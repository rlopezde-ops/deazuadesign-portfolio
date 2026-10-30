import type { Metadata } from "next";
import { AuiProvider } from "@/components/aui/aui-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextGen Portal | uBreakiFix store dashboard",
  description: "uBreakiFix by Asurion store management dashboard prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" style={{ colorScheme: "dark" }}>
      <head>
        <link
          rel="stylesheet"
          href="https://assets.asurion-ui.my.asurion53.com/fonts/font-families.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      {/*
        AUI puts light tokens on `:root`. Theme classes must live on <body>
        (not <html>) so `.asurion-dark` wins via inheritance for the app tree.
      */}
      <body className="asurion-dark min-h-full" suppressHydrationWarning>
        <AuiProvider colorMode="asurion-dark" theme="asurion">
          {children}
        </AuiProvider>
      </body>
    </html>
  );
}
