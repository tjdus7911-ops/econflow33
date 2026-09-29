import EconFlowApp from "@/components/econflow/EconFlowApp";

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EconFlowApp initialView="news-detail" initialId={id} />;
}
