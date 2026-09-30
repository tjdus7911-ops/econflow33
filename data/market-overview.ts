import { marketIndicators, type MarketCategory, type MarketDirection } from "./market";

export type MarketIndicatorType = "INDEX" | "ETF" | "FX" | "POLICY_RATE" | "BOND" | "COMMODITY";
export type MarketRegion = "KR" | "US" | "JP" | "CN" | "EU" | "GLOBAL";

export type MarketOverviewIndicator = {
  id: string;
  name: string;
  shortName: string;
  category: MarketCategory | "etf";
  type: MarketIndicatorType;
  market: MarketRegion;
  value: number;
  change: number;
  changePercent: number;
  unit: string;
  direction: MarketDirection;
  chartData: number[];
  updatedAt: string;
  detailId?: string;
  dataSource: "mock";
};

export type WatchlistItem = {
  id: string;
  symbol: string;
  name: string;
  market: "KR" | "US";
  type: "STOCK" | "ETF";
  value: number;
  change: number;
  changePercent: number;
  chartData: number[];
  alertEnabled: boolean;
  dataSource: "mock";
};

export type EconomicEvent = {
  id: string;
  date: string;
  country: "KR" | "US" | "CN" | "EU" | "JP";
  time: string;
  title: string;
  importance: "high" | "medium" | "low";
  actual?: string;
  forecast?: string;
  previous?: string;
  dataSource: "mock";
};

export type MarketTheme = {
  id: string;
  name: string;
  tab: "realtime" | "up" | "down";
  rank: number;
  changePercent: number;
  relatedCount: number;
  keywords: string[];
  dataSource: "mock";
};

export const marketTopCategories = [
  { id: "kr-stock", label: "국내주식" },
  { id: "us-stock", label: "미국주식" },
  { id: "fx", label: "환율" },
  { id: "rate", label: "금리" },
  { id: "commodity", label: "원자재" },
  { id: "bond", label: "채권" },
] as const;

export type MarketTopCategory = (typeof marketTopCategories)[number]["id"];

export const marketIndicatorFilters = [
  { id: "all", label: "전체" },
  { id: "stock", label: "주가지수" },
  { id: "etf", label: "ETF" },
  { id: "fx", label: "환율" },
  { id: "rate", label: "금리" },
  { id: "bond", label: "채권" },
  { id: "commodity", label: "원자재" },
] as const;

export type MarketIndicatorFilter = (typeof marketIndicatorFilters)[number]["id"];

const typeForCategory = (category: MarketCategory): MarketIndicatorType => {
  if (category === "stock") return "INDEX";
  if (category === "fx") return "FX";
  if (category === "rate") return "POLICY_RATE";
  if (category === "bond") return "BOND";
  return "COMMODITY";
};

const baseIndicators: MarketOverviewIndicator[] = marketIndicators.map((indicator) => ({
  id: indicator.id,
  name: indicator.name,
  shortName: indicator.shortName,
  category: indicator.category,
  type: typeForCategory(indicator.category),
  market: indicator.country,
  value: indicator.value,
  change: indicator.change,
  changePercent: indicator.changePercent,
  unit: indicator.unit,
  direction: indicator.direction,
  chartData: indicator.sparkline,
  updatedAt: indicator.updatedAt,
  detailId: indicator.id,
  dataSource: "mock",
}));

