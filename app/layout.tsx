import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Log Splitter Hire Gold Coast | Split It Gold Coast",
    template: "%s | Split It Gold Coast",
  },
  description:
    "Hydraulic log splitter hire on the Gold Coast, QLD. Book online, pick up, split wood, return. $150/day. Mudgeeraba. Fast, easy, fully automated booking.",
  keywords: [
    "log splitter hire Gold Coast",
    "hydraulic log splitter rental Gold Coast",
    "wood splitter hire Gold Coast",
    "log splitter hire Mudgeeraba",
    "equipment hire Gold Coast",
    "log splitter hire near me",
  ],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: "Split It Gold Coast",
    title: "Log Splitter Hire Gold Coast | Split It Gold Coast",
    description:
      "Hydraulic log splitter hire on the Gold Coast. Book online, pick up, split wood, return. $150/day.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Log Splitter Hire Gold Coast",
    description: "Hydraulic log splitter hire — Gold Coast. Book online from $150/day.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${barlowCondensed.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
