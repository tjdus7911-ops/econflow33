import "server-only";

import type { NewsProvider } from "@/lib/news/provider";
import { deduplicateNews, sortNewsByPublishedAt, toNewsItem } from "@/lib/news/normalize";
import type { NewsItem } from "@/lib/news/types";

export const NAVER_NEWS_REVALIDATE_SECONDS = 15 * 60;
export const NAVER_API_HUB_NEWS_ENDPOINT = "https://naverapihub.apigw.ntruss.com/search/v1/news";

const NAVER_NEWS_QUERIES = ["경제", "금리", "환율", "증시", "주식", "반도체", "미국 경제"] as const;
const NAVER_QUERY_CONCURRENCY = 2;

type NaverNewsResponse = {
  items?: Array<{
    title?: string;
    originallink?: string;
    link?: string;
    description?: string;
    pubDate?: string;
  }>;
};

type NaverCredentials = {
  apiKeyId: string;
  apiKey: string;
};

const decodeHtmlEntities = (value: string) => value
  .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number.parseInt(decimal, 10)))
  .replace(/&quot;/gi, '"')
  .replace(/&apos;|&#39;/gi, "'")
  .replace(/&lt;/gi, "<")
  .replace(/&gt;/gi, ">")
  .replace(/&nbsp;/gi, " ")
  .replace(/&amp;/gi, "&");

export const cleanNaverNewsText = (value: string) => decodeHtmlEntities(value)
  .replace(/<[^>]*>/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const stableId = (value: string) => {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return "naver-" + hash.toString(36);
};

const publisherFromUrl = (value: string) => {
  try {
    const hostname = new URL(value).hostname.toLocaleLowerCase("en-US").replace(/^www\./, "");
    if (hostname.endsWith("naver.com")) return "네이버 뉴스";
    return hostname;
  } catch {
    return "외부 뉴스";
  }
};

const categorizeNews = (title: string, description: string, query: string) => {
  const text = title + " " + description + " " + query;
  if (/환율|달러|원화|엔화|외환/.test(text)) return "환율";
  if (/금리|채권|연준|기준금리|통화정책/.test(text)) return "경제정책";
  if (/주식|증시|코스피|코스닥|나스닥|상장/.test(text)) return "주식";
  if (/반도체|자동차|배터리|산업|기업|수출/.test(text)) return "산업";
  if (/미국|중국|일본|유럽|글로벌/.test(text)) return "글로벌";
  return "경제정책";
};

/**
 * API HUB deployments commonly use the first pair below. The additional
 * server-only aliases keep existing local/Vercel secrets usable during the
 * Developers Search API migration without ever exposing them to the client.
 */
export function getNaverApiHubCredentials(): NaverCredentials | null {
  const apiKeyId = process.env.NAVER_API_HUB_API_KEY_ID
    ?? process.env.NAVER_API_HUB_CLIENT_ID
    ?? process.env.NCP_APIGW_API_KEY_ID
    ?? process.env.NAVER_CLIENT_ID;
  const apiKey = process.env.NAVER_API_HUB_API_KEY
    ?? process.env.NAVER_API_HUB_CLIENT_SECRET
    ?? process.env.NCP_APIGW_API_KEY
    ?? process.env.NAVER_CLIENT_SECRET;

  return apiKeyId && apiKey ? { apiKeyId, apiKey } : null;
}

export const isNaverNewsConfigured = () => getNaverApiHubCredentials() !== null;

export function normalizeNaverNewsItem(
  item: NonNullable<NaverNewsResponse["items"]>[number],
  query: string,
  fetchedAt: string,
): NewsItem | null {
  const originalLink = item.originallink?.trim() ?? "";
  const link = item.link?.trim() ?? "";
  const originalUrl = originalLink || link;
  const title = cleanNaverNewsText(item.title ?? "");
  const description = cleanNaverNewsText(item.description ?? "");
  const pubDate = item.pubDate?.trim() ?? "";
  if (!title || !originalUrl || !pubDate) return null;

  return toNewsItem({
    id: stableId(originalUrl + "|" + title),
    title,
    originalTitle: title,
    publisher: publisherFromUrl(originalUrl),
    description,
    originalLink,
    link: link || originalUrl,
    pubDate,
    fetchedAt,
    publishedAtRaw: pubDate,
    originalUrl,
    thumbnailUrl: null,
    category: categorizeNews(title, description, query),
    sourceType: "news-api",
    dataSource: "naver-api-hub",
    keywords: [query, "경제"],
  });
}

async function mapWithConcurrency<T, R>(
  items: readonly T[],
  concurrency: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> {
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

async function searchNaverApiHubNews(query: string, display: number, credentials: NaverCredentials) {
  const params = new URLSearchParams({ query, display: String(display), start: "1", sort: "date" });
  const response = await fetch(NAVER_API_HUB_NEWS_ENDPOINT + "?" + params, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-NCP-APIGW-API-KEY-ID": credentials.apiKeyId,
      "X-NCP-APIGW-API-KEY": credentials.apiKey,
    },
    next: { revalidate: NAVER_NEWS_REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) {
    throw new Error("NAVER API HUB 뉴스 요청 실패: HTTP " + response.status);
  }

  const payload = await response.json() as NaverNewsResponse;
  const fetchedAt = new Date().toISOString();
  return (payload.items ?? [])
    .map((item) => normalizeNaverNewsItem(item, query, fetchedAt))
    .filter((item): item is NewsItem => item !== null);
}

export async function fetchNaverNews(limit = 20): Promise<NewsItem[]> {
  const credentials = getNaverApiHubCredentials();
  if (!credentials) {
    throw new Error("NAVER API HUB 인증 환경변수가 설정되지 않았습니다.");
  }

  const requestedLimit = Math.min(Math.max(Math.trunc(limit), 1), 20);
  const displayPerQuery = Math.min(Math.max(Math.ceil(requestedLimit / NAVER_NEWS_QUERIES.length) * 2, 3), 10);
  const groups = await mapWithConcurrency(
    NAVER_NEWS_QUERIES,
    NAVER_QUERY_CONCURRENCY,
    (query) => searchNaverApiHubNews(query, displayPerQuery, credentials),
  );

  return sortNewsByPublishedAt(deduplicateNews(groups.flat())).slice(0, requestedLimit);
}

export const naverNewsProvider: NewsProvider = {
  id: "naver",
  sourceType: "news-api",
  isConfigured: isNaverNewsConfigured,
  fetch: fetchNaverNews,
};
