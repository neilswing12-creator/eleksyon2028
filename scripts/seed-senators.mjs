import { PrismaClient } from '../src/generated/prisma/index.js';
import path from 'path';

const prisma = new PrismaClient();

function mapCategory(pillar) {
  const p = (pillar || '').toUpperCase();
  if (p.includes('HEALTH')) return 'HEALTHCARE';
  if (p.includes('EDUC')) return 'EDUCATION';
  if (p.includes('AGRI') || p.includes('FOOD')) return 'AGRICULTURE';
  if (p.includes('INFRA') || p.includes('ROAD') || p.includes('TRANSPORT')) return 'INFRASTRUCTURE';
  if (p.includes('SAFE') || p.includes('POLICE') || p.includes('LAW') || p.includes('SECURITY')) return 'PUBLIC_SAFETY';
  if (p.includes('GOVERN') || p.includes('CORRUPT') || p.includes('FISCAL') || p.includes('DEMOC')) return 'GOVERNANCE';
  if (p.includes('ENVIRON') || p.includes('CLIMATE') || p.includes('LAND')) return 'ENVIRONMENT';
  if (p.includes('DIGIT') || p.includes('CYBER')) return 'DIGITAL_TRANSFORMATION';
  if (p.includes('WELFARE') || p.includes('LABOR') || p.includes('SENIOR') || p.includes('CHILD') || p.includes('JUSTICE')) return 'SOCIAL_WELFARE';
  if (p.includes('FOREIGN') || p.includes('SOVEREIGN')) return 'FOREIGN_POLICY';
  return 'ECONOMY';
}

