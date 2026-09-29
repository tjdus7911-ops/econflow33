import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Jester",
    short_name: "Jester",
    description: "오늘의 경제 이슈와 뉴스를 쉽게 이해하고 필요한 개념을 공부하는 모바일 앱",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#080d12",
    theme_color: "#080d12",
    lang: "ko-KR",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
