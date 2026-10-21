import { PrismaClient } from '../src/generated/prisma/index.js';

const prisma = new PrismaClient();

const ROBIN_PADILLA_DATA = {
  slug: "robin-padilla",
  name: "Robinhood Ferdinand \"Robin\" Padilla",
  position: "SENATOR",
  party: "PDP-Laban",
  color: "#0A5C36",
  photoUrl: "/uploads/candidates/robin-padilla-portrait.jpg",
  bio: "Robinhood Ferdinand 'Robin' Cariño Padilla is an incumbent Senator of the Republic of the Philippines, having placed first overall in the 2022 senatorial elections with over 26.6 million votes. He currently chairs the Senate Committee on Constitutional Amendments and Revision of Codes, and the Senate Committee on Public Information and Mass Media. Known for his legislative advocacy of federalism, constitutional economic reform, indigenous and Bangsamoro rights, and social protection for overseas Filipino workers.",
  education: "Bachelor of Science in Criminology - Philippine College of Criminology (PCCR)",
  publicService: "Senator of the Philippines (19th Congress, 2022–present); Chairman, Committee on Constitutional Amendments and Revision of Codes",
  officialWebsite: "https://legacy.senate.gov.ph/senators/sen_bio/padilla_bio.asp",
  socialLinks: JSON.stringify({
    facebook: "https://www.facebook.com/ROBINPADILLA.OFFICIAL",
    website: "https://legacy.senate.gov.ph/senators/sen_bio/padilla_bio.asp"
  }),
  displayOrder: 25,
  isPublished: true,
  educations: [
    { degree: "Bachelor of Science in Criminology", institution: "Philippine College of Criminology (PCCR)", year: "2006", sourceTitle: "Senate of the Philippines Bio", sourceUrl: "https://legacy.senate.gov.ph/senators/sen_bio/padilla_bio.asp" },
    { degree: "Secondary Education", institution: "St. Louis University Boys High School", year: "1987", sourceTitle: "Senate Legislative Information", sourceUrl: "https://legacy.senate.gov.ph" }
  ],
  publicServices: [
    { position: "Senator of the Republic of the Philippines", title: "Member of the Senate", period: "2022 - present (19th Congress)", sourceTitle: "Senate Official Directory", sourceUrl: "https://senate.gov.ph" },
    { position: "Senate Committee Chairman", title: "Committee on Constitutional Amendments and Revision of Codes", period: "2022 - present", sourceTitle: "Senate Committee Directory", sourceUrl: "https://senate.gov.ph" },
    { position: "Senate Committee Chairman", title: "Committee on Public Information and Mass Media", period: "2022 - present", sourceTitle: "Senate Committee Directory", sourceUrl: "https://senate.gov.ph" },
    { position: "Senate Committee Vice Chairman", title: "Committee on National Defense and Security, Peace, Unification and Reconciliation", period: "2022 - present", sourceTitle: "Senate of the Philippines", sourceUrl: "https://senate.gov.ph" }
  ],
  platforms: [
    {
      title: "Constitutional & Economic Charter Reform",
      description: "Advocates targeted economic reforms in the 1987 Constitution and an eventual transition to a federal system to decentralize national wealth and empower local regional economies.",
      category: "GOVERNANCE",
      sourceTitle: "Senate Legislative Record (SCR No. 6)",
      sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SCR-6"
    },
    {
      title: "Overseas Filipino Workers Welfare and Protection",
      description: "Spearheads legislation to establish mandatory institutional legal defense funds and comprehensive social protections for distressed overseas Filipino workers.",
      category: "SOCIAL_WELFARE",
      sourceTitle: "Senate 19th Congress Legislative Agenda",
      sourceUrl: "https://legacy.senate.gov.ph"
    },
    {
      title: "Philippine Defense and Military Modernization",
      description: "Strengthening the Philippine Marine Corps, Coast Guard, and citizen reserve defensive capabilities to defend Philippine sovereignty in the West Philippine Sea and safeguard maritime frontiers.",
      category: "PUBLIC_SAFETY",
      sourceTitle: "Senate Bill No. 2214 (Philippine Marine Corps Act)",
      sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2214"
    },
    {
      title: "Bangsamoro, Muslim & Indigenous Peoples Inclusion",
      description: "Safeguarding ancestral domains, expanding Halal industry opportunities, and securing budget equality for indigenous cultural communities and the BARMM.",
      category: "SOCIAL_WELFARE",
      sourceTitle: "Senate Legislative Documents",
      sourceUrl: "https://legacy.senate.gov.ph"
    },
    {
      title: "Farmer Subsidies and Agricultural Independence",
      description: "Championing localized cold storage facilities, lowering agricultural fuel taxes, and direct state assistance to farmers and fishermen to eliminate predatory middlemen.",
      category: "AGRICULTURE",
      sourceTitle: "Senate Public Records",
      sourceUrl: "https://legacy.senate.gov.ph"
    }
  ],
  sources: [
    { title: "Senator Robinhood Padilla Official Biography", url: "https://legacy.senate.gov.ph/senators/sen_bio/padilla_bio.asp", publisher: "Senate of the Philippines" },
    { title: "Senate of the Philippines 19th Congress Member Roster", url: "https://senate.gov.ph/senators/sen_bio/padilla_bio.asp", publisher: "Senate of the Philippines" },
    { title: "COMELEC 2022 Official Senatorial Canvass", url: "https://comelec.gov.ph", publisher: "Commission on Elections" }
  ]
};

