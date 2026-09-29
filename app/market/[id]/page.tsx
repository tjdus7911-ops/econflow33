import EconFlowApp from "@/components/econflow/EconFlowApp";

export default async function MarketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EconFlowApp initialView="market-detail" initialId={id} />;
}
