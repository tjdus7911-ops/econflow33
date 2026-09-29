export type Quiz = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const quiz: Quiz = {
  id: "rate-basics",
  question: "기준금리란 무엇일까요?",
  options: ["주식의 기준 가격", "중앙은행이 정하는 대표 금리", "나라 사이의 환율", "기업이 올린 매출"],
  answer: 1,
  explanation: "기준금리는 중앙은행이 정하는 대표 금리예요. 예금과 대출을 포함한 여러 시장 금리가 움직이는 기준점이 됩니다.",
};