export async function upsertRobinPadilla() {
  console.log("Upserting Senator Robin Padilla...");
  const existing = await prisma.candidate.findUnique({
    where: { slug: ROBIN_PADILLA_DATA.slug },
    include: { educations: true, publicServices: true, platforms: true, sources: true }
  });

  let candidateId;
  if (!existing) {
    const created = await prisma.candidate.create({
      data: {
        slug: ROBIN_PADILLA_DATA.slug,
        name: ROBIN_PADILLA_DATA.name,
        position: ROBIN_PADILLA_DATA.position,
        party: ROBIN_PADILLA_DATA.party,
        color: ROBIN_PADILLA_DATA.color,
        photoUrl: ROBIN_PADILLA_DATA.photoUrl,
        bio: ROBIN_PADILLA_DATA.bio,
        education: ROBIN_PADILLA_DATA.education,
        publicService: ROBIN_PADILLA_DATA.publicService,
        officialWebsite: ROBIN_PADILLA_DATA.officialWebsite,
        socialLinks: ROBIN_PADILLA_DATA.socialLinks,
        displayOrder: ROBIN_PADILLA_DATA.displayOrder,
        isPublished: ROBIN_PADILLA_DATA.isPublished,
        lastVerifiedAt: new Date()
      }
    });
    candidateId = created.id;
    console.log(`Created Senator Robin Padilla with ID: ${candidateId}`);
  } else {
    candidateId = existing.id;
    console.log(`Candidate ${existing.name} already exists (ID: ${candidateId}). Updating profile metadata...`);
    await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        bio: ROBIN_PADILLA_DATA.bio,
        officialWebsite: ROBIN_PADILLA_DATA.officialWebsite,
        socialLinks: ROBIN_PADILLA_DATA.socialLinks,
        color: ROBIN_PADILLA_DATA.color,
        party: ROBIN_PADILLA_DATA.party,
        lastVerifiedAt: new Date()
      }
    });
  }

  // Upsert educations if not already populated
  const currentEduCount = await prisma.candidateEducation.count({ where: { candidateId } });
  if (currentEduCount === 0) {
    for (let i = 0; i < ROBIN_PADILLA_DATA.educations.length; i++) {
      const edu = ROBIN_PADILLA_DATA.educations[i];
      await prisma.candidateEducation.create({
        data: {
          candidateId,
          degree: edu.degree,
          institution: edu.institution,
          year: edu.year,
          sourceTitle: edu.sourceTitle,
          sourceUrl: edu.sourceUrl,
          displayOrder: i + 1,
          isVerified: true
        }
      });
    }
  }

  // Upsert public services if not already populated
  const currentPsCount = await prisma.candidatePublicService.count({ where: { candidateId } });
  if (currentPsCount === 0) {
    for (let i = 0; i < ROBIN_PADILLA_DATA.publicServices.length; i++) {
      const ps = ROBIN_PADILLA_DATA.publicServices[i];
      await prisma.candidatePublicService.create({
        data: {
          candidateId,
          position: ps.position,
          title: ps.title,
          period: ps.period,
          sourceTitle: ps.sourceTitle,
          sourceUrl: ps.sourceUrl,
          displayOrder: i + 1,
          isVerified: true
        }
      });
    }
  }

  // Upsert platforms if not already populated
  const currentPlatCount = await prisma.candidatePlatform.count({ where: { candidateId } });
  if (currentPlatCount === 0) {
    for (const p of ROBIN_PADILLA_DATA.platforms) {
      await prisma.candidatePlatform.create({
        data: {
          candidateId,
          title: p.title,
          description: p.description,
          category: p.category,
          sourceTitle: p.sourceTitle,
          sourceUrl: p.sourceUrl,
          sourceType: "LEGISLATIVE_RECORD",
          verificationStatus: "VERIFIED",
          verifiedAt: new Date()
        }
      });
    }
  }

  // Upsert sources if not already populated
  const currentSrcCount = await prisma.candidateSource.count({ where: { candidateId } });
  if (currentSrcCount === 0) {
    for (let i = 0; i < ROBIN_PADILLA_DATA.sources.length; i++) {
      const s = ROBIN_PADILLA_DATA.sources[i];
      await prisma.candidateSource.create({
        data: {
          candidateId,
          title: s.title,
          url: s.url,
          publisher: s.publisher,
          category: "GENERAL",
          verificationStatus: "VERIFIED",
          displayOrder: i + 1
        }
      });
    }
  }

  console.log(`Successfully ensured Senator Robin Padilla is seeded and up-to-date.`);
  return candidateId;
}

if (process.argv[1]?.endsWith('seed-robin-padilla.mjs')) {
  upsertRobinPadilla()
    .catch((err) => {
      console.error(err);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
