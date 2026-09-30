import type { NewsItem, PreviewNewsComment } from "@/lib/news/types";

export const PREVIEW_SAMPLE_DATA_SOURCE = "preview-sample";

type PreviewCategory = "속보" | "시장" | "기업" | "산업" | "글로벌";

type PreviewCommentSeed = Omit<PreviewNewsComment, "id" | "createdAt"> & {
  minutesAgo: number;
};

type PreviewNewsSeed = {
  id: string;
  category: PreviewCategory;
  title: string;
  summary: string;
  minutesAgo: number;
  thumbnailUrl?: string;
  keywords: string[];
  relatedCompanies: NonNullable<NewsItem["relatedCompanies"]>;
  relatedIndicators: NonNullable<NewsItem["relatedIndicators"]>;
  viewCount: number;
  commentCount: number;
  aiSummary: string[];
  whatHappened: string;
  whyImportant: string;
  impact: string;
  personalMeaning: string;
  keyTakeaway: string;
  sentiment: { positive: number; negative: number };
  feedback: { helpful: number; difficult: number };
  comments: PreviewCommentSeed[];
};

const isoMinutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

const relativeTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 24 * 60) return `${Math.floor(minutes / 60)}시간 전`;
  return `${Math.floor(minutes / (24 * 60))}일 전`;
};

