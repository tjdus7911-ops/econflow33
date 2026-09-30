import EconFlowApp from "@/components/econflow/EconFlowApp";

export default async function NewsExplainPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EconFlowApp initialView="news-explain" initialId={id} />;
}
