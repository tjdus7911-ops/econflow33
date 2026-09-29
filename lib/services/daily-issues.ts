import { issues, type Issue } from "@/data/issues";
import type { MarketIndicator } from "@/data/market";
import type { NewsItem } from "@/data/news";

export type IssueImportanceInput = Pick<Issue, "articleVolume" | "sourceDiversity" | "economicImpact" | "koreaRelevance"> & {
  recency: number;
};

export type AiBriefing = {
  contentType: "briefing";
  headline: string;
  shortSummary: string;
  whatHappened: string;
  whyItHappened: string;
  whyItMatters: string;
  marketImpact: string;
  keyTakeaway: string;
  relatedConcepts: string[];
  groundedNewsIds: string[];
  groundedMarketIds: string[];
};

export type DailyIssuePipelineInput = {
  news: NewsItem[];
  market: MarketIndicator[];
};

export type NewsCluster = {
  id: string;
  topic: string;
  newsIds: string[];
  sourceDiversity: number;
  relatedMarketIds: string[];
};

export type DailyIssuePipelineResult = {
  deduplicatedNews: NewsItem[];
  clusters: NewsCluster[];
  topIssues: Issue[];
  heroIssue: Issue;
};

export const calculateImportanceScore = (input: IssueImportanceInput) => Math.round(
  Math.min(input.articleVolume / 40, 1) * 20
  + input.recency * 20
  + Math.min(input.sourceDiversity / 10, 1) * 15
  + input.economicImpact / 100 * 25
  + input.koreaRelevance / 100 * 20,
);

export function deduplicateNews(items: NewsItem[]) {
  const unique = new Map<string, NewsItem>();
  for (const item of items) {
    const key = item.originalTitle.replace(/\s+/g, " ").trim().toLowerCase();
    if (!unique.has(key)) unique.set(key, item);
  }
  return [...unique.values()];
}

export function groupNewsByTopic(items: NewsItem[]): NewsCluster[] {
  const groups = new Map<string, NewsItem[]>();
  for (const item of items) {
    const topic = item.relatedIssueId ?? item.keywords[0] ?? "기타";
    groups.set(topic, [...(groups.get(topic) ?? []), item]);
  }
  return [...groups.entries()].map(([topic, groupedItems]) => ({
    id: `cluster-${topic}`,
    topic,
    newsIds: groupedItems.map((item) => item.id),
    sourceDiversity: new Set(groupedItems.map((item) => item.source)).size,
    relatedMarketIds: [...new Set(groupedItems.flatMap((item) => item.relatedMarketIds))],
  }));
}

export function getMockDailyIssues(input: DailyIssuePipelineInput = { news: [], market: [] }): DailyIssuePipelineResult {
  const deduplicatedNews = deduplicateNews(input.news);
  const clusters = groupNewsByTopic(deduplicatedNews);
  const ranked = [...issues].sort((a, b) => b.importanceScore - a.importanceScore);
  return { deduplicatedNews, clusters, topIssues: ranked.slice(0, 3), heroIssue: ranked[0] };
}

export function buildGroundedBriefing(issue: Issue): AiBriefing {
  return {
    contentType: "briefing",
    headline: issue.title,
    shortSummary: issue.summary,
    whatHappened: issue.event,
    whyItHappened: issue.cause,
    whyItMatters: issue.impact,
    marketImpact: issue.impacts.map((impact) => `${impact.label}: ${impact.text}`).join(" "),
    keyTakeaway: issue.oneLine,
    relatedConcepts: issue.keywords,
    groundedNewsIds: issue.relatedNewsIds,
    groundedMarketIds: issue.relatedMarketIds,
  };
}
