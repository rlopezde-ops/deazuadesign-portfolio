import type { DefaultMantineColor, MantineColorsTuple, MantineThemeColors } from "@mantine/core";

type ExtendedCustomColors = "asurion" | DefaultMantineColor;

declare module "@mantine/core" {
    export interface MantineThemeColorsOverride {
        colors: Record<ExtendedCustomColors, MantineColorsTuple>;
    }
}

// Index commented for easier selection i.e theme.color.asurion[5]

const asurion = [
    "#FF4CFF", // [0]
    "#E244FF", // [1]
    "#CA3BF5", // [2]
    "#B233FF", // [3]
    "#9A2BEA", // [4]
    "#8223D2", // [5]
    "#6A1BB9", // [6]
    "#5113A1", // [7]
    "#380A89", // [8]
    "#200270", // [9]
] as const;

const gray = [
    "#f8f9fa", // [0]
    "#E6E6EB", // [1]
    "#e9ecef", // [2]
    "#dee2e6", // [3]
    "#ced4da", // [4]
    "#adb5bd", // [5]
    "#868e96", // [6]
    "#495057", // [7]
    "#343a40", // [8]
    "#0F1113", // [9]
] as const;

const dark = [
    "#E6E6EB", // [0]
    "#D5D6DA", // [1]
    "#A5AAAF", // [2]
    "#6E767D", // [3]
    "#333F48", // [4]
    "#252B32", // [5]
    "#1D2227", // [6]
    "#1A1D20", // [7]
    "#14171C", // [8]
    "#0F1113", // [9]
] as const;

const light = [
    "#212529", // [0]
    "#343A40", // [1]
    "#495057", // [2]
    "#868E96", // [3]
    "#ADB5BD", // [4]
    "#CED4DA", // [5]
    "#DEE2E6", // [6]
    "#E9ECEF", // [7]
    "#F1F3F5", // [8]
    "#F8F9FA", // [9]
    "#F8EEF9", // [10]
    "#7C757E", // [11]
] as const;

const red = [
    "#FFF5F5", // [0]
    "#FFE3E3", // [1]
    "#FFC9C9", // [2]
    "#FFA8A8", // [3]
    "#FF8787", // [4]
    "#FF5070", // [5]
    "#FA5252", // [6]
    "#F03E3E", // [7]
    "#E03131", // [8]
    "#C92A2A", // [9]
] as const;

const green = [
    "#F0FFF4", // [0]
    "#C6F6D5", // [1]
    "#9AE6B4", // [2]
    "#68D391", // [3]
    "#48BB78", // [4]
    "#38A169", // [5]
    "#2F855A", // [6]
    "#276749", // [7]
    "#22543D", // [8]
    "#1C4532", // [9]
] as const;

const primary = [
    "#F7EDFF", // [0]
    "#EAD5FA", // [1]
    "#D0AAF1", // [2]
    "#B67BE8", // [3]
    "#A053E0", // [4]
    "#933ADC", // [5]
    "#8C2DDB", // [6]
    "#7820C3", // [7]
    "#6B1BAF", // [8]
    "#5D149A", // [9]
] as const;

const error = [
    "#FFF5F5", // [0]
    "#FFE3E3", // [1]
    "#FFC9C9", // [2]
    "#FFA8A8", // [3]
    "#FF8787", // [4]
    "#FF6B6B", // [5]
    "#FA5252", // [6]
    "#F03E3E", // [7]
    "#E03131", // [8]
    "#C92A2A", // [9]
] as const;

const success = [
    "#E6FCF5", // [0]
    "#C3FAE8", // [1]
    "#96F2D7", // [2]
    "#63E6BE", // [3]
    "#38D9A9", // [4]
    "#20C997", // [5]
    "#12B886", // [6]
    "#0CA678", // [7]
    "#099268", // [8]
    "#087F5B", // [9]
    "#37E7A7", // [10]
] as const;

const warning = [
    "#FFF9DB", // [0]
    "#FFF3BF", // [1]
    "#FFEC99", // [2]
    "#FFE066", // [3]
    "#FFD43B", // [4]
    "#FCC419", // [5]
    "#FAB005", // [6]
    "#F59F00", // [7]
    "#F08C00", // [8]
    "#E67700", // [9]
] as const;

export const colorOverrides: Partial<MantineThemeColors> = {
    asurion,
    gray,
    dark,
    light,
    red,
    green,
    primary,
    success,
    warning,
    error,
};
