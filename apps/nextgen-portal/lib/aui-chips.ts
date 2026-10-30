// Re-export SelectionChip (singular, non-deprecated) from the AUI dist.
// The main package index only re-exports the deprecated plural wrappers,
// so we use this local barrel to let Turbopack resolve the path correctly.
export { SelectionChip } from "@asurion-core/mx-asurion-ui-react/dist/components/Chips/SelectionChip";
export type { SelectionChipProps } from "@asurion-core/mx-asurion-ui-react/dist/components/Chips/types";
