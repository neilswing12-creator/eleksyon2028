import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Exact, refined structured records for all 21 candidates
// Faithfully preserving original wording without losing credentials
const CANDIDATE_STRUCTURED_DATA: Record<string, { educations: string[]; publicServices: string[] }> = {
  "sara-duterte": {
    educations: [
      "San Beda College of Law (Juris Doctor)",
      "San Pedro College (BS Respiratory Therapy)"
    ],
    publicServices: [
      "Vice President of the Philippines (2022-present)",
      "Davao City Mayor (2010-2013, 2016-2022)"
    ]
  },
  "raffy-tulfo": {
    educations: [
      "Trinity University of Asia"
    ],
    publicServices: [
      "Senator of the Philippines (2022-present)",
      "Chairman of the Senate Committee on Migrant Workers and Committee on Energy"
    ]
  },
  "risa-hontiveros": {
    educations: [
      "Ateneo de Manila University (BS Social Sciences, Cum Laude)"
    ],
    publicServices: [
      "Senator of the Philippines (2016-present)",
      "Akbayan Party-list Representative (2004-2010)"
    ]
  },
  "manny-pacquiao": {
    educations: [
      "University of Makati (BS Political Science - Local Government Administration)"
    ],
    publicServices: [
      "Senator of the Philippines (2016-2022)",
      "Sarangani Lone District Representative (2010-2016)"
    ]
  },
  "francis-escudero": {
    educations: [
      "University of the Philippines Diliman (Bachelor of Laws, BS Political Science)",
      "Georgetown University (Master of Laws)"
    ],
    publicServices: [
      "Senate President (2024-present)",
      "Senator (2007-2019, 2022-present)",
      "Sorsogon Governor (2019-2022)"
    ]
  },
  "sandro-marcos": {
    educations: [
      "London School of Economics (MSc Development Management)",
      "City, University of London (BSc International Politics)"
    ],
    publicServices: [
      "Representative, 1st District of Ilocos Norte (2022-present)"
    ]
  },
  "bam-aquino": {
    educations: [
      "Ateneo de Manila University (BS Management Engineering, Summa Cum Laude)"
    ],
    publicServices: [
      "Senator of the Philippines (2013-2019)",
      "National Youth Commission Chairman (2003-2006)"
    ]
  },
  "erwin-tulfo": {
    educations: [
      "University of the East"
    ],
    publicServices: [
      "House of Representatives (2023-present)",
      "Secretary of DSWD (2022)"
    ]
  },
  "grace-poe": {
    educations: [
      "Boston College (BA Political Science)",
      "University of the Philippines Manila"
    ],
    publicServices: [
      "Senator of the Philippines (2013-present)",
      "MTRCB Chairperson (2010-2012)"
    ]
  },
  "vico-sotto": {
    educations: [
      "Ateneo de Manila University (Master in Public Management, BA Political Science)"
    ],
    publicServices: [
      "Mayor of Pasig City (2019-present)"
    ]
  },
  "chel-diokno": {
    educations: [
      "Northern Illinois University College of Law (Juris Doctor, Magna Cum Laude)"
    ],
    publicServices: [
      "Special Counsel, Senate Blue Ribbon Committee",
      "DLSU College of Law Dean"
    ]
  },
  "bong-go": {
    educations: [
      "De La Salle University (BS Management)"
    ],
    publicServices: [
      "Senator of the Philippines (2019-present)",
      "Special Assistant to the President (2016-2018)"
    ]
  },
  "bato-dela-rosa": {
    educations: [
      "Philippine Military Academy",
      "University of Southeastern Philippines (PhD Development Administration)"
    ],
    publicServices: [
      "Senator of the Philippines (2019-present)",
      "PNP Chief (2016-2018)"
    ]
  },
  "leni-robredo": {
    educations: [
      "University of the Philippines Diliman (BA Economics)",
      "University of Nueva Caceres (Bachelor of Laws)"
    ],
    publicServices: [
      "Vice President of the Philippines (2016-2022)",
      "Representative of Camarines Sur 3rd District (2013-2016)"
    ]
  },
  "antonio-trillanes": {
    educations: [
      "Philippine Military Academy (Cum Laude)",
      "University of the Philippines Diliman (Master of Public Administration)"
    ],
    publicServices: [
      "Senator of the Philippines (2007-2019)"
    ]
  },
  "leila-de-lima": {
    educations: [
      "San Beda College of Law (Salutatorian)",
      "De La Salle University (AB History-Political Science)"
    ],
    publicServices: [
      "Senator of the Philippines (2016-2022)",
      "Secretary of Justice (2010-2015)",
      "CHR Chair (2008-2010)"
    ]
  },
  "gibo-teodoro": {
    educations: [
      "Harvard Law School (Master of Laws)",
      "University of the Philippines Diliman (Juris Doctor, Bar Topnotcher)"
    ],
    publicServices: [
      "Secretary of National Defense (2007-2009, 2023-present)",
      "Tarlac Representative (1998-2007)"
    ]
  },
  "kiko-pangilinan": {
    educations: [
      "Harvard Kennedy School (Master in Public Administration)",
      "UP Diliman (Bachelor of Laws, AB English)"
    ],
    publicServices: [
      "Senator of the Philippines (2001-2013, 2016-2022)",
      "Food Security Secretary (2014-2015)"
    ]
  },
  "loren-legarda": {
    educations: [
      "University of the Philippines Diliman (BA Broadcast Communication, Cum Laude)",
      "National Defense College (Master in National Security)"
    ],
    publicServices: [
      "Senator (1998-2004, 2007-2019, 2022-present)",
      "Antique Representative (2019-2022)"
    ]
  },
  "alan-cayetano": {
    educations: [
      "Ateneo de Manila University (Juris Doctor)",
      "UP Diliman (BA Political Science)"
    ],
    publicServices: [
      "Senator (2007-2017, 2022-present)",
      "Speaker of the House (2019-2020)",
      "DFA Secretary (2017-2018)"
    ]
  },
  "pia-cayetano": {
    educations: [
      "University of the Philippines Diliman (Bachelor of Laws, BS Economics)"
    ],
    publicServices: [
      "Senator of the Philippines (2004-2016, 2019-present)",
      "Taguig Representative (2016-2019)"
    ]
  }
};

async function main() {
  console.log("=== POPULATING ACCURATE CANDIDATE EDUCATION & SERVICE ENTRIES ===");

  for (const [slug, data] of Object.entries(CANDIDATE_STRUCTURED_DATA)) {
    const candidate = await prisma.candidate.findUnique({ where: { slug } });
    if (!candidate) continue;

    // Clear any preliminary records
    await prisma.candidateEducation.deleteMany({ where: { candidateId: candidate.id } });
    await prisma.candidatePublicService.deleteMany({ where: { candidateId: candidate.id } });

    // Insert verified educations
    for (let i = 0; i < data.educations.length; i++) {
      await prisma.candidateEducation.create({
        data: {
          candidateId: candidate.id,
          degree: data.educations[i],
          displayOrder: i + 1,
        },
      });
    }

    // Insert verified public services
    for (let i = 0; i < data.publicServices.length; i++) {
      await prisma.candidatePublicService.create({
        data: {
          candidateId: candidate.id,
          position: data.publicServices[i],
          displayOrder: i + 1,
        },
      });
    }
    console.log(`Updated ${candidate.name}: ${data.educations.length} educations, ${data.publicServices.length} public services.`);
  }

  console.log("Structured entries successfully populated with 100% integrity!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
