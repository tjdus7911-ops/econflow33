import type { NewsItem } from "@/lib/news/types";

export type { NewsItem } from "@/lib/news/types";

type MockNewsSeed = Omit<NewsItem,
  "publisher" | "publishedAtRaw" | "originalUrl" | "thumbnailUrl" | "sourceType" | "dataSource" |
  "originalLink" | "link" | "pubDate" | "fetchedAt"
>;

const mockNewsSeed: MockNewsSeed[] = [
  { id: "fed-patience", title: "연준, 금리 결정은 물가 흐름을 더 확인한 뒤", originalTitle: "연준, 금리 결정은 물가 흐름을 더 확인한 뒤", summary: "중앙은행은 한두 번의 지표보다 물가와 고용의 추세를 함께 보겠다는 신중한 태도를 유지했어요.", description: "중앙은행은 한두 번의 지표보다 물가와 고용의 추세를 함께 보겠다는 신중한 태도를 유지했어요.", source: "Jester 브리핑", sourceUrl: "#source", thumbnail: "/news/rates.webp", category: "미국", publishedAt: "2시간 전", keywords: ["연준", "금리", "물가"], contentType: "briefing", relatedIssueId: "rate-cut-expectation", relatedMarketIds: ["us-base-rate", "us-10y", "sp500", "usd-krw"], relatedLessonId: "what-is-rate" },
  { id: "ai-chip", title: "AI 칩 투자, 데이터센터 확장과 함께 이어져", originalTitle: "AI 칩 투자, 데이터센터 확장과 함께 이어져", summary: "고성능 반도체 수요가 늘며 클라우드 기업들의 인프라 투자 계획도 주목받고 있어요.", description: "고성능 반도체 수요가 늘며 클라우드 기업들의 인프라 투자 계획도 주목받고 있어요.", source: "Jester 브리핑", sourceUrl: "#source", thumbnail: "/news/technology.webp", category: "테크", publishedAt: "4시간 전", keywords: ["AI 투자", "반도체", "데이터센터"], contentType: "briefing", relatedIssueId: "ai-investment", relatedMarketIds: ["nasdaq", "sp500", "kospi"], relatedLessonId: "why-stock-moves" },
  { id: "currency-range", title: "원·달러 환율, 금리 전망 따라 등락 반복", originalTitle: "원·달러 환율, 금리 전망 따라 등락 반복", summary: "달러 강세와 수출 기대가 엇갈리며 환율이 뚜렷한 방향 없이 움직였어요.", description: "달러 강세와 수출 기대가 엇갈리며 환율이 뚜렷한 방향 없이 움직였어요.", source: "Jester 브리핑", sourceUrl: "#source", thumbnail: "/news/currency.webp", category: "한국", publishedAt: "5시간 전", keywords: ["환율", "달러", "원화"], contentType: "briefing", relatedIssueId: "won-dollar-volatility", relatedMarketIds: ["usd-krw", "jpy-krw", "kospi"], relatedLessonId: "why-fx-moves" },
  { id: "bond-yield", title: "국채 금리 하락, 시장은 완화 가능성에 반응", originalTitle: "국채 금리 하락, 시장은 완화 가능성에 반응", summary: "기준금리 인하 기대가 커지며 장기 채권 금리가 먼저 반응했어요.", description: "기준금리 인하 기대가 커지며 장기 채권 금리가 먼저 반응했어요.", source: "Jester 브리핑", sourceUrl: "#source", category: "주요", publishedAt: "6시간 전", keywords: ["채권", "국채", "금리"], contentType: "briefing", relatedIssueId: "rate-cut-expectation", relatedMarketIds: ["us-10y", "us-base-rate", "sp500"], relatedLessonId: "bond-yield" },
  { id: "power-grid", title: "AI 데이터센터 전력 수요, 설비 투자로 연결", originalTitle: "AI 데이터센터 전력 수요, 설비 투자로 연결", summary: "데이터센터 증설이 전력망과 냉각 설비 등 주변 산업의 투자도 끌어내고 있어요.", description: "데이터센터 증설이 전력망과 냉각 설비 등 주변 산업의 투자도 끌어내고 있어요.", source: "Jester 브리핑", sourceUrl: "#source", category: "산업", publishedAt: "어제", keywords: ["AI 투자", "전력", "데이터센터"], contentType: "briefing", relatedIssueId: "ai-investment", relatedMarketIds: ["nasdaq", "sp500"], relatedLessonId: "read-indicators" },
  { id: "korea-retail", title: "생활물가 둔화에 소비 심리 소폭 개선", originalTitle: "생활물가 둔화에 소비 심리 소폭 개선", summary: "소비자들의 경기 전망이 나아졌지만 실제 지출 회복은 업종별로 차이를 보였어요.", description: "소비자들의 경기 전망이 나아졌지만 실제 지출 회복은 업종별로 차이를 보였어요.", source: "Jester 브리핑", sourceUrl: "#source", category: "한국", publishedAt: "어제", keywords: ["물가", "소비", "한국은행"], contentType: "briefing", relatedIssueId: "korea-consumption", relatedMarketIds: ["kospi", "kr-base-rate"], relatedLessonId: "read-indicators" },
  { id: "global-shipping", title: "글로벌 운임 안정세, 수입 비용 부담은 완화", originalTitle: "글로벌 운임 안정세, 수입 비용 부담은 완화", summary: "주요 항로의 운임이 안정되며 기업들의 물류비 부담이 이전보다 낮아졌어요.", description: "주요 항로의 운임이 안정되며 기업들의 물류비 부담이 이전보다 낮아졌어요.", source: "Jester 브리핑", sourceUrl: "#source", category: "글로벌", publishedAt: "2일 전", keywords: ["운임", "수입", "환율"], contentType: "briefing", relatedMarketIds: ["usd-krw", "gold"], relatedLessonId: "why-fx-moves" },
];

export const news: NewsItem[] = mockNewsSeed.map((item) => ({
  ...item,
  publisher: item.source,
  originalLink: item.sourceUrl,
  link: item.sourceUrl,
  pubDate: "",
  fetchedAt: "",
  publishedAtRaw: "",
  originalUrl: item.sourceUrl,
  thumbnailUrl: item.imageUrl ?? item.thumbnail ?? null,
  sourceType: "mock",
  dataSource: "mock",
}));

export const newsCategories = ["전체", "주요", "한국", "미국", "글로벌", "테크", "산업"];
