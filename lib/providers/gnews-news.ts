import "server-only";

import type { NewsItem } from "@/lib/news/types";
import { toNewsItem } from "@/lib/news/normalize";
import type { NewsProvider } from "@/lib/news/provider";

export const GNEWS_REVALIDATE_SECONDS = 20 * 60;
const GNEWS_ENDPOINT = "https://gnews.io/api/v4/top-headlines";

type GNewsResponse = {
  articles?: Array<{
    title?: string;
    description?: string | null;
    url?: string;
    image?: string | null;
    publishedAt?: string;
    source?: { name?: string; url?: string };
  }>;
};

const stableId = (value: string) => {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return `gnews-${hash.toString(36)}`;
};

const categorizeNews = (title: string, description: string) => {
  const text = `${title} ${description}`;
  if (/환율|달러|원화|엔화|외환/.test(text)) return "환율";
  if (/금리|채권|연준|기준금리|통화정책/.test(text)) return "금리";
  if (/주식|증시|코스피|코스닥|나스닥|상장/.test(text)) return "주식";
  if (/반도체|자동차|배터리|산업|기업|수출/.test(text)) return "산업";
  if (/정부|정책|세제|예산|규제/.test(text)) return "경제정책";
  return "글로벌";
};

export const isGNewsConfigured = () => Boolean(process.env.GNEWS_API_KEY);

/**
 * GNews exposes an image URL, but the image remains third-party publisher
 * content. Until EconFlow has confirmed image-display rights for its plan and
 * use case, normalization intentionally leaves thumbnailUrl empty so the UI
 * uses a local category fallback.
 */
export async function fetchGNews(limit = 10): Promise<NewsItem[]> {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) throw new Error("GNEWS_API_KEY가 설정되지 않았습니다.");

  const params = new URLSearchParams({
    category: "business",
    lang: "ko",
    country: "kr",
    max: String(Math.min(Math.max(limit, 1), 10)),
    apikey: apiKey,
  });
  const response = await fetch(`${GNEWS_ENDPOINT}?${params}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: GNEWS_REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`GNews 요청 실패: ${response.status}`);

  const payload = await response.json() as GNewsResponse;
  return (payload.articles ?? [])
    .map((article): NewsItem | null => {
      const title = article.title?.trim() ?? "";
      const originalUrl = article.url?.trim() ?? "";
      const publishedAtRaw = article.publishedAt?.trim() ?? "";
      const publisher = article.source?.name?.trim() ?? "";
      const description = article.description?.trim() ?? "";
      if (!title || !originalUrl || !publishedAtRaw || !publisher) return null;

      return toNewsItem({
        id: stableId(originalUrl),
        title,
        originalTitle: title,
        publisher,
        description,
        publishedAtRaw,
        originalUrl,
        thumbnailUrl: null,
        category: categorizeNews(title, description),
        sourceType: "news-api",
        dataSource: "gnews",
        keywords: ["경제", publisher],
      });
    })
    .filter((item): item is NewsItem => item !== null);
}

export const gnewsNewsProvider: NewsProvider = {
  id: "gnews",
  sourceType: "news-api",
  isConfigured: isGNewsConfigured,
  fetch: fetchGNews,
};
