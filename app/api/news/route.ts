import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { news as fallbackNews } from "@/data/news";
import { aggregateNews } from "@/lib/news/aggregator";
import { BOK_RSS_REVALIDATE_SECONDS, BOK_RSS_URL } from "@/lib/providers/bok-rss";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getCachedNews = unstable_cache(
  aggregateNews,
  ["econflow-news-aggregator-v2"],
  { revalidate: BOK_RSS_REVALIDATE_SECONDS },
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedLimit = Number.parseInt(searchParams.get("limit") ?? "20", 10);
  const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 20) : 20;

  try {
    const result = await getCachedNews(limit);
    return NextResponse.json(
      {
        success: true,
        updatedAt: new Date().toISOString(),
        items: result.items,
        providers: result.providers,
        source: result.items[0]?.sourceType === "news-api" ? "뉴스 API + 한국은행 RSS" : "한국은행 보도자료(전체) RSS",
        feedUrl: BOK_RSS_URL,
        fallback: result.fallback,
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${BOK_RSS_REVALIDATE_SECONDS}, stale-while-revalidate=${BOK_RSS_REVALIDATE_SECONDS}`,
        },
      },
    );
  } catch (error) {
    console.error("[api/news] 뉴스 Aggregator 처리 실패", error);
    return NextResponse.json(
      {
        success: true,
        updatedAt: new Date().toISOString(),
        items: fallbackNews.slice(0, limit),
        providers: [{ id: "mock", sourceType: "mock", configured: true, ok: true, count: Math.min(fallbackNews.length, limit) }],
        source: "EconFlow Mock 뉴스",
        feedUrl: BOK_RSS_URL,
        fallback: true,
      },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  }
}
