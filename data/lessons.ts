export type Lesson = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  sections: { title: string; body: string }[];
  takeaways: string[];
  relatedMarketIds: string[];
};

export const lessons: Lesson[] = [
  { id: "what-is-rate", title: "금리란 무엇일까?", description: "돈을 빌리는 가격인 금리의 기본부터 생활 속 영향까지 알아봐요.", category: "금리", duration: "약 5분", difficulty: "기초", sections: [{ title: "돈에도 가격이 있어요", body: "금리는 돈을 빌린 대가로 내는 비용이에요. 은행에 돈을 맡기면 받는 이자도 같은 원리로 이해할 수 있어요." }, { title: "기준금리는 출발점이에요", body: "중앙은행이 정한 기준금리는 예금, 대출, 채권 등 여러 시장 금리가 움직이는 출발점 역할을 해요." }, { title: "경제의 속도를 조절해요", body: "금리가 오르면 빌리고 쓰는 부담이 커져 경제가 천천히 움직이고, 금리가 내리면 소비와 투자가 늘기 쉬워요." }], takeaways: ["금리는 돈의 가격이에요.", "기준금리는 여러 금리의 기준점이에요.", "금리 변화는 소비·투자·물가에 연결돼요."], relatedMarketIds: ["kr-base-rate", "us-base-rate", "us-10y"] },
  { id: "why-fx-moves", title: "환율은 왜 움직일까?", description: "두 나라 돈의 교환 비율이 달라지는 이유를 핵심만 살펴봐요.", category: "환율", duration: "약 7분", difficulty: "기초", sections: [{ title: "환율은 교환 비율이에요", body: "원·달러 환율은 1달러를 사는 데 필요한 원화의 양을 뜻해요." }, { title: "돈이 향하는 곳이 달라져요", body: "금리, 경기 전망, 안전자산 선호에 따라 투자 자금이 움직이면 통화의 수요도 바뀌어요." }, { title: "생활비에도 닿아요", body: "환율이 오르면 수입 원자재와 해외 결제 비용이 커질 수 있어요." }], takeaways: ["환율 상승은 원화 가치 하락을 뜻해요.", "금리와 투자 심리가 환율에 영향을 줘요.", "수입 물가와 해외 소비가 함께 움직여요."], relatedMarketIds: ["usd-krw", "jpy-krw"] },
  { id: "why-stock-moves", title: "주식 가격은 왜 오르고 내릴까?", description: "기업의 미래를 바라보는 기대가 가격에 반영되는 과정을 배워요.", category: "주식", duration: "약 8분", difficulty: "투자 기초", sections: [{ title: "가격에는 기대가 들어 있어요", body: "주식 가격은 기업이 앞으로 벌 수익과 위험에 대한 많은 사람의 판단이 만나는 지점이에요." }, { title: "실적과 금리를 함께 봐요", body: "매출과 이익뿐 아니라 금리, 경기, 산업 변화도 기업 가치에 영향을 줘요." }, { title: "좋은 뉴스도 이미 반영될 수 있어요", body: "많은 사람이 예상한 정보라면 발표 전에 가격이 먼저 움직일 수 있어요." }], takeaways: ["주가는 미래 기대를 반영해요.", "기업 실적과 거시경제를 함께 봐야 해요.", "뉴스와 가격의 움직임은 항상 같지 않아요."], relatedMarketIds: ["kospi", "kosdaq", "sp500", "nasdaq"] },
  { id: "read-indicators", title: "경제지표, 무엇부터 볼까?", description: "물가·고용·성장률을 서로 연결해서 읽는 방법을 익혀요.", category: "경제지표", duration: "약 6분", difficulty: "기초", sections: [{ title: "한 숫자만 보지 않아요", body: "경제지표는 방향, 속도, 시장 예상과의 차이를 함께 볼 때 의미가 선명해져요." }, { title: "물가와 고용은 중요해요", body: "물가는 생활비와 금리에, 고용은 가계 소득과 소비에 연결돼요." }, { title: "흐름을 비교해요", body: "전월, 전년, 장기 평균과 비교하면 일시적인 변화인지 추세인지 구분하기 쉬워요." }], takeaways: ["숫자보다 흐름이 중요해요.", "예상과 실제의 차이도 시장을 움직여요.", "여러 지표를 함께 연결해 읽어요."], relatedMarketIds: ["kr-base-rate", "us-base-rate", "gold"] },
  { id: "bond-yield", title: "채권 금리는 왜 움직일까?", description: "기준금리 기대와 물가 전망이 장기 채권 금리에 연결되는 과정을 배워요.", category: "채권", duration: "약 6분", difficulty: "기초", sections: [{ title: "채권은 돈을 빌려준 증서예요", body: "정부나 기업은 채권을 발행해 돈을 빌리고, 투자자는 약속된 이자를 받아요." }, { title: "가격과 금리는 반대로 움직여요", body: "기존 채권의 매력이 달라지면서 채권 가격이 오르면 수익률은 낮아지고, 가격이 내리면 수익률은 높아져요." }, { title: "미래 기대가 먼저 반영돼요", body: "장기 국채금리는 앞으로의 기준금리, 물가, 성장 전망을 미리 반영해 움직일 수 있어요." }], takeaways: ["채권 가격과 금리는 반대로 움직여요.", "장기 금리는 미래의 금리·물가 기대를 반영해요.", "미국 국채금리는 세계 금융시장에 영향을 줘요."], relatedMarketIds: ["us-10y", "us-base-rate"] },
];

export const learningCategories = ["기초", "금리", "환율", "주식", "경제지표", "기업", "글로벌 경제"];
