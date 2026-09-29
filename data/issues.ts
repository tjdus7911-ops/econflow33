export type Issue = {
  id: string;
  title: string;
  shortTitle: string;
  summary: string;
  category: string;
  impact: string;
  publishedAt: string;
  status: string;
  direction: "up" | "down" | "steady";
  keywords: string[];
  contentType: "briefing";
  importanceScore: number;
  articleVolume: number;
  sourceDiversity: number;
  economicImpact: number;
  koreaRelevance: number;
  relatedNewsIds: string[];
  relatedMarketIds: string[];
  relatedLessonIds: string[];
  event: string;
  cause: string;
  impacts: { label: string; text: string; tone: "red" | "blue" | "green" | "navy" }[];
  oneLine: string;
};

export const issues: Issue[] = [
  {
    id: "rate-cut-expectation",
    title: "미국 금리 인하 기대감이 다시 커지고 있어요",
    shortTitle: "동결 가능성 ↑",
    summary: "물가 상승세가 조금 누그러지며 시장은 금리 인하 가능성을 다시 살피고 있어요.",
    category: "금리",
    impact: "주식·환율·대출 금리에 영향을 줄 수 있어요.",
    publishedAt: "오늘 오전 8:10",
    status: "+2.1%",
    direction: "up",
    keywords: ["기준금리", "물가", "연준"],
    contentType: "briefing", importanceScore: 92, articleVolume: 38, sourceDiversity: 9, economicImpact: 96, koreaRelevance: 88,
    relatedNewsIds: ["fed-patience", "bond-yield"], relatedMarketIds: ["us-base-rate", "us-10y", "sp500", "usd-krw"], relatedLessonIds: ["what-is-rate"],
    event: "최근 발표된 물가 지표가 시장의 예상보다 차분했어요. 투자자들은 미국 중앙은행이 이전보다 금리를 내리기 쉬워졌다고 해석하고 있어요.",
    cause: "물가가 빠르게 오를 때는 금리를 쉽게 내리기 어렵습니다. 반대로 물가 압력이 줄어들면 경기 부담을 덜기 위해 금리를 낮출 여지가 생겨요.",
    impacts: [
      { label: "주식", text: "기업의 자금 조달 부담이 줄 거라는 기대가 생길 수 있어요.", tone: "red" },
      { label: "환율", text: "달러 강세가 완화되면 원화 가치가 안정될 수 있어요.", tone: "blue" },
      { label: "대출", text: "시장 금리가 먼저 낮아지면 대출 이자 부담도 천천히 줄 수 있어요.", tone: "green" },
      { label: "물가", text: "금리를 너무 빨리 내리면 물가가 다시 오를 가능성도 살펴야 해요.", tone: "navy" },
    ],
    oneLine: "금리 인하 기대가 커졌지만, 실제 결정 전까지 물가와 고용 지표를 함께 보는 것이 중요해요.",
  },
  {
    id: "won-dollar-volatility",
    title: "원·달러 환율의 하루 변동 폭이 커졌어요",
    shortTitle: "다시 가속화",
    summary: "미국 금리 전망이 자주 바뀌며 달러와 원화의 움직임도 커지고 있어요.",
    category: "환율",
    impact: "수입 물가와 해외여행 비용에 영향을 줘요.",
    publishedAt: "오늘 오전 9:20",
    status: "주의",
    direction: "steady",
    keywords: ["환율", "달러", "수입물가"],
    contentType: "briefing", importanceScore: 86, articleVolume: 27, sourceDiversity: 7, economicImpact: 89, koreaRelevance: 98,
    relatedNewsIds: ["currency-range"], relatedMarketIds: ["usd-krw", "jpy-krw", "kospi"], relatedLessonIds: ["why-fx-moves"],
    event: "원·달러 환율이 하루 안에서도 비교적 큰 폭으로 움직였어요.",
    cause: "미국의 금리 전망과 글로벌 투자 심리가 빠르게 바뀌면서 달러 수요도 함께 출렁였기 때문이에요.",
    impacts: [
      { label: "수입", text: "원화가 약해지면 원유와 원자재의 원화 가격이 오를 수 있어요.", tone: "red" },
      { label: "여행", text: "달러가 비싸지면 미국 여행과 직구 비용이 늘 수 있어요.", tone: "blue" },
      { label: "수출", text: "수출 기업에는 가격 경쟁력 측면에서 도움이 될 수도 있어요.", tone: "green" },
      { label: "투자", text: "해외 자산 수익률은 자산 가격과 환율을 함께 봐야 해요.", tone: "navy" },
    ],
    oneLine: "환율이 흔들릴수록 한 방향을 예측하기보다 내 지출과 투자에 미치는 영향을 나눠서 봐야 해요.",
  },
  {
    id: "ai-investment",
    title: "AI 인프라 투자가 다시 속도를 내고 있어요",
    shortTitle: "또 한 번의 기회",
    summary: "반도체와 데이터센터를 중심으로 기업들의 AI 투자가 이어지고 있어요.",
    category: "산업",
    impact: "반도체·전력·클라우드 산업의 수요와 연결돼요.",
    publishedAt: "오늘 오전 10:05",
    status: "+3.4%",
    direction: "up",
    keywords: ["AI", "반도체", "데이터센터"],
    contentType: "briefing", importanceScore: 79, articleVolume: 31, sourceDiversity: 6, economicImpact: 82, koreaRelevance: 84,
    relatedNewsIds: ["ai-chip", "power-grid"], relatedMarketIds: ["nasdaq", "sp500", "kospi"], relatedLessonIds: ["why-stock-moves"],
    event: "주요 기술 기업들이 AI 서버와 데이터센터 투자를 이어가겠다는 계획을 밝혔어요.",
    cause: "생성형 AI 서비스 이용이 늘면서 더 많은 반도체, 전력, 네트워크 인프라가 필요해졌기 때문이에요.",
    impacts: [
      { label: "반도체", text: "고성능 연산용 칩과 메모리 수요가 이어질 수 있어요.", tone: "red" },
      { label: "전력", text: "데이터센터 전력 수요가 커져 관련 설비 투자가 늘 수 있어요.", tone: "blue" },
      { label: "기업", text: "큰 투자 비용이 실제 수익으로 이어지는지 확인해야 해요.", tone: "green" },
      { label: "고용", text: "AI 활용 직무와 인프라 운영 인력 수요가 달라질 수 있어요.", tone: "navy" },
    ],
    oneLine: "AI 투자는 계속되고 있지만, 투자 규모와 실제 수익성의 균형이 다음 관전 포인트예요.",
  },
  {
    id: "korea-consumption",
    title: "국내 소비 심리가 완만하게 회복되고 있어요",
    shortTitle: "소비 심리 회복",
    summary: "생활비 부담은 남아 있지만 소비자들의 경기 전망이 조금 나아졌어요.",
    category: "한국",
    impact: "유통·여행·외식 업종에 영향을 줄 수 있어요.",
    publishedAt: "어제 오후 5:30",
    status: "회복",
    direction: "up",
    keywords: ["소비", "내수", "심리지표"],
    contentType: "briefing", importanceScore: 68, articleVolume: 18, sourceDiversity: 5, economicImpact: 65, koreaRelevance: 95,
    relatedNewsIds: ["korea-retail"], relatedMarketIds: ["kospi", "kr-base-rate"], relatedLessonIds: ["read-indicators"],
    event: "소비자들이 앞으로의 경기를 보는 시선이 지난달보다 조금 밝아졌어요.",
    cause: "물가 상승 속도가 완만해지고 일부 생활비 부담이 줄어든 점이 영향을 줬어요.",
    impacts: [
      { label: "소비", text: "지갑을 여는 사람이 늘면 내수 회복에 도움이 돼요.", tone: "red" },
      { label: "자영업", text: "외식과 서비스 지출 회복을 기대할 수 있어요.", tone: "blue" },
      { label: "물가", text: "수요가 빠르게 늘면 가격 부담이 다시 커질 수 있어요.", tone: "green" },
      { label: "고용", text: "내수 업종의 채용에도 긍정적인 신호가 될 수 있어요.", tone: "navy" },
    ],
    oneLine: "소비 심리는 나아졌지만 실제 지출 회복이 이어지는지 함께 확인해야 해요.",
  },
];

export const issueCategories = ["전체", "금리", "환율", "한국", "산업", "글로벌"];
