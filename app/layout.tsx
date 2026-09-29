import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EconFlow — 오늘의 경제를 쉽게",
  description: "오늘의 경제 이슈와 뉴스를 쉽게 이해하고, 필요한 개념을 바로 공부하세요.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EconFlow",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
