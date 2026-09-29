import type { Metadata } from "next";
import "./globals.css";
import "./econflow-v2.css";

export const metadata: Metadata = {
  title: "EconFlow — 오늘의 경제를 쉽게",
  applicationName: "EconFlow",
  description: "오늘의 경제 이슈와 뉴스를 쉽게 이해하고, 필요한 개념을 바로 공부하세요.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "EconFlow",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
  },
};

export const viewport = {
  themeColor: "#0b2f5b",
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
