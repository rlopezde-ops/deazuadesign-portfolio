import { WorkOrderDetailView } from "@/components/workorders/workorder-detail-view";

export default async function WorkOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkOrderDetailView id={id} />;
}
