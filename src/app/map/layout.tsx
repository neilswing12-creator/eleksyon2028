import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Philippine Survey Map & Provincial Results | Eleksyon 2028",
  description:
    "Explore interactive geographic and cartogram survey maps showing candidate standings, regional strongholds, and battleground provinces across Luzon, Visayas, and Mindanao.",
  alternates: {
    canonical: "https://eleksyon.swingneil.com/map",
  },
  openGraph: {
    title: "Interactive Philippine Survey Map | Eleksyon 2028",
    description:
      "Interactive 2028 election survey map with provincial drilldowns, candidate colors, and demographic coverage.",
    url: "https://eleksyon.swingneil.com/map",
  },
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