const NEW_SENATORIAL_CANDIDATES = [
  {
    name: "Cielo Magno",
    slug: "cielo-magno",
    position: "SENATOR",
    party: "Independent / Akbayan",
    color: "#D90429",
    photoUrl: "/uploads/candidates/cielo-magno-portrait.jpg",
    bio: "Dr. Cielo Magno is an economist, institutional reform advocate, and associate professor at the University of the Philippines School of Economics. She previously served as Undersecretary of the Department of Finance overseeing the Fiscal Policy and Monitoring Group, where she championed progressive tax reforms, mining fiscal regimes, and full fiscal transparency.",
    officialWebsite: "https://econ.upd.edu.ph",
    socialLinks: JSON.stringify({ twitter: "https://twitter.com/cielomagno" }),
    educations: [
      "PhD in Law and Public Policy - Northeastern University",
      "Master of Arts in Economics - University of the Philippines Diliman",
      "Bachelor of Science in Business Economics - University of the Philippines Diliman"
    ],
    publicServices: [
      "Undersecretary for Fiscal Policy and Monitoring - Department of Finance (DOF)",
      "Associate Professor of Public Economics - UP School of Economics",
      "Board Member - Extractive Industries Transparency Initiative (EITI)",
      "Coordinator - Bantay Kita Philippines (Extractive Industries Transparency Network)"
    ],
    platforms: [
      {
        title: "Healthcare System Overhaul & Social Safety Nets",
        pillar: "Healthcare",
        summary: "Ensure state budget prioritization for universal healthcare implementation and fair benefits for OFWs and formal/informal workers.",
        details: "Pushes for robust, predictable budget allocations for public hospitals, PhilHealth solvency, and primary care facilities so healthcare is accessible to all Filipinos."
      },
      {
        title: "Rigorous Public Fund & National Budget Scrutiny",
        pillar: "Good Governance",
        summary: "Institutionalize strict public auditing of infrastructure funds, farm-to-market roads, and disaster-control expenditures.",
        details: "Eliminates duplicate, overpriced, and politically motivated budget insertions, redirecting public revenues directly to education, farmer subsidies, and social services."
      },
      {
        title: "Evidence-Based Industrial & Resource Policy",
        pillar: "Economy",
        summary: "Establish comprehensive national industrial policies and equitable mining fiscal revenue regimes.",
        details: "Advocates for domestic processing of natural resources, environmental taxation, and transparent wealth-sharing mechanisms for local host communities."
      }
    ],
    sources: [
      {
        title: "UP School of Economics Faculty Profile - Dr. Cielo Magno",
        url: "https://econ.upd.edu.ph/faculty/cielo-magno",
        publisher: "University of the Philippines"
      },
      {
        title: "Department of Finance Fiscal Policy and Monitoring Record",
        url: "https://www.dof.gov.ph",
        publisher: "Department of Finance (DOF)"
      }
    ]
  },
  {
    name: "Heidi Mendoza",
    slug: "heidi-mendoza",
    position: "SENATOR",
    party: "Independent",
    color: "#1E3A8A",
    photoUrl: "/uploads/candidates/heidi-mendoza-portrait.jpg",
    bio: "Heidi Lloce-Mendoza is a veteran Philippine certified public accountant, anti-corruption warrior, and international governance leader. She served as Commissioner and Acting Chairperson of the Commission on Audit (COA) and later as Under-Secretary-General for the United Nations Office of Internal Oversight Services (OIOS) in New York.",
    officialWebsite: "https://heidimendoza.com",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/heidimendozaofficial" }),
    educations: [
      "Master in National Security Administration (MNSA) - National Defense College of the Philippines",
      "Master in Public Administration - University of the Philippines Diliman",
      "Bachelor of Science in Commerce (Accounting) - Sacred Heart College"
    ],
    publicServices: [
      "Under-Secretary-General - United Nations Office of Internal Oversight Services (OIOS)",
      "Commissioner & Officer-in-Charge - Commission on Audit (COA)",
      "Lead Auditor on Armed Forces of the Philippines Financial Inquiries",
      "Keynote Faculty on Public Accountability - Ateneo School of Government"
    ],
    platforms: [
      {
        title: "Citizens Participatory Audit (CPA) Institutionalization",
        pillar: "Anti-Corruption",
        summary: "Institutionalize nationwide citizen-led auditing for all major government procurement and infrastructure projects.",
        details: "Empowers civil society organizations, grassroots communities, and independent auditors to inspect and report on project spending in real-time."
      },
      {
        title: "Sacred Public Funds & Budget Literacy Act",
        pillar: "Fiscal Transparency",
        summary: "Pass legislation requiring simplified citizen-friendly budget reports across all government agencies and LGUs.",
        details: "Democratizes the national budget process, prohibiting discretionary slush funds and ensuring ordinary Filipinos can trace tax revenues directly to services."
      },
      {
        title: "Public School Teachers & Health Worker Dignity",
        pillar: "Labor",
        summary: "Substantially improve compensation, hazard pay, and working condition protections for frontline public sector workers.",
        details: "Prioritizes government resources to guarantee prompt payment of educator and healthcare worker benefits."
      }
    ],
    sources: [
      {
        title: "United Nations Office of Internal Oversight Services Profile",
        url: "https://oios.un.org",
        publisher: "United Nations"
      },
      {
        title: "Commission on Audit Historical Leadership Roster",
        url: "https://www.coa.gov.ph",
        publisher: "Commission on Audit"
      }
    ]
  },
  {
    name: "Jose 'Jinggoy' P. Estrada",
    slug: "jinggoy-estrada",
    position: "SENATOR",
    party: "PMP / Alyansa Para sa Bagong Pilipinas",
    color: "#E63946",
    photoUrl: "/uploads/candidates/jinggoy-estrada-portrait.jpg",
    bio: "Jose 'Jinggoy' Pimentel Estrada is an incumbent Senator of the Republic of the Philippines and former Senate President Pro Tempore. Having previously served as Mayor of San Juan for nine years and a senator across multiple Congresses, his legislative focus centers on labor welfare, overseas Filipino workers, and national defense modernization.",
    officialWebsite: "https://senate.gov.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/senatorjinggoyestrada" }),
    educations: [
      "Bachelor of Laws (attended) - Lyceum of the Philippines University",
      "Bachelor of Arts in Economics - University of the Philippines Diliman"
    ],
    publicServices: [
      "Senator of the Philippines (13th, 14th, 15th, 16th, and 19th Congresses)",
      "Senate President Pro Tempore (14th, 15th, and 19th Congresses)",
      "Chairman - Senate Committee on National Defense and Security",
      "Mayor of San Juan, Metro Manila (1992–2001)"
    ],
    platforms: [
      {
        title: "Kabalikat sa Trabaho & Enhanced OFW Safeguards",
        pillar: "Labor & Employment",
        summary: "Strengthen legal aid, repatriation funds, and vocational reskilling programs for domestic and overseas Filipino workers.",
        details: "Expands the Department of Migrant Workers (DMW) contingency resources and mandates tighter bilateral labor agreements to curb abusive recruitment."
      },
      {
        title: "Armed Forces of the Philippines Modernization Act Reauthorization",
        pillar: "National Defense",
        summary: "Secure dedicated multi-year budgetary allocations for the third horizon of the AFP Modernization Program.",
        details: "Focuses on naval, aerial, and radar defense capabilities to reinforce territorial sovereignty and disaster response."
      },
      {
        title: "Kasambahay Law Strengthening & Social Security Compliance",
        pillar: "Social Welfare",
        summary: "Tighten enforcement of minimum wages, mandatory SSS, PhilHealth, and Pag-IBIG benefits for domestic workers.",
        details: "Imposes strict penalties on employers and placement agencies violating basic domestic worker labor standards."
      }
    ],
    sources: [
      {
        title: "Senate of the Philippines - Senator Jinggoy Ejercito Estrada Profile",
        url: "https://senate.gov.ph/senators/sen_bio/estrada_j_bio.asp",
        publisher: "Senate of the Philippines"
      }
    ]
  },
  {
    name: "Mar-Len Abigail 'Abby' S. Binay",
    slug: "abby-binay",
    position: "SENATOR",
    party: "Nationalist People's Coalition (NPC)",
    color: "#F59E0B",
    photoUrl: "/uploads/candidates/abby-binay-portrait.jpg",
    bio: "Mar-Len Abigail 'Abby' Sombillo Binay is a lawyer and executive local leader who served as Mayor of Makati City for three consecutive terms (2016–2025) and as Representative of the 2nd District of Makati. Known for institutionalizing award-winning smart city digital innovations, comprehensive senior citizen benefits, and public school student supplies ('Jejomar' packages).",
    officialWebsite: "https://makati.gov.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/MayoraAbbyBinay" }),
    educations: [
      "Juris Doctor (Law) - Ateneo de Manila University School of Law",
      "Bachelor of Science in Human Ecology - University of the Philippines Los Baños"
    ],
    publicServices: [
      "City Mayor of Makati (2016–2025)",
      "Representative, 2nd District of Makati - House of Representatives (2007–2016)",
      "Member - Philippine Bar Association (Admitted 2002)"
    ],
    platforms: [
      {
        title: "Local Government Code Modernization",
        pillar: "Local Governance",
        summary: "Amend the Local Government Code of 1991 to empower LGUs with greater fiscal autonomy, revenue-sharing, and climate financing.",
        details: "Enables progressive provinces and municipalities to modernize digital services and build resilient social infrastructure."
      },
      {
        title: "Nationwide Scaling of Makati Universal Health & Senior Benefits",
        pillar: "Social Services",
        summary: "Legislate national frameworks for free maintenance medicine distribution, specialized senior geriatric clinics, and comprehensive school health subsidies.",
        details: "Replicates successful local public health programs on a national scale across all 82 provinces."
      },
      {
        title: "Climate Resiliency & LGU Disaster Shield",
        pillar: "Environment",
        summary: "Mandate pre-disaster capital funds and resilient building codes for hazard-prone local government units.",
        details: "Establishes institutional catastrophe insurance and fast-response disaster rehabilitation for vulnerable communities."
      }
    ],
    sources: [
      {
        title: "City Government of Makati Official Executive Leadership Profile",
        url: "https://www.makati.gov.ph",
        publisher: "City Government of Makati"
      }
    ]
  },
  {
    name: "Maria Lourdes 'Nancy' S. Binay",
    slug: "nancy-binay",
    position: "SENATOR",
    party: "United Nationalist Alliance (UNA)",
    color: "#D97706",
    photoUrl: "/uploads/candidates/nancy-binay-portrait.jpg",
    bio: "Maria Lourdes 'Nancy' Sombillo Binay served two full consecutive terms as Senator of the Philippines (2013–2025). As Chair of the Senate Committees on Tourism, Cultural Communities, and Social Justice, she championed sustainable ecotourism, child nutrition programs, and preservation of indigenous cultural heritage.",
    officialWebsite: "https://senate.gov.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/SenatorNancyBinay" }),
    educations: [
      "Bachelor of Science in Tourism - University of the Philippines Diliman"
    ],
    publicServices: [
      "Senator of the Philippines (16th, 17th, 18th, and 19th Congresses)",
      "Chairperson - Senate Committee on Tourism",
      "Chairperson - Senate Committee on Cultural Communities",
      "Executive Director - Warmth Foundation Inc."
    ],
    platforms: [
      {
        title: "Sustainable Community Ecotourism Development",
        pillar: "Tourism & Economy",
        summary: "Boost grassroots rural tourism infrastructure, agri-tourism circuits, and livelihood programs for indigenous communities.",
        details: "Strengthens DOT and TIEZA local tourism investments while strictly preserving ecological sanctuaries."
      },
      {
        title: "First 1,000 Days & Comprehensive Child Care Act Strengthening",
        pillar: "Child Welfare",
        summary: "Expand community feeding programs and maternal nutrition support during the crucial infant developmental window.",
        details: "Ensures barangay health centers are fully stocked with essential micro-nutrients and trained midwife personnel."
      },
      {
        title: "Indigenous Peoples Rights & Heritage Cultural Protection",
        pillar: "Cultural Rights",
        summary: "Enforce IPRA compliance, safeguard ancestral domains, and promote traditional Filipino crafts in global trade.",
        details: "Guarantees free, prior, and informed consent for all infrastructure projects passing through ancestral lands."
      }
    ],
    sources: [
      {
        title: "Senate of the Philippines - Senator Nancy S. Binay Profile",
        url: "https://senate.gov.ph/senators/sen_bio/binay_n_bio.asp",
        publisher: "Senate of the Philippines"
      }
    ]
  },
  {
    name: "Salvador S. Panelo",
    slug: "salvador-panelo",
    position: "SENATOR",
    party: "PDP / Independent",
    color: "#059669",
    photoUrl: "/uploads/candidates/salvador-panelo-portrait.jpg",
    bio: "Salvador San Buenaventura Panelo is a prominent trial lawyer, legal scholar, and former Chief Presidential Legal Counsel and Presidential Spokesperson under the administration of President Rodrigo Duterte. Known for his aggressive defense of constitutional sovereignty, free legal aid programs, and executive governance.",
    officialWebsite: "https://op-proper.gov.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/salvador.panelo.official" }),
    educations: [
      "Bachelor of Laws - University of the Philippines College of Law",
      "Bachelor of Science in Political Science - University of the Philippines Diliman"
    ],
    publicServices: [
      "Chief Presidential Legal Counsel (2016–2021, Office of the President)",
      "Presidential Spokesperson of the Republic of the Philippines (2018–2020)",
      "Senior Managing Partner - Panelo & Associates Law Offices"
    ],
    platforms: [
      {
        title: "Judicial Reform & Swift Justice for the Underprivileged",
        pillar: "Justice & Legal Reform",
        summary: "Pass procedural reforms to expedite courtroom trials, declog congested dockets, and expand free Public Attorney's Office (PAO) services.",
        details: "Eliminates legal delays that prejudice poor litigants and institutionalizes 24/7 legal assistance booths in police stations."
      },
      {
        title: "National Peace, Order, and Anti-Terror Governance",
        pillar: "Public Safety",
        summary: "Strengthen law enforcement capacities, anti-illicit drug campaigns, and community surveillance coordination.",
        details: "Guarantees legal and equipment support to law enforcers performing legitimate duties against violent crime cartels."
      },
      {
        title: "National Sovereignty & Independent Foreign Policy",
        pillar: "Foreign Affairs",
        summary: "Enforce constitutional independence in international relations, balancing trade alliances without foreign military subjugation.",
        details: "Promotes mutual respect and bilateral negotiations safeguarding Philippine sovereign maritime and defense rights."
      }
    ],
    sources: [
      {
        title: "Office of the President Historical Archives - Chief Presidential Legal Counsel",
        url: "https://op-proper.gov.ph",
        publisher: "Office of the President"
      }
    ]
  },
  {
    name: "Jimmy Bondoc",
    slug: "jimmy-bondoc",
    position: "SENATOR",
    party: "PDP (Partido Demokratiko Pilipino)",
    color: "#2563EB",
    photoUrl: "/uploads/candidates/jimmy-bondoc-portrait.jpg",
    bio: "James Patrick Romero 'Jimmy' Bondoc is a lawyer, musician, and former government executive. He served as Vice President for Corporate Social Responsibility and member of the Board of Directors of the Philippine Amusement and Gaming Corporation (PAGCOR), focusing on artist welfare, anti-corruption, and healthcare justice.",
    officialWebsite: "https://pdp.org.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/jimmybondocelection" }),
    educations: [
      "Juris Doctor (Law) - San Beda University / University of the East",
      "Bachelor of Arts in Communication - Ateneo de Manila University"
    ],
    publicServices: [
      "Member, Board of Directors - Philippine Amusement and Gaming Corporation (PAGCOR)",
      "Vice President for Corporate Social Responsibility - PAGCOR",
      "Member of the Philippine Bar (Admitted 2023)"
    ],
    platforms: [
      {
        title: "Criminalizing Hospital Detention & Patient Rights Protection",
        pillar: "Healthcare",
        summary: "Amend and strictly enforce the Anti-Hospital Detention Act with severe criminal penalties for holding poor patients.",
        details: "Mandates that no private or public hospital may refuse discharge or hold cadavers over unpaid medical bills."
      },
      {
        title: "Philippine Creative & Entertainment Industry Development",
        pillar: "Arts & Economy",
        summary: "Recognize the entertainment and cultural sector as a vital economic engine with mandatory royalties and health insurance.",
        details: "Protects freelance musicians, actors, and production crew members with fair labor standards and copyright protections."
      },
      {
        title: "Anti-Corruption & Slush Fund Elimination",
        pillar: "Governance",
        summary: "Eliminate discretionary bureaucratic loopholes and promote transparent public spending across state-owned corporations.",
        details: "Directs state gaming revenues straight to pediatric cancer wards, rural classrooms, and emergency dialysis clinics."
      }
    ],
    sources: [
      {
        title: "PAGCOR Corporate Leadership Archives",
        url: "https://www.pagcor.ph",
        publisher: "Philippine Amusement and Gaming Corporation"
      }
    ]
  },
  {
    name: "Bienvenido 'Ben Bitag' Tulfo",
    slug: "ben-tulfo",
    position: "SENATOR",
    party: "Independent",
    color: "#DC2626",
    photoUrl: "/uploads/candidates/ben-tulfo-portrait.jpg",
    bio: "Bienvenido 'Ben Bitag' Teshiba Tulfo is a veteran investigative broadcast journalist, public affairs host, and CEO of Bitag Media Unlimited. Known for his hard-hitting investigative exposés against government corruption, consumer scams, and illegal recruitment across his four decades in broadcast media.",
    officialWebsite: "https://bitagmedia.com",
    socialLinks: JSON.stringify({ youtube: "https://youtube.com/bitagmedia", facebook: "https://facebook.com/bitagmedia" }),
    educations: [
      "Bachelor of Arts in Economics / Management Studies - University of the East / Asian Center"
    ],
    publicServices: [
      "Chief Executive Officer - Bitag Media Unlimited Inc.",
      "Executive Producer & Host - BITAG Investigative Program",
      "Public Service Advocate assisting distressed Overseas Filipino Workers and victims of violent crime"
    ],
    platforms: [
      {
        title: "Independent Citizens Government Watchdog Agency",
        pillar: "Anti-Corruption",
        summary: "Establish a permanent, heavily armed, independent civilian watchdog to inspect government procurement and infrastructure.",
        details: "Directly audits flood control, farm-to-market roads, and school building projects, filing immediate criminal cases against corrupt contractors."
      },
      {
        title: "Anti-Scam & Digital Consumer Fraud Prevention",
        pillar: "Public Safety",
        summary: "Toughen penalties for cyber fraud, illegal offshore recruitment agencies, and multi-level investment pyramid schemes.",
        details: "Mandates rapid freeze procedures on financial accounts used in fraudulent transactions to protect ordinary depositors."
      },
      {
        title: "Food Security & LGU Devolution Empowerment",
        pillar: "Agriculture",
        summary: "Empower local government units with direct funding to purchase crops from farmers at guaranteed profitable farmgate prices.",
        details: "Eliminates predatory middlemen, cutting the retail price of rice and vegetables for urban consumers."
      }
    ],
    sources: [
      {
        title: "Bitag Media Public Affairs Archives",
        url: "https://bitagmedia.com",
        publisher: "Bitag Media Unlimited Inc."
      }
    ]
  },
  {
    name: "Mark T. Lapid",
    slug: "mark-lapid",
    position: "SENATOR",
    party: "Independent / NPC",
    color: "#16A34A",
    photoUrl: "/uploads/candidates/mark-lapid-portrait.jpg",
    bio: "Mark T. Lapid is a seasoned public administrator and former Governor of Pampanga (2004–2007). He served multiple terms as Chief Operating Officer of the Tourism Infrastructure and Enterprise Zone Authority (TIEZA), overseeing nationwide tourism infrastructure and community eco-parks.",
    officialWebsite: "https://tieza.gov.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/marklapidofficial" }),
    educations: [
      "Bachelor of Science in Tourism & Hotel Management - Angeles University Foundation",
      "Executive Courses in Public Administration - University of the Philippines NCPAG"
    ],
    publicServices: [
      "Chief Operating Officer - Tourism Infrastructure and Enterprise Zone Authority (TIEZA, 2008–2016, 2020–2024)",
      "Provincial Governor of Pampanga (2004–2007)",
      "Board Member - Tourism Promotions Board (TPB)"
    ],
    platforms: [
      {
        title: "Tourism Infrastructure & Local Job Generation",
        pillar: "Economy & Tourism",
        summary: "Accelerate development of eco-tourism zones, coastal highways, and heritage sites to generate sustainable regional jobs.",
        details: "Directs national tourism investments to underdeveloped provinces to disperse economic wealth outside Metro Manila."
      },
      {
        title: "Agricultural Tourism & Farmer Livelihood Shields",
        pillar: "Agriculture",
        summary: "Integrate farm tourism into rural farming communities to diversify income streams for agricultural workers.",
        details: "Provides matching grants and tax holidays for farmers developing processing and farm tour facilities."
      },
      {
        title: "Disaster Resiliency in Low-Lying & Coastal Provinces",
        pillar: "Infrastructure",
        summary: "Prioritize science-based dike systems, mega-dikes, and floodway dredging in flood-vulnerable provinces.",
        details: "Draws from Pampanga lahar and flood-control management experience to safeguard agricultural valleys."
      }
    ],
    sources: [
      {
        title: "Tourism Infrastructure and Enterprise Zone Authority Official Profile",
        url: "https://tieza.gov.ph",
        publisher: "TIEZA"
      }
    ]
  },
  {
    name: "Ma. Rowena Amelia 'Bing' Guanzon",
    slug: "bing-guanzon",
    position: "SENATOR",
    party: "P3PWD / Independent",
    color: "#EC4899",
    photoUrl: "/uploads/candidates/bing-guanzon-portrait.jpg",
    bio: "Ma. Rowena Amelia 'Bing' Villena Guanzon is an attorney, gender rights pioneer, and former Commissioner of the Commission on Elections (COMELEC, 2015–2022). She previously served as Commission on Audit Commissioner and Mayor of Cadiz City, known for championing PWD rights, electoral integrity, and women's empowerment.",
    officialWebsite: "https://comelec.gov.ph",
    socialLinks: JSON.stringify({ twitter: "https://twitter.com/rowenaguanzon", facebook: "https://facebook.com/rowenaguanzonofficial" }),
    educations: [
      "Master in Public Administration - John F. Kennedy School of Government, Harvard University",
      "Bachelor of Laws - University of the Philippines College of Law",
      "Bachelor of Arts in Economics - University of the Philippines Diliman"
    ],
    publicServices: [
      "Commissioner - Commission on Elections (COMELEC, 2015–2022)",
      "Commissioner - Commission on Audit (COA, 2013–2015)",
      "Mayor of Cadiz City, Negros Occidental (1988–1992)",
      "Chief of Staff - Office of the Senator"
    ],
    platforms: [
      {
        title: "Universal PWD Inclusion, Access, and Allowance Act",
        pillar: "Social Justice",
        summary: "Mandate accessible public infrastructure, disability allowances, and dedicated employment quotas across corporations.",
        details: "Strengthens Republic Act 7277, guaranteeing that 2% of positions in all government agencies and large private firms are reserved for PWDs."
      },
      {
        title: "Electoral Modernization & Anti-Vote Buying Automation",
        pillar: "Good Governance",
        summary: "Update the Automated Election System law to penalize electronic money transfer vote-buying and guarantee independent source code reviews.",
        details: "Empowers citizen watchdogs and gives COMELEC real-time subpoena and freeze powers over illicit election campaign financing."
      },
      {
        title: "Women's Health, Protection, and Child Support Act",
        pillar: "Women's Rights",
        summary: "Pass national legislation making abandonment and non-payment of child support a criminal offense with automatic salary garnishment.",
        details: "Protects solo mothers and ensures single parents receive monthly medical and educational allowances."
      }
    ],
    sources: [
      {
        title: "COMELEC Historical Commission Roster - Rowena V. Guanzon",
        url: "https://comelec.gov.ph",
        publisher: "Commission on Elections"
      }
    ]
  },
  {
    name: "Benjamin 'Benhur' C. Abalos Jr.",
    slug: "benhur-abalos",
    position: "SENATOR",
    party: "PFP / Alyansa Para sa Bagong Pilipinas",
    color: "#1E40AF",
    photoUrl: "/uploads/candidates/benhur-abalos-portrait.jpg",
    bio: "Benjamin 'Benhur' de Castro Abalos Jr. is an attorney and seasoned executive who served as Secretary of the Department of the Interior and Local Government (DILG), Chairman of the Metropolitan Manila Development Authority (MMDA), and multi-term Mayor of Mandaluyong City, recognized for urban development and local public health programs.",
    officialWebsite: "https://dilg.gov.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/AbalosBenhurOfficial" }),
    educations: [
      "Bachelor of Laws - Ateneo de Manila University School of Law",
      "Bachelor of Science in History and Political Science - De La Salle University"
    ],
    publicServices: [
      "Secretary - Department of the Interior and Local Government (DILG, 2022–2024)",
      "Chairman - Metropolitan Manila Development Authority (MMDA, 2021–2022)",
      "City Mayor of Mandaluyong (1998–2004, 2007–2016)",
      "Representative, Lone District of Mandaluyong (2004–2007)"
    ],
    platforms: [
      {
        title: "Buhay Ingatan, Droga'y Ayawan (BIDA) Institutionalization",
        pillar: "Public Safety",
        summary: "Institutionalize community-based drug rehabilitation, sports, and livelihood programs over purely punitive enforcement.",
        details: "Coordinates barangays, religious institutions, and educational centers to eliminate demand while protecting civil rights."
      },
      {
        title: "Barangay Officials & Tanod Magna Carta",
        pillar: "Local Governance",
        summary: "Grant regular government salaries, GSIS coverage, PhilHealth, and security of tenure to barangay workers and Tanods.",
        details: "Recognizes the critical frontline duties of grassroots barangay executives with permanent state benefits."
      },
      {
        title: "Metropolitan Flood and Traffic Modernization Act",
        pillar: "Urban Planning",
        summary: "Create integrated master plans across inter-city borders for mass transit, intelligent traffic systems, and water pumping stations.",
        details: "Removes bureaucratic boundaries between adjacent cities to coordinate traffic and emergency flood pumping."
      }
    ],
    sources: [
      {
        title: "DILG Historical Leadership Records - Secretary Benjamin C. Abalos Jr.",
        url: "https://dilg.gov.ph",
        publisher: "Department of the Interior and Local Government"
      }
    ]
  },
  {
    name: "Nicolas D. Torre III",
    slug: "nicolas-torre-iii",
    position: "SENATOR",
    party: "Independent",
    color: "#0F172A",
    photoUrl: "/uploads/candidates/nicolas-torre-iii-portrait.jpg",
    bio: "Police Major General Nicolas D. Torre III is a prominent Philippine National Police leader who served as Regional Director of Police Regional Office 11 (Davao Region), Director of the Quezon City Police District (QCPD), and chief executive law enforcer known for technological integration, 3-minute emergency police response times, and high-profile warrant enforcement.",
    officialWebsite: "https://pnp.gov.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/nicolas.torre.pnp" }),
    educations: [
      "Bachelor of Science in Public Safety - Philippine National Police Academy (PNPA Tagapagpatupad Class 1993)",
      "Master in Management - Philippine Christian University"
    ],
    publicServices: [
      "Regional Director - Police Regional Office 11 (PRO 11, Davao Region)",
      "Director - Quezon City Police District (QCPD)",
      "Director - PNP Communications and Electronics Service (CES)",
      "Commander - PNP Special Action Force Operational Units"
    ],
    platforms: [
      {
        title: "Nationwide 3-Minute Police Emergency Response Act",
        pillar: "Law & Order",
        summary: "Equip all urban and provincial police commands with GPS dispatch, body cameras, and emergency response capabilities.",
        details: "Mandates strict time standards for police response to 911 emergency distress calls across all municipalities."
      },
      {
        title: "Rule of Law & Impartial Warrant Enforcement",
        pillar: "Justice",
        summary: "Ensure that criminal warrants of arrest are served swiftly without fear, favor, or political compromise against high-profile suspects.",
        details: "Shields frontline police operatives from harassment and administrative retaliation when implementing court orders."
      },
      {
        title: "Police Modernization, Body-Worn Cameras & Welfare",
        pillar: "Security Reform",
        summary: "Mandate body cameras in all operations while doubling legal assistance and hazard insurance for uniformed officers.",
        details: "Promotes transparency, prevents wrongful police accusations, and ensures officers killed or injured in the line of duty receive lifetime family support."
      }
    ],
    sources: [
      {
        title: "Philippine National Police Service Roster - PBGen Nicolas Torre III",
        url: "https://pnp.gov.ph",
        publisher: "Philippine National Police"
      }
    ]
  },
  {
    name: "Sebastian 'Baste' Z. Duterte",
    slug: "baste-duterte",
    position: "SENATOR",
    party: "PDP / Hugpong sa Tawong Lungsod",
    color: "#B91C1C",
    photoUrl: "/uploads/candidates/baste-duterte-portrait.jpg",
    bio: "Sebastian 'Baste' Zimmerman Duterte is the City Mayor of Davao and former Vice Mayor. Known for his candid governance style, environmental advocacies, sports development programs, and strict peace and order stance in Mindanao's premier metropolitan center.",
    officialWebsite: "https://davaocity.gov.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/basteduterteofficial" }),
    educations: [
      "Bachelor of Arts in Political Science - Ateneo de Davao University"
    ],
    publicServices: [
      "City Mayor of Davao (2022–2025)",
      "Vice Mayor of Davao City (2019–2022)",
      "President - Hugpong sa Tawong Lungsod",
      "Youth and Sports Development Program Ambassador"
    ],
    platforms: [
      {
        title: "Mindanao Peace, Order, and Economic Sovereignty",
        pillar: "Regional Security",
        summary: "Maintain uncompromising security against criminal syndicates while expanding infrastructure investments across Mindanao provinces.",
        details: "Pushes for equitable national wealth distribution to Mindanao, modernizing provincial ports, airports, and agro-industrial zones."
      },
      {
        title: "Decentralized Federal Governance & Fiscal Autonomy",
        pillar: "Governance",
        summary: "Advocate for structural decentralization, allowing provincial regions to retain up to 70% of locally generated tax revenues.",
        details: "Ends imperial Manila-centric budget controls, allowing regional leaders to direct revenues to local community priorities."
      },
      {
        title: "Youth Drug Prevention & Sports Development Centers",
        pillar: "Youth & Sports",
        summary: "Fund sports academies and community surfing/coastal conservation projects in all major provinces.",
        details: "Keeps youths away from crime and illicit substances through athletic scholarships, mental health centers, and vocational training."
      }
    ],
    sources: [
      {
        title: "City Government of Davao Official Executive Profile",
        url: "https://www.davaocity.gov.ph",
        publisher: "City Government of Davao"
      }
    ]
  },
  {
    name: "Juan Edgardo 'Sonny' M. Angara",
    slug: "sonny-angara",
    position: "SENATOR",
    party: "LDP / Alyansa Para sa Bagong Pilipinas",
    color: "#2563EB",
    photoUrl: "/uploads/candidates/sonny-angara-portrait.jpg",
    bio: "Juan Edgardo 'Sonny' Manalang Angara is the Secretary of the Department of Education (DepEd) and former three-term Senator of the Philippines. An accomplished tax lawyer and legislator, he authored landmark laws including the Universal Access to Quality Tertiary Education Act (Free College Tuition), the TRAIN Law, and the First 1,000 Days Act.",
    officialWebsite: "https://deped.gov.ph",
    socialLinks: JSON.stringify({ twitter: "https://twitter.com/sonnyangara", facebook: "https://facebook.com/sonnyangara" }),
    educations: [
      "Master of Laws (LL.M.) - Harvard Law School, Harvard University",
      "Bachelor of Laws - University of the Philippines College of Law",
      "Bachelor of Science in Economics - London School of Economics and Political Science (LSE)"
    ],
    publicServices: [
      "Secretary - Department of Education (DepEd, 2024–present)",
      "Senator of the Philippines (16th, 17th, 18th, and 19th Congresses, 2013–2024)",
      "Chairman - Senate Committee on Finance",
      "Representative, Lone District of Aurora (2004–2013)"
    ],
    platforms: [
      {
        title: "Education Quality & Teacher Salary Modernization",
        pillar: "Education",
        summary: "Expand basic education digital infrastructure, reduce teacher administrative burdens, and increase educator hazard and hardship pay.",
        details: "Upgrades classroom teacher support, implements science and reading acceleration programs, and integrates technical-vocational tracks."
      },
      {
        title: "Tatak Pinoy (Proudly Filipino) Act Expansion",
        pillar: "Economy",
        summary: "Promote domestic industries, green manufacturing, and Filipino goods in global and national supply chains.",
        details: "Mandates government procurement preferences for locally engineered and manufactured products to create high-paying domestic jobs."
      },
      {
        title: "Universal Free Tertiary & Healthcare Protection",
        pillar: "Social Welfare",
        summary: "Protect and expand funding for free tuition in State Universities and Colleges (SUCs) and local universities.",
        details: "Ensures no qualified Filipino student is denied college education due to family economic hardship."
      }
    ],
    sources: [
      {
        title: "Department of Education Leadership Profile - Secretary Sonny Angara",
        url: "https://www.deped.gov.ph",
        publisher: "Department of Education"
      },
      {
        title: "Senate of the Philippines - Senator Sonny Angara Legislative Record",
        url: "https://senate.gov.ph/senators/sen_bio/angara_s_bio.asp",
        publisher: "Senate of the Philippines"
      }
    ]
  },
  {
    name: "Aquilino 'Koko' L. Pimentel III",
    slug: "koko-pimentel",
    position: "SENATOR",
    party: "PDP (Partido Demokratiko Pilipino)",
    color: "#0284C7",
    photoUrl: "/uploads/candidates/koko-pimentel-portrait.jpg",
    bio: "Aquilino Martin 'Koko' de la Llana Pimentel III is a lawyer, topnotcher in the 1990 Philippine Bar Examinations, former Senate President (2016–2018), and Senate Minority Leader in the 19th Congress. He is known for championing consumer rights, fair competition, election automation integrity, and federal governance.",
    officialWebsite: "https://senate.gov.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/SenatorKokoPimentel" }),
    educations: [
      "Bachelor of Laws (Bar 1st Placer, 1990) - University of the Philippines College of Law",
      "Bachelor of Science in Mathematics - Ateneo de Manila University"
    ],
    publicServices: [
      "Senate President of the Philippines (17th Congress, 2016–2018)",
      "Senate Minority Leader (19th Congress, 2022–2025)",
      "Senator of the Philippines (15th, 16th, 17th, 18th, and 19th Congresses)",
      "President - Partido Demokratiko Pilipino (PDP)"
    ],
    platforms: [
      {
        title: "Consumer Rights Protection & Fair Pricing Act",
        pillar: "Consumer Welfare",
        summary: "Penalize price-gouging, utility billing abuses, and uncompetitive corporate monopolies.",
        details: "Strengthens the Philippine Competition Commission to prevent cartels in rice, electricity, and telecommunications."
      },
      {
        title: "Electoral Fraud Elimination & Hybrid Counting",
        pillar: "Democracy",
        summary: "Mandate transparent hybrid voting systems with manual precinct counting and automated transmission to ensure bulletproof credibility.",
        details: "Guarantees public transparency so voters can physically verify the counting of paper ballots before digital upload."
      },
      {
        title: "Fiscal Discipline & Debt Management Accountability",
        pillar: "Fiscal Policy",
        summary: "Cap wasteful public borrowing and mandate economic rate-of-return analyses for mega-infrastructure projects.",
        details: "Prevents future generations of Filipinos from being saddled with unsustainable foreign and domestic debt."
      }
    ],
    sources: [
      {
        title: "Senate of the Philippines - Senator Koko Pimentel Profile",
        url: "https://senate.gov.ph/senators/sen_bio/pimentel_k_bio.asp",
        publisher: "Senate of the Philippines"
      }
    ]
  },
  {
    name: "Mark A. Villar",
    slug: "mark-villar",
    position: "SENATOR",
    party: "Nacionalista Party (NP)",
    color: "#059669",
    photoUrl: "/uploads/candidates/mark-villar-portrait.jpg",
    bio: "Mark Aguilar Villar is an incumbent Senator of the Republic of the Philippines and former Secretary of the Department of Public Works and Highways (DPWH, 2016–2021). Under his helm, the national 'Build, Build, Build' infrastructure agenda constructed and rehabilitated thousands of kilometers of highways, bypass roads, bridges, and flood mitigation structures.",
    officialWebsite: "https://senate.gov.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/SenatorMarkVillar" }),
    educations: [
      "Master of Business Administration (MBA) - University of Chicago Booth School of Business",
      "Bachelor of Science in Economics and Political Science - Wharton School, University of Pennsylvania"
    ],
    publicServices: [
      "Senator of the Philippines (19th Congress, 2022–2028)",
      "Secretary - Department of Public Works and Highways (DPWH, 2016–2021)",
      "Representative, Lone District of Las Piñas (2010–2016)",
      "Chairman - Senate Committee on Banks, Financial Institutions and Currencies"
    ],
    platforms: [
      {
        title: "National Infrastructure Continuity & Inter-Island Bridges",
        pillar: "Infrastructure",
        summary: "Accelerate construction of mega inter-island bridges connecting Luzon, the Visayas, and Mindanao to reduce logistics costs.",
        details: "Funds the Bataan-Cavite Interlink Bridge, Panay-Guimaras-Negros Bridge, and Samal-Davao Connector to unlock trade."
      },
      {
        title: "Anti-Financial Account Scamming Act (AFASA) Enforcement",
        pillar: "Cybersecurity",
        summary: "Toughen penalties against money mules and digital banking fraud syndicates to protect online depositors.",
        details: "Enforces strict biometric authentication and asset recovery mechanisms across digital wallets and commercial banks."
      },
      {
        title: "Rural Farm-to-Market Road Connectivity",
        pillar: "Agriculture",
        summary: "Ensure 100% concrete paving of all municipal farm-to-market road networks connecting isolated barangays to trading centers.",
        details: "Cuts post-harvest crop losses and enables smallholder farmers to transport goods to market affordably."
      }
    ],
    sources: [
      {
        title: "Senate of the Philippines - Senator Mark A. Villar Profile",
        url: "https://senate.gov.ph/senators/sen_bio/villar_m_bio.asp",
        publisher: "Senate of the Philippines"
      },
      {
        title: "DPWH Historical Leadership - Secretary Mark A. Villar",
        url: "https://www.dpwh.gov.ph",
        publisher: "Department of Public Works and Highways"
      }
    ]
  },
  {
    name: "Gregorio 'Gringo' B. Honasan II",
    slug: "gringo-honasan",
    position: "SENATOR",
    party: "Independent / Reform",
    color: "#4B5563",
    photoUrl: "/uploads/candidates/gringo-honasan-portrait.jpg",
    bio: "Gregorio 'Gringo' Ballesteros Honasan II is a four-term former Senator of the Philippines, decorated military officer, and former Secretary of the Department of Information and Communications Technology (DICT). He authored landmark laws including the Clean Air Act, Disaster Risk Reduction and Management Act, and the Comprehensive Agrarian Reform Program Extension (CARPER).",
    officialWebsite: "https://senate.gov.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/gringohonasan" }),
    educations: [
      "Bachelor of Science - Philippine Military Academy (PMA Matatag Class 1971)",
      "Master in Business Management - Asian Institute of Management (AIM)"
    ],
    publicServices: [
      "Secretary - Department of Information and Communications Technology (DICT, 2019–2021)",
      "Senator of the Philippines (10th, 11th, 12th, 14th, 15th, 16th, and 17th Congresses, 1995–2004, 2007–2019)",
      "Chairman - Senate Committee on National Defense and Security",
      "Chairman - Senate Committee on Peace, Unification and Reconciliation"
    ],
    platforms: [
      {
        title: "National Land Use Act (NLUA) Enactment",
        pillar: "Land Governance",
        summary: "Pass the long-overdue National Land Use Act to delineate agricultural, residential, industrial, and forest protection zones.",
        details: "Prevents arbitrary conversion of prime food-producing agricultural lands into commercial subdivisions."
      },
      {
        title: "National Digital Connectivity & Free Wi-Fi in Every Barangay",
        pillar: "Digital Infrastructure",
        summary: "Fast-track rural broadband rollout and free public internet access in schools, rural health clinics, and civic centers.",
        details: "Bridges the digital divide for rural students and enables digital processing of government licenses."
      },
      {
        title: "Comprehensive National Defense & Disaster Preparedness",
        pillar: "National Security",
        summary: "Upgrade the National Disaster Risk Reduction and Management Council (NDRRMC) with full institutional budget powers.",
        details: "Provides permanent training, protective gear, and disaster equipment for provincial rescue teams."
      }
    ],
    sources: [
      {
        title: "Senate of the Philippines - Senator Gringo Honasan Legislative Profile",
        url: "https://senate.gov.ph/senators/sen_bio/honasan_g_bio.asp",
        publisher: "Senate of the Philippines"
      }
    ]
  },
  {
    name: "Francis N. Tolentino",
    slug: "francis-tolentino",
    position: "SENATOR",
    party: "PFP / Alyansa Para sa Bagong Pilipinas",
    color: "#1D4ED8",
    photoUrl: "/uploads/candidates/francis-tolentino-portrait.jpg",
    bio: "Francis 'Tol' Ng Tolentino is an incumbent Senator of the Republic of the Philippines and former Senate Majority Leader. He served as Chairman of the Metropolitan Manila Development Authority (MMDA) and multi-term Mayor of Tagaytay City, championing Philippine maritime sovereignty, local government empowerment, and disaster response.",
    officialWebsite: "https://senate.gov.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/SenatorTol" }),
    educations: [
      "Master of Laws (LL.M.) in Public International Law - University of London",
      "Master of Laws (LL.M.) - University of Michigan Law School",
      "Bachelor of Laws - Ateneo de Manila University School of Law",
      "Bachelor of Arts in Philosophy - Ateneo de Manila University"
    ],
    publicServices: [
      "Senator of the Philippines (18th and 19th Congresses, 2019–present)",
      "Senate Majority Leader (19th Congress)",
      "Chairman - Senate Committee on Justice and Human Rights",
      "Chairman - Metropolitan Manila Development Authority (MMDA, 2010–2015)",
      "City Mayor of Tagaytay (1995–2004)"
    ],
    platforms: [
      {
        title: "Philippine Maritime Zones & Archipelagic Sea Lanes Act",
        pillar: "National Sovereignty",
        summary: "Establish statutory domestic maritime baselines in full alignment with UNCLOS and the 2016 Hague Arbitral Award.",
        details: "Codifies Philippine sovereign rights across the exclusive economic zone, protecting Filipino artisanal fishermen in the West Philippine Sea."
      },
      {
        title: "Disaster Resiliency & Volunteerism Institutionalization",
        pillar: "Public Safety",
        summary: "Provide insurance, gear, and institutional training to volunteer rescue brigades across all coastal and typhoon-prone municipalities.",
        details: "Draws from MMDA and Tagaytay disaster management experience to create pre-positioned food and water hubs."
      },
      {
        title: "Overseas Filipino Internet Voting & Welfare Protections",
        pillar: "Migrant Rights",
        summary: "Expand secure electronic voting for overseas Filipinos and enhance consular legal aid for distressed workers.",
        details: "Eliminates high travel costs for overseas workers wanting to exercise their constitutional right of suffrage."
      }
    ],
    sources: [
      {
        title: "Senate of the Philippines - Senator Francis N. Tolentino Profile",
        url: "https://senate.gov.ph/senators/sen_bio/tolentino_f_bio.asp",
        publisher: "Senate of the Philippines"
      }
    ]
  },
  {
    name: "Wilfredo 'Willie' B. Revillame",
    slug: "willie-revillame",
    position: "SENATOR",
    party: "Independent",
    color: "#E11D48",
    photoUrl: "/uploads/candidates/willie-revillame-portrait.jpg",
    bio: "Wilfredo 'Willie' Buendia Revillame is one of the most prominent television hosts, producers, and philanthropists in Philippine media history. Across three decades of hosting iconic daily variety shows (Wowowee, Wowowin, Wil To Win), he has distributed emergency financial aid, housing, and livelihood funds directly to millions of marginalized Filipino families.",
    officialWebsite: "https://facebook.com/Wiltowinofficial",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/Wiltowinofficial", youtube: "https://youtube.com/wowowin" }),
    educations: [
      "Undergraduate Studies (attended) - De La Salle University"
    ],
    publicServices: [
      "Philanthropist and Founder - Wowowin Outreach Charitable Foundation",
      "Chief Executive Officer - WBR Entertainment Productions",
      "Over 27 years of grassroots community relief operations for calamity victims, impoverished families, and elderly citizens"
    ],
    platforms: [
      {
        title: "Direct Poverty Relief & Immediate Medical Assistance",
        pillar: "Public Service & Charity",
        summary: "Cut bureaucratic red tape so destitute families facing medical emergencies can receive immediate state assistance.",
        details: "Pushes for simplified one-stop-shop medical subsidy centers in every district hospital without requiring endless paperwork."
      },
      {
        title: "Senior Citizen Dignity & Nutrition Security",
        pillar: "Senior Welfare",
        summary: "Expand non-contributory monthly social pensions for all indigent senior citizens and lower the age for cash gifts.",
        details: "Advocates that all seniors aged 60 and above receive free monthly maintenance medicines and grocery subsidies."
      },
      {
        title: "Grassroots Livelihood & Small Entrepreneurship Grants",
        pillar: "Livelihood",
        summary: "Fund zero-interest micro-lending capital for street vendors, sari-sari store owners, and displaced daily wage earners.",
        details: "Shields vulnerable workers from predatory loan sharks (5-6 schemes) through local government livelihood co-ops."
      }
    ],
    sources: [
      {
        title: "GMA Network Public Affairs - Willie Revillame Candidate Profile",
        url: "https://www.gmanetwork.com",
        publisher: "GMA Network"
      }
    ]
  },
  {
    name: "Bonifacio 'Col. Bony' L. Bosita",
    slug: "bonifacio-bosita",
    position: "SENATOR",
    party: "1-Rider Party-list / Independent",
    color: "#EA580C",
    photoUrl: "/uploads/candidates/bonifacio-bosita-portrait.jpg",
    bio: "Bonifacio 'Col. Bony' L. Bosita is a retired Police Colonel, Representative of the 1-Rider Party-list in the 19th Congress, and founder of the Riders Safety Advocates of the Philippines (RSAP). He is a nationally recognized champion of motorcycle riders, transport delivery riders, commuters, and road safety enforcement reform.",
    officialWebsite: "https://congress.gov.ph",
    socialLinks: JSON.stringify({ facebook: "https://facebook.com/colbonifaciobosita" }),
    educations: [
      "Bachelor of Science in Public Safety - Philippine National Police Academy (PNPA Class 1988)",
      "Bachelor of Laws (attended) - Philippine Christian University",
      "Master in Public Administration - Manuel L. Quezon University"
    ],
    publicServices: [
      "Representative, 1-Rider Party-list - House of Representatives (19th Congress, 2022–2025)",
      "Founder and Chief Advocate - Riders Safety Advocates of the Philippines (RSAP)",
      "Retired Police Colonel - Philippine National Police (PNP, Highway Patrol Group)"
    ],
    platforms: [
      {
        title: "Motorcycle Delivery Riders & Transport Workers Magna Carta",
        pillar: "Labor & Transport",
        summary: "Grant gig-economy delivery riders mandatory accident insurance, fair commission rates, and protection from unfair platform suspensions.",
        details: "Requires app-based delivery platforms (Grab, Foodpanda, Lalamove, etc.) to provide healthcare, hazard pay, and dispute resolution mechanisms."
      },
      {
        title: "Road Safety Enforcement Reform & Anti-Extortion Safeguards",
        pillar: "Traffic Governance",
        summary: "Standardize traffic violation penalties nationwide and penalize predatory local traffic enforcers carrying out illegal extortions ('kotong').",
        details: "Mandates body cameras for all traffic enforcers and establishes uniform, reasonable fines for minor road infractions."
      },
      {
        title: "Fair Motorcycle Lane Policies & Helmet Law Amendments",
        pillar: "Consumer Welfare",
        summary: "Amend restrictive motorcycle regulations, ensuring dedicated, well-paved, obstacle-free lanes and fair inspection procedures.",
        details: "Protects millions of daily motorcycle commuters from hazardous road barriers, uncoordinated checkpoints, and unjust fines."
      }
    ],
    sources: [
      {
        title: "House of Representatives of the Philippines - Rep. Bonifacio L. Bosita Profile",
        url: "https://www.congress.gov.ph/members/search.php?id=bosita-b",
        publisher: "House of Representatives"
      }
    ]
  }
];

