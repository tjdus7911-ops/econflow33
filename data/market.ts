import type { CharacterPose } from "@/components/econflow/Character";

export type MarketCategory = "stock" | "fx" | "rate" | "bond" | "commodity";
export type MarketDirection = "up" | "down" | "steady";
export type MarketPeriod = "1w" | "1m" | "3m" | "1y";

export type MarketReason = {
  title: string;
  description: string;
  relatedNewsIds: string[];
};

export type MarketIndicator = {
  id: string;
  name: string;
  shortName: string;
  category: MarketCategory;
  country: "KR" | "US" | "JP" | "GLOBAL";
  value: number;
  unit: string;
  change: number;
  changePercent: number;
  direction: MarketDirection;
  updatedAt: string;
  sparkline: number[];
  history: Record<MarketPeriod, number[]>;
  simpleExplanation: string;
  marketReasons: MarketReason[];
  relatedNewsIds: string[];
  relatedLessonIds: string[];
  dataSource: "mock";
};

export const marketCategories: { id: "all" | MarketCategory; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "stock", label: "주식" },
  { id: "fx", label: "환율" },
  { id: "rate", label: "금리" },
  { id: "bond", label: "채권" },
  { id: "commodity", label: "원자재" },
];

export const marketSummary: {
  headline: string;
  description: string;
  signals: { label: string; direction: MarketDirection }[];
  characterPose: CharacterPose;
  updatedAt: string;
  dataSource: "mock";
} = {
  headline: "금리 ↓ · 원/달러 환율 ↑ · 주식 ↑ 흐름이에요.",
  description: "미국 금리 인하 기대가 커지면서 주식시장에는 비교적 긍정적인 분위기가 나타나고 있어요.",
  signals: [
    { label: "금리", direction: "down" },
    { label: "원/달러 환율", direction: "up" },
    { label: "주식", direction: "up" },
  ],
  characterPose: "market",
  updatedAt: "오늘 오전 10:20",
  dataSource: "mock",
};

const histories = (points: number[]): Record<MarketPeriod, number[]> => ({
  "1w": points.slice(-7),
  "1m": [...points, ...points.map((point, index) => point + (index % 3 - 1) * 0.4)],
  "3m": [...points.map((point) => point * 0.985), ...points, ...points.map((point) => point * 1.008)],
  "1y": [...points.map((point) => point * 0.93), ...points.map((point) => point * 0.97), ...points, ...points.map((point) => point * 1.01)],
});

