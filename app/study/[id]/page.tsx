import EconFlowApp from "@/components/econflow/EconFlowApp";

export default async function StudyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EconFlowApp initialView="lesson" initialId={id} />;
}