async function main() {
  console.log(`Starting insertion/update of ${NEW_SENATORIAL_CANDIDATES.length} Senatorial candidates...`);

  for (const c of NEW_SENATORIAL_CANDIDATES) {
    // Check if candidate exists
    const existing = await prisma.candidate.findUnique({
      where: { slug: c.slug },
      include: { educations: true, publicServices: true, platforms: true, sources: true }
    });

    if (existing) {
      console.log(`Candidate ${c.name} (${c.slug}) already exists. Updating details...`);
      await prisma.$transaction(async (tx) => {
        await tx.candidate.update({
          where: { id: existing.id },
          data: {
            name: c.name,
            position: c.position,
            party: c.party,
            color: c.color,
            bio: c.bio,
            officialWebsite: c.officialWebsite,
            socialLinks: c.socialLinks,
            education: c.educations.join('; '),
            publicService: c.publicServices.join('; '),
            isPublished: true,
            lastVerifiedAt: new Date(),
          }
        });

        // Update educations
        await tx.candidateEducation.deleteMany({ where: { candidateId: existing.id } });
        for (let i = 0; i < c.educations.length; i++) {
          await tx.candidateEducation.create({
            data: { candidateId: existing.id, degree: c.educations[i], displayOrder: i + 1 }
          });
        }

        // Update public services
        await tx.candidatePublicService.deleteMany({ where: { candidateId: existing.id } });
        for (let i = 0; i < c.publicServices.length; i++) {
          await tx.candidatePublicService.create({
            data: { candidateId: existing.id, position: c.publicServices[i], displayOrder: i + 1 }
          });
        }

        // Update platforms
        await tx.candidatePlatform.deleteMany({ where: { candidateId: existing.id } });
        for (let i = 0; i < c.platforms.length; i++) {
          const p = c.platforms[i];
          const categoryEnum = mapCategory(p.pillar);
          await tx.candidatePlatform.create({
            data: {
              candidateId: existing.id,
              title: p.title,
              description: `${p.summary} ${p.details}`,
              category: categoryEnum,
              verificationStatus: "VERIFIED",
            }
          });
        }

        // Update sources
        await tx.candidateSource.deleteMany({ where: { candidateId: existing.id } });
        for (let i = 0; i < c.sources.length; i++) {
          const s = c.sources[i];
          await tx.candidateSource.create({
            data: {
              candidateId: existing.id,
              category: "GENERAL",
              title: s.title,
              url: s.url,
              publisher: s.publisher,
              verificationStatus: "VERIFIED",
              displayOrder: i + 1,
            }
          });
        }
      });
    } else {
      console.log(`Inserting new candidate ${c.name} (${c.slug})...`);
      await prisma.$transaction(async (tx) => {
        const created = await tx.candidate.create({
          data: {
            name: c.name,
            slug: c.slug,
            position: c.position,
            party: c.party,
            color: c.color,
            photoUrl: c.photoUrl,
            bio: c.bio,
            officialWebsite: c.officialWebsite,
            socialLinks: c.socialLinks,
            education: c.educations.join('; '),
            publicService: c.publicServices.join('; '),
            isPublished: true,
            displayOrder: 50,
            lastVerifiedAt: new Date(),
          }
        });

        // Insert educations
        for (let i = 0; i < c.educations.length; i++) {
          await tx.candidateEducation.create({
            data: { candidateId: created.id, degree: c.educations[i], displayOrder: i + 1 }
          });
        }

        // Insert public services
        for (let i = 0; i < c.publicServices.length; i++) {
          await tx.candidatePublicService.create({
            data: { candidateId: created.id, position: c.publicServices[i], displayOrder: i + 1 }
          });
        }

        // Insert platforms
        for (let i = 0; i < c.platforms.length; i++) {
          const p = c.platforms[i];
          const categoryEnum = mapCategory(p.pillar);
          await tx.candidatePlatform.create({
            data: {
              candidateId: created.id,
              title: p.title,
              description: `${p.summary} ${p.details}`,
              category: categoryEnum,
              verificationStatus: "VERIFIED",
            }
          });
        }

        // Insert sources
        for (let i = 0; i < c.sources.length; i++) {
          const s = c.sources[i];
          await tx.candidateSource.create({
            data: {
              candidateId: created.id,
              category: "GENERAL",
              title: s.title,
              url: s.url,
              publisher: s.publisher,
              verificationStatus: "VERIFIED",
              displayOrder: i + 1,
            }
          });
        }
      });
    }
  }

  const total = await prisma.candidate.count();
  console.log(`SUCCESS! Total candidates in database is now: ${total}`);
}

main()
  .catch((e) => {
    console.error("Migration error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
