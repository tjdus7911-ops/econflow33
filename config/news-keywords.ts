export const ECONOMY_NEWS_KEYWORDS = [
  "금리",
  "한국은행",
  "미국 연준",
  "FOMC",
  "환율",
  "달러",
  "엔화",
  "물가",
  "CPI",
  "고용",
  "GDP",
  "코스피",
  "미국 증시",
  "채권",
  "국채",
  "금",
  "유가",
  "반도체",
  "AI 투자",
] as const;

export type EconomyNewsKeyword = (typeof ECONOMY_NEWS_KEYWORDS)[number];