const overviewOnlyIndicators: MarketOverviewIndicator[] = [
  { id: "kospi200", name: "코스피 200", shortName: "KOSPI 200", category: "stock", type: "INDEX", market: "KR", value: 337.84, change: 1.18, changePercent: .35, unit: "", direction: "up", chartData: [332, 334, 333, 335, 336, 337, 338], updatedAt: "장 마감 기준", dataSource: "mock" },
  { id: "dow-jones", name: "다우존스", shortName: "DOW", category: "stock", type: "INDEX", market: "US", value: 38996.39, change: 141.43, changePercent: .36, unit: "", direction: "up", chartData: [38620, 38690, 38650, 38780, 38830, 38920, 38996], updatedAt: "전일 종가 기준", dataSource: "mock" },
  { id: "russell2000", name: "러셀 2000", shortName: "RUSSELL 2000", category: "stock", type: "INDEX", market: "US", value: 2063.12, change: -8.41, changePercent: -.41, unit: "", direction: "down", chartData: [2084, 2078, 2081, 2072, 2069, 2066, 2063], updatedAt: "전일 종가 기준", dataSource: "mock" },
  { id: "qqq", name: "인베스코 QQQ", shortName: "QQQ (ETF)", category: "etf", type: "ETF", market: "US", value: 442.31, change: 2.43, changePercent: .55, unit: "달러", direction: "up", chartData: [434, 436, 435, 438, 439, 441, 442], updatedAt: "전일 종가 기준", dataSource: "mock" },
  { id: "spy", name: "SPDR S&P 500", shortName: "SPY (ETF)", category: "etf", type: "ETF", market: "US", value: 507.18, change: 2.78, changePercent: .55, unit: "달러", direction: "up", chartData: [498, 499, 501, 500, 503, 505, 507], updatedAt: "전일 종가 기준", dataSource: "mock" },
  { id: "kodex200", name: "KODEX 200", shortName: "KODEX 200 (ETF)", category: "etf", type: "ETF", market: "KR", value: 33825, change: 115, changePercent: .34, unit: "원", direction: "up", chartData: [33320, 33480, 33410, 33590, 33620, 33710, 33825], updatedAt: "장 마감 기준", dataSource: "mock" },
  { id: "eur-krw", name: "원/유로 환율", shortName: "EUR/KRW", category: "fx", type: "FX", market: "EU", value: 1442.62, change: 3.08, changePercent: .21, unit: "원", direction: "up", chartData: [1430, 1434, 1432, 1438, 1436, 1440, 1443], updatedAt: "오후 4:00 기준", dataSource: "mock" },
  { id: "cny-krw", name: "원/위안 환율", shortName: "CNY/KRW", category: "fx", type: "FX", market: "CN", value: 184.22, change: -.31, changePercent: -.17, unit: "원", direction: "down", chartData: [185, 184.8, 184.9, 184.6, 184.5, 184.4, 184.2], updatedAt: "오후 4:00 기준", dataSource: "mock" },
  { id: "kr-10y", name: "한국 10년물 국채금리", shortName: "한국 10년물", category: "bond", type: "BOND", market: "KR", value: 3.42, change: .03, changePercent: .88, unit: "%", direction: "up", chartData: [3.31, 3.34, 3.32, 3.36, 3.38, 3.39, 3.42], updatedAt: "장 마감 기준", dataSource: "mock" },
  { id: "kr-3y", name: "한국 3년물 국채금리", shortName: "한국 3년물", category: "bond", type: "BOND", market: "KR", value: 3.27, change: -.02, changePercent: -.61, unit: "%", direction: "down", chartData: [3.34, 3.32, 3.33, 3.3, 3.29, 3.28, 3.27], updatedAt: "장 마감 기준", dataSource: "mock" },
  { id: "us-2y", name: "미국 2년물 국채금리", shortName: "미국 2년물", category: "bond", type: "BOND", market: "US", value: 4.71, change: .05, changePercent: 1.07, unit: "%", direction: "up", chartData: [4.59, 4.62, 4.61, 4.65, 4.67, 4.69, 4.71], updatedAt: "전일 종가 기준", dataSource: "mock" },
  { id: "wti", name: "서부텍사스유", shortName: "WTI", category: "commodity", type: "COMMODITY", market: "GLOBAL", value: 82.14, change: 1.08, changePercent: 1.33, unit: "달러/배럴", direction: "up", chartData: [79.8, 80.4, 80.1, 80.9, 81.2, 81.7, 82.1], updatedAt: "전일 종가 기준", dataSource: "mock" },
  { id: "silver", name: "은 현물", shortName: "SILVER", category: "commodity", type: "COMMODITY", market: "GLOBAL", value: 27.42, change: -.18, changePercent: -.65, unit: "달러/oz", direction: "down", chartData: [28.1, 27.9, 28, 27.8, 27.7, 27.5, 27.4], updatedAt: "전일 종가 기준", dataSource: "mock" },
];

export const marketOverviewIndicators: MarketOverviewIndicator[] = [...baseIndicators, ...overviewOnlyIndicators];

export const watchlistUniverse: WatchlistItem[] = [
  { id: "005930", symbol: "005930", name: "삼성전자", market: "KR", type: "STOCK", value: 72300, change: 1200, changePercent: 1.69, chartData: [69700, 70400, 71100, 70600, 71400, 71800, 72300], alertEnabled: false, dataSource: "mock" },
  { id: "000660", symbol: "000660", name: "SK하이닉스", market: "KR", type: "STOCK", value: 198500, change: 3400, changePercent: 1.74, chartData: [190200, 192100, 191400, 194300, 195800, 197000, 198500], alertEnabled: false, dataSource: "mock" },
  { id: "035420", symbol: "035420", name: "NAVER", market: "KR", type: "STOCK", value: 215000, change: -2500, changePercent: -1.15, chartData: [221000, 219500, 220200, 217800, 216900, 216100, 215000], alertEnabled: false, dataSource: "mock" },
  { id: "035720", symbol: "035720", name: "카카오", market: "KR", type: "STOCK", value: 58700, change: 800, changePercent: 1.38, chartData: [56800, 57200, 57000, 57900, 58100, 58400, 58700], alertEnabled: false, dataSource: "mock" },
  { id: "AAPL", symbol: "AAPL", name: "애플", market: "US", type: "STOCK", value: 189.42, change: 1.36, changePercent: .72, chartData: [185, 186, 185.7, 187.1, 187.8, 188.6, 189.4], alertEnabled: false, dataSource: "mock" },
  { id: "NVDA", symbol: "NVDA", name: "엔비디아", market: "US", type: "STOCK", value: 887.89, change: 14.72, changePercent: 1.69, chartData: [848, 856, 852, 866, 873, 881, 888], alertEnabled: false, dataSource: "mock" },
  { id: "TSLA", symbol: "TSLA", name: "테슬라", market: "US", type: "STOCK", value: 243.62, change: -4.21, changePercent: -1.7, chartData: [252, 249, 251, 247, 246, 245, 244], alertEnabled: false, dataSource: "mock" },
  { id: "QQQ", symbol: "QQQ", name: "인베스코 QQQ", market: "US", type: "ETF", value: 442.31, change: 2.43, changePercent: .55, chartData: [434, 436, 435, 438, 439, 441, 442], alertEnabled: false, dataSource: "mock" },
];

