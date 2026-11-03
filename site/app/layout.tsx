import type { Metadata, Viewport } from "next";
import { SiteEffects } from "@/components/site-effects";
import "./globals.css";
import "./styles/main.css";
import "./styles/case-study.css";

export const metadata: Metadata = {
  title: "De Azua Design | Design Leader",
  referrer: "strict-origin-when-cross-origin",
};

// viewport-fit=cover is required for env(safe-area-inset-*) on notch devices.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/iconoir-icons/iconoir@main/css/iconoir.css"
        />
        <noscript>
          <style>{`.fade-in, .fade-in-section { opacity: 1; transform: none; }`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <footer className="footer">
          <p>© 2026 De Azua Design. Designed with intention.</p>
        </footer>
        <SiteEffects />
      </body>
    </html>
  );
}
