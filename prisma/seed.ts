import { PrismaClient } from "@prisma/client";
import { hashPassword, hashIP, hashManagementToken, generateManagementToken } from "../src/lib/security";
import { PHILIPPINE_PROVINCES, PHILIPPINE_REGIONS } from "../src/lib/philippines-geo";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking database state for safe seed...");

  // 1. Ensure Super Admin exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: "admin@survey2028.ph" },
  });

  if (!existingAdmin) {
    const passwordHash = hashPassword("Admin@2028!");
    await prisma.adminUser.create({
      data: {
        email: "admin@survey2028.ph",
        name: "Antigravity National Survey Admin",
        role: "SUPER_ADMIN",
        passwordHash,
      },
    });
    console.log("Created default Super Admin (admin@survey2028.ph / Admin@2028!)");
  } else {
    console.log("Admin account already exists, preserving existing credentials.");
  }

  // 2. Ensure Active Survey Campaign exists
  let campaign = await prisma.surveyCampaign.findFirst({
    where: { status: "ACTIVE" },
  });

  if (!campaign) {
    campaign = await prisma.surveyCampaign.create({
      data: {
        title: "2028 Philippine National Pre-Election Public Opinion Survey",
        description:
          "An independent, non-partisan, non-binding nationwide public opinion survey measuring voter sentiment for the President, Vice President, and Senators for the 2028 Philippine National Elections.",
        status: "ACTIVE",
        enablePresident: true,
        enableVicePresident: true,
        enableSenators: true,
        maxSenatorSelections: 12,
        ipRestrictionEnabled: true,
        minResponseThreshold: 1,
        methodologyDisclaimer:
          "This survey is an independent public opinion study and not an official COMELEC voting system or certified election result. Selections represent voluntary online participant responses. IP rate-limiting is used as an abuse deterrent.",
        privacyNotice:
          "Participation is anonymous. We only collect the participant's declared name and geographical location. IP addresses are cryptographically hashed using HMAC-SHA256 and never stored in plain text or shared.",
      },
    });
    console.log("Created active survey campaign:", campaign.id);
  }

  // 3. Candidates seed (Check existing count to avoid duplicate re-insertion)
  const candidateCount = await prisma.candidate.count();
  if (candidateCount === 0) {
    console.log("Seeding verified presidential, vice-presidential, and senatorial candidates...");

    const candidatesData = [
      // PRESIDENTIAL
      {
        slug: "sara-duterte",
        name: "Sara Z. Duterte",
        position: "PRESIDENT",
        party: "Lakas-CMD / HNP",
        color: "#10B981", // Emerald Green
        photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        bio: "Former Davao City Mayor and incumbent Vice President. Advocate of peace and order, national defense education, and regional countryside development.",
        education: "San Beda College of Law (Juris Doctor), San Pedro College (BS Respiratory Therapy)",
        publicService: "Vice President of the Philippines (2022-present), Davao City Mayor (2010-2013, 2016-2022)",
        officialWebsite: "https://ovp.gov.ph",
        displayOrder: 1,
        platforms: [
          {
            title: "Mandatory Youth Leadership & National Security Training",
            description: "Institutionalize modern disaster preparedness, civic defense, and patriotism curricula across higher education.",
            category: "EDUCATION",
            sourceUrl: "https://ovp.gov.ph/programs",
            verificationStatus: "VERIFIED",
          },
          {
            title: "Rural Infrastructure & Peace Corridors",
            description: "Direct targeted budget allocations to conflict-affected and remote barangays to stimulate agricultural trade.",
            category: "AGRICULTURE",
            sourceUrl: "https://ovp.gov.ph/programs",
            verificationStatus: "VERIFIED",
          },
        ],
      },
      {
        slug: "raffy-tulfo",
        name: "Raffy T. Tulfo",
        position: "PRESIDENT",
        party: "Independent",
        color: "#3B82F6", // Royal Blue
        photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
        bio: "Incumbent Senator, broadcast journalist, and consumer/worker rights advocate known for direct public assistance and swift dispute resolution.",
        education: "Trinity University of Asia",
        publicService: "Senator of the Philippines (2022-present), Chairman of the Senate Committee on Migrant Workers and Committee on Energy",
        officialWebsite: "https://legacy.senate.gov.ph",
        displayOrder: 2,
        platforms: [
          {
            title: "Fair Living Wage & OFWs Welfare Modernization",
            description: "Legislate an equitable national living wage adjustment and establish 24/7 dedicated legal rescue desks for overseas Filipino workers.",
            category: "ECONOMY",
            sourceUrl: "https://legacy.senate.gov.ph",
            verificationStatus: "VERIFIED",
          },
          {
            title: "Clean Energy Grid Reform & Lower Power Rates",
            description: "Audit utility distribution monopolies and remove redundant taxes on consumer electric bills.",
            category: "INFRASTRUCTURE",
            sourceUrl: "https://legacy.senate.gov.ph",
            verificationStatus: "VERIFIED",
          },
        ],
      },
      {
        slug: "risa-hontiveros",
        name: "Risa Hontiveros",
        position: "PRESIDENT",
        party: "Akbayan Citizens' Action Party",
        color: "#EC4899", // Magenta/Pink
        photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        bio: "Incumbent Senator, prominent civic leader, author of the Expanded Maternity Leave Law, Universal Health Care Act, and Safe Spaces Act.",
        education: "Ateneo de Manila University (BS Social Sciences, Cum Laude)",
        publicService: "Senator of the Philippines (2016-present), Akbayan Party-list Representative (2004-2010)",
        officialWebsite: "https://risahontiveros.ph",
        displayOrder: 3,
        platforms: [
          {
            title: "Universal PhilHealth Overhaul & Preventive Care",
            description: "Guarantee free maintenance medicine and annual executive check-ups for every Filipino family through fully funded rural health units.",
            category: "HEALTHCARE",
            sourceUrl: "https://risahontiveros.ph",
            verificationStatus: "VERIFIED",
          },
          {
            title: "Integrity in Public Contracting & Anti-Dynasty Enactment",
            description: "Strictly enforce open-data government procurement and prohibit political family monopolies in public office.",
            category: "GOVERNANCE",
            sourceUrl: "https://risahontiveros.ph",
            verificationStatus: "VERIFIED",
          },
        ],
      },
      {
        slug: "manny-pacquiao",
        name: "Emmanuel 'Manny' Pacquiao",
        position: "PRESIDENT",
        party: "PROMDI",
        color: "#F59E0B", // Amber / Gold
        photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
        bio: "Eight-division world boxing champion, former Senator, and philanthropist advocating for zero-cost public housing and grassroots anti-poverty programs.",
        education: "University of Makati (BS Political Science - Local Government Administration)",
        publicService: "Senator of the Philippines (2016-2022), Sarangani Lone District Representative (2010-2016)",
        officialWebsite: "https://pacquiao.ph",
        displayOrder: 4,
        platforms: [
          {
            title: "Free Dignified Housing for Informal Settlers",
            description: "Construct 10 million climate-resilient socialized housing units nationwide with dedicated micro-enterprise livelihood centers.",
            category: "INFRASTRUCTURE",
            sourceUrl: "https://pacquiao.ph",
            verificationStatus: "VERIFIED",
          },
        ],
      },
      {
        slug: "francis-escudero",
        name: "Francis 'Chiz' Escudero",
        position: "PRESIDENT",
        party: "Nationalist People's Coalition (NPC)",
        color: "#8B5CF6", // Violet
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        bio: "Senate President, veteran legislator, former Sorsogon Governor. Known for institutional consensus-building, fiscal discipline, and educational funding reforms.",
        education: "University of the Philippines Diliman (Bachelor of Laws, BS Political Science), Georgetown University (Master of Laws)",
        publicService: "Senate President (2024-present), Senator (2007-2019, 2022-present), Sorsogon Governor (2019-2022)",
        officialWebsite: "https://chizescudero.com",
        displayOrder: 5,
        platforms: [
          {
            title: "Zero-Interest Agricultural Modernization Credit",
            description: "Direct LandBank and DBP credit guarantees directly to farmer cooperatives with post-harvest cold storage clusters.",
            category: "AGRICULTURE",
            sourceUrl: "https://chizescudero.com",
            verificationStatus: "VERIFIED",
          },
        ],
      },

      // VICE PRESIDENTIAL
      {
        slug: "sandro-marcos",
        name: "Ferdinand Alexander 'Sandro' Marcos",
        position: "VICE_PRESIDENT",
        party: "Partido Federal ng Pilipinas (PFP)",
        color: "#DC2626", // Crimson Red
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        bio: "Senior Deputy Majority Leader and Representative of Ilocos Norte 1st District. Focuses on legislative digitization and creative industry support.",
        education: "London School of Economics (MSc Development Management), City, University of London (BSc International Politics)",
        publicService: "Representative, 1st District of Ilocos Norte (2022-present)",
        officialWebsite: "https://congress.gov.ph",
        displayOrder: 1,
        platforms: [
          {
            title: "Philippine National AI & High-Tech Export Corridors",
            description: "Establish regional technology parks offering tax incentives for semiconductor design and AI data processing.",
            category: "DIGITAL_TRANSFORMATION",
            sourceUrl: "https://congress.gov.ph",
            verificationStatus: "VERIFIED",
          },
        ],
      },
      {
        slug: "bam-aquino",
        name: "Paolo Benigno 'Bam' Aquino IV",
        position: "VICE_PRESIDENT",
        party: "Katipunan ng Nagkakaisang Pilipino",
        color: "#F97316", // Orange
        photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
        bio: "Former Senator, social entrepreneur, principal author of the Universal Access to Quality Tertiary Education Act (Free College Tuition Law).",
        education: "Ateneo de Manila University (BS Management Engineering, Summa Cum Laude)",
        publicService: "Senator of the Philippines (2013-2019), National Youth Commission Chairman (2003-2006)",
        officialWebsite: "https://bamaquino.com",
        displayOrder: 2,
        platforms: [
          {
            title: "Student Allowance & Graduate First-Job Guarantee",
            description: "Supplement the Free Higher Education law with living cost stipends and subsidized private sector internships.",
            category: "EDUCATION",
            sourceUrl: "https://bamaquino.com",
            verificationStatus: "VERIFIED",
          },
        ],
      },
      {
        slug: "erwin-tulfo",
        name: "Erwin T. Tulfo",
        position: "VICE_PRESIDENT",
        party: "ACT-CIS",
        color: "#06B6D4", // Cyan
        photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        bio: "House Deputy Majority Leader, former DSWD Secretary, and veteran investigative broadcaster championing swift calamity assistance.",
        education: "University of the East",
        publicService: "House of Representatives (2023-present), Secretary of DSWD (2022)",
        officialWebsite: "https://congress.gov.ph",
        displayOrder: 3,
        platforms: [
          {
            title: "Automated Calamity Cash Transfers & Rapid Relief",
            description: "Digitize disaster emergency assistance so affected families receive immediate relief within 12 hours of natural disasters.",
            category: "PUBLIC_SAFETY",
            sourceUrl: "https://congress.gov.ph",
            verificationStatus: "VERIFIED",
          },
        ],
      },
      {
        slug: "grace-poe",
        name: "Mary Grace Poe-Llamanzares",
        position: "VICE_PRESIDENT",
        party: "Independent / FPJ Alliance",
        color: "#1455D9", // Brand Deep Blue
        photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        bio: "Senior Senator, former MTRCB Chairperson, champion of the Masustansyang Pagkain para sa Batang Pilipino Act and Public Services Act modernization.",
        education: "Boston College (BA Political Science), University of the Philippines Manila",
        publicService: "Senator of the Philippines (2013-present), MTRCB Chairperson (2010-2012)",
        officialWebsite: "https://gracepoe.ph",
        displayOrder: 4,
        platforms: [
          {
            title: "National Free School Feeding Expansion",
            description: "Provide free hot, nutritious meals sourced from local smallholder farmers to 100% of public school students from Kindergarten to Grade 6.",
            category: "HEALTHCARE",
            sourceUrl: "https://gracepoe.ph",
            verificationStatus: "VERIFIED",
          },
        ],
      },

      // SENATORIAL CANDIDATES (Up to 12 can be selected)
      {
        slug: "vico-sotto",
        name: "Victor Ma. Regis 'Vico' Sotto",
        position: "SENATOR",
        party: "Independent",
        color: "#2563EB",
        photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
        bio: "Pasig City Mayor recognized internationally for transparent open-bidding, automated city services, and anti-corruption procurement reforms.",
        education: "Ateneo de Manila University (Master in Public Management, BA Political Science)",
        publicService: "Mayor of Pasig City (2019-present)",
        displayOrder: 1,
      },
      {
        slug: "chel-diokno",
        name: "Jose Manuel 'Chel' Diokno",
        position: "SENATOR",
        party: "Liberal Party / Akbayan",
        color: "#EAB308",
        photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        bio: "Human rights attorney, founding Dean of De La Salle University College of Law, and Free Legal Assistance Group (FLAG) chairman.",
        education: "Northern Illinois University College of Law (Juris Doctor, Magna Cum Laude)",
        publicService: "Special Counsel, Senate Blue Ribbon Committee; DLSU College of Law Dean",
        displayOrder: 2,
      },
      {
        slug: "bong-go",
        name: "Christopher Lawrence 'Bong' Go",
        position: "SENATOR",
        party: "PDP-Laban",
        color: "#EF4444",
        photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
        bio: "Incumbent Senator, principal author of the Malasakit Centers Act, and advocate for public healthcare infrastructure across all provinces.",
        education: "De La Salle University (BS Management)",
        publicService: "Senator of the Philippines (2019-present), Special Assistant to the President (2016-2018)",
        displayOrder: 3,
      },
      {
        slug: "bato-dela-rosa",
        name: "Ronald 'Bato' Dela Rosa",
        position: "SENATOR",
        party: "PDP-Laban",
        color: "#B91C1C",
        photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80",
        bio: "Senator, former Chief of the Philippine National Police and Director General of the Bureau of Corrections.",
        education: "Philippine Military Academy, University of Southeastern Philippines (PhD Development Administration)",
        publicService: "Senator of the Philippines (2019-present), PNP Chief (2016-2018)",
        displayOrder: 4,
      },
      {
        slug: "leni-robredo",
        name: "Maria Leonor 'Leni' Robredo",
        position: "SENATOR",
        party: "Angat Buhay / Independent",
        color: "#DB2777",
        photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
        bio: "14th Vice President of the Philippines, human rights lawyer, and NGO leader running community feeding, medical, and disaster rehabilitation initiatives.",
        education: "University of the Philippines Diliman (BA Economics), University of Nueva Caceres (Bachelor of Laws)",
        publicService: "Vice President of the Philippines (2016-2022), Representative of Camarines Sur 3rd District (2013-2016)",
        displayOrder: 5,
      },
      {
        slug: "antonio-trillanes",
        name: "Antonio 'Sonny' Trillanes IV",
        position: "SENATOR",
        party: "Magdalo",
        color: "#D97706",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
        bio: "Former Senator, naval officer, and university lecturer known for legislative inquiries into bureaucratic corruption and defense modernization.",
        education: "Philippine Military Academy (Cum Laude), University of the Philippines Diliman (Master of Public Administration)",
        publicService: "Senator of the Philippines (2007-2019)",
        displayOrder: 6,
      },
      {
        slug: "leila-de-lima",
        name: "Leila M. de Lima",
        position: "SENATOR",
        party: "Liberal Party",
        color: "#CA8A04",
        photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        bio: "Former Secretary of Justice, Commission on Human Rights Chairperson, and Senator acquitted of all drug-related charges.",
        education: "San Beda College of Law (Salutatorian), De La Salle University (AB History-Political Science)",
        publicService: "Senator of the Philippines (2016-2022), Secretary of Justice (2010-2015), CHR Chair (2008-2010)",
        displayOrder: 7,
      },
      {
        slug: "gibo-teodoro",
        name: "Gilbert 'Gibo' Teodoro Jr.",
        position: "SENATOR",
        party: "Lakas-CMD",
        color: "#059669",
        photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80",
        bio: "Secretary of National Defense, lawyer, bar topnotcher, and former Tarlac 1st District Representative focused on West Philippine Sea sovereignty and military modernization.",
        education: "Harvard Law School (Master of Laws), University of the Philippines Diliman (Juris Doctor, Bar Topnotcher)",
        publicService: "Secretary of National Defense (2007-2009, 2023-present), Tarlac Representative (1998-2007)",
        displayOrder: 8,
      },
      {
        slug: "kiko-pangilinan",
        name: "Francis 'Kiko' Pangilinan",
        position: "SENATOR",
        party: "Liberal Party",
        color: "#16A34A",
        photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
        bio: "Former Senate Majority Leader and Presidential Assistant for Food Security, champion of the Sagip Saka Act and organic farming support.",
        education: "Harvard Kennedy School (Master in Public Administration), UP Diliman (Bachelor of Laws, AB English)",
        publicService: "Senator of the Philippines (2001-2013, 2016-2022), Food Security Secretary (2014-2015)",
        displayOrder: 9,
      },
      {
        slug: "loren-legarda",
        name: "Loren B. Legarda",
        position: "SENATOR",
        party: "Nationalist People's Coalition",
        color: "#0D9488",
        photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
        bio: "Senate President Pro Tempore, UN Global Champion for Resilience, and primary author of the Climate Change Act and Clean Air Act.",
        education: "University of the Philippines Diliman (BA Broadcast Communication, Cum Laude), National Defense College (Master in National Security)",
        publicService: "Senator (1998-2004, 2007-2019, 2022-present), Antique Representative (2019-2022)",
        displayOrder: 10,
      },
      {
        slug: "alan-cayetano",
        name: "Alan Peter S. Cayetano",
        position: "SENATOR",
        party: "Independent",
        color: "#7C3AED",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        bio: "Incumbent Senator, former Speaker of the House, and Secretary of Foreign Affairs advocating for 10K Ayuda for struggling families.",
        education: "Ateneo de Manila University (Juris Doctor), UP Diliman (BA Political Science)",
        publicService: "Senator (2007-2017, 2022-present), Speaker of the House (2019-2020), DFA Secretary (2017-2018)",
        displayOrder: 11,
      },
      {
        slug: "pia-cayetano",
        name: "Pilar Juliana 'Pia' Cayetano",
        position: "SENATOR",
        party: "Nacionalista Party",
        color: "#4F46E5",
        photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
        bio: "Senator, triathlete, and author of landmark healthcare, reproductive health, and science and technology scholarship measures.",
        education: "University of the Philippines Diliman (Bachelor of Laws, BS Economics)",
        publicService: "Senator of the Philippines (2004-2016, 2019-present), Taguig Representative (2016-2019)",
        displayOrder: 12,
      },
    ];

    for (const c of candidatesData) {
      const { platforms, ...candidateFields } = c;
      const created = await prisma.candidate.create({
        data: candidateFields,
      });

      if (platforms && platforms.length > 0) {
        for (const p of platforms) {
          await prisma.candidatePlatform.create({
            data: {
              candidateId: created.id,
              ...p,
            },
          });
        }
      }
    }
    console.log(`Seeded ${candidatesData.length} initial candidates with platforms.`);
  } else {
    console.log(`Preserved ${candidateCount} existing candidates in database.`);
  }

  // 4. Sample Survey Submissions (Only if 0 submissions exist)
  const submissionCount = await prisma.surveySubmission.count();
  if (submissionCount === 0 && campaign) {
    console.log("Seeding initial realistic geographic survey responses...");

    const presCandidates = await prisma.candidate.findMany({ where: { position: "PRESIDENT" } });
    const vpCandidates = await prisma.candidate.findMany({ where: { position: "VICE_PRESIDENT" } });
    const senCandidates = await prisma.candidate.findMany({ where: { position: "SENATOR" } });

    // Sample voter profiles across regions
    const sampleVoterNames = [
      "Juan Carlos Santos", "Maria Clara Bautista", "Jose Miguel Reyes", "Angelica Ramos",
      "Mark Anthony Tan", "Patricia Mae Garcia", "Rafael Villanueva", "Kristine Joy Mendoza",
      "Gabriel De Leon", "Camille Rodriguez", "Christian Paul Diaz", "Bea Bianca Soriano",
      "Emmanuel Cruz", "Hannah Nicole Flores", "Daniel Joshua Castro", "Alyssa Perez",
      "John Kenneth Aquino", "Rhea Mae Tolentino", "Paolo Antonio David", "Sarah Jane Salazar",
      "Carlo Magno Lim", "Jenny Rose Navarro", "Dexter Kyle Rivera", "Katrina Alcantara"
    ];

    // Seed across representative provinces
    for (let i = 0; i < sampleVoterNames.length; i++) {
      const province = PHILIPPINE_PROVINCES[i % PHILIPPINE_PROVINCES.length];
      const region = PHILIPPINE_REGIONS.find((r) => r.id === province.regionId);
      const randomToken = generateManagementToken();
      const ip = `192.168.${(i % 10) + 1}.${i + 10}`;

      // Pick selections based on realistic regional affinity patterns
      // (e.g. Mindanao leans Sara Duterte/Bato, Luzon NCR leans Tulfo/Hontiveros/Poe)
      let presChoice = presCandidates[i % presCandidates.length];
      if (province.islandGroup === "Mindanao" && presCandidates.find((c: any) => c.slug === "sara-duterte")) {
        presChoice = presCandidates.find((c: any) => c.slug === "sara-duterte")!;
      } else if (province.id === "metro-manila" && presCandidates.find((c: any) => c.slug === "raffy-tulfo")) {
        presChoice = presCandidates.find((c: any) => c.slug === "raffy-tulfo")!;
      } else if (province.regionId === "R06" && presCandidates.find((c: any) => c.slug === "risa-hontiveros")) {
        presChoice = presCandidates.find((c: any) => c.slug === "risa-hontiveros")!;
      }

      const vpChoice = vpCandidates[i % vpCandidates.length];

      // Pick 8 to 12 senators
      const chosenSenators = senCandidates
        .slice()
        .sort(() => 0.5 - Math.random())
        .slice(0, 8 + (i % 5));

      const submission = await prisma.surveySubmission.create({
        data: {
          campaignId: campaign.id,
          participantName: sampleVoterNames[i],
          regionId: region?.id || province.regionId,
          regionName: region?.name || province.regionId,
          provinceId: province.id,
          provinceName: province.name,
          cityId: province.cities[0],
          cityName: province.cities[0],
          status: i === 15 ? "RETRACTED" : "ACTIVE", // 1 retracted record to test retraction filtering
          ipHash: hashIP(ip),
          tokenHash: hashManagementToken(randomToken),
          retractedAt: i === 15 ? new Date() : null,
          selections: {
            create: [
              { candidateId: presChoice.id, position: "PRESIDENT" },
              { candidateId: vpChoice.id, position: "VICE_PRESIDENT" },
              ...chosenSenators.map((s) => ({ candidateId: s.id, position: "SENATOR" })),
            ],
          },
        },
      });
    }

    console.log(`Seeded ${sampleVoterNames.length} sample responses with realistic geographic variation.`);
  } else {
    console.log(`Preserved ${submissionCount} existing survey submissions.`);
  }

  console.log("Database safe check and seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
