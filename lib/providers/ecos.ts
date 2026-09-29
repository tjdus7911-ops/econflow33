export const ECOS_STATISTICS = {
  krBaseRate: { table: "722Y001", item: "0101000" },
  usdKrw: { table: "731Y001", item: "0000001" },
} as const;

export const isEcosConfigured = () => Boolean(process.env.ECOS_API_KEY);

export async function fetchEcosStatistic(table: string, item: string, start: string, end: string) {
  const apiKey = process.env.ECOS_API_KEY;
  if (!apiKey) return [];
  const path = [apiKey, "json", "kr", "1", "100", table, "D", start, end, item].map(encodeURIComponent).join("/");
  const response = await fetch(`https://ecos.bok.or.kr/api/StatisticSearch/${path}`, { next: { revalidate: 3600 } });
  if (!response.ok) throw new Error(`ECOS 요청 실패: ${response.status}`);
  const payload = await response.json() as { StatisticSearch?: { row?: Record<string, string>[] } };
  return payload.StatisticSearch?.row ?? [];
}
