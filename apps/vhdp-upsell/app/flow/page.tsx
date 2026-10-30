import { FlowMapCanvas } from "@/components/flow-map-canvas"
import { flowMapConfig } from "@/lib/flow-data"

export default function FlowPage() {
  return <FlowMapCanvas {...flowMapConfig} />
}
