import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Plus Jakarta Sans: open, warm and very legible at small sizes (body + headings).
const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
// JetBrains Mono: bill numbers, codes and receipts.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eleksyon.swingneil.com"),
  title: {
    default: "Eleksyon 2028 | Philippine Public Opinion & Civic Registry",
    template: "%s | Eleksyon 2028",
  },
  description:
    "Explore independent, non-partisan public opinion research on the 2028 Philippine National Elections with interactive geographic coverage, registered voters demographics, transparent audit logs, and legislative profiles. Independent research platform not affiliated with COMELEC.",
  applicationName: "Eleksyon 2028",
  authors: [{ name: "Philippine Civic Technology & Opinion Research" }],
  generator: "Next.js",
  keywords: [
    "Eleksyon 2028",
    "Philippine Election Survey",
    "2028 Presidential Poll",
    "COMELEC Voters Demographics",
    "Philippine Senate Bills",
    "Civic Technology Philippines",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Eleksyon 2028 | Philippine Public Opinion & Civic Registry",
    description:
      "Independent, non-partisan pre-election public opinion survey and civic demographic registry. Not affiliated with COMELEC or any government agency.",
    url: "https://eleksyon.swingneil.com",
    siteName: "Eleksyon 2028",
    locale: "en_PH",
    type: "website",
    images: [
      {
        url: "/e28-logo.svg",
        width: 800,
        height: 600,
        alt: "Eleksyon 2028 Official Civic Registry Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eleksyon 2028 | Philippine Public Opinion & Civic Registry",
    description:
      "Independent pre-election public opinion survey with interactive geographic maps and verified civic records.",
    images: ["/e28-logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body
        className={`${sans.variable} ${mono.variable} font-sans antialiased bg-[#F7F8FA] text-ink min-h-screen flex flex-col justify-between`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
