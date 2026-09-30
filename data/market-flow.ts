export type MarketFlowDirection = "up" | "down" | "pressure" | "watch" | "neutral";

export type MarketFlowIcon = "basket" | "bank" | "bond" | "dollar" | "chart";

export interface FlowStep {
  id: string;
  label: string;
  title: string;
  shortTitle?: string;
  description: string;
  direction: MarketFlowDirection;
  icon: MarketFlowIcon;
  question: string;
  connection?: string;
}

export interface MarketImpact {
  asset: string;
  label: string;
  direction: MarketFlowDirection;
  description: string;
}

export interface MarketFlowRelatedNews {
  id: string;
  title: string;
}

export interface MarketFlow {
  id: string;
  date: string;
  title: string;
  summary: string;
  category: string;
  steps: FlowStep[];
  impacts: MarketImpact[];
  relatedNews: MarketFlowRelatedNews[];
}

// API 연결 전 UI 검증을 위한 독립 mock 데이터입니다.
// 추후 이 배열 대신 API 응답을 MarketFlow 타입으로 전달하면 같은 UI를 재사용할 수 있습니다.
export const MOCK_MARKET_FLOWS: MarketFlow[] = [
  {
    id: "us-inflation-chain",
    date: "2026-09-30",
    category: "물가 · 금리",
    title: "미국 물가가 예상보다 높게 나와 시장이 이렇게 움직이고 있어요.",
    summary: "하나의 경제 이벤트가 여러 시장에 어떤 영향을 주는지 단계별로 쉽게 설명해드려요.",
    steps: [
      {
        id: "inflation",
        label: "물가",
        title: "미국 물가가 예상보다 높게 나왔어요",
        shortTitle: "예상 상회",
        description: "소비자물가가 예상보다 높게 나오면서 물가 상승세가 충분히 잡히지 않았다는 우려가 커졌어요.",
        direction: "up",
        icon: "basket",
        question: "왜 중요한가요?",
        connection: "물가가 잘 잡히지 않으면",
      },
      {
        id: "rate",
        label: "금리",
        title: "금리 인하 기대가 낮아져요",
        shortTitle: "인하 기대 ↓",
        description: "물가 상승세가 예상보다 강하면 중앙은행이 금리를 빠르게 내리기 어려울 수 있다는 전망이 커지기 때문이에요.",
        direction: "down",
        icon: "bank",
        question: "왜 그렇게 되나요?",
        connection: "높은 금리가 오래 갈 수 있다는 전망에",
      },
      {
        id: "bond",
        label: "채권",
        title: "미국채 금리가 상승 압력을 받아요",
        shortTitle: "미국채 금리 상승 압력",
        description: "기준금리가 높은 수준에 머물 가능성이 커지면 새로 발행되는 채권의 금리도 높아질 수 있어 기존 채권 가격에는 부담이 돼요.",
        direction: "up",
        icon: "bond",
        question: "채권금리가 오르면 어떤 의미인가요?",
        connection: "미국 금리가 상대적으로 높게 유지되면",
      },
      {
        id: "currency",
        label: "환율",
        title: "달러가 강해질 압력이 생겨요",
        shortTitle: "달러 강세 압력",
        description: "다른 나라보다 미국의 금리가 높을 것으로 예상되면 더 높은 이자를 기대하는 자금이 달러 자산으로 이동할 수 있어요.",
        direction: "pressure",
        icon: "dollar",
        question: "달러 강세는 어떤 영향을 주나요?",
        connection: "금리와 달러가 함께 강해지면",
      },
      {
        id: "stock",
        label: "주식",
        title: "성장주에 부담이 될 수 있어요",
        shortTitle: "성장주 부담 가능",
        description: "금리가 높아지면 먼 미래의 이익을 현재 가치로 환산할 때 가치가 낮아지는 효과가 있어 성장주 밸류에이션에 부담이 될 수 있어요.",
        direction: "pressure",
        icon: "chart",
        question: "어떤 종목이 더 영향을 받을까요?",
      },
    ],
    impacts: [
      { asset: "미국 성장주", label: "부담 가능", direction: "pressure", description: "금리에 민감한 성장주의 변동성이 커질 수 있어요." },
      { asset: "달러", label: "강세 압력", direction: "up", description: "미국 금리가 오래 높게 유지될 전망은 달러 수요에 영향을 줄 수 있어요." },
      { asset: "한국 증시", label: "수급 확인", direction: "watch", description: "달러 흐름에 따라 외국인 자금의 움직임을 함께 살펴볼 필요가 있어요." },
      { asset: "금", label: "영향 가능", direction: "neutral", description: "달러와 금리의 방향이 금 가격에 서로 다른 영향을 줄 수 있어요." },
      { asset: "채권", label: "금리 민감", direction: "watch", description: "시장금리가 오르면 채권 가격에는 부담으로 작용할 수 있어요." },
    ],
    relatedNews: [
      { id: "fed-patience", title: "연준, 금리 결정은 물가 흐름을 더 확인한 뒤" },
      { id: "bond-yield", title: "국채 금리, 물가 전망 변화에 민감하게 반응" },
    ],
  },
];

export const todayMarketFlow = MOCK_MARKET_FLOWS[0];
