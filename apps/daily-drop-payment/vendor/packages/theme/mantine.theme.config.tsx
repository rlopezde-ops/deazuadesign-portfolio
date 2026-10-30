import type { CSSVariablesResolver, MantineThemeOverride } from "@mantine/core";

import { createTheme, rem } from "@mantine/core";
import "@mantine/core/styles.layer.css";

import { colorOverrides } from "./overrides/colors";
import { componentOverrides } from "./overrides/components";

export const mantineTheme: MantineThemeOverride = createTheme({
    primaryColor: "asurion",
    primaryShade: {
        dark: 5,
        light: 5,
    },
    colors: colorOverrides,
    fontFamily: "Apercu",
    fontFamilyMonospace: "ApercuMono",
    components: componentOverrides,
    lineHeights: {
        xxs: "0.75rem",
        xs: "0.875rem",
        sm: "1rem",
        md: "1.125rem",
        lg: "1.25rem",
        xl: "1.5rem",
    },
    fontSizes: {
        xxs: rem("10px"),
        xs: rem("12px"),
        sm: rem("14px"),
        md: rem("16px"),
        lg: rem("20px"),
        xl: rem("24px"),
    },
    defaultRadius: "6px",
    spacing: {
        "4xs": rem("2px"),
        "3xs": rem("4px"),
        xxs: rem("8px"),
        xs: rem("10px"),
        sm: rem("12px"),
        md: rem("16px"),
        lg: rem("20px"),
        xl: rem("24px"),
        xxl: rem("32px"),
        "3xl": rem("48px"),
        "4xl": rem("60px"),
    },
    cursorType: "pointer",
});

/** Define custom CSS variable suffix for light/dark mode support */
type ExwoColorKeys = "app-bg" | "header-bg" | "panel-bg" | "control-bar-bg" | "modal-bg";
type Prefix<Prefix extends string, T extends string> = `${Prefix}${T}`;
type ExWoThemeVars = Record<Prefix<"--exwo-color-", ExwoColorKeys>, string>;

// TODO: exploring light mode here:
// https://www.figma.com/design/GTrpkGJh42R2R6pgRzhZjh/Expert-Workspace-Messaging?node-id=10481-49828&t=epSePMeHlRLGKfXI-4

/** Enables creation of custom CSS variables (https://mantine.dev/styles/css-variables/#css-variables-resolver).
 *
 * Light and dark default variables for mantine can be found here
 * https://mantine.dev/styles/css-variables-list/#light-only
 * https://mantine.dev/styles/css-variables-list/#dark-only
 */
export const resolver: CSSVariablesResolver = () => ({
    variables: {
        "--mantine-font-weight-light": "300",
        "--mantine-font-weight-normal": "400",
        "--mantine-font-weight-heavy": "700",
        "--mantine-priority-overlay": "1100",
        "--mantine-priority-highest": "1000",
        "--mantine-priority-higher": "800",
        "--mantine-priority-high": "600",
        "--mantine-priority-low": "400",
        "--mantine-priority-lower": "200",
        "--mantine-priority-lowest": "0",
    },
    light: {
        "--exwo-color-modal-bg": "var(--mantine-color-light-8)",
        "--exwo-color-app-bg": "var(--mantine-color-light-9)",
        "--exwo-color-control-bar-bg": "var(--mantine-color-light-7)",
        "--exwo-color-panel-bg": "var(--mantine-color-light-8)",
        "--exwo-color-header-bg": "var(--mantine-color-light-9)",
    } satisfies ExWoThemeVars,
    dark: {
        "--exwo-color-app-bg": "var(--mantine-color-dark-7)",
        "--exwo-color-control-bar-bg": "var(--mantine-color-dark-9)",
        "--exwo-color-panel-bg": "var(--mantine-color-dark-5)",
        "--exwo-color-header-bg": "var(--mantine-color-dark-7)",
        "--exwo-color-modal-bg": "var(--mantine-color-dark-5)",
    } satisfies ExWoThemeVars,
});
