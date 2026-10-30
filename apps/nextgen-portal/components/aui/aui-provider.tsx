"use client";

import { useEffect } from "react";
import {
  GlobalStyles,
  InternalProvider,
  updateTheme,
  type ThemeKey,
} from "@asurion-core/mx-asurion-ui-react";
import { StyledComponentsRegistry } from "@/components/aui/styled-components-registry";

/** AUI CSS color-theme classes from `@asurion-core/aui-tokens`. */
export type AuiColorMode = "asurion-dark" | "asurion-light" | "partner-dark" | "partner-light";

type AuiProviderProps = {
  children: React.ReactNode;
  /** Brand theme for styled-components (buttons, etc.). */
  theme?: ThemeKey;
  /**
   * Official AUI surface/token theme class applied to `<html>`.
   * Dark modes: `asurion-dark` | `partner-dark`.
   */
  colorMode?: AuiColorMode;
};

const COLOR_MODE_CLASSES: AuiColorMode[] = [
  "asurion-dark",
  "asurion-light",
  "partner-dark",
  "partner-light",
];

/**
 * Boots official AUI (GlobalStyles + theme + InternalProvider).
 * Color mode uses AUI token classes from aui-tokens (`asurion-dark`, etc.).
 * @see https://ui.asurion.com
 */
export function AuiProvider({
  children,
  theme = "asurion",
  colorMode = "asurion-dark",
}: AuiProviderProps) {
  useEffect(() => {
    updateTheme(theme);
  }, [theme]);

  useEffect(() => {
    // Apply on <body>, not <html>: AUI `:root` carries light tokens and would
    // override a theme class on the same element.
    const root = document.body;
    root.classList.remove(...COLOR_MODE_CLASSES);
    root.classList.add(colorMode);
    document.documentElement.style.colorScheme = colorMode.endsWith("-dark")
      ? "dark"
      : "light";
  }, [colorMode]);

  return (
    <StyledComponentsRegistry>
      <InternalProvider>
        <GlobalStyles />
        {children}
      </InternalProvider>
    </StyledComponentsRegistry>
  );
}