export const marketIndicators: MarketIndicator[] = [
  {
    id: "kospi", name: "코스피", shortName: "KOSPI", category: "stock", country: "KR",
    value: 2482.1, unit: "", change: 12.34, changePercent: 0.5, direction: "up", updatedAt: "오늘 오후 3:30",
    sparkline: [2442, 2448, 2455, 2449, 2462, 2470, 2482], history: histories([2388, 2405, 2398, 2422, 2416, 2440, 2433, 2451, 2462, 2470, 2482]),
    simpleExplanation: "코스피는 한국의 대표 기업들이 전반적으로 어떤 흐름을 보이는지 알려주는 주가지수예요.",
    marketReasons: [
      { title: "금리 인하 기대", description: "시장 금리 부담이 낮아질 수 있다는 기대가 투자 심리에 힘을 보탰어요.", relatedNewsIds: ["fed-patience"] },
      { title: "반도체 투자", description: "AI 인프라 투자가 이어지며 대형 기술주가 주목받았어요.", relatedNewsIds: ["ai-chip"] },
      { title: "외국인 수급", description: "대형주 중심의 외국인 매수 흐름이 지수에 영향을 줬어요.", relatedNewsIds: ["currency-range"] },
    ],
    relatedNewsIds: ["fed-patience", "ai-chip"], relatedLessonIds: ["why-stock-moves"], dataSource: "mock",
  },
  {
    id: "kosdaq", name: "코스닥", shortName: "KOSDAQ", category: "stock", country: "KR",
    value: 815.24, unit: "", change: -3.21, changePercent: -0.39, direction: "down", updatedAt: "오늘 오후 3:30",
    sparkline: [827, 824, 829, 821, 819, 817, 815], history: histories([788, 796, 803, 801, 810, 818, 827, 824, 821, 817, 815]),
    simpleExplanation: "코스닥은 성장 가능성이 큰 중소·기술 기업의 주가 흐름을 보여주는 지수예요.",
    marketReasons: [
      { title: "성장주 부담", description: "금리 전망이 엇갈리며 성장주에 대한 눈높이가 조정됐어요.", relatedNewsIds: ["fed-patience"] },
      { title: "차익 실현", description: "최근 오른 일부 종목에서 이익을 확정하려는 움직임이 나타났어요.", relatedNewsIds: ["ai-chip"] },
      { title: "업종별 차이", description: "반도체와 바이오 등 주요 업종의 흐름이 엇갈렸어요.", relatedNewsIds: ["ai-chip"] },
    ],
    relatedNewsIds: ["ai-chip", "fed-patience"], relatedLessonIds: ["why-stock-moves"], dataSource: "mock",
  },
  {
    id: "sp500", name: "S&P 500", shortName: "S&P 500", category: "stock", country: "US",
    value: 5071.17, unit: "", change: 28.21, changePercent: 0.56, direction: "up", updatedAt: "오늘 오전 6:00",
    sparkline: [5012, 5007, 5024, 5038, 5041, 5055, 5071], history: histories([4860, 4902, 4921, 4955, 4970, 4998, 5012, 5024, 5038, 5055, 5071]),
    simpleExplanation: "S&P 500은 미국을 대표하는 500개 기업의 주가 흐름을 한눈에 보여줘요.",
    marketReasons: [
      { title: "금리 기대", description: "물가 부담이 완화될 수 있다는 기대가 주식시장에 긍정적으로 작용했어요.", relatedNewsIds: ["fed-patience"] },
      { title: "기술주 강세", description: "AI 투자와 데이터센터 수요가 대형 기술주를 지지했어요.", relatedNewsIds: ["ai-chip"] },
      { title: "실적 기대", description: "주요 기업의 이익이 이어질 수 있다는 전망도 반영됐어요.", relatedNewsIds: ["power-grid"] },
    ],
    relatedNewsIds: ["fed-patience", "ai-chip"], relatedLessonIds: ["why-stock-moves"], dataSource: "mock",
  },
  {
    id: "nasdaq", name: "나스닥", shortName: "NASDAQ", category: "stock", country: "US",
    value: 15611.76, unit: "", change: 112.43, changePercent: 0.73, direction: "up", updatedAt: "오늘 오전 6:00",
    sparkline: [15390, 15424, 15412, 15490, 15508, 15562, 15612], history: histories([14850, 14990, 15110, 15080, 15240, 15310, 15390, 15412, 15490, 15562, 15612]),
    simpleExplanation: "나스닥은 미국 기술 기업의 비중이 높아 성장 산업의 기대 변화에 민감한 지수예요.",
    marketReasons: [
      { title: "AI 투자", description: "반도체와 클라우드 투자 계획이 기술주 기대를 높였어요.", relatedNewsIds: ["ai-chip"] },
      { title: "채권 금리", description: "장기 금리 하락이 성장주의 가치 평가 부담을 덜어줬어요.", relatedNewsIds: ["bond-yield"] },
      { title: "대형주 중심", description: "시가총액이 큰 기술 기업이 지수 상승을 이끌었어요.", relatedNewsIds: ["power-grid"] },
    ],
    relatedNewsIds: ["ai-chip", "bond-yield"], relatedLessonIds: ["why-stock-moves"], dataSource: "mock",
  },
  {
    id: "usd-krw", name: "원/달러 환율", shortName: "USD/KRW", category: "fx", country: "KR",
    value: 1334.2, unit: "원", change: 4.8, changePercent: 0.36, direction: "up", updatedAt: "오늘 오후 4:00",
    sparkline: [1322, 1326, 1324, 1329, 1331, 1330, 1334], history: histories([1304, 1311, 1308, 1315, 1318, 1322, 1326, 1324, 1329, 1330, 1334]),
    simpleExplanation: "원/달러 환율이 오른다는 것은 같은 1달러를 사기 위해 더 많은 원화가 필요하다는 뜻이에요. 쉽게 말하면 원화 가치가 상대적으로 약해졌다는 의미예요.",
    marketReasons: [
      { title: "미국 금리 전망", description: "미국 금리가 높은 수준에 오래 머물 수 있다는 예상이 달러 수요에 영향을 줬어요.", relatedNewsIds: ["fed-patience"] },
      { title: "달러 강세", description: "주요 통화 대비 달러가 강해지며 원/달러 환율도 함께 움직였어요.", relatedNewsIds: ["currency-range"] },
      { title: "외국인 자금 흐름", description: "국내 주식시장의 외국인 매매가 원화 수요에 영향을 줬어요.", relatedNewsIds: ["currency-range"] },
    ],
    relatedNewsIds: ["currency-range", "fed-patience"], relatedLessonIds: ["why-fx-moves"], dataSource: "mock",
  },
  {
    id: "jpy-krw", name: "원/엔 환율", shortName: "JPY/KRW", category: "fx", country: "JP",
    value: 902.45, unit: "원/100엔", change: -2.15, changePercent: -0.24, direction: "down", updatedAt: "오늘 오후 4:00",
    sparkline: [911, 908, 909, 906, 904, 905, 902], history: histories([930, 925, 919, 916, 914, 911, 908, 909, 906, 905, 902]),
    simpleExplanation: "원/엔 환율은 100엔을 사는 데 필요한 원화의 양이에요. 내려가면 같은 엔화를 더 적은 원화로 바꿀 수 있어요.",
    marketReasons: [
      { title: "일본 금리 전망", description: "일본은행의 정책 변화 기대가 엔화 가치에 영향을 줬어요.", relatedNewsIds: ["currency-range"] },
      { title: "달러 흐름", description: "달러 강세가 엔화와 원화에 서로 다른 속도로 반영됐어요.", relatedNewsIds: ["fed-patience"] },
      { title: "수출입 수요", description: "한일 기업의 결제 수요도 단기 환율에 영향을 줄 수 있어요.", relatedNewsIds: ["global-shipping"] },
    ],
    relatedNewsIds: ["currency-range", "global-shipping"], relatedLessonIds: ["why-fx-moves"], dataSource: "mock",
  },
  {
    id: "kr-base-rate", name: "한국 기준금리", shortName: "한국 기준금리", category: "rate", country: "KR",
    value: 3.5, unit: "%", change: 0, changePercent: 0, direction: "steady", updatedAt: "최근 결정 기준",
    sparkline: [3.25, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5], history: histories([2.5, 2.75, 3, 3.25, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5]),
    simpleExplanation: "한국 기준금리는 한국은행이 정하는 대표 금리로, 예금과 대출 금리가 움직이는 출발점이에요.",
    marketReasons: [
      { title: "물가 흐름", description: "생활물가가 충분히 안정되는지 확인할 필요가 있어요.", relatedNewsIds: ["korea-retail"] },
      { title: "가계부채", description: "금리 변화가 대출과 주택시장에 미치는 영향도 함께 살펴요.", relatedNewsIds: ["currency-range"] },
      { title: "원화 가치", description: "미국과의 금리 차이가 환율에 미칠 영향도 고려해요.", relatedNewsIds: ["fed-patience"] },
    ],
    relatedNewsIds: ["korea-retail", "currency-range"], relatedLessonIds: ["what-is-rate"], dataSource: "mock",
  },
  {
    id: "us-base-rate", name: "미국 기준금리", shortName: "미국 기준금리", category: "rate", country: "US",
    value: 5.5, unit: "%", change: 0, changePercent: 0, direction: "steady", updatedAt: "최근 결정 기준",
    sparkline: [5, 5.25, 5.5, 5.5, 5.5, 5.5, 5.5], history: histories([3.75, 4, 4.5, 4.75, 5, 5.25, 5.5, 5.5, 5.5, 5.5, 5.5]),
    simpleExplanation: "미국 기준금리는 연준이 정하는 대표 금리로, 세계 금융시장과 달러 가치에 폭넓게 영향을 줘요.",
    marketReasons: [
      { title: "물가", description: "연준은 물가 상승 속도가 목표에 가까워지는지 확인하고 있어요.", relatedNewsIds: ["fed-patience"] },
      { title: "고용", description: "고용이 너무 빠르게 약해지는지도 중요한 판단 기준이에요.", relatedNewsIds: ["fed-patience"] },
      { title: "금융 여건", description: "채권 금리와 주식시장 움직임도 정책 효과를 판단하는 단서예요.", relatedNewsIds: ["bond-yield"] },
    ],
    relatedNewsIds: ["fed-patience", "bond-yield"], relatedLessonIds: ["what-is-rate"], dataSource: "mock",
  },
  {
    id: "us-10y", name: "미국 10년물 국채금리", shortName: "미국 10년물", category: "bond", country: "US",
    value: 4.32, unit: "%", change: 0.08, changePercent: 1.89, direction: "up", updatedAt: "오늘 오전 6:00",
    sparkline: [4.21, 4.18, 4.24, 4.22, 4.27, 4.29, 4.32], history: histories([3.91, 3.98, 4.02, 4.08, 4.14, 4.21, 4.18, 4.24, 4.27, 4.29, 4.32]),
    simpleExplanation: "미국 10년물 국채금리는 미국 정부가 10년 동안 돈을 빌릴 때 시장이 요구하는 금리예요. 장기 성장과 물가 기대를 함께 반영해요.",
    marketReasons: [
      { title: "연준 전망", description: "기준금리가 얼마나 오래 높은 수준에 머물지에 대한 예상이 반영됐어요.", relatedNewsIds: ["fed-patience"] },
      { title: "물가 기대", description: "앞으로 물가가 얼마나 오를지에 대한 전망이 장기 금리에 영향을 줘요.", relatedNewsIds: ["bond-yield"] },
      { title: "국채 수급", description: "국채 발행과 투자자 수요의 균형도 금리를 움직여요.", relatedNewsIds: ["bond-yield"] },
    ],
    relatedNewsIds: ["bond-yield", "fed-patience"], relatedLessonIds: ["bond-yield"], dataSource: "mock",
  },
  {
    id: "gold", name: "금 현물", shortName: "GOLD", category: "commodity", country: "GLOBAL",
    value: 2364.8, unit: "달러/oz", change: 18.6, changePercent: 0.79, direction: "up", updatedAt: "오늘 오전 6:00",
    sparkline: [2310, 2322, 2317, 2338, 2346, 2350, 2365], history: histories([2180, 2205, 2240, 2265, 2288, 2310, 2322, 2317, 2338, 2350, 2365]),
    simpleExplanation: "금 가격은 불확실성이 커질 때 자산을 지키려는 수요와 달러·금리 흐름에 영향을 받아요.",
    marketReasons: [
      { title: "안전자산 수요", description: "경제와 국제 정세의 불확실성이 금 수요를 높일 수 있어요.", relatedNewsIds: ["global-shipping"] },
      { title: "달러 가치", description: "달러가 약해지면 다른 통화 사용자에게 금이 상대적으로 저렴해질 수 있어요.", relatedNewsIds: ["currency-range"] },
      { title: "실질금리", description: "물가를 고려한 금리가 낮아지면 이자가 없는 금의 부담이 줄어들 수 있어요.", relatedNewsIds: ["bond-yield"] },
    ],
    relatedNewsIds: ["currency-range", "bond-yield"], relatedLessonIds: ["read-indicators"], dataSource: "mock",
  },
];

export const getMarketIndicator = (id: string) => marketIndicators.find((indicator) => indicator.id === id);
