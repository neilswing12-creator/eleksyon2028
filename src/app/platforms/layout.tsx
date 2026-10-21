import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidate Policy Platforms & Agendas | Eleksyon 2028",
  description:
    "Comprehensive comparison of verified candidate policy platforms covering the Economy, Healthcare, Education, Infrastructure, Agriculture, and Digital Transformation.",
  alternates: {
    canonical: "https://eleksyon.swingneil.com/platforms",
  },
  openGraph: {
    title: "Candidate Policy Platforms | Eleksyon 2028",
    description: "Compare official policy positions of 2028 Philippine national candidates.",
    url: "https://eleksyon.swingneil.com/platforms",
  },
};

export default function PlatformsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
