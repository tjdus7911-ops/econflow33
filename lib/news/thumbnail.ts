import "server-only";

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type { NewsItem } from "./types";

const SCRAPE_CONCURRENCY = 4;
const SCRAPE_TIMEOUT_MS = 2_000;
const MAX_ARTICLES_TO_SCRAPE = 12;
const MAX_REDIRECTS = 4;
const MAX_HTML_BYTES = 256_000;
const CACHE_TTL_MS = 30 * 60 * 1_000;

type CacheEntry = { value: string | null; expiresAt: number };
const thumbnailCache = new Map<string, CacheEntry>();

export type ThumbnailStats = {
  enabled: boolean;
  attempted: number;
  succeeded: number;
  failed: number;
};

export const isNewsImageScrapingEnabled = () => process.env.ENABLE_NEWS_IMAGE_SCRAPING === "true";

const isPrivateIpv4 = (address: string) => {
  const octets = address.split(".").map(Number);
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return true;
  const [first, second] = octets;
  return first === 0
    || first === 10
    || first === 127
    || (first === 100 && second >= 64 && second <= 127)
    || (first === 169 && second === 254)
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && second === 168)
    || (first === 198 && (second === 18 || second === 19))
    || first >= 224;
};

const isPrivateIpv6 = (rawAddress: string) => {
  const address = rawAddress.toLocaleLowerCase("en-US").replace(/^\[|\]$/g, "").split("%")[0];
  if (address === "::" || address === "::1") return true;
  if (address.startsWith("fc") || address.startsWith("fd")) return true;
  if (/^fe[89ab]/.test(address) || address.startsWith("ff")) return true;
  if (address.startsWith("::ffff:")) {
    const ipv4 = address.slice("::ffff:".length);
    return isIP(ipv4) !== 4 || isPrivateIpv4(ipv4);
  }
  return false;
};

const isPrivateAddress = (address: string) => {
  const version = isIP(address.replace(/^\[|\]$/g, ""));
  if (version === 4) return isPrivateIpv4(address);
  if (version === 6) return isPrivateIpv6(address);
  return true;
};

async function validateServerFetchUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("invalid URL");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("unsupported protocol");
  if (url.username || url.password) throw new Error("URL credentials are not allowed");

  const hostname = url.hostname.toLocaleLowerCase("en-US").replace(/^\[|\]$/g, "");
  if (!hostname || hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
    throw new Error("local hostname blocked");
  }

  if (isIP(hostname)) {
    if (isPrivateAddress(hostname)) throw new Error("private address blocked");
  } else {
    const addresses = await lookup(hostname, { all: true, verbatim: true });
    if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
      throw new Error("private DNS result blocked");
    }
  }

  return url;
}

const decodeHtmlEntities = (value: string) => value
  .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number.parseInt(decimal, 10)))
  .replace(/&quot;/gi, '"')
  .replace(/&apos;|&#39;/gi, "'")
  .replace(/&amp;/gi, "&");

const parseAttributes = (tag: string) => {
  const attributes = new Map<string, string>();
  const pattern = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>]+))/g;
  for (const match of tag.matchAll(pattern)) {
    attributes.set(match[1].toLocaleLowerCase("en-US"), match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attributes;
};

export function extractRepresentativeImage(html: string, articleUrl: string) {
  const candidates = new Map<string, string>();
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attributes = parseAttributes(match[0]);
    const key = (attributes.get("property") ?? attributes.get("name") ?? "").toLocaleLowerCase("en-US");
    const content = attributes.get("content");
    if (content && !candidates.has(key)) candidates.set(key, content);
  }

  for (const key of ["og:image", "twitter:image"]) {
    const rawValue = candidates.get(key);
    if (!rawValue) continue;
    try {
      const imageUrl = new URL(decodeHtmlEntities(rawValue.trim()), articleUrl);
      if (imageUrl.protocol === "https:" || imageUrl.protocol === "http:") return imageUrl.toString();
    } catch {
      // Try the next supported metadata field.
    }
  }
  return null;
}

async function readHtmlPrefix(response: Response) {
  if (!response.body) return "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let total = 0;
  let html = "";

  try {
    while (total < MAX_HTML_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      const remaining = MAX_HTML_BYTES - total;
      const chunk = value.byteLength > remaining ? value.slice(0, remaining) : value;
      total += chunk.byteLength;
      html += decoder.decode(chunk, { stream: total < MAX_HTML_BYTES });
      if (html.toLocaleLowerCase("en-US").includes("</head>")) break;
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }
  return html;
}

async function requestArticleImage(startUrl: string): Promise<string | null> {
  let currentUrl = startUrl;
  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const validated = await validateServerFetchUrl(currentUrl);
    const response = await fetch(validated, {
      method: "GET",
      redirect: "manual",
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9",
        "User-Agent": "EconFlowNewsPreview/1.0",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(SCRAPE_TIMEOUT_MS),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      await response.body?.cancel().catch(() => undefined);
      if (!location || redirectCount === MAX_REDIRECTS) return null;
      currentUrl = new URL(location, validated).toString();
      continue;
    }

    if (!response.ok) {
      await response.body?.cancel().catch(() => undefined);
      return null;
    }

    const contentType = response.headers.get("content-type")?.toLocaleLowerCase("en-US") ?? "";
    if (contentType && !contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      await response.body?.cancel().catch(() => undefined);
      return null;
    }

    return extractRepresentativeImage(await readHtmlPrefix(response), validated.toString());
  }
  return null;
}

async function scrapeArticleThumbnail(value: string) {
  const cached = thumbnailCache.get(value);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  let thumbnailUrl: string | null = null;
  try {
    thumbnailUrl = await requestArticleImage(value);
  } catch {
    thumbnailUrl = null;
  }
  thumbnailCache.set(value, { value: thumbnailUrl, expiresAt: Date.now() + CACHE_TTL_MS });
  return thumbnailUrl;
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, task: (item: T) => Promise<R>) {
  const results = new Array<R>(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await task(items[index]);
    }
  });
  await Promise.all(workers);
  return results;
}

/**
 * Development/local test feature only. Production can disable every article
 * page request by leaving ENABLE_NEWS_IMAGE_SCRAPING unset or setting it false.
 */
export async function enrichNewsThumbnails(items: NewsItem[]) {
  const enabled = isNewsImageScrapingEnabled();
  if (!enabled) {
    return {
      items,
      stats: { enabled: false, attempted: 0, succeeded: 0, failed: 0 } satisfies ThumbnailStats,
    };
  }

  const targets = items.slice(0, MAX_ARTICLES_TO_SCRAPE);
  const enrichedTargets = await mapWithConcurrency(targets, SCRAPE_CONCURRENCY, async (item) => {
    if (item.thumbnailUrl) return item;
    const candidates = [...new Set([item.originalLink, item.link].filter(Boolean))];
    let thumbnailUrl: string | null = null;
    for (const candidate of candidates) {
      thumbnailUrl = await scrapeArticleThumbnail(candidate);
      if (thumbnailUrl) break;
    }
    return { ...item, thumbnailUrl, imageUrl: thumbnailUrl, thumbnail: thumbnailUrl };
  });

  const succeeded = enrichedTargets.filter((item) => Boolean(item.thumbnailUrl)).length;
  return {
    items: [...enrichedTargets, ...items.slice(targets.length)],
    stats: {
      enabled: true,
      attempted: targets.length,
      succeeded,
      failed: targets.length - succeeded,
    } satisfies ThumbnailStats,
  };
}
