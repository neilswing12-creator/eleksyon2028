import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Survey Standings & National Tally | Eleksyon 2028",
  description:
    "Real-time survey standings, verified vote tallies, percentage shares, and demographic insights for 2028 Presidential, Vice-Presidential, and Senatorial candidates.",
  alternates: {
    canonical: "https://eleksyon.swingneil.com/results",
  },
  openGraph: {
    title: "Live Survey Standings & National Tally | Eleksyon 2028",
    description: "Real-time non-binding pre-election public opinion survey results.",
    url: "https://eleksyon.swingneil.com/results",
  },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
