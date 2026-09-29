import "server-only";

import type { NewsItem } from "@/data/news";

export const BOK_RSS_URL = "https://www.bok.or.kr/portal/bbs/B0000552/news.rss?menuNo=200690";
export const BOK_RSS_REVALIDATE_SECONDS = 20 * 60;

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

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

const kstDateKey = (date: Date) => new Date(date.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);

export function formatNewsPublishedAt(value: string, now = new Date()) {
  const published = new Date(value);
  if (Number.isNaN(published.getTime())) return "날짜 미상";

  const differenceMinutes = Math.floor((now.getTime() - published.getTime()) / 60_000);
  const publishedDay = kstDateKey(published);
  const currentDay = kstDateKey(now);

  if (differenceMinutes < 0) return publishedDay === currentDay ? "오늘" : publishedDay.replaceAll("-", ".");
  if (differenceMinutes < 1) return "방금 전";
  if (differenceMinutes < 60) return `${differenceMinutes}분 전`;
  if (differenceMinutes < 6 * 60) return `${Math.floor(differenceMinutes / 60)}시간 전`;
  if (publishedDay === currentDay) return "오늘";

  const dayDifference = Math.round(
    (Date.parse(`${currentDay}T00:00:00Z`) - Date.parse(`${publishedDay}T00:00:00Z`)) / DAY_MS,
  );
  if (dayDifference === 1) return "어제";
  if (dayDifference > 1 && dayDifference < 7) return `${dayDifference}일 전`;
  return publishedDay.replaceAll("-", ".");
}

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

      return {
        id: stableId(sourceUrl),
        title,
        originalTitle: title,
        summary: description || `${title} 관련 한국은행 공식 자료입니다.`,
        description,
        source: "한국은행",
        sourceUrl,
        thumbnail: null,
        category,
        publishedAt: formatNewsPublishedAt(publishedAtRaw, now),
        publishedAtRaw,
        keywords: [category, "한국은행"],
        contentType: "news",
        dataSource: "bok-rss",
        relatedMarketIds: [],
      } satisfies NewsItem;
    })
    .filter((item): item is NewsItem => item !== null)
    .sort((a, b) => new Date(b.publishedAtRaw ?? 0).getTime() - new Date(a.publishedAtRaw ?? 0).getTime());
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
