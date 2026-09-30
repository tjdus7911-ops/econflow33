export type NewsSourceType = "official" | "publisher" | "news-api" | "mock";

export type NewsItem = {
  id: string;
  title: string;
  originalTitle: string;
  publisher: string;
  description: string;
  originalLink: string;
  link: string;
  pubDate: string;
  fetchedAt: string;
  publishedAt: string;
  publishedAtRaw: string;
  originalUrl: string;
  thumbnailUrl: string | null;
  category: string;
  sourceType: NewsSourceType;
  dataSource: string;

  // Existing EconFlow fields are kept while the rest of the app migrates to
  // the provider-neutral fields above.
  summary: string;
  source: string;
  sourceUrl: string;
  imageUrl?: string | null;
  thumbnail?: string | null;
  keywords: string[];
  contentType: "news" | "briefing";
  relatedIssueId?: string;
  relatedMarketIds: string[];
  relatedLessonId?: string;
};

export type NewsProviderId = "gnews" | "bok-rss" | "naver" | "mock";

export type NewsProviderStatus = {
  id: NewsProviderId;
  sourceType: NewsSourceType;
  configured: boolean;
  ok: boolean;
  count: number;
  message?: string;
};
