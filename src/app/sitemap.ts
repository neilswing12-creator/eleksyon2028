import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const BASE_URL = "https://eleksyon.swingneil.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static public indexable pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/map`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/results`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/candidates`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/voters`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/platforms`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/methodology`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  try {
    const candidates = await prisma.candidate.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    const candidateRoutes: MetadataRoute.Sitemap = candidates.map((c) => ({
      url: `${BASE_URL}/candidates/${encodeURIComponent(c.slug)}`,
      lastModified: c.updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    }));

    return [...staticRoutes, ...candidateRoutes];
  } catch (err) {
    console.error("Error generating sitemap candidates:", err);
    return staticRoutes;
  }
}
