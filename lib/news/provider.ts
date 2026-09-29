import type { NewsItem, NewsProviderId, NewsSourceType } from "./types";

export type NewsProvider = {
  id: NewsProviderId;
  sourceType: NewsSourceType;
  isConfigured: () => boolean;
  fetch: (limit: number) => Promise<NewsItem[]>;
};
