import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { news as fallbackNews } from "@/data/news";
import {
  BOK_RSS_REVALIDATE_SECONDS,
  BOK_RSS_URL,
  fetchBokNews,
} from "@/lib/providers/bok-rss";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getCachedBokNews = unstable_cache(
  fetchBokNews,
  ["bok-rss-news-v1"],
  { revalidate: BOK_RSS_REVALIDATE_SECONDS },
);

export async function GET() {
  try {
    const items = await getCachedBokNews();
    return NextResponse.json(
      {
        items,
        source: "한국은행 보도자료(전체) RSS",
        feedUrl: BOK_RSS_URL,
        fallback: false,
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${BOK_RSS_REVALIDATE_SECONDS}, stale-while-revalidate=${BOK_RSS_REVALIDATE_SECONDS}`,
        },
      },
    );
  } catch (error) {
    console.error("[api/news] 한국은행 RSS fallback 사용", error);
    return NextResponse.json(
      {
        items: fallbackNews.map((item) => ({ ...item, dataSource: "mock" as const })),
        source: "EconFlow Mock 뉴스",
        feedUrl: BOK_RSS_URL,
        fallback: true,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    );
  }
}
