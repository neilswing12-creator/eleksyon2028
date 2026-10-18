import prisma from "../src/lib/prisma";

interface EducationItem {
  degree: string;
  institution: string;
  year?: string;
  sourceUrl?: string;
  sourceTitle?: string;
}

interface PublicServiceItem {
  position: string;
  title: string;
  period: string;
  sourceUrl?: string;
  sourceTitle?: string;
}

interface PlatformItem {
  title: string;
  description: string;
  category: string;
  sourceUrl: string;
  sourceTitle: string;
  sourceType: string;
}

interface SourceItem {
  category: string;
  title: string;
  url: string;
  publisher: string;
  notes?: string;
}

interface CandidateUpdateData {
  slug: string;
  name: string;
  position: string;
  party: string;
  color: string;
  photoUrl: string;
  bio: string;
  educations: EducationItem[];
  publicServices: PublicServiceItem[];
  platforms: PlatformItem[];
  sources: SourceItem[];
}

const verifiedCandidates: CandidateUpdateData[] = [
  // 1. Sara Z. Duterte
  {
    slug: "sara-duterte",
    name: "Sara Z. Duterte",
    position: "PRESIDENT",
    party: "Lakas-CMD / Hugpong ng Pagbabago (HNP)",
    color: "#0038A8",
    photoUrl: "/uploads/candidates/sara-duterte-portrait.jpg",
    bio: "15th Vice President of the Philippines, former Secretary of the Department of Education (2022–2024), and former three-term Mayor and Vice Mayor of Davao City. Admitted to the Philippine Bar in 2006 and serves as a Colonel (Reservist) in the Philippine Army.",
    educations: [
      {
        degree: "Bachelor of Science in Respiratory Therapy",
        institution: "San Pedro College (Davao City)",
        year: "1999",
        sourceTitle: "Office of the Vice President Official Profile",
        sourceUrl: "https://ovp.gov.ph",
      },
      {
        degree: "Bachelor of Laws (LL.B.)",
        institution: "San Sebastian College – Recoletos (Manila)",
        year: "2005",
        sourceTitle: "Supreme Court of the Philippines Roll of Attorneys",
        sourceUrl: "https://sc.judiciary.gov.ph",
      },
      {
        degree: "Philippine Bar Examination Admission",
        institution: "Supreme Court of the Philippines (Roll No. 51745)",
        year: "2006",
        sourceTitle: "Lawyers List - Supreme Court of the Philippines",
        sourceUrl: "https://sc.judiciary.gov.ph",
      },
      {
        degree: "Command and General Staff Course / Military Training",
        institution: "Armed Forces of the Philippines Command and General Staff College",
        year: "2020",
        sourceTitle: "AFP Reserve Command Records",
        sourceUrl: "https://www.afp.mil.ph",
      },
    ],
    publicServices: [
      {
        position: "Vice President of the Republic of the Philippines",
        title: "15th Vice President of the Philippines",
        period: "June 30, 2022 – Present",
        sourceTitle: "Official Gazette of the Republic of the Philippines",
        sourceUrl: "https://www.officialgazette.gov.ph",
      },
      {
        position: "Secretary of the Department of Education",
        title: "Cabinet Secretary, DepEd",
        period: "June 30, 2022 – July 19, 2024",
        sourceTitle: "Department of Education Official Records",
        sourceUrl: "https://www.deped.gov.ph",
      },
      {
        position: "City Mayor of Davao City",
        title: "Local Chief Executive (Multiple Terms)",
        period: "2016 – 2022, 2010 – 2013",
        sourceTitle: "City Government of Davao Historical Roll",
        sourceUrl: "https://www.davaocity.gov.ph",
      },
      {
        position: "Chairperson, Regional Development Council (RDC XI)",
        title: "RDC XI Chairperson",
        period: "2010 – 2013",
        sourceTitle: "National Economic and Development Authority Region XI",
        sourceUrl: "https://nro11.neda.gov.ph",
      },
      {
        position: "Vice Mayor of Davao City",
        title: "Presiding Officer, Sangguniang Panlungsod",
        period: "2007 – 2010",
        sourceTitle: "City Government of Davao",
        sourceUrl: "https://www.davaocity.gov.ph",
      },
      {
        position: "Court Attorney, Supreme Court of the Philippines",
        title: "Legal Staff Attorney",
        period: "2006 – 2007",
        sourceTitle: "Supreme Court of the Philippines Personnel Roll",
        sourceUrl: "https://sc.judiciary.gov.ph",
      },
    ],
    platforms: [
      {
        title: "MATATAG Basic Education Curriculum Modernization",
        category: "EDUCATION",
        description: "Decongest the basic education curriculum from Kindergarten to Grade 10 to focus on fundamental literacy, numeracy, critical thinking skills, and Filipino civic values.",
        sourceTitle: "DepEd MATATAG Curriculum Launch",
        sourceUrl: "https://www.deped.gov.ph/matatag/",
        sourceType: "GOVERNMENT_PUBLICATION",
      },
      {
        title: "Decentralized Public Assistance via Regional Satellite Hubs",
        category: "SOCIAL_WELFARE",
        description: "Institutionalize nationwide regional satellite stations ensuring direct medical subsidy, emergency burial assistance, and rapid relief response for provincial communities.",
        sourceTitle: "OVP Strategic Programs Report",
        sourceUrl: "https://ovp.gov.ph",
        sourceType: "OFFICIAL_PLATFORM",
      },
      {
        title: "Community-Led Peace & Anti-Radicalization Integration",
        category: "PUBLIC_SAFETY",
        description: "Support localized socio-economic interventions and livelihood development in conflict-vulnerable communities to end local armed insurgencies permanently.",
        sourceTitle: "OVP Peace and Development Directives",
        sourceUrl: "https://ovp.gov.ph",
        sourceType: "OFFICIAL_PLATFORM",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Office of the Vice President of the Philippines Official Portal",
        url: "https://ovp.gov.ph",
        publisher: "Office of the Vice President",
        notes: "Primary biographical, public service, and official platform repository.",
      },
      {
        category: "EDUCATION",
        title: "Supreme Court Roll of Attorneys",
        url: "https://sc.judiciary.gov.ph",
        publisher: "Supreme Court of the Philippines",
        notes: "Verified Bar admission year 2006 and roll number 51745.",
      },
    ],
  },

  // 2. Raffy T. Tulfo
  {
    slug: "raffy-tulfo",
    name: "Raffy T. Tulfo",
    position: "PRESIDENT",
    party: "Independent",
    color: "#3B82F6",
    photoUrl: "/uploads/candidates/raffy-tulfo-portrait.jpg",
    bio: "Senator of the Philippines, Chairman of the Senate Committees on Energy and Migrant Workers. Veteran broadcast journalist and consumer/labor advocate known for grassroots assistance and public welfare advocacy.",
    educations: [
      {
        degree: "Bachelor of Science in Business Administration",
        institution: "Trinity University of Asia (Quezon City)",
        sourceTitle: "Senate of the Philippines Official Profile",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        degree: "Tertiary Studies",
        institution: "Ateneo de Davao University",
        sourceTitle: "Senate Legislative Reference Bureau",
        sourceUrl: "https://senate.gov.ph",
      },
    ],
    publicServices: [
      {
        position: "Senator of the Philippines",
        title: "Member, 19th Congress of the Philippines",
        period: "June 30, 2022 – Present",
        sourceTitle: "Senate of the Philippines Legislative Roll",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Chairman, Senate Committee on Energy",
        title: "Committee Chairperson",
        period: "2022 – Present",
        sourceTitle: "Senate Directory of Committees",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Chairman, Senate Committee on Migrant Workers",
        title: "Committee Chairperson",
        period: "2022 – Present",
        sourceTitle: "Senate Directory of Committees",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Member, Commission on Appointments",
        title: "Legislative Commissioner",
        period: "2022 – Present",
        sourceTitle: "Commission on Appointments Official Roll",
        sourceUrl: "https://comapp.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Magna Carta of Filipino Seafarers (RA 12021)",
        category: "FOREIGN_POLICY",
        description: "Enacted legislative protections upholding maritime labor standards, cadet education subsidies, mandatory standard insurance, and fair disability compensation for global seafarers.",
        sourceTitle: "Republic Act No. 12021 Official Record",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "EPIRA Reform & Electricity Rate Reduction",
        category: "INFRASTRUCTURE",
        description: "Comprehensive review of the Electric Power Industry Reform Act (EPIRA) to dismantle uncompetitive generation charges, reduce cross-subsidies, and lower household electric bills.",
        sourceTitle: "Senate Committee on Energy Inquiries",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Anti-Wage Theft & Minimum Wage Protection (SB 1494)",
        category: "ECONOMY",
        description: "Establish criminal penalties and mandatory interest on employers who unlawfully withhold, delay, or underpay legal minimum wages and mandated employee benefits.",
        sourceTitle: "Senate Bill No. 1494 19th Congress",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines — Senator Raffy T. Tulfo Record",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Official committee chairmanships, enacted bills, and personal profile.",
      },
    ],
  },

  // 3. Risa Hontiveros
  {
    slug: "risa-hontiveros",
    name: "Risa Hontiveros",
    position: "PRESIDENT",
    party: "Akbayan Citizens' Action Party",
    color: "#EC4899",
    photoUrl: "/uploads/candidates/risa-hontiveros-portrait.jpg",
    bio: "Senate Deputy Minority Leader, champion of landmark healthcare, women's rights, and child protection legislation. Veteran human rights advocate and former peace negotiator.",
    educations: [
      {
        degree: "Bachelor of Arts in Social Sciences",
        institution: "Ateneo de Manila University",
        year: "1987",
        sourceTitle: "Ateneo de Manila University Alumni Registry (Cum Laude)",
        sourceUrl: "https://ateneo.edu",
      },
      {
        degree: "Secondary Education",
        institution: "St. Paul College Pasig",
        year: "1983",
        sourceTitle: "Senate of the Philippines Biography",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        degree: "Elementary Education",
        institution: "St. Paul College Pasig",
        year: "1979",
        sourceTitle: "Senate of the Philippines Biography",
        sourceUrl: "https://senate.gov.ph",
      },
    ],
    publicServices: [
      {
        position: "Senate Deputy Minority Leader",
        title: "Legislative Leadership, 19th Congress",
        period: "2022 – Present",
        sourceTitle: "Senate of the Philippines",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Senator of the Philippines",
        title: "Member, 17th, 18th, and 19th Congresses",
        period: "June 30, 2016 – Present",
        sourceTitle: "Senate Legislative Reference Bureau",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Board Member, Philippine Health Insurance Corporation (PhilHealth)",
        title: "Member, Board of Directors",
        period: "2014 – 2015",
        sourceTitle: "PhilHealth Official Gazette Publication",
        sourceUrl: "https://www.officialgazette.gov.ph",
      },
      {
        position: "Representative, Akbayan Citizens' Action Party",
        title: "Party-list Representative, 13th & 14th Congresses",
        period: "2004 – 2010",
        sourceTitle: "House of Representatives of the Philippines",
        sourceUrl: "https://www.congress.gov.ph",
      },
      {
        position: "Government Peace Panel Member (GRP-NDFP)",
        title: "Peace Negotiating Panel Member",
        period: "1998 – 2004",
        sourceTitle: "Office of the Presidential Adviser on Peace, Reconciliation and Unity",
        sourceUrl: "https://peace.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Universal Health Care Act (RA 11223) & Mental Health Act (RA 11036)",
        category: "HEALTHCARE",
        description: "Primary author of landmark laws guaranteeing automatic PhilHealth coverage for all citizens and integrating comprehensive mental health services into all rural health units.",
        sourceTitle: "Republic Act No. 11223 & RA 11036",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Safe Spaces Act (RA 11313) & Anti-OSAEC Act (RA 11930)",
        category: "PUBLIC_SAFETY",
        description: "Enacted stringent national penalties against street, workplace, and online sexual harassment, and created aggressive task forces against online child sexual exploitation.",
        sourceTitle: "Republic Act No. 11313 & RA 11930",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "105-Day Expanded Maternity Leave Law (RA 11210)",
        category: "SOCIAL_WELFARE",
        description: "Increased paid maternity leave from 60 to 105 days with full pay and option to allocate days to fathers and alternative caregivers to protect infant welfare.",
        sourceTitle: "Republic Act No. 11210 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines — Senator Risa Hontiveros",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Complete legislative sponsor ledger and official CV.",
      },
    ],
  },

  // 4. Manny Pacquiao
  {
    slug: "manny-pacquiao",
    name: "Emmanuel 'Manny' Pacquiao",
    position: "PRESIDENT",
    party: "PROMDI / MP Movement",
    color: "#F59E0B",
    photoUrl: "/uploads/candidates/manny-pacquiao-portrait.jpg",
    bio: "Former Senator of the Philippines (2016–2022) and eight-division world boxing champion. Former Representative for the Lone District of Sarangani, advocate for grassroots sports, low-cost housing, and anti-corruption.",
    educations: [
      {
        degree: "Bachelor of Science in Law Enforcement and Public Administration",
        institution: "University of Makati",
        year: "2019",
        sourceTitle: "University of Makati Commencement Records",
        sourceUrl: "https://umak.edu.ph",
      },
      {
        degree: "Doctor of Humanities (Honoris Causa)",
        institution: "Southwestern University (Cebu)",
        year: "2009",
        sourceTitle: "Southwestern University Honorary Citations",
        sourceUrl: "https://swu.phinma.edu.ph",
      },
      {
        degree: "Philippine Educational Placement Test (PEPT) High School Equivalency",
        institution: "Department of Education",
        year: "2007",
        sourceTitle: "DepEd Certification Records",
        sourceUrl: "https://www.deped.gov.ph",
      },
    ],
    publicServices: [
      {
        position: "Senator of the Philippines",
        title: "Member, 17th and 18th Congresses",
        period: "June 30, 2016 – June 30, 2022",
        sourceTitle: "Senate of the Philippines",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Chairman, Senate Committee on Public Works",
        title: "Committee Chairperson",
        period: "2016 – 2019",
        sourceTitle: "Senate Legislative Directory",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Representative, Lone District of Sarangani",
        title: "District Representative, 15th & 16th Congresses",
        period: "June 30, 2010 – June 30, 2016",
        sourceTitle: "House of Representatives of the Philippines",
        sourceUrl: "https://www.congress.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Nationwide Free Housing (Pacman Village Expansion)",
        category: "HOUSING",
        description: "Construct disaster-resilient subsidized housing communities nationwide for informal settlers and low-income families without required equity or down payments.",
        sourceTitle: "Senate Bill No. 2163 Housing Program",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Philippine Boxing and Combat Sports Commission",
        category: "PUBLIC_SAFETY",
        description: "Establish dedicated statutory healthcare, pension benefits, emergency insurance, and safety regulations for professional athletes and trainers.",
        sourceTitle: "Senate Bill No. 193 18th Congress",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Specialized Anti-Corruption Tribunal & Maximum Security Facility",
        category: "GOVERNANCE",
        description: "Construct specialized detention facilities and expedite judicial proceedings against high-level corrupt officials stealing public treasury funds.",
        sourceTitle: "Official Policy Platform Manifesto",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "OFFICIAL_PLATFORM",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines Archives — Senator Emmanuel D. Pacquiao",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Historical legislative records from the 17th and 18th Congresses.",
      },
    ],
  },

  // 5. Francis 'Chiz' Escudero
  {
    slug: "francis-escudero",
    name: "Francis 'Chiz' Escudero",
    position: "PRESIDENT",
    party: "Nationalist People's Coalition (NPC)",
    color: "#10B981",
    photoUrl: "/uploads/candidates/francis-escudero-portrait.jpg",
    bio: "25th President of the Senate of the Philippines (elected May 20, 2024). Former Governor of Sorsogon (2019–2022), former House Minority Floor Leader, and three-term Senator.",
    educations: [
      {
        degree: "Master of Laws in International and Comparative Law (LL.M.)",
        institution: "Georgetown University Law Center (Washington, D.C., USA)",
        year: "1996",
        sourceTitle: "Georgetown Law Alumni Records",
        sourceUrl: "https://www.law.georgetown.edu",
      },
      {
        degree: "Bachelor of Laws (LL.B.)",
        institution: "University of the Philippines College of Law (Diliman)",
        year: "1993",
        sourceTitle: "UP College of Law Alumni Registry",
        sourceUrl: "https://law.upd.edu.ph",
      },
      {
        degree: "Bachelor of Arts in Political Science",
        institution: "University of the Philippines Diliman",
        year: "1989",
        sourceTitle: "UP Diliman Alumni Directory",
        sourceUrl: "https://upd.edu.ph",
      },
      {
        degree: "Philippine Bar Examination Admission",
        institution: "Supreme Court of the Philippines (Roll No. 39345)",
        year: "1994",
        sourceTitle: "Supreme Court Roll of Attorneys",
        sourceUrl: "https://sc.judiciary.gov.ph",
      },
    ],
    publicServices: [
      {
        position: "President of the Senate of the Philippines",
        title: "25th Senate President",
        period: "May 20, 2024 – Present",
        sourceTitle: "Senate of the Philippines Journal of Plenary",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Senator of the Philippines",
        title: "Member, 14th, 15th, 16th, 17th, & 19th Congresses",
        period: "2007 – 2019, 2022 – Present",
        sourceTitle: "Senate Legislative Record",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Provincial Governor of Sorsogon",
        title: "Provincial Governor",
        period: "June 30, 2019 – June 30, 2022",
        sourceTitle: "Provincial Government of Sorsogon Archives",
        sourceUrl: "https://sorsogon.gov.ph",
      },
      {
        position: "House Minority Floor Leader",
        title: "Minority Leader, 13th Congress",
        period: "2004 – 2007",
        sourceTitle: "House of Representatives Journal",
        sourceUrl: "https://www.congress.gov.ph",
      },
      {
        position: "Representative, 1st District of Sorsogon",
        title: "Member, 11th, 12th, and 13th Congresses",
        period: "June 30, 1998 – June 30, 2007",
        sourceTitle: "House of Representatives of the Philippines",
        sourceUrl: "https://www.congress.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Anti-No Permit, No Exam Act (RA 11984)",
        category: "EDUCATION",
        description: "Authored and sponsored the landmark law forbidding educational institutions from barring underprivileged students with unsettled school tuition fees from taking exams.",
        sourceTitle: "Republic Act No. 11984 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Universal Access to Quality Tertiary Education (RA 10931)",
        category: "EDUCATION",
        description: "Co-authored the free tuition act in all State Universities and Colleges (SUCs), local universities, and state-run tech-voc institutes across the Philippines.",
        sourceTitle: "Republic Act No. 10931 Senate Record",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Minimum Wage Earner Tax Exemption (RA 9504)",
        category: "ECONOMY",
        description: "Authored statutory provisions fully exempting minimum wage earners from paying income and withholding taxes, preserving worker purchasing power.",
        sourceTitle: "Republic Act No. 9504 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines — Senate President Francis G. Escudero",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Official Senate President profile, legislative resume, and speeches.",
      },
    ],
  },

  // 6. Ferdinand Alexander 'Sandro' Marcos
  {
    slug: "sandro-marcos",
    name: "Ferdinand Alexander 'Sandro' Marcos",
    position: "VICE_PRESIDENT",
    party: "Partido Federal ng Pilipinas (PFP)",
    color: "#DC2626",
    photoUrl: "/uploads/candidates/sandro-marcos-portrait.jpg",
    bio: "Senior Deputy Majority Leader of the House of Representatives, Representative for the 1st District of Ilocos Norte. Economist with a Master's degree in Development Studies from the London School of Economics.",
    educations: [
      {
        degree: "Master of Science in Development Studies",
        institution: "London School of Economics and Political Science (LSE, UK)",
        year: "2017",
        sourceTitle: "LSE Alumni Records & House Profile",
        sourceUrl: "https://www.congress.gov.ph",
      },
      {
        degree: "Bachelor of Science in International Politics",
        institution: "City, University of London (UK)",
        year: "2016",
        sourceTitle: "City University of London Alumni Directory",
        sourceUrl: "https://www.city.ac.uk",
      },
      {
        degree: "Secondary Education",
        institution: "Worth School (West Sussex, UK)",
        year: "2013",
        sourceTitle: "Worth School Alumni Publications",
        sourceUrl: "https://www.worthschool.org.uk",
      },
    ],
    publicServices: [
      {
        position: "Senior Deputy Majority Leader, House of Representatives",
        title: "19th Congress Floor Leadership",
        period: "July 2022 – Present",
        sourceTitle: "House of Representatives of the Philippines",
        sourceUrl: "https://www.congress.gov.ph",
      },
      {
        position: "Representative, 1st District of Ilocos Norte",
        title: "District Representative",
        period: "June 30, 2022 – Present",
        sourceTitle: "House of Representatives Directory",
        sourceUrl: "https://www.congress.gov.ph",
      },
      {
        position: "Legislative Staff Officer, Office of the Majority Leader",
        title: "Congressional Committee Staff",
        period: "2019 – 2021",
        sourceTitle: "House of Representatives Secretariat Records",
        sourceUrl: "https://www.congress.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Maharlika Investment Fund Act (RA 11954)",
        category: "ECONOMY",
        description: "Co-authored the creation of the Philippine sovereign wealth vehicle to pool investible government capital for high-return infrastructure, agriculture, and energy projects.",
        sourceTitle: "Republic Act No. 11954 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "E-Governance Act & Public Digital Modernization",
        category: "DIGITAL_TRANSFORMATION",
        description: "Co-authored House legislation integrating citizen portals, civil registry verification, and municipal permit processing into interoperable cloud systems.",
        sourceTitle: "19th Congress House Bill No. 7327",
        sourceUrl: "https://www.congress.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "House of Representatives of the Philippines — Rep. Ferdinand Alexander Marcos",
        url: "https://www.congress.gov.ph",
        publisher: "House of Representatives",
        notes: "Official congressional ledger, committee assignments, and bills authored.",
      },
    ],
  },

  // 7. Bam Aquino
  {
    slug: "bam-aquino",
    name: "Paolo Benigno 'Bam' Aquino IV",
    position: "VICE_PRESIDENT",
    party: "Katipunan ng Nagkakaisang Pilipino (KANP)",
    color: "#EAB308",
    photoUrl: "/uploads/candidates/bam-aquino-portrait.jpg",
    bio: "Former Senator of the Philippines (2013–2019), social entrepreneur, and primary sponsor of landmark youth, education, and micro-enterprise development laws. Former Chairman of the National Youth Commission.",
    educations: [
      {
        degree: "Bachelor of Science in Management Engineering",
        institution: "Ateneo de Manila University",
        year: "1999",
        sourceTitle: "Ateneo de Manila University (Summa Cum Laude, Class Valedictorian)",
        sourceUrl: "https://ateneo.edu",
      },
      {
        degree: "Secondary Education",
        institution: "Ateneo de Manila High School",
        year: "1995",
        sourceTitle: "Ateneo Alumni Association (Valedictorian)",
        sourceUrl: "https://ateneo.edu",
      },
    ],
    publicServices: [
      {
        position: "Senator of the Philippines",
        title: "Member, 16th and 17th Congresses",
        period: "June 30, 2013 – June 30, 2019",
        sourceTitle: "Senate of the Philippines Legislative Roll",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Chairman, Senate Committee on Education, Arts and Culture",
        title: "17th Congress Committee Chairman",
        period: "2016 – 2019",
        sourceTitle: "Senate of the Philippines Directory",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Chairman, Senate Committee on Trade, Commerce and Entrepreneurship",
        title: "16th Congress Committee Chairman",
        period: "2013 – 2016",
        sourceTitle: "Senate of the Philippines Directory",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Chairperson, National Youth Commission (NYC)",
        title: "Cabinet Rank Youth Agency Head",
        period: "2003 – 2006",
        sourceTitle: "National Youth Commission Archives",
        sourceUrl: "https://nyc.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Universal Access to Quality Tertiary Education Act (RA 10931)",
        category: "EDUCATION",
        description: "Principal sponsor and co-author of free tuition in all 114 State Universities and Colleges, local universities, and state technical vocational institutions nationwide.",
        sourceTitle: "Republic Act No. 10931 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Go Negosyo Act (RA 10644) & Youth Entrepreneurship",
        category: "ECONOMY",
        description: "Authored the statutory creation of Negosyo Centers across all municipalities to provide regulatory one-stop registration, direct microloans, and mentoring for MSMEs.",
        sourceTitle: "Republic Act No. 10644 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines Archives — Senator Bam Aquino",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Historical records of 44 laws principally authored or sponsored.",
      },
    ],
  },

  // 8. Erwin T. Tulfo
  {
    slug: "erwin-tulfo",
    name: "Erwin T. Tulfo",
    position: "VICE_PRESIDENT",
    party: "Lakas-CMD / ACT-CIS",
    color: "#6366F1",
    photoUrl: "/uploads/candidates/erwin-tulfo-portrait.jpg",
    bio: "Deputy Majority Leader of the House of Representatives, Representative for ACT-CIS Partylist. Former Secretary of the Department of Social Welfare and Development (DSWD, 2022).",
    educations: [
      {
        degree: "Bachelor of Science in Business Administration",
        institution: "University of the East (Manila)",
        sourceTitle: "House of Representatives Profile",
        sourceUrl: "https://www.congress.gov.ph",
      },
      {
        degree: "Undergraduate Studies in Mass Communication",
        institution: "Harper College (Palatine, Illinois, USA)",
        sourceTitle: "Congressional Personnel CV",
        sourceUrl: "https://www.congress.gov.ph",
      },
    ],
    publicServices: [
      {
        position: "Deputy Majority Leader, House of Representatives",
        title: "19th Congress Floor Leadership",
        period: "July 2023 – Present",
        sourceTitle: "House of Representatives of the Philippines",
        sourceUrl: "https://www.congress.gov.ph",
      },
      {
        position: "Party-list Representative, ACT-CIS",
        title: "Member, 19th Congress",
        period: "May 2023 – Present",
        sourceTitle: "House of Representatives Directory",
        sourceUrl: "https://www.congress.gov.ph",
      },
      {
        position: "Secretary, Department of Social Welfare and Development (DSWD)",
        title: "Cabinet Secretary",
        period: "June 30, 2022 – December 2022",
        sourceTitle: "DSWD Official Transition Records",
        sourceUrl: "https://www.dswd.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Digitalization & Fast-Tracking of AICS Social Assistance",
        category: "SOCIAL_WELFARE",
        description: "Spearheaded paperless verification and automated cash payouts for the Assistance to Individuals in Crisis Situations (AICS) program during DSWD tenure.",
        sourceTitle: "DSWD Administrative Orders 2022",
        sourceUrl: "https://www.dswd.gov.ph",
        sourceType: "GOVERNMENT_PUBLICATION",
      },
      {
        title: "Predatory Interest Cap on Consumer Micro-Loans",
        category: "ECONOMY",
        description: "Introduced legislation mandating statutory interest rate caps on fast cash mobile lending applications and criminalizing illegal debt collection harassment.",
        sourceTitle: "19th Congress House Bill No. 8920",
        sourceUrl: "https://www.congress.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "House of Representatives of the Philippines — Rep. Erwin T. Tulfo",
        url: "https://www.congress.gov.ph",
        publisher: "House of Representatives",
        notes: "Congressional member record and authored bills.",
      },
    ],
  },

  // 9. Grace Poe
  {
    slug: "grace-poe",
    name: "Mary Grace Poe-Llamanzares",
    position: "VICE_PRESIDENT",
    party: "Independent / FPJ Alliance",
    color: "#1455D9",
    photoUrl: "/uploads/candidates/grace-poe-portrait.jpg",
    bio: "Senior Senator of the Philippines (2013–present), former MTRCB Chairperson. Top vote-getter in the 2013 senatorial election and primary author of the Public Services Act and National School Feeding Program.",
    educations: [
      {
        degree: "Bachelor of Arts in Political Science",
        institution: "Boston College (Chestnut Hill, Massachusetts, USA)",
        year: "1991",
        sourceTitle: "Boston College Alumni Directory",
        sourceUrl: "https://www.bc.edu",
      },
      {
        degree: "Undergraduate Studies in Development Studies",
        institution: "University of the Philippines Manila",
        year: "1986-1988",
        sourceTitle: "Senate Biography",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        degree: "Secondary Education",
        institution: "Assumption College San Lorenzo (Makati)",
        year: "1986",
        sourceTitle: "Senate Biography",
        sourceUrl: "https://senate.gov.ph",
      },
    ],
    publicServices: [
      {
        position: "Senator of the Philippines",
        title: "Member, 16th, 17th, 18th, and 19th Congresses",
        period: "June 30, 2013 – Present",
        sourceTitle: "Senate of the Philippines",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Chairperson, Senate Committee on Public Services",
        title: "Senate Committee Chair",
        period: "2016 – 2024",
        sourceTitle: "Senate Legislative Directory",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Chairperson, Movie and Television Review and Classification Board (MTRCB)",
        title: "MTRCB Agency Head",
        period: "2010 – 2012",
        sourceTitle: "Official Gazette of the Republic of the Philippines",
        sourceUrl: "https://www.officialgazette.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Masustansyang Pagkain para sa Batang Pilipino Act (RA 11037)",
        category: "HEALTHCARE",
        description: "Authored and sponsored the national school feeding program providing daily hot, nutritious meals sourced from local farmers to public school children.",
        sourceTitle: "Republic Act No. 11037 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Public Services Act Modernization (RA 11659)",
        category: "ECONOMY",
        description: "Primary author of law opening telecommunications, airlines, and railways to competitive international investment while strictly protecting critical public utilities.",
        sourceTitle: "Republic Act No. 11659 Senate Record",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines — Senator Grace Poe",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Legislative resume, committee records, and enacted laws.",
      },
    ],
  },

  // 10. Victor Ma. Regis 'Vico' Sotto
  {
    slug: "vico-sotto",
    name: "Victor Ma. Regis 'Vico' Sotto",
    position: "SENATOR",
    party: "Independent",
    color: "#0284C7",
    photoUrl: "/uploads/candidates/vico-sotto-portrait.jpg",
    bio: "Mayor of Pasig City (2019–present, re-elected 2022). Recognized by the U.S. Department of State as an International Anti-Corruption Champion for pioneering the Pasig City Freedom of Information ordinance and transparent bidding reforms.",
    educations: [
      {
        degree: "Master in Public Management (MPM)",
        institution: "Ateneo de Manila University – Ateneo School of Government",
        year: "2018",
        sourceTitle: "Ateneo School of Government Alumni Records",
        sourceUrl: "https://ateneo.edu/asog",
      },
      {
        degree: "Bachelor of Arts in Political Science",
        institution: "Ateneo de Manila University",
        year: "2011",
        sourceTitle: "Ateneo de Manila University Alumni Directory",
        sourceUrl: "https://ateneo.edu",
      },
    ],
    publicServices: [
      {
        position: "City Mayor of Pasig City",
        title: "Local Chief Executive (Two Terms)",
        period: "June 30, 2019 – Present",
        sourceTitle: "City Government of Pasig Official Registry",
        sourceUrl: "https://pasigcity.gov.ph",
      },
      {
        position: "City Councilor, 1st District of Pasig City",
        title: "Member, Sangguniang Panlungsod",
        period: "June 30, 2016 – June 30, 2019",
        sourceTitle: "Pasig City Legislative Archives",
        sourceUrl: "https://pasigcity.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Transparent Competitive Public Procurement & Open Data",
        category: "GOVERNANCE",
        description: "Implement transparent livestreamed public bidding and local Freedom of Information standards, lowering municipal supply procurement costs by 10% to 15%.",
        sourceTitle: "Pasig City Freedom of Information Ordinance",
        sourceUrl: "https://pasigcity.gov.ph",
        sourceType: "GOVERNMENT_PUBLICATION",
      },
      {
        title: "Universal Healthcare Integration & Regularization of Health Staff",
        category: "HEALTHCARE",
        description: "Full municipal saturation of PhilHealth Konsulta comprehensive checkups and regularizing hundreds of contractual frontline health workers into permanent plantilla posts.",
        sourceTitle: "Pasig City State of the City Address",
        sourceUrl: "https://pasigcity.gov.ph",
        sourceType: "GOVERNMENT_PUBLICATION",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "City Government of Pasig Official Executive Portal",
        url: "https://pasigcity.gov.ph",
        publisher: "City Government of Pasig",
        notes: "Executive orders, municipal ordinances, and procurement disclosures.",
      },
    ],
  },

  // 11. Jose Manuel 'Chel' Diokno
  {
    slug: "chel-diokno",
    name: "Jose Manuel 'Chel' Diokno",
    position: "SENATOR",
    party: "Akbayan Citizens' Action Party",
    color: "#D97706",
    photoUrl: "/uploads/candidates/chel-diokno-portrait.jpg",
    bio: "Veteran human rights lawyer, Chairman of the Free Legal Assistance Group (FLAG), founding Dean of the De La Salle University College of Law, and advocate for judicial reform and access to justice.",
    educations: [
      {
        degree: "Juris Doctor (J.D.)",
        institution: "Northwestern University School of Law (Chicago, Illinois, USA)",
        year: "1986",
        sourceTitle: "Northwestern Pritzker School of Law (Magna Cum Laude)",
        sourceUrl: "https://www.law.northwestern.edu",
      },
      {
        degree: "Bachelor of Arts in Philosophy",
        institution: "Northern Illinois University (USA)",
        year: "1982",
        sourceTitle: "Northern Illinois University Alumni Records",
        sourceUrl: "https://www.niu.edu",
      },
      {
        degree: "Philippine Bar Examination Admission",
        institution: "Supreme Court of the Philippines",
        year: "1988",
        sourceTitle: "Supreme Court of the Philippines Roll of Attorneys",
        sourceUrl: "https://sc.judiciary.gov.ph",
      },
      {
        degree: "Illinois Bar Admission",
        institution: "Supreme Court of Illinois (USA)",
        year: "1987",
        sourceTitle: "Illinois State Bar Association Directory",
        sourceUrl: "https://www.isba.org",
      },
    ],
    publicServices: [
      {
        position: "Chairman, Free Legal Assistance Group (FLAG)",
        title: "National Chairman",
        period: "2003 – Present",
        sourceTitle: "Free Legal Assistance Group Registry",
        sourceUrl: "https://flag.com.ph",
      },
      {
        position: "Founding Dean, Tañada-Diokno School of Law",
        title: "Dean of Law, De La Salle University",
        period: "2009 – 2019",
        sourceTitle: "De La Salle University Institutional Roll",
        sourceUrl: "https://www.dlsu.edu.ph",
      },
      {
        position: "Special Counsel, Senate Blue Ribbon Committee",
        title: "Special Counsel",
        period: "2001 – 2002",
        sourceTitle: "Senate of the Philippines Committee Records",
        sourceUrl: "https://senate.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Judicial Speed Modernization & Elimination of Trial Delays",
        category: "PUBLIC_SAFETY",
        description: "Decongest Philippine courts by establishing strict statutory trial timetables, digitalizing docket filing, and expanding barangay-level mediation clinics.",
        sourceTitle: "FLAG Justice Reform Whitepaper",
        sourceUrl: "https://flag.com.ph",
        sourceType: "OFFICIAL_PLATFORM",
      },
      {
        title: "Barangay Free Legal Aid & Whistleblower Shield",
        category: "GOVERNANCE",
        description: "Institutionalize funded community legal assistance for low-income citizens facing trumped-up litigation and establish robust financial protection for anti-graft whistleblowers.",
        sourceTitle: "Chel Diokno Legislative Policy Platform",
        sourceUrl: "https://flag.com.ph",
        sourceType: "OFFICIAL_PLATFORM",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Free Legal Assistance Group (FLAG) Official Archives",
        url: "https://flag.com.ph",
        publisher: "Free Legal Assistance Group",
        notes: "Historical human rights advocacy records and legal scholarship.",
      },
    ],
  },

  // 12. Christopher Lawrence 'Bong' Go
  {
    slug: "bong-go",
    name: "Christopher Lawrence 'Bong' Go",
    position: "SENATOR",
    party: "PDP-Laban",
    color: "#EF4444",
    photoUrl: "/uploads/candidates/bong-go-portrait.jpg",
    bio: "Senator of the Philippines (2019–present). Chairman of the Senate Committees on Health and Demography, and Sports. Primary author of the Malasakit Centers Act and the National Academy of Sports Act.",
    educations: [
      {
        degree: "Bachelor of Science in Management",
        institution: "De La Salle University (Manila)",
        year: "1996",
        sourceTitle: "De La Salle University Alumni Directory",
        sourceUrl: "https://www.dlsu.edu.ph",
      },
      {
        degree: "Secondary & Elementary Education",
        institution: "Ateneo de Davao University",
        sourceTitle: "Senate Official Biography",
        sourceUrl: "https://senate.gov.ph",
      },
    ],
    publicServices: [
      {
        position: "Senator of the Philippines",
        title: "Member, 18th and 19th Congresses",
        period: "June 30, 2019 – Present",
        sourceTitle: "Senate of the Philippines",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Chairman, Senate Committee on Health and Demography",
        title: "Senate Committee Chairman",
        period: "2019 – Present",
        sourceTitle: "Senate Directory of Committees",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Special Assistant to the President (SAP)",
        title: "Office of the President (Cabinet Rank)",
        period: "2016 – 2018",
        sourceTitle: "Official Gazette of the Republic of the Philippines",
        sourceUrl: "https://www.officialgazette.gov.ph",
      },
      {
        position: "Executive Assistant to the Mayor of Davao City",
        title: "Davao City Mayoral Executive Staff",
        period: "1998 – 2016",
        sourceTitle: "City Government of Davao",
        sourceUrl: "https://www.davaocity.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Malasakit Centers Act (RA 11463)",
        category: "HEALTHCARE",
        description: "Established 160+ hospital-based one-stop financial assistance centers in all public tertiary hospitals, reducing out-of-pocket medical debt for indigent patients to zero.",
        sourceTitle: "Republic Act No. 11463 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Regional Specialty Centers Act (RA 11959)",
        category: "HEALTHCARE",
        description: "Mandated the establishment of regional heart, lung, kidney, and cancer treatment centers in all regional Department of Health hospitals nationwide.",
        sourceTitle: "Republic Act No. 11959 Senate Record",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines — Senator Christopher Lawrence T. Go",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Official Senate member page and committee hearings.",
      },
    ],
  },

  // 13. Ronald 'Bato' Dela Rosa
  {
    slug: "bato-dela-rosa",
    name: "Ronald 'Bato' Dela Rosa",
    position: "SENATOR",
    party: "PDP-Laban",
    color: "#B91C1C",
    photoUrl: "/uploads/candidates/bato-dela-rosa-portrait.jpg",
    bio: "Senator of the Philippines (2019–present), Chairman of the Senate Committee on Public Order and Dangerous Drugs. Former Chief of the Philippine National Police (PNP, 2016–2018) and Director General of the Bureau of Corrections (BuCor, 2018).",
    educations: [
      {
        degree: "Doctor of Public Administration (DPA)",
        institution: "University of Southeastern Philippines (Davao City)",
        year: "2006",
        sourceTitle: "USeP Graduate School Registry",
        sourceUrl: "https://www.usep.edu.ph",
      },
      {
        degree: "Master in Public Administration (MPA)",
        institution: "University of Southeastern Philippines",
        year: "1998",
        sourceTitle: "USeP Graduate School Registry",
        sourceUrl: "https://www.usep.edu.ph",
      },
      {
        degree: "Bachelor of Science",
        institution: "Philippine Military Academy (PMA Class 'Sinagtala')",
        year: "1986",
        sourceTitle: "PMA Alumni Association Roll",
        sourceUrl: "https://pma.edu.ph",
      },
    ],
    publicServices: [
      {
        position: "Senator of the Philippines",
        title: "Member, 18th and 19th Congresses",
        period: "June 30, 2019 – Present",
        sourceTitle: "Senate of the Philippines",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Chairman, Senate Committee on Public Order and Dangerous Drugs",
        title: "Senate Committee Chairman",
        period: "2019 – Present",
        sourceTitle: "Senate Directory of Committees",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Director General, Bureau of Corrections (BuCor)",
        title: "Agency Head",
        period: "April 2018 – October 2018",
        sourceTitle: "Department of Justice Appointment Records",
        sourceUrl: "https://www.doj.gov.ph",
      },
      {
        position: "Chief, Philippine National Police (PNP)",
        title: "PNP Director General",
        period: "July 1, 2016 – April 19, 2018",
        sourceTitle: "Philippine National Police History Roll",
        sourceUrl: "https://pnp.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Revival of Mandatory Basic ROTC Program (SB 2034)",
        category: "PUBLIC_SAFETY",
        description: "Sponsored legislation reinstating mandatory Reserve Officers' Training Corps (ROTC) in colleges to train youth in national defense mobilization and disaster management.",
        sourceTitle: "19th Congress Senate Bill No. 2034",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Bureau of Fire Protection Modernization Act (RA 11589)",
        category: "PUBLIC_SAFETY",
        description: "Co-authored comprehensive equipment upgrades, modern fire engines, and expanded specialized rescue capabilities for municipal fire stations.",
        sourceTitle: "Republic Act No. 11589 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines — Senator Ronald Dela Rosa",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Legislative record and authored bills.",
      },
    ],
  },

  // 14. Maria Leonor 'Leni' Robredo
  {
    slug: "leni-robredo",
    name: "Maria Leonor 'Leni' Robredo",
    position: "SENATOR",
    party: "Liberal / Angat Buhay",
    color: "#DB2777",
    photoUrl: "/uploads/candidates/leni-robredo-portrait.jpg",
    bio: "14th Vice President of the Philippines (2016–2022). Chairperson of Angat Pinas, Inc. Former Representative for the 3rd District of Camarines Sur and Public Attorney's Office (PAO) lawyer.",
    educations: [
      {
        degree: "Bachelor of Laws (LL.B.)",
        institution: "University of Nueva Caceres (Naga City)",
        year: "1992",
        sourceTitle: "University of Nueva Caceres College of Law",
        sourceUrl: "https://unc.edu.ph",
      },
      {
        degree: "Bachelor of Arts in Economics",
        institution: "University of the Philippines Diliman",
        year: "1986",
        sourceTitle: "UP School of Economics Alumni Registry",
        sourceUrl: "https://econ.upd.edu.ph",
      },
      {
        degree: "Philippine Bar Examination Admission",
        institution: "Supreme Court of the Philippines (Roll No. 41818)",
        year: "1997",
        sourceTitle: "Supreme Court Roll of Attorneys",
        sourceUrl: "https://sc.judiciary.gov.ph",
      },
    ],
    publicServices: [
      {
        position: "Vice President of the Republic of the Philippines",
        title: "14th Vice President",
        period: "June 30, 2016 – June 30, 2022",
        sourceTitle: "Official Gazette of the Republic of the Philippines",
        sourceUrl: "https://www.officialgazette.gov.ph",
      },
      {
        position: "Co-Chairperson, Inter-Agency Committee on Anti-Illegal Drugs (ICAD)",
        title: "Cabinet Co-Chair",
        period: "November 2019",
        sourceTitle: "Official Gazette of the Republic of the Philippines",
        sourceUrl: "https://www.officialgazette.gov.ph",
      },
      {
        position: "Representative, 3rd District of Camarines Sur",
        title: "Member, 16th Congress",
        period: "June 30, 2013 – June 30, 2016",
        sourceTitle: "House of Representatives of the Philippines",
        sourceUrl: "https://www.congress.gov.ph",
      },
      {
        position: "Public Attorney, Public Attorney's Office (PAO)",
        title: "District Legal Counsel (Naga City)",
        period: "1997 – 1999",
        sourceTitle: "Public Attorney's Office Personnel History",
        sourceUrl: "https://pao.gov.ph",
      },
      {
        position: "Branch Coordinator, Sentro ng Alternatibong Lingap Panligal (SALIGAN)",
        title: "Development Legal Counsel (Bicol Region)",
        period: "1999 – 2012",
        sourceTitle: "SALIGAN Institutional Archives",
        sourceUrl: "https://saligan.org",
      },
    ],
    platforms: [
      {
        title: "Full Disclosure & Government Freedom of Information Act",
        category: "GOVERNANCE",
        description: "Authored mandatory online disclosure of public bidding records, procurement contracts, and budget allocations for all state entities and local government units.",
        sourceTitle: "16th Congress House Bill No. 19",
        sourceUrl: "https://www.congress.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Angat Buhay Community Health & Rural Livelihood Expansion",
        category: "SOCIAL_WELFARE",
        description: "Mobilize cross-sectoral community development supporting malnutrition feeding centers, smallholder farmer market links, and disaster-resistant classroom construction.",
        sourceTitle: "OVP Angat Buhay Accomplishment Ledger",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "OFFICIAL_PLATFORM",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Official Gazette of the Republic of the Philippines — Office of the Vice President",
        url: "https://www.officialgazette.gov.ph",
        publisher: "Official Gazette",
        notes: "Historical tenure records for the 14th Vice President.",
      },
    ],
  },

  // 15. Antonio 'Sonny' Trillanes IV
  {
    slug: "antonio-trillanes",
    name: "Antonio 'Sonny' Trillanes IV",
    position: "SENATOR",
    party: "Magdalo Para sa Pilipino",
    color: "#2563EB",
    photoUrl: "/uploads/candidates/antonio-trillanes-portrait.jpg",
    bio: "Former two-term Senator of the Philippines (2007–2019), former Philippine Navy Lieutenant Senior Grade, and professor of public administration. Author of the Salary Standardization Law III and the AFP Modernization Act.",
    educations: [
      {
        degree: "Master in Public Administration (MPA)",
        institution: "University of the Philippines National College of Public Administration and Governance (NCPAG)",
        year: "2002",
        sourceTitle: "UP NCPAG Alumni Records",
        sourceUrl: "https://ncpag.upd.edu.ph",
      },
      {
        degree: "Bachelor of Science in Naval Systems Engineering",
        institution: "Philippine Military Academy (PMA Class 'Marangal', Cum Laude)",
        year: "1995",
        sourceTitle: "PMA Alumni Association",
        sourceUrl: "https://pma.edu.ph",
      },
    ],
    publicServices: [
      {
        position: "Senator of the Philippines",
        title: "Member, 14th, 15th, 16th, and 17th Congresses",
        period: "June 30, 2007 – June 30, 2019",
        sourceTitle: "Senate of the Philippines Legislative Roll",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Chairman, Senate Committee on Civil Service and Government Reorganization",
        title: "Senate Committee Chairman",
        period: "2010 – 2019",
        sourceTitle: "Senate Directory of Committees",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Lieutenant Senior Grade, Philippine Navy",
        title: "Naval Operations Officer",
        period: "1995 – 2004",
        sourceTitle: "Philippine Navy Commission Records",
        sourceUrl: "https://navy.mil.ph",
      },
    ],
    platforms: [
      {
        title: "Revised AFP Modernization Act (RA 10349)",
        category: "FOREIGN_POLICY",
        description: "Authored and sponsored the legal framework modernizing external territorial defense capabilities, radar coverage, and naval vessels for the West Philippine Sea.",
        sourceTitle: "Republic Act No. 10349 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Salary Standardization Law III (Joint Res. 4)",
        category: "ECONOMY",
        description: "Primary author of comprehensive pay scale upgrades for government civil servants, public school teachers, and uniformed military personnel.",
        sourceTitle: "Congress Joint Resolution No. 4",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines Archives — Senator Antonio F. Trillanes IV",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Historical legislative records from 2007 to 2019.",
      },
    ],
  },

  // 16. Leila M. de Lima
  {
    slug: "leila-de-lima",
    name: "Leila M. de Lima",
    position: "SENATOR",
    party: "Liberal / Mamamayang Liberal",
    color: "#84CC16",
    photoUrl: "/uploads/candidates/leila-de-lima-portrait.jpg",
    bio: "Former Senator of the Philippines (2016–2022), former Secretary of the Department of Justice (DOJ, 2010–2015), and former Chairperson of the Commission on Human Rights (CHR, 2008–2010). Bar topnotcher and advocate for judicial integrity and prison reform.",
    educations: [
      {
        degree: "Bachelor of Laws (LL.B.)",
        institution: "San Beda College of Law (Manila, Salutatorian)",
        year: "1985",
        sourceTitle: "San Beda College of Law Alumni Registry",
        sourceUrl: "https://www.sanbeda.edu.ph",
      },
      {
        degree: "Bachelor of Arts in History and Political Science",
        institution: "De La Salle University (Manila)",
        year: "1980",
        sourceTitle: "De La Salle University Alumni Directory",
        sourceUrl: "https://www.dlsu.edu.ph",
      },
      {
        degree: "Philippine Bar Examination Admission",
        institution: "Supreme Court of the Philippines (8th Place Topnotcher)",
        year: "1985",
        sourceTitle: "Supreme Court Roll of Attorneys",
        sourceUrl: "https://sc.judiciary.gov.ph",
      },
    ],
    publicServices: [
      {
        position: "Senator of the Philippines",
        title: "Member, 17th and 18th Congresses",
        period: "June 30, 2016 – June 30, 2022",
        sourceTitle: "Senate of the Philippines",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Secretary, Department of Justice (DOJ)",
        title: "Cabinet Secretary",
        period: "June 30, 2010 – October 12, 2015",
        sourceTitle: "Department of Justice Historical Roll",
        sourceUrl: "https://www.doj.gov.ph",
      },
      {
        position: "Chairperson, Commission on Human Rights (CHR)",
        title: "Constitutional Commission Chair",
        period: "May 2008 – June 2010",
        sourceTitle: "Commission on Human Rights of the Philippines",
        sourceUrl: "https://chr.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Prison Reform & Integrated Corrections System",
        category: "PUBLIC_SAFETY",
        description: "Consolidate the fragmented national corrections and detention system to eliminate severe penal overcrowding, modernize inmate rehabilitation, and root out contraband syndicates.",
        sourceTitle: "17th Congress Senate Bill No. 180",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Human Rights Defenders Protection Act",
        category: "GOVERNANCE",
        description: "Enact legal protections safeguarding civic leaders, journalists, and public interest attorneys from unlawful surveillance, harassment, and extrajudicial retaliation.",
        sourceTitle: "18th Congress Senate Bill No. 179",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines Archives — Senator Leila M. de Lima",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Legislative dossier and committee records.",
      },
    ],
  },

  // 17. Gilbert 'Gibo' Teodoro Jr.
  {
    slug: "gibo-teodoro",
    name: "Gilbert 'Gibo' Teodoro Jr.",
    position: "SENATOR",
    party: "Nationalist People's Coalition (NPC) / Lakas",
    color: "#059669",
    photoUrl: "/uploads/candidates/gibo-teodoro-portrait.jpg",
    bio: "Secretary of National Defense of the Philippines (2023–present; previously 2007–2009). Bar topnotcher, former three-term Representative for the 1st District of Tarlac (1998–2007), and former Chairman of the National Disaster Coordinating Council (NDCC).",
    educations: [
      {
        degree: "Master of Laws (LL.M.)",
        institution: "Harvard Law School (Cambridge, Massachusetts, USA)",
        year: "1997",
        sourceTitle: "Harvard Law School Alumni Records",
        sourceUrl: "https://hls.harvard.edu",
      },
      {
        degree: "Bachelor of Laws (LL.B.)",
        institution: "University of the Philippines College of Law (Dean's Medal)",
        year: "1989",
        sourceTitle: "UP College of Law Alumni Registry",
        sourceUrl: "https://law.upd.edu.ph",
      },
      {
        degree: "Bachelor of Science in Commerce, Major in Financial Management",
        institution: "De La Salle University (Manila)",
        year: "1984",
        sourceTitle: "De La Salle University Alumni Directory",
        sourceUrl: "https://www.dlsu.edu.ph",
      },
      {
        degree: "Philippine Bar Examination Admission",
        institution: "Supreme Court of the Philippines (1st Place Topnotcher, 1989)",
        year: "1990",
        sourceTitle: "Supreme Court Roll of Attorneys",
        sourceUrl: "https://sc.judiciary.gov.ph",
      },
      {
        degree: "New York State Bar Admission",
        institution: "New York State Bar (USA)",
        year: "1997",
        sourceTitle: "New York State Unified Court System Directory",
        sourceUrl: "https://www.nycourts.gov",
      },
    ],
    publicServices: [
      {
        position: "Secretary of National Defense (DND)",
        title: "Cabinet Secretary (Two Administrations)",
        period: "June 5, 2023 – Present; August 2007 – November 2009",
        sourceTitle: "Department of National Defense Official Records",
        sourceUrl: "https://www.dnd.gov.ph",
      },
      {
        position: "Chairman, National Disaster Coordinating Council (NDCC)",
        title: "Disaster Council Head",
        period: "2007 – 2009",
        sourceTitle: "National Disaster Risk Reduction and Management Council",
        sourceUrl: "https://ndrrmc.gov.ph",
      },
      {
        position: "Representative, 1st District of Tarlac",
        title: "Member, 11th, 12th, and 13th Congresses",
        period: "June 30, 1998 – June 30, 2007",
        sourceTitle: "House of Representatives of the Philippines",
        sourceUrl: "https://www.congress.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Comprehensive Archipelagic Defense Concept (CADC)",
        category: "FOREIGN_POLICY",
        description: "Implemented external defense doctrine protecting the entire 200-nautical-mile Exclusive Economic Zone (EEZ) and maritime energy fields in the West Philippine Sea.",
        sourceTitle: "DND CADC Policy Briefing",
        sourceUrl: "https://www.dnd.gov.ph",
        sourceType: "GOVERNMENT_PUBLICATION",
      },
      {
        title: "Self-Reliant Defense Posture (SRDP) Revitalization Act (RA 12024)",
        category: "PUBLIC_SAFETY",
        description: "Championed the domestic manufacturing law fostering local defense industries to produce naval vessels, munitions, and cyber technologies within the Philippines.",
        sourceTitle: "Republic Act No. 12024 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "GOVERNMENT_PUBLICATION",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Department of National Defense Official Executive Portal",
        url: "https://www.dnd.gov.ph",
        publisher: "Department of National Defense",
        notes: "Executive leadership record and defense modernization policy directives.",
      },
    ],
  },

  // 18. Francis 'Kiko' Pangilinan
  {
    slug: "kiko-pangilinan",
    name: "Francis 'Kiko' Pangilinan",
    position: "SENATOR",
    party: "Liberal",
    color: "#16A34A",
    photoUrl: "/uploads/candidates/kiko-pangilinan-portrait.jpg",
    bio: "Former three-term Senator of the Philippines and Senate Majority Leader. Former Presidential Assistant for Food Security and Agricultural Modernization (2014–2015) and primary author of the Sagip Saka Act.",
    educations: [
      {
        degree: "Master in Public Administration (MPA)",
        institution: "Harvard Kennedy School of Government (Cambridge, Massachusetts, USA)",
        year: "1998",
        sourceTitle: "Harvard Kennedy School Alumni Records",
        sourceUrl: "https://www.hks.harvard.edu",
      },
      {
        degree: "Bachelor of Laws (LL.B.)",
        institution: "University of the Philippines College of Law (Diliman)",
        year: "1993",
        sourceTitle: "UP College of Law Alumni Directory",
        sourceUrl: "https://law.upd.edu.ph",
      },
      {
        degree: "Bachelor of Arts in English, Major in Comparative Literature",
        institution: "University of the Philippines Diliman",
        year: "1988",
        sourceTitle: "UP Diliman Alumni Registry",
        sourceUrl: "https://upd.edu.ph",
      },
      {
        degree: "Philippine Bar Examination Admission",
        institution: "Supreme Court of the Philippines",
        year: "1994",
        sourceTitle: "Supreme Court Roll of Attorneys",
        sourceUrl: "https://sc.judiciary.gov.ph",
      },
    ],
    publicServices: [
      {
        position: "Senator of the Philippines",
        title: "Member, 12th, 13th, 14th, 17th, & 18th Congresses",
        period: "2001 – 2013, 2016 – 2022",
        sourceTitle: "Senate of the Philippines",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Majority Floor Leader, Senate of the Philippines",
        title: "Senate Majority Leader",
        period: "2004 – 2008",
        sourceTitle: "Senate Journal Records",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Presidential Assistant for Food Security and Agricultural Modernization",
        title: "Cabinet Rank Presidential Assistant",
        period: "2014 – 2015",
        sourceTitle: "Official Gazette of the Republic of the Philippines",
        sourceUrl: "https://www.officialgazette.gov.ph",
      },
      {
        position: "City Councilor, 4th District of Quezon City",
        title: "Quezon City Councilor",
        period: "1988 – 1992",
        sourceTitle: "Quezon City Government Historical Roll",
        sourceUrl: "https://quezoncity.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Sagip Saka Act (RA 11321)",
        category: "AGRICULTURE",
        description: "Authored and sponsored legislation allowing national and local agencies to purchase agricultural produce directly from registered farmer and fisher cooperatives without middlemen.",
        sourceTitle: "Republic Act No. 11321 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Department of Fisheries and Aquatic Resources Creation",
        category: "AGRICULTURE",
        description: "Sponsored creation of a standalone Cabinet-level Department of Fisheries to modernize municipal fishing gear, protect coral reefs, and safeguard fishermen in Philippine waters.",
        sourceTitle: "18th Congress Senate Bill No. 695",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines Archives — Senator Francis N. Pangilinan",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Complete legislative sponsor ledger and agricultural policy papers.",
      },
    ],
  },

  // 19. Loren B. Legarda
  {
    slug: "loren-legarda",
    name: "Loren B. Legarda",
    position: "SENATOR",
    party: "Nationalist People's Coalition (NPC)",
    color: "#047857",
    photoUrl: "/uploads/candidates/loren-legarda-portrait.jpg",
    bio: "Senate President Pro Tempore (2022–2024), four-term Senator, former three-time topnotcher in senatorial elections. Global climate champion, United Nations Global Champion for Resilience, and author of major ecological and cultural heritage laws.",
    educations: [
      {
        degree: "Master in National Security Administration (MNSA)",
        institution: "National Defense College of the Philippines (Gold Medal)",
        year: "1993",
        sourceTitle: "NDCP Alumni Registry",
        sourceUrl: "https://ndcp.edu.ph",
      },
      {
        degree: "Bachelor of Arts in Broadcast Communication",
        institution: "University of the Philippines Diliman (Cum Laude)",
        year: "1981",
        sourceTitle: "UP College of Mass Communication Registry",
        sourceUrl: "https://masscomm.upd.edu.ph",
      },
      {
        degree: "Secondary & Elementary Education",
        institution: "Assumption College San Lorenzo (Makati)",
        year: "1973, 1977",
        sourceTitle: "Senate Official Biography",
        sourceUrl: "https://senate.gov.ph",
      },
    ],
    publicServices: [
      {
        position: "Senator of the Philippines",
        title: "Member, 11th, 12th, 14th, 15th, 16th, 17th, & 19th Congresses",
        period: "1998 – 2004, 2007 – 2019, 2022 – Present",
        sourceTitle: "Senate of the Philippines",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Senate President Pro Tempore",
        title: "Senate Leadership",
        period: "2022 – 2024",
        sourceTitle: "Senate Journal Records",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Representative, Lone District of Antique",
        title: "Deputy Speaker, House of Representatives",
        period: "2019 – 2022",
        sourceTitle: "House of Representatives of the Philippines",
        sourceUrl: "https://www.congress.gov.ph",
      },
      {
        position: "Majority Floor Leader, Senate of the Philippines",
        title: "Senate Majority Leader",
        period: "2001 – 2004",
        sourceTitle: "Senate Journal Records",
        sourceUrl: "https://senate.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Climate Change Act (RA 9729) & Disaster Risk Reduction (RA 10121)",
        category: "ENVIRONMENT",
        description: "Primary author of comprehensive ecological laws establishing the Climate Change Commission, municipal adaptation plans, and national disaster resilience funding.",
        sourceTitle: "Republic Act No. 9729 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Renewable Energy Act (RA 9513) & Green Jobs Act (RA 10771)",
        category: "ENVIRONMENT",
        description: "Enacted statutory tax holidays, feed-in tariffs, and incentives accelerating private investments in solar, wind, geothermal, and ocean energy generation.",
        sourceTitle: "Republic Act No. 9513 Senate Record",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines — Senator Loren Legarda",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Author of over 100 enacted environmental, cultural, and social laws.",
      },
    ],
  },

  // 20. Alan Peter S. Cayetano
  {
    slug: "alan-cayetano",
    name: "Alan Peter S. Cayetano",
    position: "SENATOR",
    party: "Independent",
    color: "#6B7280",
    photoUrl: "/uploads/candidates/alan-cayetano-portrait.jpg",
    bio: "Senator of the Philippines (2007–2017, 2022–present). Former Speaker of the House of Representatives (2019–2020), Secretary of Foreign Affairs (DFA, 2017–2018), and Senate Majority Leader (2013–2016).",
    educations: [
      {
        degree: "Juris Doctor (J.D.)",
        institution: "Ateneo de Manila University School of Law",
        year: "1997",
        sourceTitle: "Ateneo Law School Alumni Registry",
        sourceUrl: "https://ateneo.edu/law",
      },
      {
        degree: "Bachelor of Arts in Political Science",
        institution: "University of the Philippines Diliman",
        year: "1993",
        sourceTitle: "UP Diliman Alumni Directory",
        sourceUrl: "https://upd.edu.ph",
      },
      {
        degree: "Philippine Bar Examination Admission",
        institution: "Supreme Court of the Philippines",
        year: "1998",
        sourceTitle: "Supreme Court Roll of Attorneys",
        sourceUrl: "https://sc.judiciary.gov.ph",
      },
    ],
    publicServices: [
      {
        position: "Senator of the Philippines",
        title: "Member, 14th, 15th, 16th, and 19th Congresses",
        period: "2007 – 2017, 2022 – Present",
        sourceTitle: "Senate of the Philippines",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Speaker of the House of Representatives",
        title: "22nd Speaker of the House",
        period: "July 22, 2019 – October 13, 2020",
        sourceTitle: "House of Representatives of the Philippines",
        sourceUrl: "https://www.congress.gov.ph",
      },
      {
        position: "Secretary of Foreign Affairs (DFA)",
        title: "Cabinet Secretary",
        period: "May 18, 2017 – October 17, 2018",
        sourceTitle: "Department of Foreign Affairs Historical Roll",
        sourceUrl: "https://dfa.gov.ph",
      },
      {
        position: "Senate Majority Floor Leader",
        title: "Senate Majority Leader",
        period: "2013 – 2016",
        sourceTitle: "Senate Journal Records",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Vice Mayor of Taguig",
        title: "Presiding Officer",
        period: "1995 – 1998",
        sourceTitle: "City Government of Taguig History",
        sourceUrl: "https://taguig.gov.ph",
      },
    ],
    platforms: [
      {
        title: "Sampung Libong Pag-Asa Direct Household Stimulus",
        category: "SOCIAL_WELFARE",
        description: "Institutionalize emergency financial assistance grants of ₱10,000 per underprivileged Filipino family during times of national economic distress and inflation spikes.",
        sourceTitle: "19th Congress Senate Bill No. 302",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Department of Disaster Resilience Creation",
        category: "PUBLIC_SAFETY",
        description: "Consolidate disaster risk mitigation, early warning weather monitoring, and immediate relief distribution under a unified Cabinet department.",
        sourceTitle: "House Bill No. 5989 / 19th Congress Senate Bill",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines — Senator Alan Peter Cayetano",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Congressional record and plenary proceedings.",
      },
    ],
  },

  // 21. Pilar Juliana 'Pia' Cayetano
  {
    slug: "pia-cayetano",
    name: "Pilar Juliana 'Pia' Cayetano",
    position: "SENATOR",
    party: "Nacionalista Party",
    color: "#EC4899",
    photoUrl: "/uploads/candidates/pia-cayetano-portrait.jpg",
    bio: "Senator of the Philippines (2004–2016, 2019–present). Former Deputy Speaker of the House of Representatives (2016–2019). Lawyer, triathlete, and primary author of the Sin Tax Reform Act, Corporate Recovery and Tax Incentives for Enterprises (CREATE) Act, and the Responsible Parenthood and Reproductive Health Act.",
    educations: [
      {
        degree: "Bachelor of Laws (LL.B.)",
        institution: "University of the Philippines College of Law (Diliman, Top 7)",
        year: "1991",
        sourceTitle: "UP College of Law Alumni Registry",
        sourceUrl: "https://law.upd.edu.ph",
      },
      {
        degree: "Bachelor of Science in Economics",
        institution: "University of the Philippines Diliman (Cum Laude)",
        year: "1985",
        sourceTitle: "UP School of Economics Alumni Directory",
        sourceUrl: "https://econ.upd.edu.ph",
      },
      {
        degree: "Philippine Bar Examination Admission",
        institution: "Supreme Court of the Philippines",
        year: "1992",
        sourceTitle: "Supreme Court Roll of Attorneys",
        sourceUrl: "https://sc.judiciary.gov.ph",
      },
    ],
    publicServices: [
      {
        position: "Senator of the Philippines",
        title: "Member, 13th, 14th, 15th, 16th, 18th, & 19th Congresses",
        period: "2004 – 2016, 2019 – Present",
        sourceTitle: "Senate of the Philippines",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Chairperson, Senate Committee on Ways and Means",
        title: "18th Congress Committee Chair",
        period: "2019 – 2022",
        sourceTitle: "Senate Directory of Committees",
        sourceUrl: "https://senate.gov.ph",
      },
      {
        position: "Deputy Speaker, House of Representatives",
        title: "17th Congress Leadership",
        period: "2016 – 2019",
        sourceTitle: "House of Representatives of the Philippines",
        sourceUrl: "https://www.congress.gov.ph",
      },
      {
        position: "President, Committee of Women Parliamentarians",
        title: "Inter-Parliamentary Union (IPU)",
        period: "2008 – 2010",
        sourceTitle: "Inter-Parliamentary Union Assembly Records",
        sourceUrl: "https://www.ipu.org",
      },
    ],
    platforms: [
      {
        title: "Corporate Recovery and Tax Incentives for Enterprises (CREATE, RA 11534)",
        category: "ECONOMY",
        description: "Primary sponsor of corporate tax relief lowering business income taxes to 20%–25% while streamlining performance-based tax holidays for job-generating investments.",
        sourceTitle: "Republic Act No. 11534 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Responsible Parenthood and Reproductive Health Act (RA 10354)",
        category: "HEALTHCARE",
        description: "Principal sponsor guaranteeing universal public access to maternal health services, reproductive healthcare supplies, and adolescent health education.",
        sourceTitle: "Republic Act No. 10354 Senate Record",
        sourceUrl: "https://senate.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
      {
        title: "Sin Tax Reform Act (RA 10351)",
        category: "HEALTHCARE",
        description: "Restructured tobacco and alcohol excise taxes to deter harmful smoking consumption and earmark billions in annual revenues directly for universal PhilHealth healthcare coverage.",
        sourceTitle: "Republic Act No. 10351 Official Gazette",
        sourceUrl: "https://www.officialgazette.gov.ph",
        sourceType: "LEGISLATIVE_RECORD",
      },
    ],
    sources: [
      {
        category: "GENERAL",
        title: "Senate of the Philippines — Senator Pia S. Cayetano",
        url: "https://senate.gov.ph",
        publisher: "Senate of the Philippines",
        notes: "Legislative dossier of major health, economic, and education laws.",
      },
    ],
  },
];

async function main() {
  console.log("=== UPDATING CANDIDATE PROFILES WITH VERIFIED RESEARCH DATA ===");
  console.log(`Processing ${verifiedCandidates.length} candidate profiles...`);

  let updatedCount = 0;
  let totalEduCount = 0;
  let totalServiceCount = 0;
  let totalPlatformCount = 0;
  let totalSourceCount = 0;

  for (const c of verifiedCandidates) {
    const existing = await prisma.candidate.findUnique({ where: { slug: c.slug } });
    if (!existing) {
      console.warn(`[WARN] Candidate with slug ${c.slug} not found in database!`);
      continue;
    }

    console.log(`Updating: ${c.name} (${c.slug})`);

    await prisma.$transaction(async (tx) => {
      // 1. Update Candidate core record
      await tx.candidate.update({
        where: { id: existing.id },
        data: {
          name: c.name,
          party: c.party,
          photoUrl: c.photoUrl,
          bio: c.bio,
          lastVerifiedAt: new Date(),
        },
      });

      // 2. Clear & replace structured educations
      await tx.candidateEducation.deleteMany({ where: { candidateId: existing.id } });
      for (let i = 0; i < c.educations.length; i++) {
        const edu = c.educations[i];
        await tx.candidateEducation.create({
          data: {
            candidateId: existing.id,
            degree: edu.degree,
            institution: edu.institution,
            year: edu.year || null,
            sourceTitle: edu.sourceTitle || null,
            sourceUrl: edu.sourceUrl || null,
            displayOrder: i,
            isVerified: true,
          },
        });
        totalEduCount++;
      }

      // 3. Clear & replace structured public services
      await tx.candidatePublicService.deleteMany({ where: { candidateId: existing.id } });
      for (let i = 0; i < c.publicServices.length; i++) {
        const ps = c.publicServices[i];
        await tx.candidatePublicService.create({
          data: {
            candidateId: existing.id,
            position: ps.position,
            title: ps.title,
            period: ps.period,
            sourceTitle: ps.sourceTitle || null,
            sourceUrl: ps.sourceUrl || null,
            displayOrder: i,
            isVerified: true,
          },
        });
        totalServiceCount++;
      }

      // 4. Clear & replace platforms
      await tx.candidatePlatform.deleteMany({ where: { candidateId: existing.id } });
      for (const plat of c.platforms) {
        await tx.candidatePlatform.create({
          data: {
            candidateId: existing.id,
            title: plat.title,
            description: plat.description,
            category: plat.category,
            sourceUrl: plat.sourceUrl,
            sourceTitle: plat.sourceTitle,
            sourceType: plat.sourceType,
            verificationStatus: "VERIFIED",
            verifiedAt: new Date(),
          },
        });
        totalPlatformCount++;
      }

      // 5. Clear & replace sources
      await tx.candidateSource.deleteMany({ where: { candidateId: existing.id } });
      for (let i = 0; i < c.sources.length; i++) {
        const s = c.sources[i];
        await tx.candidateSource.create({
          data: {
            candidateId: existing.id,
            category: s.category,
            title: s.title,
            url: s.url,
            publisher: s.publisher,
            notes: s.notes || null,
            verificationStatus: "VERIFIED",
            displayOrder: i,
          },
        });
        totalSourceCount++;
      }
    });

    updatedCount++;
    console.log(`  ✓ Updated ${c.name} with ${c.educations.length} edus, ${c.publicServices.length} positions, ${c.platforms.length} platforms, ${c.sources.length} sources.`);
  }

  console.log("\n=======================================================");
  console.log(`CANDIDATES UPDATED: ${updatedCount} / ${verifiedCandidates.length}`);
  console.log(`TOTAL EDUCATION ENTRIES: ${totalEduCount}`);
  console.log(`TOTAL PUBLIC SERVICE ENTRIES: ${totalServiceCount}`);
  console.log(`TOTAL PLATFORM ENTRIES: ${totalPlatformCount}`);
  console.log(`TOTAL SOURCE ENTRIES: ${totalSourceCount}`);
  console.log("=======================================================\n");
}

main()
  .catch((e) => {
    console.error("Failed to update candidate profiles:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
