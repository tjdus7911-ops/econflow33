export const FRED_SERIES = {
  usBaseRate: "FEDFUNDS",
  usTenYearYield: "DGS10",
  usCpi: "CPIAUCSL",
  usEmployment: "PAYEMS",
} as const;

export const isFredConfigured = () => Boolean(process.env.FRED_API_KEY);

export async function fetchFredSeries(seriesId: string) {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) return [];
  const params = new URLSearchParams({ series_id: seriesId, api_key: apiKey, file_type: "json", sort_order: "desc", limit: "120" });
  const response = await fetch(`https://api.stlouisfed.org/fred/series/observations?${params}`, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`FRED 요청 실패: ${response.status}`);
  const payload = await response.json() as { observations?: { date: string; value: string }[] };
  return payload.observations ?? [];
}
