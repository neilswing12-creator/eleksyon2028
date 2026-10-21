import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const position = searchParams.get("position");
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    if (slug) {
      const candidate = await prisma.candidate.findUnique({
        where: { slug },
        include: {
          platforms: {
            where: { verificationStatus: "VERIFIED" },
            orderBy: { createdAt: "desc" },
          },
          educations: {
            orderBy: { displayOrder: "asc" },
          },
          publicServices: {
            orderBy: { displayOrder: "asc" },
          },
          sources: {
            orderBy: { displayOrder: "asc" },
          },
          legislativeRecords: {
            where: { reviewStatus: "CONFIRMED" },
            orderBy: [{ congress: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
          },
        },
      });

      if (!candidate) {
        return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
      }

      return NextResponse.json({ candidate });
    }

    const candidates = await prisma.candidate.findMany({
      where: {
        isPublished: true,
        ...(position ? { position } : {}),
      },
      include: {
        platforms: {
          where: {
            verificationStatus: "VERIFIED",
            ...(category ? { category } : {}),
          },
          orderBy: { createdAt: "desc" },
        },
        educations: {
          orderBy: { displayOrder: "asc" },
        },
        publicServices: {
          orderBy: { displayOrder: "asc" },
        },
        sources: {
          orderBy: { displayOrder: "asc" },
        },
        legislativeRecords: {
          where: { reviewStatus: "CONFIRMED" },
          select: {
            id: true,
            chamber: true,
            congress: true,
            billNo: true,
            title: true,
            role: true,
            status: true,
            republicActNo: true,
            sourceInstitution: true,
          },
        },
      },
      orderBy: [{ position: "asc" }, { displayOrder: "asc" }],
    });

    return NextResponse.json({ candidates });
  } catch (error) {
    console.error("Candidates route error:", error);
    return NextResponse.json({ error: "Failed to load candidates." }, { status: 500 });
  }
}
