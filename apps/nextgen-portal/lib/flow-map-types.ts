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
  fromSide?: string
  toSide?: string
}

export type FlowGroupColor = {
  bg: string
  border: string
  label: string
}

export type FlowSection = {
  id: string
  title: string
  subtitle?: string
  y: number
  /** Optional groups shown when focusing this section in the sidebar legend. */
  groups?: string[]
  /** Optional Figma file/frame URL for this section. */
  figmaUrl?: string
  /** Optional status dot in the Flows sidebar. */
  upToDate?: boolean
}

export type FlowMapConfig = {
  title: string
  subtitle?: string
  canvas: { width: number; height: number }
  defaultZoom?: number
  nodes: FlowNode[]
  edges: FlowEdge[]
  groupColors: Record<string, FlowGroupColor>
  /** Optional default main Figma source link shown in the left sidebar footer. */
  figmaUrl?: string
}

export interface NoteItem {
  text: string
  checked: boolean
}

export interface NoteReply {
  author: string
  text: string
  created_at: string
}

export interface Note {
  id: string
  x: number
  y: number
  arrow_x: number | null
  arrow_y: number | null
  content: string
  author: string
  authorEmail?: string
  items: NoteItem[]
  replies: NoteReply[]
  done: boolean
  created_at: string
  updated_at: string
}