export const marketCalendarDays = [
  { date: "2026-09-28", day: "월", dateLabel: "28" },
  { date: "2026-09-29", day: "화", dateLabel: "29" },
  { date: "2026-09-30", day: "수", dateLabel: "30" },
  { date: "2026-10-01", day: "목", dateLabel: "1" },
  { date: "2026-10-02", day: "금", dateLabel: "2" },
  { date: "2026-10-03", day: "토", dateLabel: "3" },
  { date: "2026-10-04", day: "일", dateLabel: "4" },
] as const;

export const economicEvents: EconomicEvent[] = [
  { id: "event-0928-1", date: "2026-09-28", country: "EU", time: "18:00", title: "유로존 소비자신뢰지수", importance: "medium", forecast: "-14.2", previous: "-14.6", dataSource: "mock" },
  { id: "event-0929-1", date: "2026-09-29", country: "KR", time: "08:00", title: "한국 산업생산", importance: "medium", forecast: "0.4%", previous: "0.2%", dataSource: "mock" },
  { id: "event-0930-1", date: "2026-09-30", country: "US", time: "21:15", title: "연준 보우먼 부의장 연설", importance: "high", dataSource: "mock" },
  { id: "event-0930-2", date: "2026-09-30", country: "US", time: "23:30", title: "9월 댈러스 연은 제조업지수", importance: "high", forecast: "-8.1", previous: "-9.7", dataSource: "mock" },
  { id: "event-0930-3", date: "2026-09-30", country: "CN", time: "10:00", title: "중국 제조업 구매관리자지수(PMI)", importance: "high", forecast: "49.8", previous: "49.4", dataSource: "mock" },
  { id: "event-0930-4", date: "2026-09-30", country: "CN", time: "10:00", title: "중국 서비스업 구매관리자지수(PMI)", importance: "medium", forecast: "50.4", previous: "50.1", dataSource: "mock" },
  { id: "event-1001-1", date: "2026-10-01", country: "US", time: "23:00", title: "ISM 제조업 구매관리자지수", importance: "high", forecast: "49.1", previous: "48.7", dataSource: "mock" },
  { id: "event-1002-1", date: "2026-10-02", country: "US", time: "21:30", title: "미국 신규 실업수당청구건수", importance: "high", forecast: "228K", previous: "224K", dataSource: "mock" },
  { id: "event-1004-1", date: "2026-10-04", country: "JP", time: "08:50", title: "일본 외환보유액", importance: "low", previous: "$1.23T", dataSource: "mock" },
];

export const marketThemes: MarketTheme[] = [
  { id: "theme-ai", name: "AI / 반도체", tab: "realtime", rank: 1, changePercent: 2.8, relatedCount: 18, keywords: ["AI", "데이터센터"], dataSource: "mock" },
  { id: "theme-power", name: "원전 / 전력", tab: "realtime", rank: 2, changePercent: 1.9, relatedCount: 12, keywords: ["전력망", "원전"], dataSource: "mock" },
  { id: "theme-battery", name: "2차전지", tab: "realtime", rank: 3, changePercent: 1.7, relatedCount: 10, keywords: ["배터리", "소재"], dataSource: "mock" },
  { id: "theme-defense", name: "방산", tab: "realtime", rank: 4, changePercent: 1.5, relatedCount: 8, keywords: ["수출", "방산"], dataSource: "mock" },
  { id: "theme-bio", name: "바이오", tab: "up", rank: 1, changePercent: 3.2, relatedCount: 9, keywords: ["신약", "임상"], dataSource: "mock" },
  { id: "theme-robot", name: "로봇", tab: "up", rank: 2, changePercent: 2.4, relatedCount: 7, keywords: ["자동화", "로봇"], dataSource: "mock" },
  { id: "theme-ev", name: "전기차", tab: "up", rank: 3, changePercent: 1.3, relatedCount: 6, keywords: ["완성차", "충전"], dataSource: "mock" },
  { id: "theme-shipping", name: "해운", tab: "down", rank: 1, changePercent: -2.1, relatedCount: 11, keywords: ["운임", "물류"], dataSource: "mock" },
  { id: "theme-travel", name: "여행 / 항공", tab: "down", rank: 2, changePercent: -1.6, relatedCount: 5, keywords: ["유가", "여객"], dataSource: "mock" },
  { id: "theme-internet", name: "인터넷 플랫폼", tab: "down", rank: 3, changePercent: -.9, relatedCount: 8, keywords: ["광고", "플랫폼"], dataSource: "mock" },
];
