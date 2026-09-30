import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { aggregateNews } from "@/lib/news/aggregator";
import { NAVER_NEWS_REVALIDATE_SECONDS } from "@/lib/providers/naver-news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getCachedNews = unstable_cache(
  aggregateNews,
  ["jester-naver-api-hub-news-v1"],
  { revalidate: NAVER_NEWS_REVALIDATE_SECONDS },
);

const safeMessage = (error: unknown) => error instanceof Error ? error.message : "뉴스를 불러오지 못했습니다.";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsedLimit = Number.parseInt(searchParams.get("limit") ?? "20", 10);
  const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 20) : 20;
  const includeThumbnails = searchParams.get("images") === "true";

  try {
    const result = await getCachedNews(limit, includeThumbnails);
    return NextResponse.json(
      {
        success: true,
        updatedAt: new Date().toISOString(),
        items: result.items,
        count: result.items.length,
        providers: result.providers,
        source: "NAVER API HUB Search API",
        fallback: false,
        imageScrapingEnabled: result.thumbnailStats.enabled,
        thumbnailStats: result.thumbnailStats,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=" + NAVER_NEWS_REVALIDATE_SECONDS + ", stale-while-revalidate=" + NAVER_NEWS_REVALIDATE_SECONDS,
        },
      },
    );
  } catch (error) {
    const message = safeMessage(error);
    console.error("[api/news] NAVER API HUB 처리 실패:", message);
    return NextResponse.json(
      {
        success: false,
        updatedAt: new Date().toISOString(),
        items: [],
        count: 0,
        source: "NAVER API HUB Search API",
        fallback: false,
        error: message,
      },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
