import "server-only";

import type { NewsItem } from "@/data/news";
import { formatNewsPublishedAt, toNewsItem } from "@/lib/news/normalize";
import type { NewsProvider } from "@/lib/news/provider";

export const BOK_RSS_URL = "https://www.bok.or.kr/portal/bbs/B0000552/news.rss?menuNo=200690";
export const BOK_RSS_REVALIDATE_SECONDS = 20 * 60;

const unwrapCdata = (value: string) => value
  .replace(/^\s*<!\[CDATA\[/, "")
  .replace(/\]\]>\s*$/, "");

const decodeXmlEntities = (value: string) => value
  .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number.parseInt(decimal, 10)))
  .replace(/&quot;/g, '"')
  .replace(/&apos;/g, "'")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&amp;/g, "&")
  .replace(/&nbsp;/g, " ");

const extractTag = (xml: string, tag: string) => {
  const match = xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? unwrapCdata(match[1]).trim() : "";
};

const cleanText = (value: string) => decodeXmlEntities(unwrapCdata(value))
  .replace(/\s+/g, " ")
  .trim();

const cleanDescription = (value: string) => {
  const decodedMarkup = decodeXmlEntities(unwrapCdata(value));
  return decodeXmlEntities(decodedMarkup
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
};

const stableId = (value: string) => {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return `bok-${hash.toString(36)}`;
};

export { formatNewsPublishedAt } from "@/lib/news/normalize";

const categorizeBokNews = (title: string, description: string) => {
  const text = `${title} ${description}`;
  if (/소비자물가|생산자물가|수입물가|물가/.test(text)) return "물가";
  if (/환율|외환|국제수지|외화/.test(text)) return "환율";
  if (/기준금리|금리|통화정책|금융통화위원회/.test(text)) return "금리";
  if (/금융시장|채권|증권|주식|지급결제|카드|계좌이체/.test(text)) return "금융시장";
  if (/국내총생산|국민소득|경제심리|기업경기|경기|성장/.test(text)) return "한국경제";
  return "경제정책";
};

export function parseBokRss(xml: string, now = new Date()): NewsItem[] {
  const itemBlocks = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)];

  return itemBlocks
    .map((match): NewsItem | null => {
      const itemXml = match[1];
      const title = cleanText(extractTag(itemXml, "title"));
      const sourceUrl = cleanText(extractTag(itemXml, "link") || extractTag(itemXml, "guid"));
      const description = cleanDescription(extractTag(itemXml, "description"));
      const publishedAtRaw = cleanText(extractTag(itemXml, "pubDate"));
      const category = categorizeBokNews(title, description);

      if (!title || !sourceUrl || !publishedAtRaw) return null;

      return toNewsItem({
        id: stableId(sourceUrl),
        title,
        originalTitle: title,
        publisher: "한국은행",
        description,
        publishedAtRaw,
        publishedAt: formatNewsPublishedAt(publishedAtRaw, now),
        originalUrl: sourceUrl,
        thumbnailUrl: null,
        category,
        sourceType: "official",
        dataSource: "bok-rss",
        summary: description || `${title} 관련 한국은행 공식 자료입니다.`,
        keywords: [category, "한국은행"],
        relatedMarketIds: [],
      });
    })
    .filter((item): item is NewsItem => item !== null)
    .sort((a, b) => new Date(b.publishedAtRaw).getTime() - new Date(a.publishedAtRaw).getTime());
}

export async function fetchBokNews(): Promise<NewsItem[]> {
  const response = await fetch(BOK_RSS_URL, {
    headers: { Accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8" },
    next: { revalidate: BOK_RSS_REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(8_000),
  });

  if (!response.ok) throw new Error(`한국은행 RSS 요청 실패: ${response.status}`);

  const items = parseBokRss(await response.text());
  if (!items.length) throw new Error("한국은행 RSS에서 유효한 뉴스 항목을 찾지 못했습니다.");
  return items;
}

export const bokNewsProvider: NewsProvider = {
  id: "bok-rss",
  sourceType: "official",
  isConfigured: () => true,
  fetch: async (limit) => (await fetchBokNews()).slice(0, limit),
};
