import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidates Directory & Profiles | Eleksyon 2028",
  description:
    "Explore official candidate profiles, educational credentials, public service records, and verified legislative achievements for 2028 Philippine Presidential, Vice-Presidential, and Senatorial aspirants.",
  alternates: {
    canonical: "https://eleksyon.swingneil.com/candidates",
  },
  openGraph: {
    title: "Candidates Directory & Profiles | Eleksyon 2028",
    description:
      "Comprehensive profiles and verified legislative track records of 2028 Philippine national election candidates.",
    url: "https://eleksyon.swingneil.com/candidates",
  },
};

export default function CandidatesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
