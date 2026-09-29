import type { NewsItem } from "@/data/news";

type NaverNewsResponse = {
  items: {
    title: string;
    originallink: string;
    link: string;
    description: string;
    pubDate: string;
  }[];
};

const stripHtml = (value: string) => value
  .replace(/<[^>]*>/g, "")
  .replace(/&quot;/g, '"')
  .replace(/&amp;/g, "&")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">");

const stableId = (value: string) => {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return `naver-${hash.toString(36)}`;
};

export function normalizeNaverNewsItem(item: NaverNewsResponse["items"][number], keywords: string[]): NewsItem {
  const sourceUrl = item.originallink || item.link;
  const hostname = (() => {
    try { return new URL(sourceUrl).hostname.replace(/^www\./, ""); } catch { return "외부 뉴스"; }
  })();
  const originalTitle = stripHtml(item.title);
  const description = stripHtml(item.description);

  return {
    id: stableId(sourceUrl),
    title: originalTitle,
    originalTitle,
    summary: description,
    description,
    source: hostname,
    sourceUrl,
    category: "주요",
    publishedAt: new Date(item.pubDate).toISOString(),
    keywords,
    contentType: "news",
    relatedMarketIds: [],
  };
}

export const isNaverNewsConfigured = () => Boolean(process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET);

export async function searchNaverNews(query: string, display = 20): Promise<NewsItem[]> {
  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;
  if (!clientId || !clientSecret) return [];

  const params = new URLSearchParams({ query, display: String(display), sort: "date" });
  const response = await fetch(`https://openapi.naver.com/v1/search/news.json?${params}`, {
    headers: { "X-Naver-Client-Id": clientId, "X-Naver-Client-Secret": clientSecret },
    next: { revalidate: 900 },
  });
  if (!response.ok) throw new Error(`NAVER 뉴스 요청 실패: ${response.status}`);
  const payload = await response.json() as NaverNewsResponse;
  return payload.items.map((item) => normalizeNaverNewsItem(item, [query]));
}
