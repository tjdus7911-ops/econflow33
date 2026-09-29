import "server-only";

import { news as mockNews } from "@/data/news";
import { deduplicateNews, sortNewsByPublishedAt } from "./normalize";
import type { NewsItem, NewsProviderStatus } from "./types";
import { bokNewsProvider } from "@/lib/providers/bok-rss";
import { gnewsNewsProvider } from "@/lib/providers/gnews-news";

export type AggregatedNews = {
  items: NewsItem[];
  providers: NewsProviderStatus[];
  fallback: boolean;
};

const safeMessage = (error: unknown) => error instanceof Error ? error.message : "알 수 없는 오류";

export async function aggregateNews(limit = 20): Promise<AggregatedNews> {
  const requestedLimit = Math.min(Math.max(Math.trunc(limit), 1), 20);
  const providers: NewsProviderStatus[] = [];
  const prioritizedItems: NewsItem[] = [];
  const gnewsConfigured = gnewsNewsProvider.isConfigured();

  if (gnewsConfigured) {
    try {
      const items = sortNewsByPublishedAt(await gnewsNewsProvider.fetch(requestedLimit));
      prioritizedItems.push(...items);
      providers.push({ id: "gnews", sourceType: "news-api", configured: true, ok: true, count: items.length });
    } catch (error) {
      console.error("[news/aggregator] GNews provider 실패", error);
      providers.push({ id: "gnews", sourceType: "news-api", configured: true, ok: false, count: 0, message: safeMessage(error) });
    }
  } else {
    providers.push({ id: "gnews", sourceType: "news-api", configured: false, ok: false, count: 0, message: "API Key 필요 · 실제 호출 미검증" });
  }

  const publisherItems = deduplicateNews(prioritizedItems);
  const neededOfficialItems = Math.max(requestedLimit - publisherItems.length, 0);
  let officialItems: NewsItem[] = [];

  if (neededOfficialItems > 0) {
    try {
      officialItems = sortNewsByPublishedAt(await bokNewsProvider.fetch(requestedLimit));
      providers.push({ id: "bok-rss", sourceType: "official", configured: true, ok: true, count: officialItems.length });
    } catch (error) {
      console.error("[news/aggregator] 한국은행 RSS provider 실패", error);
      providers.push({ id: "bok-rss", sourceType: "official", configured: true, ok: false, count: 0, message: safeMessage(error) });
    }
  }

  const realItems = deduplicateNews([...publisherItems, ...officialItems]);
  const neededMockItems = Math.max(requestedLimit - realItems.length, 0);
  const items = deduplicateNews([
    ...realItems,
    ...(neededMockItems > 0 ? mockNews.slice(0, neededMockItems) : []),
  ]).slice(0, requestedLimit);

  if (neededMockItems > 0) {
    providers.push({ id: "mock", sourceType: "mock", configured: true, ok: true, count: Math.max(items.length - realItems.length, 0) });
  }

  return {
    items,
    providers,
    fallback: items.some((item) => item.sourceType === "mock"),
  };
}
