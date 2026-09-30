import type { NewsItem } from "./types";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

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

export function normalizeNewsTitle(value: string) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("ko-KR")
    .replace(/[\s\p{P}\p{S}]+/gu, "")
    .trim();
}

const normalizeUrl = (value: string) => {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";
    url.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach((key) => url.searchParams.delete(key));
    return url.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
};

export function sortNewsByPublishedAt(items: NewsItem[]) {
  return [...items].sort((a, b) => {
    const aTime = Date.parse(a.publishedAtRaw);
    const bTime = Date.parse(b.publishedAtRaw);
    if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
    if (Number.isNaN(aTime)) return 1;
    if (Number.isNaN(bTime)) return -1;
    return bTime - aTime;
  });
}

export function deduplicateNews(items: NewsItem[]) {
  const urls = new Set<string>();
  const titles = new Set<string>();

  return items.filter((item) => {
    const urlKeys = [item.originalLink, item.link, item.originalUrl]
      .map(normalizeUrl)
      .filter(Boolean);
    const titleKey = normalizeNewsTitle(item.originalTitle || item.title);
    if (urlKeys.some((key) => urls.has(key)) || (titleKey && titles.has(titleKey))) return false;
    urlKeys.forEach((key) => urls.add(key));
    if (titleKey) titles.add(titleKey);
    return true;
  });
}

export function toNewsItem(
  item: Pick<NewsItem,
    "id" | "title" | "originalTitle" | "publisher" | "description" | "publishedAtRaw" |
    "originalUrl" | "thumbnailUrl" | "category" | "sourceType" | "dataSource"
  > & Partial<Pick<NewsItem,
    "publishedAt" | "summary" | "keywords" | "contentType" | "relatedIssueId" |
    "relatedMarketIds" | "relatedLessonId" | "originalLink" | "link" | "pubDate" | "fetchedAt"
  >>,
): NewsItem {
  return {
    ...item,
    originalLink: item.originalLink ?? item.originalUrl,
    link: item.link ?? item.originalUrl,
    pubDate: item.pubDate ?? item.publishedAtRaw,
    fetchedAt: item.fetchedAt ?? new Date().toISOString(),
    publishedAt: item.publishedAt ?? formatNewsPublishedAt(item.publishedAtRaw),
    summary: item.summary ?? item.description,
    source: item.publisher,
    sourceUrl: item.originalUrl,
    imageUrl: item.thumbnailUrl,
    thumbnail: item.thumbnailUrl,
    keywords: item.keywords ?? [item.category],
    contentType: item.contentType ?? "news",
    relatedMarketIds: item.relatedMarketIds ?? [],
  };
}
