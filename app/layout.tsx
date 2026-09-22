import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://doubletake.mistystep.io"),
  title: "Double Take — one line, two impressions",
  description: "Write one line that reads true in two different scenes.",
  applicationName: "Double Take",
  icons: {
    icon: [
      { url: "/brand/double-take-mark-16.svg", sizes: "16x16", type: "image/svg+xml" },
      { url: "/brand/double-take-mark-32.svg", sizes: "32x32", type: "image/svg+xml" },
      { url: "/brand/double-take-mark.svg", sizes: "any", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "Double Take",
    description: "One line. Two impressions. Make both read true.",
    type: "website",
    url: "https://doubletake.mistystep.io",
    siteName: "Double Take",
    images: ["/brand/double-take-share.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Double Take",
    description: "One line. Two impressions. Make both read true.",
    images: ["/brand/double-take-share.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1b1626",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
