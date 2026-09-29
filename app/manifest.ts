import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EconFlow — 오늘의 경제를 쉽게",
    short_name: "EconFlow",
    description: "오늘의 경제 이슈와 뉴스를 쉽게 이해하고 필요한 개념을 공부하는 모바일 앱",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b2f5b",
    lang: "ko-KR",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
