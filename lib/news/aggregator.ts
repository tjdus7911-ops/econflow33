import "server-only";

import { enrichNewsThumbnails, isNewsImageScrapingEnabled, type ThumbnailStats } from "./thumbnail";
import type { NewsItem, NewsProviderStatus } from "./types";
import { naverNewsProvider } from "@/lib/providers/naver-news";

export type AggregatedNews = {
  items: NewsItem[];
  providers: NewsProviderStatus[];
  fallback: false;
  thumbnailStats: ThumbnailStats;
};

export async function aggregateNews(limit = 20, includeThumbnails = false): Promise<AggregatedNews> {
  const requestedLimit = Math.min(Math.max(Math.trunc(limit), 1), 20);
  if (!naverNewsProvider.isConfigured()) {
    throw new Error("NAVER API HUB 인증 환경변수가 설정되지 않았습니다.");
  }

  const naverItems = await naverNewsProvider.fetch(requestedLimit);
  if (!naverItems.length) {
    throw new Error("NAVER API HUB에서 유효한 경제뉴스를 받지 못했습니다.");
  }

  const enriched = includeThumbnails
    ? await enrichNewsThumbnails(naverItems)
    : {
        items: naverItems,
        stats: {
          enabled: isNewsImageScrapingEnabled(),
          attempted: 0,
          succeeded: 0,
          failed: 0,
        } satisfies ThumbnailStats,
      };
  return {
    items: enriched.items,
    providers: [{
      id: "naver",
      sourceType: "news-api",
      configured: true,
      ok: true,
      count: enriched.items.length,
    }],
    fallback: false,
    thumbnailStats: enriched.stats,
  };
}