const seeds: PreviewNewsSeed[] = [
  {
    id: "preview-rate-hold",
    category: "속보",
    title: "한국은행, 기준금리 동결…물가·가계대출 흐름 점검",
    summary: "한국은행이 기준금리를 유지하고 다음 결정까지 물가 안정과 가계대출 증가세를 함께 살피겠다는 시나리오예요.",
    minutesAgo: 18,
    thumbnailUrl: "/news/rates.webp",
    keywords: ["한국은행", "기준금리", "가계대출"],
    relatedCompanies: [
      { name: "KB금융", symbol: "105560" },
      { name: "신한지주", symbol: "055550" },
    ],
    relatedIndicators: [
      { id: "preview-kr-rate", name: "한국 기준금리", value: "2.50%", change: "0.00%p", direction: "steady" },
      { id: "preview-kospi", name: "코스피", value: "2,645.30", change: "+0.42%", direction: "up" },
      { id: "preview-usd-krw", name: "원·달러", value: "1,338.50", change: "-0.35%", direction: "down" },
    ],
    viewCount: 33_720,
    commentCount: 96,
    aiSummary: [
      "기준금리는 유지됐고, 당장 대출·예금 금리가 크게 바뀔 가능성은 낮아졌어요.",
      "물가 둔화와 가계대출 증가라는 서로 다른 신호를 함께 확인하려는 결정이에요.",
      "다음 금리 결정 전까지 소비자물가와 주택 관련 지표가 중요해졌어요.",
    ],
    whatHappened: "한국은행이 기준금리를 현재 수준으로 유지하는 가상 결정을 내렸어요. 물가는 둔화 중이지만 가계대출 증가세가 이어져 추가 인하에는 신중한 입장을 보였어요.",
    whyImportant: "기준금리는 예금과 대출, 채권, 주식의 가격을 폭넓게 움직이는 출발점이에요. 동결 기간이 길어지면 가계와 기업의 이자 부담도 예상보다 오래 이어질 수 있어요.",
    impact: "은행주는 예대마진 기대에 관심을 받을 수 있지만, 내수 기업은 높은 자금 조달 비용이 부담이 될 수 있어요. 채권 금리는 다음 인하 시점에 대한 기대에 따라 움직일 가능성이 커요.",
    personalMeaning: "변동금리 대출이 있다면 다음 금리 인하를 단정하기보다 상환 계획을 보수적으로 잡는 편이 좋아요. 예금 만기도 여러 시점으로 나누면 금리 변화에 대응하기 쉬워요.",
    keyTakeaway: "금리는 동결됐지만 방향이 확정된 것은 아니며, 물가와 가계대출을 함께 봐야 해요.",
    sentiment: { positive: 156, negative: 312 },
    feedback: { helpful: 184, difficult: 36 },
    comments: [
      { userName: "경제초보", content: "동결이 곧 금리 인하 포기라는 뜻은 아니라는 설명이 도움이 됐어요.", likeCount: 42, minutesAgo: 12 },
      { userName: "월급관리중", content: "주택대출 금리가 언제 움직이는지도 같이 지켜봐야겠네요.", likeCount: 28, minutesAgo: 8 },
      { userName: "채권한걸음", content: "다음 물가 발표 뒤 채권 금리 반응이 궁금합니다.", likeCount: 17, minutesAgo: 4 },
    ],
  },
  {
    id: "preview-us-inflation",
    category: "시장",
    title: "미국 물가 상승세 둔화…기술주 중심으로 투자심리 회복",
    summary: "미국 물가 지표가 예상보다 완만해지면서 금리 부담이 큰 성장주에 매수세가 유입되는 가상 시장 상황이에요.",
    minutesAgo: 54,
    thumbnailUrl: "/news/technology.webp",
    keywords: ["미국 물가", "나스닥", "기술주"],
    relatedCompanies: [
      { name: "엔비디아", symbol: "NVDA" },
      { name: "마이크로소프트", symbol: "MSFT" },
      { name: "애플", symbol: "AAPL" },
    ],
    relatedIndicators: [
      { id: "preview-nasdaq", name: "나스닥", value: "18,624.20", change: "+1.32%", direction: "up" },
      { id: "preview-us-10y", name: "미국 10년물", value: "3.84%", change: "-0.07%p", direction: "down" },
      { id: "preview-dollar", name: "달러 인덱스", value: "101.42", change: "-0.28%", direction: "down" },
    ],
    viewCount: 29_480,
    commentCount: 82,
    aiSummary: [
      "물가 압력이 낮아졌다는 해석이 나오며 미국 장기금리가 하락했어요.",
      "미래 이익의 가치가 중요한 기술주가 금리 하락 기대에 더 민감하게 반응했어요.",
      "한 번의 지표보다 다음 고용·물가 흐름이 상승세 지속 여부를 결정할 가능성이 커요.",
    ],
    whatHappened: "미국 물가 상승률이 시장 예상보다 낮게 나온 가상 시나리오에서 국채 금리가 하락하고 나스닥 중심의 기술주가 반등했어요.",
    whyImportant: "물가가 안정되면 중앙은행이 높은 금리를 오래 유지할 필요가 줄어들 수 있어요. 이 기대는 기업의 자금 조달 비용과 주식 가치 평가에 바로 반영돼요.",
    impact: "장기금리 하락은 기술주에 긍정적일 수 있지만 달러 약세와 업종 간 순환매를 함께 만들 수 있어요. 반도체와 소프트웨어 종목의 변동성은 여전히 클 수 있어요.",
    personalMeaning: "미국 주식 비중이 높다면 하루 상승률보다 금리와 실적 전망이 같은 방향으로 움직이는지 확인해 보세요. 환율 변화도 원화 기준 수익률에 영향을 줘요.",
    keyTakeaway: "물가 둔화는 기술주에 우호적이지만, 다음 지표로 추세가 확인돼야 해요.",
    sentiment: { positive: 338, negative: 129 },
    feedback: { helpful: 205, difficult: 29 },
    comments: [
      { userName: "미국주식러", content: "금리와 기술주가 왜 반대로 움직이는지 이해됐어요.", likeCount: 51, minutesAgo: 39 },
      { userName: "분산투자", content: "환율까지 같이 봐야 원화 수익률을 알 수 있다는 점이 중요하네요.", likeCount: 34, minutesAgo: 27 },
      { userName: "데이터체크", content: "다음 고용지표까지 확인하고 판단해야겠어요.", likeCount: 22, minutesAgo: 16 },
    ],
  },
  {
    id: "preview-hbm-investment",
    category: "기업",
    title: "삼성전자·SK하이닉스, 차세대 HBM 투자 확대 예고",
    summary: "AI 서버용 고대역폭 메모리 수요에 대응하기 위해 국내 반도체 기업들이 생산능력 확대를 검토하는 가상 기업 뉴스예요.",
    minutesAgo: 125,
    thumbnailUrl: "/news/technology.webp",
    keywords: ["HBM", "반도체", "AI 서버"],
    relatedCompanies: [
      { name: "삼성전자", symbol: "005930" },
      { name: "SK하이닉스", symbol: "000660" },
      { name: "한미반도체", symbol: "042700" },
    ],
    relatedIndicators: [
      { id: "preview-kospi-chip", name: "코스피 반도체", value: "4,982.14", change: "+2.14%", direction: "up" },
      { id: "preview-dram", name: "DRAM 현물지수", value: "118.6", change: "+0.80%", direction: "up" },
      { id: "preview-sox", name: "필라델피아 반도체", value: "5,214.70", change: "+1.85%", direction: "up" },
    ],
    viewCount: 41_920,
    commentCount: 137,
    aiSummary: [
      "AI 서버 수요에 맞춰 국내 메모리 기업이 HBM 생산능력 확대를 검토하고 있어요.",
      "투자 확대는 장기 성장 기반이지만 단기적으로는 감가상각과 비용 부담을 키울 수 있어요.",
      "장비·소재 기업에도 주문 증가 기대가 확산될 수 있어요.",
    ],
    whatHappened: "삼성전자와 SK하이닉스가 차세대 HBM 생산라인과 패키징 설비에 대한 투자를 늘리는 가상 계획을 제시했어요.",
    whyImportant: "HBM은 AI 가속기의 성능을 좌우하는 핵심 메모리예요. 공급능력과 수율은 메모리 기업의 시장점유율과 수익성을 결정할 수 있어요.",
    impact: "메모리와 반도체 장비 기업에는 수주 기대가 커질 수 있어요. 반면 공급이 너무 빠르게 늘면 향후 가격 경쟁과 재고 부담이 생길 가능성도 있어요.",
    personalMeaning: "반도체 관련 투자에서는 AI 수요뿐 아니라 설비투자 규모, 수율, 고객사 확보를 함께 확인하세요. 테마 상승만으로 장기 실적을 단정하기는 어려워요.",
    keyTakeaway: "HBM 투자는 성장 기회와 비용 부담을 동시에 키우므로 수율과 고객 확보가 핵심이에요.",
    sentiment: { positive: 402, negative: 121 },
    feedback: { helpful: 247, difficult: 41 },
    comments: [
      { userName: "반도체공부", content: "매출 성장뿐 아니라 감가상각 부담도 봐야 한다는 점이 좋았어요.", likeCount: 68, minutesAgo: 91 },
      { userName: "장기투자자", content: "결국 수율과 고객사 확보가 실제 실적으로 이어지는지 확인해야겠네요.", likeCount: 49, minutesAgo: 73 },
      { userName: "산업읽기", content: "장비주까지 연결해서 볼 수 있어 이해가 쉬웠습니다.", likeCount: 31, minutesAgo: 55 },
      { userName: "초보개미", content: "HBM 공급이 늘면 가격이 어떻게 바뀔지도 궁금해요.", likeCount: 18, minutesAgo: 34 },
    ],
  },
  {
    id: "preview-battery-ess",
    category: "산업",
    title: "전기차 배터리 업계, 에너지저장장치 수요로 돌파구 모색",
    summary: "전기차 수요 성장세가 주춤한 가운데 배터리 기업들이 전력망용 ESS 시장을 새로운 성장축으로 검토하는 가상 산업 뉴스예요.",
    minutesAgo: 190,
    keywords: ["배터리", "ESS", "전기차"],
    relatedCompanies: [
      { name: "LG에너지솔루션", symbol: "373220" },
      { name: "삼성SDI", symbol: "006400" },
      { name: "포스코퓨처엠", symbol: "003670" },
    ],
    relatedIndicators: [
      { id: "preview-battery-index", name: "2차전지 지수", value: "2,184.60", change: "+0.74%", direction: "up" },
      { id: "preview-lithium", name: "탄산리튬", value: "76,500", change: "-1.20%", direction: "down" },
      { id: "preview-ev-sales", name: "글로벌 EV 판매", value: "1.42M", change: "+4.10%", direction: "up" },
    ],
    viewCount: 18_640,
    commentCount: 61,
    aiSummary: [
      "배터리 기업들이 전기차 외에 전력망용 ESS 수요를 새로운 성장 기회로 보고 있어요.",
      "ESS는 제품 수명과 안전성, 장기 공급계약이 수익성을 좌우해요.",
      "원재료 가격 하락은 비용에는 긍정적이지만 판매가격 하락으로 이어질 수도 있어요.",
    ],
    whatHappened: "배터리 기업들이 전기차 수요 둔화에 대응해 전력망용 에너지저장장치 공급과 장기계약을 확대하는 가상 전략을 내놓았어요.",
    whyImportant: "ESS는 재생에너지의 불규칙한 발전량을 보완하는 핵심 설비예요. 전력망 투자가 늘면 배터리 수요처가 자동차에서 에너지 인프라로 넓어질 수 있어요.",
    impact: "배터리 셀 기업에는 공장 가동률을 높일 기회가 될 수 있고, 소재 기업에는 제품 구성이 바뀌는 계기가 될 수 있어요. 안전 규제와 가격 경쟁은 부담 요인이에요.",
    personalMeaning: "배터리 산업을 볼 때 전기차 판매량만 보지 말고 ESS 수주, 원재료 가격, 공장 가동률도 함께 확인해 보세요.",
    keyTakeaway: "ESS는 배터리 수요를 다변화하지만 안전성과 장기계약 수익성이 중요해요.",
    sentiment: { positive: 214, negative: 96 },
    feedback: { helpful: 138, difficult: 27 },
    comments: [
      { userName: "산업초보", content: "전기차 외에 ESS라는 수요처가 있다는 걸 처음 알았어요.", likeCount: 37, minutesAgo: 142 },
      { userName: "에너지관심", content: "안전 규제가 비용에 얼마나 영향을 주는지도 보고 싶네요.", likeCount: 26, minutesAgo: 118 },
      { userName: "분기보고서", content: "수주보다 실제 공장 가동률을 확인해야겠어요.", likeCount: 19, minutesAgo: 87 },
    ],
  },
  {
    id: "preview-oil-volatility",
    category: "글로벌",
    title: "국제유가, 산유국 공급 협의 앞두고 변동성 확대",
    summary: "주요 산유국의 생산정책 논의를 앞두고 감산 유지와 증산 가능성이 엇갈리는 가상 글로벌 시장 상황이에요.",
    minutesAgo: 260,
    keywords: ["국제유가", "OPEC", "에너지"],
    relatedCompanies: [
      { name: "SK이노베이션", symbol: "096770" },
      { name: "S-Oil", symbol: "010950" },
      { name: "대한항공", symbol: "003490" },
    ],
    relatedIndicators: [
      { id: "preview-wti", name: "WTI", value: "$74.82", change: "+1.46%", direction: "up" },
      { id: "preview-brent", name: "브렌트유", value: "$78.36", change: "+1.12%", direction: "up" },
      { id: "preview-energy-index", name: "글로벌 에너지", value: "684.20", change: "+0.63%", direction: "up" },
    ],
    viewCount: 15_870,
    commentCount: 54,
    aiSummary: [
      "산유국의 공급정책 불확실성으로 국제유가가 큰 폭으로 움직이고 있어요.",
      "유가 상승은 정유사에 기회가 될 수 있지만 항공·운송업에는 비용 부담이에요.",
      "원유 재고와 실제 생산량이 발표 내용보다 더 중요한 확인 지표예요.",
    ],
    whatHappened: "산유국 회의를 앞두고 감산이 이어질지, 일부 국가가 생산을 늘릴지를 두고 전망이 엇갈리는 가상 상황에서 국제유가 변동성이 커졌어요.",
    whyImportant: "유가는 운송비와 제조원가, 소비자물가에 연결돼요. 중앙은행의 금리 판단에도 간접적으로 영향을 줄 수 있어요.",
    impact: "정유사는 정제마진과 재고평가 효과를 받을 수 있지만 항공과 화학 기업은 원가 부담이 커질 수 있어요. 유가 상승이 길어지면 물가 둔화 속도도 느려질 수 있어요.",
    personalMeaning: "주유비와 항공권 가격처럼 생활비에 직접 연결될 수 있어요. 에너지 관련 투자는 유가 자체와 기업별 비용 구조를 구분해서 봐야 해요.",
    keyTakeaway: "유가 뉴스는 공급 발표보다 실제 생산량과 재고 변화로 확인해야 해요.",
    sentiment: { positive: 118, negative: 246 },
    feedback: { helpful: 121, difficult: 22 },
    comments: [
      { userName: "출퇴근러", content: "유가가 물가와 금리까지 연결된다는 설명이 이해하기 쉬웠어요.", likeCount: 33, minutesAgo: 201 },
      { userName: "항공주관심", content: "항공사는 환율과 유가를 같이 봐야겠네요.", likeCount: 24, minutesAgo: 166 },
      { userName: "원자재초보", content: "회의 발표 후 실제 생산량도 확인해보겠습니다.", likeCount: 16, minutesAgo: 128 },
    ],
  },
  {
    id: "preview-fx-range",
    category: "시장",
    title: "원·달러 환율, 미국 금리 전망 엇갈리며 1,330원대 등락",
    summary: "미국 통화정책 전망과 국내 수출기업의 달러 매도가 맞물리며 환율이 방향을 탐색하는 가상 시장 뉴스예요.",
    minutesAgo: 330,
    thumbnailUrl: "/news/currency.webp",
    keywords: ["환율", "달러", "수출"],
    relatedCompanies: [
      { name: "삼성전자", symbol: "005930" },
      { name: "현대차", symbol: "005380" },
      { name: "대한항공", symbol: "003490" },
    ],
    relatedIndicators: [
      { id: "preview-fx-usd", name: "원·달러", value: "1,336.80", change: "+0.18%", direction: "up" },
      { id: "preview-fx-jpy", name: "원·엔", value: "907.42", change: "-0.22%", direction: "down" },
      { id: "preview-dollar-index", name: "달러 인덱스", value: "101.65", change: "+0.14%", direction: "up" },
    ],
    viewCount: 21_360,
    commentCount: 73,
    aiSummary: [
      "원·달러 환율이 금리 전망과 수급 요인 사이에서 뚜렷한 방향 없이 움직였어요.",
      "원화 약세는 수출기업 매출에 유리할 수 있지만 수입 비용을 높일 수 있어요.",
      "미국 금리와 외국인 주식 자금 흐름을 함께 확인해야 해요.",
    ],
    whatHappened: "미국 금리 인하 시점에 대한 전망이 엇갈리고 수출기업의 달러 매도 물량이 나오며 원·달러 환율이 좁은 범위에서 움직이는 가상 상황이에요.",
    whyImportant: "환율은 수입물가, 해외여행 비용, 수출기업 실적, 외국인 투자 흐름에 동시에 영향을 줘요.",
    impact: "원화가 약해지면 수출 비중이 큰 기업에는 긍정적일 수 있지만 항공·유통처럼 달러 비용이 큰 기업에는 부담이에요. 해외자산의 원화 평가액도 달라져요.",
    personalMeaning: "해외여행이나 달러 투자를 계획한다면 한 번에 환전하기보다 시점을 나눠 변동성을 줄이는 방법을 고려할 수 있어요.",
    keyTakeaway: "환율은 금리뿐 아니라 수출입 결제와 외국인 자금 같은 수급에도 움직여요.",
    sentiment: { positive: 173, negative: 201 },
    feedback: { helpful: 162, difficult: 33 },
    comments: [
      { userName: "환율공부", content: "수출기업과 항공사가 반대로 영향을 받을 수 있다는 점이 명확했어요.", likeCount: 45, minutesAgo: 251 },
      { userName: "여행준비중", content: "환전 시점을 나누는 방법을 참고해야겠네요.", likeCount: 29, minutesAgo: 214 },
      { userName: "ETF초보", content: "미국 ETF 수익률에도 환율 영향이 크겠어요.", likeCount: 21, minutesAgo: 176 },
    ],
  },
  {
    id: "preview-hyundai-return",
    category: "기업",
    title: "현대차, 주주환원 강화와 친환경차 투자 계획 발표",
    summary: "현대차가 배당과 자사주 정책을 강화하면서 전기차·하이브리드 투자를 병행하는 가상 기업 발표예요.",
    minutesAgo: 430,
    keywords: ["현대차", "주주환원", "친환경차"],
    relatedCompanies: [
      { name: "현대차", symbol: "005380" },
      { name: "현대모비스", symbol: "012330" },
      { name: "기아", symbol: "000270" },
    ],
    relatedIndicators: [
      { id: "preview-auto-index", name: "자동차 업종", value: "3,942.18", change: "+1.08%", direction: "up" },
      { id: "preview-kospi-auto", name: "코스피", value: "2,645.30", change: "+0.42%", direction: "up" },
      { id: "preview-fx-auto", name: "원·달러", value: "1,336.80", change: "+0.18%", direction: "up" },
    ],
    viewCount: 24_910,
    commentCount: 88,
    aiSummary: [
      "현대차가 주주환원을 강화하면서 미래차 투자도 이어가겠다는 계획을 제시했어요.",
      "배당과 자사주는 단기 주주가치에, 연구개발 투자는 장기 경쟁력에 영향을 줘요.",
      "현금흐름이 두 목표를 함께 감당할 수 있는지가 핵심이에요.",
    ],
    whatHappened: "현대차가 배당 확대와 자사주 소각 계획을 제시하는 동시에 전기차와 하이브리드 생산설비 투자를 이어가는 가상 계획을 발표했어요.",
    whyImportant: "기업이 벌어들인 현금을 주주에게 돌려줄지 미래 성장에 투자할지는 기업가치에 큰 영향을 줘요. 두 전략의 균형이 중요해요.",
    impact: "주주환원 확대는 투자심리에 긍정적일 수 있고 부품사에도 생산 투자 기대가 이어질 수 있어요. 다만 자동차 수요가 둔화하면 대규모 투자 부담이 커질 수 있어요.",
    personalMeaning: "배당률만 보기보다 영업현금흐름, 투자 규모, 판매량 전망을 함께 확인하면 주주환원의 지속 가능성을 판단하는 데 도움이 돼요.",
    keyTakeaway: "좋은 주주환원은 미래 투자를 해치지 않는 범위에서 지속될 때 의미가 커요.",
    sentiment: { positive: 317, negative: 84 },
    feedback: { helpful: 176, difficult: 24 },
    comments: [
      { userName: "배당관심", content: "배당과 투자 중 하나만 좋은 게 아니라 균형이 중요하군요.", likeCount: 47, minutesAgo: 342 },
      { userName: "자동차리서치", content: "현금흐름을 확인해야 지속 가능한 정책인지 알 수 있겠어요.", likeCount: 35, minutesAgo: 298 },
      { userName: "장기적립", content: "판매량과 투자 규모를 같이 비교해봐야겠습니다.", likeCount: 20, minutesAgo: 249 },
    ],
  },
  {
    id: "preview-data-center-power",
    category: "산업",
    title: "AI 데이터센터 확산에 전력기기·냉각 산업 투자 확대",
    summary: "AI 데이터센터의 전력 사용량이 늘면서 변압기, 배전, 냉각 설비 투자가 확대되는 가상 산업 흐름이에요.",
    minutesAgo: 580,
    thumbnailUrl: "/news/technology.webp",
    keywords: ["AI 데이터센터", "전력기기", "냉각"],
    relatedCompanies: [
      { name: "LS ELECTRIC", symbol: "010120" },
      { name: "HD현대일렉트릭", symbol: "267260" },
      { name: "효성중공업", symbol: "298040" },
    ],
    relatedIndicators: [
      { id: "preview-power-index", name: "전력기기 업종", value: "7,418.62", change: "+2.36%", direction: "up" },
      { id: "preview-copper", name: "구리", value: "$4.18", change: "+0.52%", direction: "up" },
      { id: "preview-nasdaq-power", name: "나스닥", value: "18,624.20", change: "+1.32%", direction: "up" },
    ],
    viewCount: 19_430,
    commentCount: 69,
    aiSummary: [
      "AI 데이터센터 증설이 서버뿐 아니라 전력망과 냉각 설비 투자로 이어지고 있어요.",
      "변압기와 배전기기는 공급기간이 길어 수주잔고가 중요한 지표예요.",
      "전력 가격과 지역별 인허가가 데이터센터 확장의 속도를 좌우할 수 있어요.",
    ],
    whatHappened: "대형 기술기업의 AI 데이터센터 계획에 맞춰 전력기기와 냉각 설비 기업이 생산능력 투자를 확대하는 가상 산업 시나리오예요.",
    whyImportant: "AI 서비스는 많은 전력을 사용해요. 데이터센터가 늘수록 발전·송전·배전·냉각까지 넓은 인프라 투자가 필요해져요.",
    impact: "전력기기 기업은 장기 수주 기회를 얻을 수 있지만 구리 등 원재료 가격과 생산설비 증설 비용이 부담이 될 수 있어요. 지역 전력망 부족은 프로젝트 지연 요인이에요.",
    personalMeaning: "AI 관련 산업을 볼 때 반도체뿐 아니라 전력 인프라의 수주잔고와 납기, 원재료 비용도 함께 확인해 보세요.",
    keyTakeaway: "AI 성장의 숨은 병목은 전력이며, 수주가 실제 매출로 전환되는 속도가 중요해요.",
    sentiment: { positive: 286, negative: 72 },
    feedback: { helpful: 153, difficult: 31 },
    comments: [
      { userName: "AI산업지도", content: "AI가 전력기기 산업까지 연결되는 흐름을 한눈에 볼 수 있었어요.", likeCount: 44, minutesAgo: 461 },
      { userName: "인프라투자", content: "수주잔고와 실제 매출 전환 시차를 확인해야겠네요.", likeCount: 32, minutesAgo: 392 },
      { userName: "원자재체크", content: "구리 가격이 원가에 미치는 영향도 궁금합니다.", likeCount: 18, minutesAgo: 318 },
      { userName: "전력초보", content: "데이터센터 인허가가 병목이 될 수 있다는 점이 새로웠어요.", likeCount: 15, minutesAgo: 241 },
    ],
  },
  {
    id: "preview-china-consumption",
    category: "글로벌",
    title: "중국 소비 부양책 기대…아시아 수출 기업에 관심",
    summary: "중국이 내수 소비를 지원할 수 있다는 기대가 커지며 화장품·화학·기계 업종이 주목받는 가상 글로벌 뉴스예요.",
    minutesAgo: 780,
    keywords: ["중국 소비", "부양책", "수출"],
    relatedCompanies: [
      { name: "아모레퍼시픽", symbol: "090430" },
      { name: "LG화학", symbol: "051910" },
      { name: "두산밥캣", symbol: "241560" },
    ],
    relatedIndicators: [
      { id: "preview-hsi", name: "항셍지수", value: "19,842.30", change: "+1.18%", direction: "up" },
      { id: "preview-cny", name: "위안·달러", value: "7.08", change: "-0.16%", direction: "down" },
      { id: "preview-asia-export", name: "아시아 수출", value: "104.7", change: "+0.60%", direction: "up" },
    ],
    viewCount: 14_820,
    commentCount: 47,
    aiSummary: [
      "중국의 소비 지원 기대가 아시아 수출기업의 실적 회복 기대를 높였어요.",
      "정책 발표보다 가계 소비와 부동산 심리가 실제로 회복되는지가 중요해요.",
      "업종별 중국 매출 비중과 재고 수준에 따라 영향은 달라질 수 있어요.",
    ],
    whatHappened: "중국 정부가 소비쿠폰과 내구재 교체 지원을 확대할 수 있다는 가상 기대가 형성되며 중국 매출 비중이 높은 아시아 기업들이 관심을 받았어요.",
    whyImportant: "중국은 한국을 포함한 아시아 기업의 큰 수출 시장이에요. 중국 소비가 회복되면 화장품, 화학, 기계 등 여러 업종의 주문과 가격에 영향을 줄 수 있어요.",
    impact: "중국 관련 소비재와 소재 기업의 실적 기대가 높아질 수 있어요. 하지만 정책 규모가 작거나 부동산 부진이 이어지면 기대가 빠르게 낮아질 수도 있어요.",
    personalMeaning: "중국 관련 기업을 볼 때 단순한 정책 기대보다 현지 매출 증가와 재고 감소가 실제 분기 실적에 나타나는지 확인하세요.",
    keyTakeaway: "중국 부양책은 기대보다 실제 소비·매출 데이터로 효과를 확인해야 해요.",
    sentiment: { positive: 207, negative: 132 },
    feedback: { helpful: 119, difficult: 21 },
    comments: [
      { userName: "중국경제입문", content: "정책 발표와 실제 소비 회복은 다를 수 있다는 점을 기억해야겠어요.", likeCount: 31, minutesAgo: 632 },
      { userName: "소비재관심", content: "기업별 중국 매출 비중부터 확인해보겠습니다.", likeCount: 23, minutesAgo: 524 },
      { userName: "실적체크", content: "재고 감소가 분기 실적에 나타나는지도 중요하겠네요.", likeCount: 14, minutesAgo: 418 },
    ],
  },
  {
    id: "preview-shipping-cost",
    category: "속보",
    title: "해상 운임 지수 하락…수입기업 물류비 부담 완화 기대",
    summary: "주요 항로의 컨테이너 운임이 안정되며 유통·의류·가전 기업의 물류비 부담이 낮아질 수 있다는 가상 속보예요.",
    minutesAgo: 1_440,
    keywords: ["해상운임", "물류비", "수입기업"],
    relatedCompanies: [
      { name: "HMM", symbol: "011200" },
      { name: "LG전자", symbol: "066570" },
      { name: "신세계", symbol: "004170" },
    ],
    relatedIndicators: [
      { id: "preview-scfi", name: "상하이 운임지수", value: "1,842.10", change: "-3.24%", direction: "down" },
      { id: "preview-bdi", name: "발틱운임지수", value: "1,516", change: "-1.08%", direction: "down" },
      { id: "preview-logistics", name: "운송 업종", value: "2,764.40", change: "-0.42%", direction: "down" },
    ],
    viewCount: 12_940,
    commentCount: 39,
    aiSummary: [
      "해상 운임이 내려가며 수입기업과 유통기업의 물류비 부담이 낮아질 가능성이 생겼어요.",
      "운송기업에는 운임 하락이 매출과 수익성 부담으로 작용할 수 있어요.",
      "계약 운임은 시차를 두고 반영되므로 효과가 바로 나타나지는 않을 수 있어요.",
    ],
    whatHappened: "선박 공급과 항로 혼잡이 완화되며 주요 컨테이너 운임지수가 하락하는 가상 상황이에요.",
    whyImportant: "운임은 수입 제품 가격과 기업 원가에 포함돼요. 물류비가 안정되면 상품 가격 상승 압력이 낮아질 수 있어요.",
    impact: "유통·의류·가전 기업에는 원가 절감 요인이지만 해운사에는 수익성 부담이 될 수 있어요. 장기계약 비중에 따라 실제 반영 시점은 기업마다 달라요.",
    personalMeaning: "운임 하락이 소비자가격 인하로 바로 이어진다고 단정하기보다 기업의 재고와 환율, 계약 구조를 함께 확인하세요.",
    keyTakeaway: "운임 하락의 수혜와 부담은 업종별로 반대이며 실제 실적에는 시차가 있어요.",
    sentiment: { positive: 189, negative: 107 },
    feedback: { helpful: 102, difficult: 19 },
    comments: [
      { userName: "물류관찰", content: "수입기업과 해운사의 영향이 반대라는 점이 잘 보였어요.", likeCount: 27, minutesAgo: 1_102 },
      { userName: "생활물가", content: "운임이 내려도 소비자가격에는 시차가 있겠군요.", likeCount: 20, minutesAgo: 947 },
      { userName: "기업분석중", content: "장기계약 비중을 확인해야 실제 효과를 알 수 있겠어요.", likeCount: 13, minutesAgo: 786 },
    ],
  },
];

