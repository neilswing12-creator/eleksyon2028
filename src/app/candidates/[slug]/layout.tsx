import { Metadata } from "next";
import prisma from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const candidate = await prisma.candidate.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      position: true,
      party: true,
      photoUrl: true,
      bio: true,
    },
  });

  if (!candidate) {
    return {
      title: "Candidate Profile | Eleksyon 2028",
      description: "Candidate profile and civic opinion standings for Eleksyon 2028.",
    };
  }

  const positionLabel = candidate.position.replace("_", " ");
  const title = `${candidate.name} | ${positionLabel} Candidate Profile & Legislative Records`;
  const description = `Explore candidate profile, civic education, and verified public legislative records for ${candidate.name} (${candidate.party || "Independent"}), running for ${positionLabel} in the Philippine 2028 National Election Survey.`;
  const canonicalUrl = `https://eleksyon.swingneil.com/candidates/${encodeURIComponent(params.slug)}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "profile",
      images: candidate.photoUrl
        ? [
            {
              url: candidate.photoUrl,
              width: 600,
              height: 600,
              alt: `${candidate.name} Portrait`,
            },
          ]
        : [
            {
              url: "/e28-logo.svg",
              width: 800,
              height: 600,
              alt: "Eleksyon 2028 Logo",
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: candidate.photoUrl ? [candidate.photoUrl] : ["/e28-logo.svg"],
    },
  };
}

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
