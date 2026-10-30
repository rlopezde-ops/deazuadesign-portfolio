export type FlowNode = {
  id: string
  label: string
  /** Path under `public/` or absolute URL. */
  screenshot: string
  /** Internal path (`/foo`) or external URL (`http://…`). Omit to disable navigation. */
  route?: string
  x: number
  y: number
  group: string
  /** Shown in node tooltip area when provided (e.g. dev command). */
  hint?: string
}

export type FlowEdge = {
  from: string
  to: string
  label?: string
}

export type FlowGroupColor = {
  bg: string
  border: string
  label: string
}

export type FlowMapConfig = {
  title: string
  subtitle?: string
  canvas: { width: number; height: number }
  defaultZoom?: number
  nodes: FlowNode[]
  edges: FlowEdge[]
  groupColors: Record<string, FlowGroupColor>
}