export const previewSampleNews: NewsItem[] = seeds.map((seed) => {
  const publishedAtRaw = isoMinutesAgo(seed.minutesAgo);
  const thumbnailUrl = seed.thumbnailUrl ?? null;
  return {
    id: seed.id,
    title: seed.title,
    originalTitle: seed.title,
    publisher: "EconFlow Preview",
    description: seed.summary,
    originalLink: "",
    link: "",
    pubDate: publishedAtRaw,
    fetchedAt: new Date().toISOString(),
    publishedAt: relativeTime(seed.minutesAgo),
    publishedAtRaw,
    originalUrl: "",
    thumbnailUrl,
    category: seed.category,
    sourceType: "mock",
    dataSource: PREVIEW_SAMPLE_DATA_SOURCE,
    summary: seed.summary,
    source: "EconFlow Preview",
    sourceUrl: "",
    imageUrl: thumbnailUrl,
    thumbnail: thumbnailUrl,
    keywords: seed.keywords,
    contentType: "briefing",
    relatedMarketIds: seed.relatedIndicators.map((indicator) => indicator.id),
    relatedCompanies: seed.relatedCompanies,
    relatedIndicators: seed.relatedIndicators,
    viewCount: seed.viewCount,
    commentCount: seed.commentCount,
    previewContent: {
      label: "Preview Sample News",
      aiSummary: seed.aiSummary,
      whatHappened: seed.whatHappened,
      whyImportant: seed.whyImportant,
      impact: seed.impact,
      personalMeaning: seed.personalMeaning,
      keyTakeaway: seed.keyTakeaway,
      sentiment: seed.sentiment,
      feedback: seed.feedback,
      comments: seed.comments.map((comment, index) => ({
        id: `preview-comment-${seed.id}-${index + 1}`,
        userName: comment.userName,
        content: comment.content,
        likeCount: comment.likeCount,
        createdAt: isoMinutesAgo(comment.minutesAgo),
      })),
    },
  };
});

export const isPreviewSampleNews = (item: NewsItem) => item.dataSource === PREVIEW_SAMPLE_DATA_SOURCE;
