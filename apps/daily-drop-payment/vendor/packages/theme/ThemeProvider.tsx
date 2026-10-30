import type { JSX, PropsWithChildren } from "react";

import { MantineProvider, type MantineProviderProps } from "@mantine/core";

import { mantineTheme, resolver } from "./mantine.theme.config";

export function GlobalThemeProvider({
    children,
    ...props
}: PropsWithChildren<Omit<MantineProviderProps, "cssVariablesResolver" | "theme">>): JSX.Element {
    return (
        <MantineProvider cssVariablesResolver={resolver} defaultColorScheme="dark" theme={mantineTheme} {...props}>
            {children}
        </MantineProvider>
    );
}
