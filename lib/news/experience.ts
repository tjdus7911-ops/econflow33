import type { NewsItem } from "./types";

export const NEWS_FEED_CATEGORIES = ["전체", "속보", "시장", "기업", "산업", "글로벌"] as const;
export type NewsFeedCategory = (typeof NEWS_FEED_CATEGORIES)[number];
export type NewsSentiment = "positive" | "negative";
export type ExplanationFeedback = "helpful" | "difficult";

export type RelatedCompany = {
  name: string;
  symbol: string;
};

export type NewsAiContent = {
  newsId: string;
  shortSummary: string[];
  whatHappened: string;
  whyImportant: string;
  impact: string;
  personalMeaning: string;
  keyTakeaway: string;
  generatedAt: string;
  sourceReferences: string[];
};

export type NewsComment = {
  id: string;
  newsId: string;
  userId: string;
  userName: string;
  content: string;
  likeCount: number;
  likedBy: string[];
  reportedBy: string[];
  parentCommentId: string | null;
  createdAt: string;
  updatedAt: string;
};

const COMPANY_DICTIONARY: Array<RelatedCompany & { pattern: RegExp }> = [
  { name: "엔비디아", symbol: "NVDA", pattern: /NVIDIA|NVDA|엔비디아/i },
  { name: "AMD", symbol: "AMD", pattern: /\bAMD\b|에이엠디/i },
  { name: "마이크론", symbol: "MU", pattern: /Micron|\bMU\b|마이크론/i },
  { name: "삼성전자", symbol: "005930", pattern: /삼성전자|삼성 반도체/i },
  { name: "SK하이닉스", symbol: "000660", pattern: /SK하이닉스|하이닉스/i },
  { name: "테슬라", symbol: "TSLA", pattern: /Tesla|TSLA|테슬라/i },
  { name: "애플", symbol: "AAPL", pattern: /Apple|AAPL|애플/i },
  { name: "마이크로소프트", symbol: "MSFT", pattern: /Microsoft|MSFT|마이크로소프트/i },
  { name: "현대모비스", symbol: "012330", pattern: /현대모비스/i },
  { name: "LG전자", symbol: "066570", pattern: /LG전자/i },
  { name: "셀트리온", symbol: "068270", pattern: /셀트리온/i },
  { name: "신한지주", symbol: "055550", pattern: /신한금융|신한지주/i },
];

const stableNumber = (value: string) => {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash;
};

const newsText = (item: NewsItem) => `${item.title} ${item.description} ${item.summary} ${item.category} ${item.keywords.join(" ")}`;

export function getNewsFeedCategory(item: NewsItem): Exclude<NewsFeedCategory, "전체"> {
  const text = newsText(item);
  const publishedTime = Date.parse(item.publishedAtRaw);
  if (Number.isFinite(publishedTime) && Date.now() - publishedTime < 90 * 60_000) return "속보";
  if (/미국|중국|일본|유럽|관세|국제|글로벌|해외|달러/.test(text)) return "글로벌";
  if (/기업|실적|주식|상장|IPO|증자|배당/.test(text)) return "기업";
  if (/반도체|자동차|배터리|산업|수출|제조|에너지|AI/.test(text)) return "산업";
  return "시장";
}

export const matchesNewsFeedCategory = (item: NewsItem, category: NewsFeedCategory) =>
  category === "전체" || getNewsFeedCategory(item) === category;

export function getRelatedCompanies(item: NewsItem): RelatedCompany[] {
  const text = newsText(item);
  return COMPANY_DICTIONARY
    .filter((company) => company.pattern.test(text))
    .map(({ name, symbol }) => ({ name, symbol }))
    .slice(0, 4);
}

export function getNewsMetrics(item: NewsItem) {
  const seed = stableNumber(item.id);
  const participation = 180 + seed % 420;
  const positivePercent = 38 + seed % 39;
  return {
    viewCount: 8_000 + seed % 42_000,
    commentCount: 18 + seed % 139,
    participation,
    positive: Math.round(participation * positivePercent / 100),
    negative: participation - Math.round(participation * positivePercent / 100),
  };
}

export function formatCompactCount(value: number) {
  if (value >= 10_000) return `${(value / 1_000).toFixed(1)}K`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

export function formatNewsDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "오늘";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
}

export function formatNewsDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "발행 시각 미상";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const valueOf = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${valueOf("year")}.${valueOf("month")}.${valueOf("day")} ${valueOf("hour")}:${valueOf("minute")}`;
}

export function formatNewsTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

const categoryExplanation = (category: string) => {
  if (/환율|달러|외환/.test(category)) return "환율은 수입물가와 해외투자, 기업의 원가에 넓게 영향을 줄 수 있어요.";
  if (/금리|채권|정책/.test(category)) return "금리와 정책 기대는 대출 비용, 채권 금리, 주식의 가치 평가에 함께 영향을 줄 수 있어요.";
  if (/주식|기업|산업|AI|반도체/.test(category)) return "기업의 성장 기대와 비용 부담이 실적 전망과 시장 평가에 반영될 수 있어요.";
  return "경제 뉴스는 정책과 기업 활동에 대한 시장의 기대가 바뀌는 신호가 될 수 있어요.";
};

export function buildNewsAiContent(item: NewsItem): NewsAiContent {
  const description = (item.description || item.summary).trim();
  const feedCategory = getNewsFeedCategory(item);
  const keywordSummary = item.keywords.slice(0, 3).join("·");
  return {
    newsId: item.id,
    shortSummary: [
      description || item.title,
      `${item.publisher}에서 보도한 ${feedCategory} 분야 소식이에요.`,
      keywordSummary ? `주요 키워드는 ${keywordSummary}입니다.` : "제목과 요약에 담긴 핵심 흐름을 먼저 확인해 보세요.",
    ].filter(Boolean).slice(0, 3),
    whatHappened: description || `${item.publisher}가 “${item.title}” 소식을 보도했어요.`,
    whyImportant: categoryExplanation(`${item.category} ${feedCategory} ${item.keywords.join(" ")}`),
    impact: "이 뉴스와 연결된 주식·환율·금리는 서로 다른 요인에도 영향을 받아요. 현재 수치와 후속 보도를 함께 보며 방향이 이어지는지 확인하는 것이 중요해요.",
    personalMeaning: "특정 종목의 매수·매도 신호로 보기보다는 내 대출·예금·투자에 연결된 지표가 어떻게 변하는지 확인해 보세요.",
    keyTakeaway: "핵심은 하나의 제목보다 원문의 사실과 후속 시장 데이터를 함께 확인하는 것이에요.",
    generatedAt: item.fetchedAt || item.publishedAtRaw,
    sourceReferences: [item.originalUrl || item.sourceUrl].filter(Boolean),
  };
}

export function getSeedComments(item: NewsItem): NewsComment[] {
  const metrics = getNewsMetrics(item);
  return [
    {
      id: `seed-${item.id}`,
      newsId: item.id,
      userId: "seed-econ-beginner",
      userName: "경제초보",
      content: "제목만 봤을 때보다 중요한 포인트가 잘 정리돼서 이해하기 쉬웠어요.",
      likeCount: Math.max(3, metrics.commentCount % 53),
      likedBy: [],
      reportedBy: [],
      parentCommentId: null,
      createdAt: new Date(Date.parse(item.publishedAtRaw) || Date.now() - 2 * 60 * 60_000).toISOString(),
      updatedAt: new Date(Date.parse(item.publishedAtRaw) || Date.now() - 2 * 60 * 60_000).toISOString(),
    },
  ];
}
