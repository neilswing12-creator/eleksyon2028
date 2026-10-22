import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdminSession, getClientIP } from "@/lib/security";
import { sortCandidatesByPositionAndName } from "@/lib/candidate-sorting";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

function getAdmin(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  let token = "";
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else {
    token = req.cookies.get("admin_session")?.value || "";
  }
  return verifyAdminSession(token);
}

function getBaseSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/-(pres|vp|sen|president|vice-president|senator)$/i, "")
    .trim();
}

// GET all candidates for admin table
export async function GET(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const candidates = await prisma.candidate.findMany({
      include: {
        platforms: true,
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
          orderBy: [{ congress: "desc" }, { displayOrder: "asc" }],
        },
        legislativeImportJobs: {
          orderBy: { startedAt: "desc" },
          take: 1,
        },
        _count: {
          select: { selections: true, legislativeRecords: true },
        },
      },
      orderBy: [{ position: "asc" }, { displayOrder: "asc" }],
    });

    const sortedCandidates = sortCandidatesByPositionAndName(candidates);

    return NextResponse.json({ candidates: sortedCandidates });
  } catch (error) {
    console.error("Admin candidate list error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

// POST create new candidate
export async function POST(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (admin.role === "ANALYST") {
      return NextResponse.json(
        { error: "Forbidden: Analysts have read-only access." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      name,
      slug,
      position,
      party,
      color,
      photoUrl,
      bio,
      education,
      publicService,
      educations,
      publicServices,
      platforms,
      sources,
      lastVerifiedAt,
      officialWebsite,
      socialLinks,
      displayOrder,
      isPublished,
    } = body;

    if (!name || !slug || !position) {
      return NextResponse.json(
        { error: "Name, slug, and position are required." },
        { status: 400 }
      );
    }

    const finalSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");

    // Format education items
    const parsedEducations: string[] = Array.isArray(educations)
      ? educations
          .map((item: any) => (typeof item === "string" ? item.trim() : item.degree?.trim()))
          .filter(Boolean)
      : education
      ? [education.trim()]
      : [];

    // Format public service items
    const parsedServices: string[] = Array.isArray(publicServices)
      ? publicServices
          .map((item: any) => (typeof item === "string" ? item.trim() : item.position?.trim()))
          .filter(Boolean)
      : publicService
      ? [publicService.trim()]
      : [];

    const legacyEducation = parsedEducations.join("; ") || education || null;
    const legacyPublicService = parsedServices.join("; ") || publicService || null;

    const created = await prisma.$transaction(async (tx) => {
      const cand = await tx.candidate.create({
        data: {
          name,
          slug: finalSlug,
          position,
          party: party || null,
          color: color || "#1455D9",
          photoUrl: photoUrl || null,
          bio: bio || null,
          education: legacyEducation,
          publicService: legacyPublicService,
          officialWebsite: officialWebsite || null,
          socialLinks: typeof socialLinks === "object" ? JSON.stringify(socialLinks) : socialLinks || null,
          displayOrder: displayOrder ? parseInt(displayOrder, 10) : 0,
          isPublished: isPublished !== false,
          lastVerifiedAt: lastVerifiedAt ? new Date(lastVerifiedAt) : new Date(),
        },
      });

      // Insert structured educations
      if (parsedEducations.length > 0) {
        for (let i = 0; i < parsedEducations.length; i++) {
          await tx.candidateEducation.create({
            data: {
              candidateId: cand.id,
              degree: parsedEducations[i],
              displayOrder: i + 1,
            },
          });
        }
      }

      // Insert structured public services
      if (parsedServices.length > 0) {
        for (let i = 0; i < parsedServices.length; i++) {
          await tx.candidatePublicService.create({
            data: {
              candidateId: cand.id,
              position: parsedServices[i],
              displayOrder: i + 1,
            },
          });
        }
      }

      // Insert policy platforms / agendas
      if (Array.isArray(platforms) && platforms.length > 0) {
        for (let i = 0; i < platforms.length; i++) {
          const p = platforms[i];
          if (p && p.title) {
            await tx.candidatePlatform.create({
              data: {
                candidateId: cand.id,
                title: typeof p.title === "string" ? p.title.trim() : "",
                description: typeof p.description === "string" ? p.description.trim() : (p.title || ""),
                category: p.category || "GOVERNANCE",
                sourceUrl: p.sourceUrl ? String(p.sourceUrl).trim() : null,
                sourceTitle: p.sourceTitle ? String(p.sourceTitle).trim() : null,
                sourceType: p.sourceType || "OFFICIAL_PLATFORM",
                publicationDate: p.publicationDate ? new Date(p.publicationDate) : null,
                verificationStatus: p.verificationStatus || "VERIFIED",
                verifiedAt: p.verifiedAt ? new Date(p.verifiedAt) : new Date(),
              },
            });
          }
        }
      }

      // Insert verified sources and citations
      if (Array.isArray(sources) && sources.length > 0) {
        for (let i = 0; i < sources.length; i++) {
          const s = sources[i];
          if (s && s.title && s.url) {
            await tx.candidateSource.create({
              data: {
                candidateId: cand.id,
                category: s.category || "GENERAL",
                title: String(s.title).trim(),
                url: String(s.url).trim(),
                publisher: s.publisher ? String(s.publisher).trim() : null,
                publicationDate: s.publicationDate ? String(s.publicationDate).trim() : null,
                verificationStatus: s.verificationStatus || "VERIFIED",
                notes: s.notes ? String(s.notes).trim() : null,
                displayOrder: s.displayOrder ?? i + 1,
              },
            });
          }
        }
      }

      return await tx.candidate.findUniqueOrThrow({
        where: { id: cand.id },
        include: {
          educations: { orderBy: { displayOrder: "asc" } },
          publicServices: { orderBy: { displayOrder: "asc" } },
          platforms: true,
          sources: { orderBy: { displayOrder: "asc" } },
        },
      });
    });

    const clientIP = getClientIP(req.headers);
    await prisma.adminAuditLog.create({
      data: {
        adminEmail: admin.email,
        action: "CANDIDATE_CREATED",
        entityType: "Candidate",
        entityId: created.id,
        details: `Created candidate ${created.name} (${created.position}) with assigned color ${created.color}`,
        ipAddress: clientIP,
      },
    });

    return NextResponse.json({ success: true, candidate: created }, { status: 201 });
  } catch (error: any) {
    console.error("Admin candidate create error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A candidate with this slug already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create candidate." }, { status: 500 });
  }
}

// PUT update candidate
export async function PUT(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (admin.role === "ANALYST") {
      return NextResponse.json(
        { error: "Forbidden: Analysts have read-only access." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      id,
      name,
      slug,
      position,
      party,
      color,
      photoUrl,
      bio,
      education,
      publicService,
      officialWebsite,
      socialLinks,
      displayOrder,
      isPublished,
      lastVerifiedAt,
      educations,
      publicServices,
      platforms,
      sources,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Candidate ID is required." }, { status: 400 });
    }

    const existing = await prisma.candidate.findUnique({
      where: { id },
      include: { educations: true, publicServices: true, platforms: true, sources: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Candidate not found." }, { status: 404 });
    }

    // Normalize photo URL
    let normalizedPhotoUrl = photoUrl;
    if (photoUrl && typeof photoUrl === "string") {
      const trimmed = photoUrl.trim();
      if (trimmed) {
        normalizedPhotoUrl = trimmed.startsWith("http") || trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
      } else {
        normalizedPhotoUrl = null;
      }
    }

    // Clean up old custom uploaded image if replaced
    if (
      normalizedPhotoUrl &&
      existing.photoUrl &&
      normalizedPhotoUrl !== existing.photoUrl &&
      existing.photoUrl.startsWith("/uploads/candidates/") &&
      !existing.photoUrl.endsWith("-portrait.jpg")
    ) {
      try {
        const oldFilename = path.basename(existing.photoUrl);
        const oldPath = path.join(process.cwd(), "public", "uploads", "candidates", oldFilename);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      } catch (err) {
        console.warn("Could not delete old candidate photo:", err);
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Update structured educations if provided
      let legacyEdu = education;
      if (Array.isArray(educations)) {
        await tx.candidateEducation.deleteMany({ where: { candidateId: id } });
        const validEdu = educations
          .map((item: any) => (typeof item === "string" ? item.trim() : item.degree?.trim()))
          .filter(Boolean);

        for (let i = 0; i < validEdu.length; i++) {
          await tx.candidateEducation.create({
            data: {
              candidateId: id,
              degree: validEdu[i],
              displayOrder: i + 1,
            },
          });
        }
        legacyEdu = validEdu.join("; ");
      }

      // 2. Update structured public services if provided
      let legacyService = publicService;
      if (Array.isArray(publicServices)) {
        await tx.candidatePublicService.deleteMany({ where: { candidateId: id } });
        const validService = publicServices
          .map((item: any) => (typeof item === "string" ? item.trim() : item.position?.trim()))
          .filter(Boolean);

        for (let i = 0; i < validService.length; i++) {
          await tx.candidatePublicService.create({
            data: {
              candidateId: id,
              position: validService[i],
              displayOrder: i + 1,
            },
          });
        }
        legacyService = validService.join("; ");
      }

      // 3. Update candidate sources if provided
      if (Array.isArray(sources)) {
        await tx.candidateSource.deleteMany({ where: { candidateId: id } });
        for (let i = 0; i < sources.length; i++) {
          const s = sources[i];
          if (s && s.title && s.url) {
            await tx.candidateSource.create({
              data: {
                candidateId: id,
                category: s.category || "GENERAL",
                title: s.title.trim(),
                url: s.url.trim(),
                publisher: s.publisher ? s.publisher.trim() : null,
                publicationDate: s.publicationDate ? s.publicationDate.trim() : null,
                verificationStatus: s.verificationStatus || "VERIFIED",
                notes: s.notes ? s.notes.trim() : null,
                displayOrder: s.displayOrder ?? i + 1,
              },
            });
          }
        }
      }

      // 4. Update candidate platforms / policy agendas if provided
      if (Array.isArray(platforms)) {
        await tx.candidatePlatform.deleteMany({ where: { candidateId: id } });
        for (let i = 0; i < platforms.length; i++) {
          const p = platforms[i];
          if (p && p.title) {
            await tx.candidatePlatform.create({
              data: {
                candidateId: id,
                title: typeof p.title === "string" ? p.title.trim() : "",
                description: typeof p.description === "string" ? p.description.trim() : (p.title || ""),
                category: p.category || "GOVERNANCE",
                sourceUrl: p.sourceUrl ? String(p.sourceUrl).trim() : null,
                sourceTitle: p.sourceTitle ? String(p.sourceTitle).trim() : null,
                sourceType: p.sourceType || "OFFICIAL_PLATFORM",
                publicationDate: p.publicationDate ? new Date(p.publicationDate) : null,
                verificationStatus: p.verificationStatus || "VERIFIED",
                verifiedAt: p.verifiedAt ? new Date(p.verifiedAt) : new Date(),
              },
            });
          }
        }
      }

      // 5. Update candidate core fields with strict whitelisted data
      const updateData: any = {};
      if (name !== undefined) updateData.name = name.trim();
      if (slug !== undefined) updateData.slug = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-");
      if (position !== undefined) updateData.position = position;
      if (party !== undefined) updateData.party = party ? party.trim() : null;
      if (color !== undefined) updateData.color = color;
      if (photoUrl !== undefined) updateData.photoUrl = normalizedPhotoUrl;
      if (bio !== undefined) updateData.bio = bio ? bio.trim() : null;
      if (legacyEdu !== undefined) updateData.education = legacyEdu;
      if (legacyService !== undefined) updateData.publicService = legacyService;
      if (officialWebsite !== undefined) updateData.officialWebsite = officialWebsite ? officialWebsite.trim() : null;
      if (socialLinks !== undefined) {
        updateData.socialLinks = typeof socialLinks === "object" ? JSON.stringify(socialLinks) : socialLinks || null;
      }
      if (displayOrder !== undefined) updateData.displayOrder = parseInt(displayOrder, 10) || 0;
      if (isPublished !== undefined) updateData.isPublished = Boolean(isPublished);
      if (lastVerifiedAt !== undefined) {
        updateData.lastVerifiedAt = lastVerifiedAt ? new Date(lastVerifiedAt) : null;
      }

      const cand = await tx.candidate.update({
        where: { id },
        data: updateData,
        include: {
          educations: { orderBy: { displayOrder: "asc" } },
          publicServices: { orderBy: { displayOrder: "asc" } },
          platforms: true,
          sources: { orderBy: { displayOrder: "asc" } },
        },
      });

      // 6. Cross-position automatic synchronization (e.g. Presidential <-> Senatorial)
      const siblingCandidates = await tx.candidate.findMany({
        where: { id: { not: id } },
      });

      const existingBaseSlug = getBaseSlug(existing.slug);
      const currentNameLower = existing.name.trim().toLowerCase();
      const newNameLower = name ? name.trim().toLowerCase() : currentNameLower;

      const matchingSiblings = siblingCandidates.filter((s) => {
        const sNameLower = s.name.trim().toLowerCase();
        const sBaseSlug = getBaseSlug(s.slug);
        return (
          sNameLower === currentNameLower ||
          sNameLower === newNameLower ||
          sBaseSlug === existingBaseSlug
        );
      });

      for (const sibling of matchingSiblings) {
        // Sync shared profile attributes (preserving slot-specific position, slug, displayOrder, isPublished)
        const siblingUpdateData: any = {};
        if (name !== undefined) siblingUpdateData.name = name.trim();
        if (party !== undefined) siblingUpdateData.party = party ? party.trim() : null;
        if (color !== undefined) siblingUpdateData.color = color;
        if (photoUrl !== undefined) siblingUpdateData.photoUrl = normalizedPhotoUrl;
        if (bio !== undefined) siblingUpdateData.bio = bio ? bio.trim() : null;
        if (legacyEdu !== undefined) siblingUpdateData.education = legacyEdu;
        if (legacyService !== undefined) siblingUpdateData.publicService = legacyService;
        if (officialWebsite !== undefined) siblingUpdateData.officialWebsite = officialWebsite ? officialWebsite.trim() : null;
        if (socialLinks !== undefined) {
          siblingUpdateData.socialLinks = typeof socialLinks === "object" ? JSON.stringify(socialLinks) : socialLinks || null;
        }
        if (lastVerifiedAt !== undefined) {
          siblingUpdateData.lastVerifiedAt = lastVerifiedAt ? new Date(lastVerifiedAt) : null;
        }

        if (Object.keys(siblingUpdateData).length > 0) {
          await tx.candidate.update({
            where: { id: sibling.id },
            data: siblingUpdateData,
          });
        }

        // Sync educations
        if (Array.isArray(educations)) {
          await tx.candidateEducation.deleteMany({ where: { candidateId: sibling.id } });
          const validEdu = educations
            .map((item: any) => (typeof item === "string" ? item.trim() : item.degree?.trim()))
            .filter(Boolean);

          for (let i = 0; i < validEdu.length; i++) {
            await tx.candidateEducation.create({
              data: {
                candidateId: sibling.id,
                degree: validEdu[i],
                displayOrder: i + 1,
              },
            });
          }
        }

        // Sync public services
        if (Array.isArray(publicServices)) {
          await tx.candidatePublicService.deleteMany({ where: { candidateId: sibling.id } });
          const validService = publicServices
            .map((item: any) => (typeof item === "string" ? item.trim() : item.position?.trim()))
            .filter(Boolean);

          for (let i = 0; i < validService.length; i++) {
            await tx.candidatePublicService.create({
              data: {
                candidateId: sibling.id,
                position: validService[i],
                displayOrder: i + 1,
              },
            });
          }
        }

        // Sync policy platforms
        if (Array.isArray(platforms)) {
          await tx.candidatePlatform.deleteMany({ where: { candidateId: sibling.id } });
          for (let i = 0; i < platforms.length; i++) {
            const p = platforms[i];
            if (p && p.title) {
              await tx.candidatePlatform.create({
                data: {
                  candidateId: sibling.id,
                  title: typeof p.title === "string" ? p.title.trim() : "",
                  description: typeof p.description === "string" ? p.description.trim() : (p.title || ""),
                  category: p.category || "GOVERNANCE",
                  sourceUrl: p.sourceUrl ? String(p.sourceUrl).trim() : null,
                  sourceTitle: p.sourceTitle ? String(p.sourceTitle).trim() : null,
                  sourceType: p.sourceType || "OFFICIAL_PLATFORM",
                  publicationDate: p.publicationDate ? new Date(p.publicationDate) : null,
                  verificationStatus: p.verificationStatus || "VERIFIED",
                  verifiedAt: p.verifiedAt ? new Date(p.verifiedAt) : new Date(),
                },
              });
            }
          }
        }

        // Sync sources
        if (Array.isArray(sources)) {
          await tx.candidateSource.deleteMany({ where: { candidateId: sibling.id } });
          for (let i = 0; i < sources.length; i++) {
            const s = sources[i];
            if (s && s.title && s.url) {
              await tx.candidateSource.create({
                data: {
                  candidateId: sibling.id,
                  category: s.category || "GENERAL",
                  title: s.title.trim(),
                  url: s.url.trim(),
                  publisher: s.publisher ? s.publisher.trim() : null,
                  publicationDate: s.publicationDate ? s.publicationDate.trim() : null,
                  verificationStatus: s.verificationStatus || "VERIFIED",
                  notes: s.notes ? s.notes.trim() : null,
                  displayOrder: s.displayOrder ?? i + 1,
                },
              });
            }
          }
        }
      }

      (cand as any).syncedSiblingsCount = matchingSiblings.length;
      return cand;
    });

    const syncedCount = (updated as any).syncedSiblingsCount || 0;
    const clientIP = getClientIP(req.headers);
    await prisma.adminAuditLog.create({
      data: {
        adminEmail: admin.email,
        action: "CANDIDATE_UPDATED",
        entityType: "Candidate",
        entityId: updated.id,
        details: `Updated candidate ${updated.name} (${updated.position})${
          syncedCount > 0 ? ` [auto-synced to ${syncedCount} other ballot positions]` : ""
        }`,
        ipAddress: clientIP,
      },
    });

    return NextResponse.json({
      success: true,
      candidate: updated,
      syncedSiblingsCount: syncedCount,
    });
  } catch (error) {
    console.error("Admin candidate update error:", error);
    return NextResponse.json({ error: "Failed to update candidate." }, { status: 500 });
  }
}

// DELETE deactivate candidate
export async function DELETE(req: NextRequest) {
  try {
    const admin = getAdmin(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (admin.role !== "SUPER_ADMIN" && admin.role !== "CANDIDATE_MANAGER" && admin.role !== "SURVEY_MANAGER") {
      return NextResponse.json({ error: "Forbidden: Insufficient privileges." }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Candidate ID required." }, { status: 400 });
    }

    // Soft deactivate to preserve historical survey votes
    const deactivated = await prisma.candidate.update({
      where: { id },
      data: { isPublished: false },
    });

    const clientIP = getClientIP(req.headers);
    await prisma.adminAuditLog.create({
      data: {
        adminEmail: admin.email,
        action: "CANDIDATE_ARCHIVED",
        entityType: "Candidate",
        entityId: deactivated.id,
        details: `Archived/unpublished candidate ${deactivated.name} (votes preserved for audit)`,
        ipAddress: clientIP,
      },
    });

    return NextResponse.json({ success: true, message: "Candidate unpublished successfully." });
  } catch (error) {
    console.error("Admin candidate delete error:", error);
    return NextResponse.json({ error: "Failed to archive candidate." }, { status: 500 });
  }
}
