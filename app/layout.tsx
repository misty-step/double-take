import type { Metadata, Viewport } from "next";
import { Libre_Franklin, Newsreader } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});
const libreFranklin = Libre_Franklin({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-libre-franklin",
  display: "swap",
});
const description =
  "A party game for 2 to 8 phones. Everyone gets the same two worlds; write the line that fits both.";

/** Icons, the manifest, and the share image come from app/icon, apple-icon, manifest, and opengraph-image. */
export const metadata: Metadata = {
  metadataBase: new URL("https://doubletake.mistystep.io"),
  title: "Double Take",
  description,
  applicationName: "Double Take",
  appleWebApp: {
    capable: true,
    title: "Double Take",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "Double Take",
    description,
    type: "website",
    url: "https://doubletake.mistystep.io",
    siteName: "Double Take",
  },
  twitter: {
    card: "summary_large_image",
    title: "Double Take",
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${libreFranklin.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
