import EconFlowApp from "@/components/econflow/EconFlowApp";

export default async function IssueDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EconFlowApp initialView="issue-detail" initialId={id} />;
}
