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
  "Everyone gets the same two worlds. Write the line that fits both best.";

export const metadata: Metadata = {
  metadataBase: new URL("https://doubletake.mistystep.io"),
  title: "Double Take",
  description,
  applicationName: "Double Take",
  icons: {
    icon: [
      {
        url: "/brand/double-take-mark-16.svg",
        sizes: "16x16",
        type: "image/svg+xml",
      },
      {
        url: "/brand/double-take-mark-32.svg",
        sizes: "32x32",
        type: "image/svg+xml",
      },
      {
        url: "/brand/double-take-mark.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    title: "Double Take",
    description,
    type: "website",
    url: "https://doubletake.mistystep.io",
    siteName: "Double Take",
    images: ["/brand/double-take-share.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Double Take",
    description,
    images: ["/brand/double-take-share.svg"],
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
