import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voters' Profile & Demographic Analytics | Eleksyon 2028",
  description:
    "Certified Commission on Elections (COMELEC) registered voter statistics, generational cohorts (Gen Z, Millennials, Gen X, Boomers), gender ratios, and top vote-rich provinces.",
  alternates: {
    canonical: "https://eleksyon.swingneil.com/voters",
  },
  openGraph: {
    title: "Voters' Profile & Demographics | Eleksyon 2028",
    description:
      "Official Philippine electoral demographics and generational voting population statistics.",
    url: "https://eleksyon.swingneil.com/voters",
  },
};

export default function VotersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
