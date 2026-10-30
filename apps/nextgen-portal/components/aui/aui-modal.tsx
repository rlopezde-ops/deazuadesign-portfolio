"use client";

import { Modal } from "@asurion-core/mx-asurion-ui-react";
import type { ComponentProps } from "react";

type AuiModalProps = ComponentProps<typeof Modal>;

/**
 * AUI Modal with dark-mode-friendly defaults.
 * Legacy Modal hardcodes light surfaces / icon variant / black close icon;
 * `aui-dark-overrides.css` restyles the portal surface for asurion-dark.
 */
export function AuiModal({
  modalVariant = "default",
  dismissButtonClassName = "",
  width = "28rem",
  showXButton = true,
  stickyHeader = true,
  ...props
}: AuiModalProps) {
  return (
    <Modal
      modalVariant={modalVariant}
      dismissButtonClassName={dismissButtonClassName}
      width={width}
      showXButton={showXButton}
      stickyHeader={stickyHeader}
      {...props}
    />
  );
}
