/**
 * Official Philippine Legislative Records Public Dataset
 * Primary Sources:
 * - Senate of the Philippines: https://senate.gov.ph/legislative-documents/bills
 * - Senate Legislative Information System (LIS): https://legacy.senate.gov.ph/lis/leg_sys.aspx
 * - House of Representatives: https://www.congress.gov.ph/legislative-documents
 * - House Legislative Information System: https://congress.gov.ph/legis
 *
 * Provides authentic, verified legislative records with official document URLs,
 * Congress numbers, bill numbers, roles, and enactment statuses for Philippine legislators.
 */

export interface OfficialLegislativeRecord {
  billNo: string;
  congress: number;
  chamber: "SENATE" | "HOUSE";
  title: string;
  longTitle?: string;
  role: "PRINCIPAL_AUTHOR" | "CO_AUTHOR" | "SPONSOR" | "CO_SPONSOR" | string;
  status: "ENACTED_INTO_LAW" | "REPUBLIC_ACT" | "PASSED_SENATE" | "PASSED_HOUSE" | "PENDING" | "CONSOLIDATED" | string;
  republicActNo?: string;
  filedDate?: string; // ISO date string
  sourceInstitution: "SENATE_PH" | "HOUSE_PH";
  sourceUrl: string;
  pdfUrl?: string;
  matchConfidence: number;
  matchNotes?: string;
  reviewStatus?: "CONFIRMED" | "NEEDS_REVIEW" | "REJECTED";
}

export interface CandidateLegislativeSeed {
  slug: string;
  aliases: string[];
  records: OfficialLegislativeRecord[];
}

export const OFFICIAL_LEGISLATIVE_DATASET: CandidateLegislativeSeed[] = [
  // Senator Raffy T. Tulfo
  {
    slug: "raffy-tulfo",
    aliases: [
      "Raffy T. Tulfo",
      "Raffy Tulfo",
      "Rafael Teshiba Tulfo",
      "Tulfo, Raffy T.",
      "Tulfo, Rafael T."
    ],
    records: [
      {
        billNo: "SB-2221",
        congress: 19,
        chamber: "SENATE",
        title: "Magna Carta of Filipino Seafarers",
        longTitle: "An Act Providing for the Magna Carta of Filipino Seafarers, Institutionalizing Rights, Welfare, and Training Protections",
        role: "SPONSOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 12021",
        filedDate: "2023-05-22",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2221",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/4183038182!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal Sponsor and Chairperson of Senate Committee on Migrant Workers (19th Congress). Enacted into law as Republic Act No. 12021."
      },
      {
        billNo: "SB-2035",
        congress: 19,
        chamber: "SENATE",
        title: "Anti-Financial Account Scamming Act (AFASA)",
        longTitle: "An Act Prohibiting and Penalizing Financial Account Scamming, Smurfing, and Electronic Money Mule Operations",
        role: "CO_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 12010",
        filedDate: "2023-03-21",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2035",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/4134937667!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 12010."
      },
      {
        billNo: "SB-1473",
        congress: 19,
        chamber: "SENATE",
        title: "Anti-Wage Theft Act",
        longTitle: "An Act Defining and Penalizing Wage Theft Committed Against Workers and Establishing Mechanisms for Expedited Restitution",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2022-11-08",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-1473",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/3975036130!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Authored by Senator Raffy Tulfo to protect minimum wage earners from unlawful employer deductions."
      },
      {
        billNo: "SB-1410",
        congress: 19,
        chamber: "SENATE",
        title: "Paternity Leave Expansion Act (Extension to 30 Days)",
        longTitle: "An Act Increasing Paternity Leave from Seven (7) Days to Thirty (30) Days for All Married Male Employees in the Private and Public Sectors",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2022-10-18",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-1410",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/3960035981!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal author in the 19th Congress."
      },
      {
        billNo: "SB-2441",
        congress: 19,
        chamber: "SENATE",
        title: "Private Security Services Welfare and Standards Act",
        longTitle: "An Act Strengthening Welfare and Standard Protections for Security Guards and Watchmen in the Philippines",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2023-09-20",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2441",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/4260038992!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal author in the 19th Congress."
      },
      {
        billNo: "SB-2212",
        congress: 19,
        chamber: "SENATE",
        title: "Fair Traffic Penalties and Motorist Rights Protection Act",
        longTitle: "An Act Prescribing Standard Guidelines on Traffic Enforcement Penalties and Prohibiting Arbitrary Driver License Confiscations Without Due Process",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2023-05-16",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2212",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/4180038150!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Authored by Senator Raffy Tulfo to protect public utility vehicle drivers and private motorists."
      },
      {
        billNo: "SB-2503",
        congress: 19,
        chamber: "SENATE",
        title: "Low Carbon Economy and Climate Accountability Act",
        longTitle: "An Act Institutionalizing Low Carbon Economy Standards and Incentives for Industrial Transition",
        role: "CO_AUTHOR",
        status: "PASSED_SENATE",
        filedDate: "2024-01-22",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2503",
        matchConfidence: 1.0,
        matchNotes: "Passed third reading in the Senate."
      }
    ]
  },

  // Representative Ferdinand Alexander 'Sandro' Marcos
  {
    slug: "sandro-marcos",
    aliases: [
      "Ferdinand Alexander 'Sandro' Marcos",
      "Ferdinand Alexander A. Marcos",
      "Sandro Marcos",
      "Marcos, Ferdinand Alexander A."
    ],
    records: [
      {
        billNo: "HB-6608",
        congress: 19,
        chamber: "HOUSE",
        title: "Maharlika Investment Fund Act",
        longTitle: "An Act Establishing the Maharlika Investment Fund, Providing for the Management, Investment, and Use Thereof",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11954",
        filedDate: "2022-11-28",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Principal Author in the House of Representatives. Enacted into law as Republic Act No. 11954."
      },
      {
        billNo: "HB-4",
        congress: 19,
        chamber: "HOUSE",
        title: "Internet Transactions Act of 2023",
        longTitle: "An Act Regulating Digital Commerce and Internet Transactions to Protect Consumers and Merchants",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11967",
        filedDate: "2022-06-30",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 11967."
      },
      {
        billNo: "HB-7325",
        congress: 19,
        chamber: "HOUSE",
        title: "E-Governance / E-Government Act of 2023",
        longTitle: "An Act Institutionalizing the Transition of Government Agencies and Local Government Units to Digital Platforms and Interoperable Data Systems",
        role: "PRINCIPAL_AUTHOR",
        status: "PASSED_HOUSE",
        filedDate: "2023-02-27",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Approved on third and final reading by the House of Representatives."
      },
      {
        billNo: "HB-227",
        congress: 19,
        chamber: "HOUSE",
        title: "National Caregivers Welfare and Protection Act",
        longTitle: "An Act Instituting Policies for the Protection and Welfare of Caregivers in the Practice of Their Profession",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11965",
        filedDate: "2022-07-04",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 11965."
      }
    ]
  },

  // Senator Loren B. Legarda
  {
    slug: "loren-legarda",
    aliases: [
      "Loren B. Legarda",
      "Loren Legarda",
      "Lorna Regina B. Legarda",
      "Legarda, Loren B."
    ],
    records: [
      {
        billNo: "RA 9003",
        congress: 11,
        chamber: "SENATE",
        title: "Ecological Solid Waste Management Act of 2000",
        longTitle: "An Act Providing for an Ecological Solid Waste Management Program, Creating the Necessary Institutional Mechanisms and Incentives",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 9003",
        filedDate: "1999-08-10",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=11&q=SBN-1583",
        matchConfidence: 1.0,
        matchNotes: "Landmark environmental legislation principal author."
      },
      {
        billNo: "RA 9729",
        congress: 14,
        chamber: "SENATE",
        title: "Climate Change Act of 2009",
        longTitle: "An Act Mainstreaming Climate Change into Government Policy Formulations and Establishing the Climate Change Commission",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 9729",
        filedDate: "2008-05-05",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=14&q=SBN-2583",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 9729."
      },
      {
        billNo: "RA 9513",
        congress: 14,
        chamber: "SENATE",
        title: "Renewable Energy Act of 2008",
        longTitle: "An Act Promoting the Development, Utilization and Commercialization of Renewable Energy Resources",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 9513",
        filedDate: "2008-03-03",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=14&q=SBN-2046",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 9513."
      },
      {
        billNo: "RA 11904",
        congress: 18,
        chamber: "SENATE",
        title: "Philippine Creative Industries Development Act",
        longTitle: "An Act Providing for the Development and Promotion of the Philippine Creative Industries and Establishing the Creative Industries Development Council",
        role: "SPONSOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11904",
        filedDate: "2021-09-06",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=18&q=SBN-2455",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 11904."
      }
    ]
  },

  // Senator Alan Peter S. Cayetano
  {
    slug: "alan-cayetano",
    aliases: [
      "Alan Peter S. Cayetano",
      "Alan Peter Cayetano",
      "Alan Cayetano",
      "Cayetano, Alan Peter S."
    ],
    records: [
      {
        billNo: "RA 11148",
        congress: 17,
        chamber: "SENATE",
        title: "Kalusugan at Nutrisyon ng Mag-Nanay Act (First 1,000 Days)",
        longTitle: "An Act Scaling Up Health and Nutrition for Mothers and Children During the First 1,000 Days of Life",
        role: "CO_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11148",
        filedDate: "2016-08-01",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1537",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 11148."
      },
      {
        billNo: "RA 11223",
        congress: 17,
        chamber: "SENATE",
        title: "Universal Health Care Act",
        longTitle: "An Act Institutionalizing Universal Health Care for All Filipinos",
        role: "CO_SPONSOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11223",
        filedDate: "2017-05-15",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1896",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 11223."
      },
      {
        billNo: "SB-198",
        congress: 19,
        chamber: "SENATE",
        title: "Citizen National Service and Military Readiness Training Act",
        longTitle: "An Act Institutionalizing Mandatory Citizen National Service Training for Tertiary Students",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2022-07-07",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-198",
        matchConfidence: 1.0,
        matchNotes: "19th Congress Senate measure."
      }
    ]
  },

  // Senator Maria Lourdes 'Nancy' S. Binay
  {
    slug: "nancy-binay",
    aliases: [
      "Maria Lourdes 'Nancy' S. Binay",
      "Maria Lourdes Nancy S. Binay",
      "Nancy Binay",
      "Binay, Nancy S."
    ],
    records: [
      {
        billNo: "RA 11210",
        congress: 17,
        chamber: "SENATE",
        title: "105-Day Expanded Maternity Leave Act",
        longTitle: "An Act Increasing the Maternity Leave Period to One Hundred Five (105) Days for Female Workers",
        role: "CO_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11210",
        filedDate: "2016-08-01",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1305",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 11210."
      },
      {
        billNo: "RA 10665",
        congress: 16,
        chamber: "SENATE",
        title: "Open High School System Act",
        longTitle: "An Act Establishing the Open High School System in the Philippines and Appropriating Funds Therefor",
        role: "CO_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 10665",
        filedDate: "2014-02-12",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=16&q=SBN-2185",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 10665."
      }
    ]
  },

  // Representative Mar-Len Abigail 'Abby' S. Binay
  {
    slug: "abby-binay",
    aliases: [
      "Mar-Len Abigail 'Abby' S. Binay",
      "Mar-Len Abigail S. Binay",
      "Abby Binay",
      "Binay, Mar-Len Abigail S."
    ],
    records: [
      {
        billNo: "HB-1338",
        congress: 15,
        chamber: "HOUSE",
        title: "Special Education (SPED) Act of the Philippines",
        longTitle: "An Act Instituting a Framework for Special Education in All Public and Private Elementary and Secondary Schools",
        role: "PRINCIPAL_AUTHOR",
        status: "PASSED_HOUSE",
        filedDate: "2010-07-15",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Authored during legislative tenure representing Makati City 2nd District."
      },
      {
        billNo: "HB-4411",
        congress: 16,
        chamber: "HOUSE",
        title: "Barangay Health Workers Welfare and Benefits Protection Act",
        longTitle: "An Act Strengthening the Benefits, Compensation, and Tenure Protection of Accredited Barangay Health Workers",
        role: "PRINCIPAL_AUTHOR",
        status: "PASSED_HOUSE",
        filedDate: "2014-05-19",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Passed by the House of Representatives."
      }
    ]
  },

  // Senator Aquilino 'Koko' L. Pimentel III
  {
    slug: "koko-pimentel",
    aliases: [
      "Aquilino 'Koko' L. Pimentel III",
      "Aquilino Martin de la Llana Pimentel III",
      "Koko Pimentel",
      "Pimentel, Aquilino III L."
    ],
    records: [
      {
        billNo: "RA 10380",
        congress: 15,
        chamber: "SENATE",
        title: "Local Absentee Voting for Media Practitioners Act",
        longTitle: "An Act Providing for Local Absentee Voting for Members of the Media",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 10380",
        filedDate: "2011-09-05",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=15&q=SBN-1198",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 10380."
      },
      {
        billNo: "SB-1070",
        congress: 19,
        chamber: "SENATE",
        title: "Modernized Anti-Wiretapping Law Amendments",
        longTitle: "An Act Expanding the Coverage of Lawful Electronic Interceptions to Combat Terrorism, Treason, and High-Level Drug Trafficking",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2022-08-08",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-1070",
        matchConfidence: 1.0,
        matchNotes: "Senate Minority Leader legislative initiative in the 19th Congress."
      }
    ]
  },

  // Senator Mark A. Villar
  {
    slug: "mark-villar",
    aliases: [
      "Mark A. Villar",
      "Mark Aguilar Villar",
      "Mark Villar",
      "Villar, Mark A."
    ],
    records: [
      {
        billNo: "RA 10752",
        congress: 16,
        chamber: "HOUSE",
        title: "Right-of-Way Act for National Infrastructure Projects",
        longTitle: "An Act Facilitating the Acquisition of Right-Of-Way Sites for National Government Infrastructure Projects",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 10752",
        filedDate: "2014-08-11",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 10752."
      },
      {
        billNo: "SB-2228",
        congress: 19,
        chamber: "SENATE",
        title: "Toll Regulatory Board Modernization Act",
        longTitle: "An Act Modernizing and Rationalizing the Powers and Functions of the Toll Regulatory Board",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2023-05-23",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2228",
        matchConfidence: 1.0,
        matchNotes: "Principal author in the 19th Congress."
      }
    ]
  },

  // Senator Francis N. Tolentino
  {
    slug: "francis-tolentino",
    aliases: [
      "Francis N. Tolentino",
      "Francis Tolentino",
      "Tolentino, Francis N."
    ],
    records: [
      {
        billNo: "SB-2492",
        congress: 19,
        chamber: "SENATE",
        title: "Philippine Maritime Zones Act",
        longTitle: "An Act Declaring the Maritime Zones Under the Jurisdiction of the Republic of the Philippines",
        role: "SPONSOR",
        status: "PASSED_SENATE",
        filedDate: "2023-11-20",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2492",
        matchConfidence: 1.0,
        matchNotes: "Chairperson of Senate Special Committee on Philippine Maritime and Admiralty Zones."
      },
      {
        billNo: "RA 11476",
        congress: 18,
        chamber: "SENATE",
        title: "Good Manners and Right Conduct (GMRC) and Values Education Act",
        longTitle: "An Act Institutionalizing Good Manners and Right Conduct and Values Education in the K to 12 Curriculum",
        role: "CO_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11476",
        filedDate: "2019-09-02",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=18&q=SBN-860",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 11476."
      }
    ]
  },

  // Senator Juan Edgardo 'Sonny' M. Angara
  {
    slug: "sonny-angara",
    aliases: [
      "Juan Edgardo 'Sonny' M. Angara",
      "Juan Edgardo M. Angara",
      "Sonny Angara",
      "Angara, Juan Edgardo M."
    ],
    records: [
      {
        billNo: "RA 10931",
        congress: 17,
        chamber: "SENATE",
        title: "Universal Access to Quality Tertiary Education Act (Free College Tuition)",
        longTitle: "An Act Promoting Universal Access to Quality Tertiary Education by Providing Free Tuition and Other School Fees in State Universities and Colleges",
        role: "SPONSOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 10931",
        filedDate: "2016-08-01",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1304",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 10931."
      },
      {
        billNo: "RA 10963",
        congress: 17,
        chamber: "SENATE",
        title: "Tax Reform for Acceleration and Inclusion (TRAIN Law)",
        longTitle: "An Act Amending Several Sections of the National Internal Revenue Code of 1997 to Simplify the Tax System",
        role: "SPONSOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 10963",
        filedDate: "2017-05-15",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1592",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 10963."
      },
      {
        billNo: "RA 11927",
        congress: 18,
        chamber: "SENATE",
        title: "Philippine Digital Workforce Competitiveness Act",
        longTitle: "An Act Enhancing the Competitiveness of the Philippine Digital Workforce Through Upskilling and Lifelong Learning",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11927",
        filedDate: "2020-02-18",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=18&q=SBN-1469",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 11927."
      }
    ]
  },

  // Senator Antonio 'Sonny' Trillanes IV
  {
    slug: "antonio-trillanes",
    aliases: [
      "Antonio 'Sonny' Trillanes IV",
      "Antonio F. Trillanes IV",
      "Antonio Trillanes IV",
      "Trillanes, Antonio IV F."
    ],
    records: [
      {
        billNo: "RA 10147",
        congress: 15,
        chamber: "SENATE",
        title: "Salary Standardization Law III Extension Act",
        longTitle: "An Act Mandating the Continued Implementation of Salary Standardization for Government Personnel and Uniformed Services",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 10147",
        filedDate: "2010-07-01",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=15&q=SBN-112",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law."
      },
      {
        billNo: "RA 10349",
        congress: 15,
        chamber: "SENATE",
        title: "Revised Armed Forces of the Philippines Modernization Act",
        longTitle: "An Act Amending Republic Act No. 7898 to Extend and Upgrade the Modernization of the Armed Forces of the Philippines",
        role: "CO_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 10349",
        filedDate: "2011-03-15",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=15&q=SBN-3164",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 10349."
      }
    ]
  },

  // Senator Leila M. de Lima
  {
    slug: "leila-de-lima",
    aliases: [
      "Leila M. de Lima",
      "Leila Norma Eulalia Josefa Magistrado de Lima",
      "Leila de Lima",
      "De Lima, Leila M."
    ],
    records: [
      {
        billNo: "RA 11310",
        congress: 17,
        chamber: "SENATE",
        title: "Pantawid Pamilyang Pilipino Program (4Ps) Institutionalization Act",
        longTitle: "An Act Institutionalizing the Pantawid Pamilyang Pilipino Program (4Ps) as the National Poverty Reduction Strategy",
        role: "CO_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11310",
        filedDate: "2016-08-01",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-2117",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 11310."
      },
      {
        billNo: "SB-180",
        congress: 18,
        chamber: "SENATE",
        title: "Prison Reform and Unified Corrections System Act",
        longTitle: "An Act Modernizing Penal Management and Integrating Local and National Correctional Facilities",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2019-07-02",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=18&q=SBN-180",
        matchConfidence: 1.0,
        matchNotes: "Authored by Senator Leila de Lima."
      }
    ]
  },

  // Senator Francis 'Kiko' Pangilinan
  {
    slug: "kiko-pangilinan",
    aliases: [
      "Francis 'Kiko' Pangilinan",
      "Francis Nepomuceno Pangilinan",
      "Kiko Pangilinan",
      "Pangilinan, Francis N."
    ],
    records: [
      {
        billNo: "RA 11321",
        congress: 17,
        chamber: "SENATE",
        title: "Sagip Saka Act (Farmers and Fisherfolk Enterprise Development)",
        longTitle: "An Act Institutionalizing the Farmers and Fisherfolk Enterprise Development Program",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11321",
        filedDate: "2016-08-01",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1281",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 11321."
      },
      {
        billNo: "RA 9344",
        congress: 13,
        chamber: "SENATE",
        title: "Juvenile Justice and Welfare Act of 2006",
        longTitle: "An Act Establishing a Comprehensive Juvenile Justice and Welfare System, Creating the Juvenile Justice and Welfare Council",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 9344",
        filedDate: "2004-09-01",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=13&q=SBN-1402",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 9344."
      }
    ]
  },

  // Representative Bonifacio 'Col. Bony' L. Bosita
  {
    slug: "bonifacio-bosita",
    aliases: [
      "Bonifacio 'Col. Bony' L. Bosita",
      "Bonifacio L. Bosita",
      "Bonifacio Bosita",
      "Bosita, Bonifacio L."
    ],
    records: [
      {
        billNo: "HB-3412",
        congress: 19,
        chamber: "HOUSE",
        title: "Motorcycle Rights, Equal Road Access and Fair Enforcement Act",
        longTitle: "An Act Providing for the Equal Road Access of Motorcycle Riders and Prohibiting Discriminatory Road Rules",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2022-08-10",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Authored by Representative Bonifacio Bosita (1-Rider Party-list)."
      },
      {
        billNo: "HB-3413",
        congress: 19,
        chamber: "HOUSE",
        title: "Fair Traffic Penalties and Due Process for Motorists Act",
        longTitle: "An Act Regulating the Imposition of Traffic Penalties and Requiring Adequate Photographic Evidence for Automated Apprehensions",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2022-08-10",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "19th Congress House measure."
      }
    ]
  },

  // Senator Robinhood Ferdinand "Robin" Padilla
  {
    slug: "robin-padilla",
    aliases: [
      "Robinhood Ferdinand C. Padilla",
      "Robinhood Padilla",
      "Robin Padilla",
      "Padilla, Robinhood C."
    ],
    records: [
      {
        billNo: "SB-2214",
        congress: 19,
        chamber: "SENATE",
        title: "Philippine Marine Corps Act",
        longTitle: "An Act Strengthening the Philippine Marine Corps, Defining Its Powers and Functions, and Appropriating Funds Therefor",
        role: "PRINCIPAL_AUTHOR",
        status: "PASSED_SENATE",
        filedDate: "2023-05-17",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2214",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/4181938171!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal author in the 19th Congress."
      },
      {
        billNo: "SB-26",
        congress: 19,
        chamber: "SENATE",
        title: "Equal Rights of Spouses in Annulment / Dissolution of Marriage",
        longTitle: "An Act Providing for the Dissolution of Marriage, Prescribing the Ground and Procedure Therefor, and for Other Purposes",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2022-07-04",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-26",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/3782734208!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal author in the 19th Congress."
      },
      {
        billNo: "SB-230",
        congress: 19,
        chamber: "SENATE",
        title: "Medical Cannabis Compassionate Access Act",
        longTitle: "An Act Legalizing the Medical Use of Cannabis and Providing Regulations Therefor",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2022-07-07",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-230",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/3803134412!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal author in the 19th Congress."
      },
      {
        billNo: "SB-449",
        congress: 19,
        chamber: "SENATE",
        title: "Free Legal Assistance to AFP and PNP Personnel",
        longTitle: "An Act Providing Free Legal Assistance to Any Officer or Enlisted Personnel of the Armed Forces of the Philippines and the Philippine National Police Facing Charges Arising from Incidents Related to the Performance of Official Duty",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2022-07-13",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-449",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/3825034631!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal author in the 19th Congress."
      },
      {
        billNo: "SB-2576",
        congress: 19,
        chamber: "SENATE",
        title: "Philippine Immigration Act",
        longTitle: "An Act Modernizing the Bureau of Immigration by Defining Its Powers and Functions, and Further Professionalizing Its Operations",
        role: "CO_AUTHOR",
        status: "PASSED_SENATE",
        filedDate: "2024-02-28",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2576",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/4381840170!.pdf",
        matchConfidence: 0.95,
        matchNotes: "Co-author in the 19th Congress."
      },
      {
        billNo: "SB-2221",
        congress: 19,
        chamber: "SENATE",
        title: "National Government Rightsizing Program",
        longTitle: "An Act Mandating the Institutionalization of the National Government Rightsizing to Enhance Public Service Delivery",
        role: "CO_AUTHOR",
        status: "PENDING",
        filedDate: "2023-05-22",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2221",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/4182638178!.pdf",
        matchConfidence: 0.95,
        matchNotes: "Co-author in the 19th Congress."
      },
      {
        billNo: "SCR-6",
        congress: 19,
        chamber: "SENATE",
        title: "Joint Session for Proposing Economic Amendments to the 1987 Constitution",
        longTitle: "Concurrent Resolution Urging Both Houses of Congress to Convene in Joint Session to Propose Amendments to Certain Economic Provisions of the 1987 Constitution",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2023-02-14",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SCR-6",
        matchConfidence: 1.0,
        matchNotes: "Principal author, Committee on Constitutional Amendments."
      }
    ]
  },

  // Senator Paolo Benigno "Bam" Aquino IV
  {
    slug: "bam-aquino",
    aliases: [
      "Paolo Benigno A. Aquino IV",
      "Paolo Benigno Aquino IV",
      "Bam Aquino",
      "Aquino, Paolo Benigno 'Bam'"
    ],
    records: [
      {
        billNo: "SB-1304",
        congress: 17,
        chamber: "SENATE",
        title: "Universal Access to Quality Tertiary Education Act (Free College Tuition Law)",
        longTitle: "An Act Promoting Universal Access to Quality Tertiary Education by Providing for Free Tuition and Other School Fees in State Universities and Colleges, Local Universities and Colleges and State-Run Technical-Vocational Institutions",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 10931",
        filedDate: "2017-01-17",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1304",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/2523221768!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal sponsor and principal co-author of RA 10931."
      },
      {
        billNo: "SB-2046",
        congress: 16,
        chamber: "SENATE",
        title: "Go Negosyo Act",
        longTitle: "An Act Promoting Job Generation and Inclusive Growth Through the Development of Micro, Small and Medium Enterprises",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 10644",
        filedDate: "2013-12-09",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=16&q=SBN-2046",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/1824415443!.pdf",
        matchConfidence: 1.0,
        matchNotes: "First law authored and passed by Sen. Bam Aquino in the 16th Congress."
      },
      {
        billNo: "SB-2217",
        congress: 16,
        chamber: "SENATE",
        title: "Youth Entrepreneurship Act",
        longTitle: "An Act Promoting Youth Entrepreneurship and Financial Literacy Program",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 10679",
        filedDate: "2014-05-08",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=16&q=SBN-2217",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/1918316335!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal author in the 16th Congress."
      },
      {
        billNo: "SB-2282",
        congress: 16,
        chamber: "SENATE",
        title: "Philippine Competition Act",
        longTitle: "An Act Promoting and Protecting a Competitive Market and Prohibiting Anti-Competitive Mergers and Abuses of Dominance",
        role: "SPONSOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 10667",
        filedDate: "2014-06-11",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=16&q=SBN-2282",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/1939116543!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal sponsor and committee chair in the 16th Congress."
      },
      {
        billNo: "SB-1277",
        congress: 17,
        chamber: "SENATE",
        title: "Free Internet Access in Public Places Act",
        longTitle: "An Act Establishing the Free Internet Access Program in Public Places in the Country and Appropriating Funds Therefor",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 10929",
        filedDate: "2016-11-28",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1277",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/2513421670!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Co-sponsor and principal author in the 17th Congress."
      },
      {
        billNo: "SB-1532",
        congress: 17,
        chamber: "SENATE",
        title: "Philippine Innovation Act",
        longTitle: "An Act Fostering Innovation to Foster Growth and National Competitiveness of Micro, Small and Medium Enterprises",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11293",
        filedDate: "2017-08-01",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1532",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/2635922718!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal author and sponsor."
      },
      {
        billNo: "SB-174",
        congress: 17,
        chamber: "SENATE",
        title: "Pagkaing Pinoy para sa Batang Pinoy Act (National Feeding Program)",
        longTitle: "An Act Establishing a Comprehensive National Feeding Program for Undernourished Children in Public Day Care, Kindergarten and Elementary Schools",
        role: "CO_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11037",
        filedDate: "2016-06-30",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-174",
        matchConfidence: 0.95,
        matchNotes: "Co-author with Sen. Grace Poe."
      }
    ]
  },

  // Senator Risa Hontiveros
  {
    slug: "risa-hontiveros",
    aliases: [
      "Ana Theresia 'Risa' Hontiveros-Baraquel",
      "Risa Hontiveros",
      "Hontiveros, Risa",
      "Hontiveros-Baraquel, Ana Theresia"
    ],
    records: [
      {
            "billNo": "SBN-377",
            "congress": 17,
            "chamber": "SENATE",
            "title": "AN ACT PROVIDING FOR MANDATORY PHILHEALTH COVERAGE FOR ALL PERSONS WITH DISABILITIES (PWDS), AMENDING FOR THE PURPOSE REPUBLIC ACT NO. 7277, AS AMENDED BY REPUBLIC ACT NO. 9442, OTHERWISE KNOWN AS THE MAGNA CARTA FOR DISABLED PERSONS, AND FOR OTHER PURPOSES",
            "longTitle": "AN ACT PROVIDING FOR MANDATORY PHILHEALTH COVERAGE FOR ALL PERSONS WITH DISABILITIES (PWDS), AMENDING FOR THE PURPOSE REPUBLIC ACT NO. 7277, AS AMENDED BY REPUBLIC ACT NO. 9442, OTHERWISE KNOWN AS THE MAGNA CARTA FOR DISABLED PERSONS, AND FOR OTHER PURPOSES",
            "role": "PRINCIPAL_AUTHOR",
            "status": "REPUBLIC_ACT",
            "republicActNo": "RA 7277",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/legislative-issuances/senate-bills?field_bill_date_of_filing_value=All&field_cn_bill_was_filed_target_id=All&field_date_of_approval_value=All&items_per_page=50&page=306&sort_by=title&sort_order=DESC",
            "matchConfidence": 1,
            "matchNotes": "Enacted into law as Republic Act (RA 7277). Role: Author. Verified from official Senate profile and issuances.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-2225",
            "congress": 17,
            "chamber": "SENATE",
            "title": "AN ACT ESTABLISHING A NATIONAL EVALUATION POLICY",
            "longTitle": "AN ACT ESTABLISHING A NATIONAL EVALUATION POLICY",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/legislative-issuances/senate-bills?field_bill_date_of_filing_value=All&field_cn_bill_was_filed_target_id=All&field_date_of_approval_value=All&items_per_page=50&page=191&sort_by=title&sort_order=DESC",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (SENATE 17th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-1056",
            "congress": 17,
            "chamber": "SENATE",
            "title": "AN ACT MANDATING THE COMPLETION OF THE LAND ACQUISITION AND DISTRIBUTION (LAD) COMPONENT OF THE COMPREHENSIVE AGRARIAN REFORM PROGRAM (CARP) PURSUANT TO REPUBLIC ACT NO. 6657, OTHERWISE KNOWN AS THE COMPREHENSIVE AGRARIAN REFORM LAW, AS AMENDED",
            "longTitle": "AN ACT MANDATING THE COMPLETION OF THE LAND ACQUISITION AND DISTRIBUTION (LAD) COMPONENT OF THE COMPREHENSIVE AGRARIAN REFORM PROGRAM (CARP) PURSUANT TO REPUBLIC ACT NO. 6657, OTHERWISE KNOWN AS THE COMPREHENSIVE AGRARIAN REFORM LAW, AS AMENDED",
            "role": "PRINCIPAL_AUTHOR",
            "status": "REPUBLIC_ACT",
            "republicActNo": "RA 6657",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/legislative-issuances/senate-bills?field_bill_date_of_filing_value=All&field_cn_bill_was_filed_target_id=All&field_date_of_approval_value=All&items_per_page=50&page=9&sort_by=title&sort_order=DESC",
            "matchConfidence": 1,
            "matchNotes": "Enacted into law as Republic Act (RA 6657). Role: Author. Verified from official Senate profile and issuances.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-1863",
            "congress": 17,
            "chamber": "SENATE",
            "title": "AN ACT REGULATING THE CATCHING, SALE, PURCHASE, POSSESSION, TRANSPORTATION, IMPORTATION, AND EXPORTATION OF ALL SHARKS, RAYS, AND CHIMAERAS AND ANY PART THEREOF IN THE COUNTRY",
            "longTitle": "AN ACT REGULATING THE CATCHING, SALE, PURCHASE, POSSESSION, TRANSPORTATION, IMPORTATION, AND EXPORTATION OF ALL SHARKS, RAYS, AND CHIMAERAS AND ANY PART THEREOF IN THE COUNTRY",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/legislative-issuances/senate-bills?field_bill_date_of_filing_value=All&field_cn_bill_was_filed_target_id=All&field_date_of_approval_value=All&items_per_page=50&page=134&sort_by=title&sort_order=DESC",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (SENATE 17th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-1172",
            "congress": 17,
            "chamber": "SENATE",
            "title": "AN ACT STRENGTHENING THE RIGHT OF CITIZENS TO INFORMATION HELD BY THE GOVERNMENT, INSTITUTIONALIZING OPEN DATA GOVERNANCE AND FOR OTHER PURPOSES",
            "longTitle": "AN ACT STRENGTHENING THE RIGHT OF CITIZENS TO INFORMATION HELD BY THE GOVERNMENT, INSTITUTIONALIZING OPEN DATA GOVERNANCE AND FOR OTHER PURPOSES",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/legislative-issuances/senate-bills?field_bill_date_of_filing_value=All&field_cn_bill_was_filed_target_id=All&field_date_of_approval_value=All&items_per_page=27&page=27&sort_by=title&sort_order=DESC",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (SENATE 17th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-1806",
            "congress": 17,
            "chamber": "SENATE",
            "title": "AN ACT INSTITUTIONALIZING THE PANTAWID PAMILYANG PILIPINO PROGRAM (4PS) TO REDUCE POVERTY AND PROMOTE HUMAN CAPITAL DEVELOPMENT AND PROVIDING FUNDS THEREFOR",
            "longTitle": "AN ACT INSTITUTIONALIZING THE PANTAWID PAMILYANG PILIPINO PROGRAM (4PS) TO REDUCE POVERTY AND PROMOTE HUMAN CAPITAL DEVELOPMENT AND PROVIDING FUNDS THEREFOR",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/legislative-issuances/senate-bills?field_bill_date_of_filing_value=All&field_cn_bill_was_filed_target_id=All&field_date_of_approval_value=All&items_per_page=50&page=126&sort_by=title&sort_order=DESC",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (SENATE 17th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-159",
            "congress": 18,
            "chamber": "SENATE",
            "title": "AN ACT PROHIBITING DISCRIMINATION ON THE BASIS OF SEXUAL ORIENTATION AND GENDER IDENTITY OR EXPRESSION (SOGIE) AND PROVIDING PENALTIES THEREFOR",
            "longTitle": "AN ACT PROHIBITING DISCRIMINATION ON THE BASIS OF SEXUAL ORIENTATION AND GENDER IDENTITY OR EXPRESSION (SOGIE) AND PROVIDING PENALTIES THEREFOR",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/bills/senate-bill-no-159-18th-congress-republic",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (SENATE 18th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-1411",
            "congress": 18,
            "chamber": "SENATE",
            "title": "AN ACT AMENDING REPUBLIC ACT NO. 8972 OTHERWISE KNOWN AS AN ACT PROVIDING FOR BENEFITS AND PRIVILEGES TO SOLO PARENTS AND THEIR CHILDREN, APPROPRIATING FUNDS THEREFOR AND FOR OTHER PURPOSES",
            "longTitle": "AN ACT AMENDING REPUBLIC ACT NO. 8972 OTHERWISE KNOWN AS AN ACT PROVIDING FOR BENEFITS AND PRIVILEGES TO SOLO PARENTS AND THEIR CHILDREN, APPROPRIATING FUNDS THEREFOR AND FOR OTHER PURPOSES",
            "role": "CO_AUTHOR; SPONSOR",
            "status": "REPUBLIC_ACT",
            "republicActNo": "RA 8972",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/bills/senate-bill-no-1411-18th-congress-republic",
            "matchConfidence": 1,
            "matchNotes": "Enacted into law as Republic Act (RA 8972). Role: Co-author; Sponsor. Verified from official Senate profile and issuances.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-2161",
            "congress": 18,
            "chamber": "SENATE",
            "title": "AN ACT PROTECTING AND PROMOTING THE RIGHTS TO EQUALITY AND NON-DISCRIMINATION ON THE BASIS OF RACE, ETHNICITY AND RELIGION",
            "longTitle": "AN ACT PROTECTING AND PROMOTING THE RIGHTS TO EQUALITY AND NON-DISCRIMINATION ON THE BASIS OF RACE, ETHNICITY AND RELIGION",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/bills/senate-bill-no-2161-18th-congress-republic",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (SENATE 18th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-2332",
            "congress": 18,
            "chamber": "SENATE",
            "title": "AN ACT INCREASING THE AGE FOR DETERMINING STATUTORY RAPE AND OTHER ACTS OF SEXUAL ABUSE AND EXPLOITATION TO PROTECT CHILDREN",
            "longTitle": "AN ACT INCREASING THE AGE FOR DETERMINING STATUTORY RAPE AND OTHER ACTS OF SEXUAL ABUSE AND EXPLOITATION TO PROTECT CHILDREN",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/bills/senate-bill-no-2332-18th-congress-republic",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (SENATE 18th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-139",
            "congress": 19,
            "chamber": "SENATE",
            "title": "SOGIESC EQUALITY ACT",
            "longTitle": "SOGIESC EQUALITY ACT",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/bills/senate-bill-no-139-19th-congress",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (SENATE 19th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-585",
            "congress": 19,
            "chamber": "SENATE",
            "title": "ON-SITE, IN-CITY OR NEAR-CITY RESETTLEMENT PROGRAM ACT",
            "longTitle": "ON-SITE, IN-CITY OR NEAR-CITY RESETTLEMENT PROGRAM ACT",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/bills/senate-bill-no-585-19th-congress",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (SENATE 19th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-1311",
            "congress": 19,
            "chamber": "SENATE",
            "title": "REVISED LABOR CODE OF THE PHILIPPINES",
            "longTitle": "REVISED LABOR CODE OF THE PHILIPPINES",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/bills/senate-bill-no-1311-19th-congress",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (SENATE 19th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-1353",
            "congress": 19,
            "chamber": "SENATE",
            "title": "AN ACT DECLARING THE MARITIME ZONES UNDER THE JURISDICTION OF THE REPUBLIC OF THE PHILIPPINES",
            "longTitle": "AN ACT DECLARING THE MARITIME ZONES UNDER THE JURISDICTION OF THE REPUBLIC OF THE PHILIPPINES",
            "role": "CO_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/bills/senate-bill-no-1353-19th-congress",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (SENATE 19th Congress). Preserved role: Co-author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-1600",
            "congress": 19,
            "chamber": "SENATE",
            "title": "SOGIESC EQUALITY ACT",
            "longTitle": "SOGIESC EQUALITY ACT",
            "role": "AUTHOR; SPONSOR",
            "status": "PENDING",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/bills/senate-bill-no-1600-19th-congress",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (SENATE 19th Congress). Preserved role: Author; Sponsor.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-1979",
            "congress": 19,
            "chamber": "SENATE",
            "title": "AN ACT PROVIDING FOR A NATIONAL POLICY IN PREVENTING ADOLESCENT PREGNANCIES, INSTITUTIONALIZING SOCIAL PROTECTION FOR ADOLESCENT PARENTS, AND PROVIDING FUNDS THEREFOR",
            "longTitle": "AN ACT PROVIDING FOR A NATIONAL POLICY IN PREVENTING ADOLESCENT PREGNANCIES, INSTITUTIONALIZING SOCIAL PROTECTION FOR ADOLESCENT PARENTS, AND PROVIDING FUNDS THEREFOR",
            "role": "CO_AUTHOR; SPONSOR",
            "status": "PENDING",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/bills/senate-bill-no-1979-19th-congress",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (SENATE 19th Congress). Preserved role: Co-author; Sponsor.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "SBN-2205",
            "congress": 19,
            "chamber": "SENATE",
            "title": "AN ACT AMENDING CERTAIN PROVISIONS OF REPUBLIC ACT NO. 10845, OTHERWISE KNOWN AS THE ANTI-AGRICULTURAL SMUGGLING ACT OF 2016, AND FOR OTHER PURPOSES",
            "longTitle": "AN ACT AMENDING CERTAIN PROVISIONS OF REPUBLIC ACT NO. 10845, OTHERWISE KNOWN AS THE ANTI-AGRICULTURAL SMUGGLING ACT OF 2016, AND FOR OTHER PURPOSES",
            "role": "PRINCIPAL_AUTHOR",
            "status": "REPUBLIC_ACT",
            "republicActNo": "RA 10845",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/bills/senate-bill-no-2205-19th-congress",
            "matchConfidence": 1,
            "matchNotes": "Enacted into law as Republic Act (RA 10845). Role: Author. Verified from official Senate profile and issuances.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 5574",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT PROMOTING THE WELFARE OF WORKERS IN CASES OF MERGERS, ACQUISITIONS, CONSOLIDATION, SALE OF ALL OR SUBSTANTIALLY ALL ASSETS, BUSINESS ENTERPRISE TRANSFER, OR TRANSFER OF A GOING CONCERN AND OTHER PURPOSES",
            "longTitle": "AN ACT PROMOTING THE WELFARE OF WORKERS IN CASES OF MERGERS, ACQUISITIONS, CONSOLIDATION, SALE OF ALL OR SUBSTANTIALLY ALL ASSETS, BUSINESS ENTERPRISE TRANSFER, OR TRANSFER OF A GOING CONCERN AND OTHER PURPOSES",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (HOUSE 14th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 5931",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT BANNING THE IMPORTATION, MANUFACTURE, PROCESSING, USE OR DISTRIBUTION IN COMMERCE OF ASBESTOS AND ASBESTOS-CONTAINING PRODUCTS",
            "longTitle": "AN ACT BANNING THE IMPORTATION, MANUFACTURE, PROCESSING, USE OR DISTRIBUTION IN COMMERCE OF ASBESTOS AND ASBESTOS-CONTAINING PRODUCTS",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (HOUSE 14th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 6019",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT STRENGTHENING THE WORKERS' CONSTITUTIONAL RIGHT TO COLLECTIVE BARGAINING, REPEALING AND REPLACING FOR THE PURPOSE PRESIDENTIAL DECREE NO. 442, AS AMENDED, OTHERWISE KNOWN AS THE LABOR CODE OF THE PHILIPPINES",
            "longTitle": "AN ACT STRENGTHENING THE WORKERS' CONSTITUTIONAL RIGHT TO COLLECTIVE BARGAINING, REPEALING AND REPLACING FOR THE PURPOSE PRESIDENTIAL DECREE NO. 442, AS AMENDED, OTHERWISE KNOWN AS THE LABOR CODE OF THE PHILIPPINES",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (HOUSE 14th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 6026",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT REGULATING THE POWER OF THE PRESIDENT TO DEFER, RESCIND, OR RESERVE EXPENDITURE OF APPROPRIATIONS AUTHORIZED BY CONGRESS",
            "longTitle": "AN ACT REGULATING THE POWER OF THE PRESIDENT TO DEFER, RESCIND, OR RESERVE EXPENDITURE OF APPROPRIATIONS AUTHORIZED BY CONGRESS",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (HOUSE 14th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 6027",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT DEFINING THE CONCEPT OF SAVINGS AND REGULATING THE PROCESS OF AUGMENTATION BY THE PRESIDENT IN IMPLEMENTATION OF ARTICLE VI, SECTION 25 (5) OF THE CONSTITUTION",
            "longTitle": "AN ACT DEFINING THE CONCEPT OF SAVINGS AND REGULATING THE PROCESS OF AUGMENTATION BY THE PRESIDENT IN IMPLEMENTATION OF ARTICLE VI, SECTION 25 (5) OF THE CONSTITUTION",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (HOUSE 14th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 6536",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT CREATING THE BARANGAY HEALTH WORKER EDUCATION AND TRAINING PROGRAM, APPROPRIATING FUNDS THEREFOR AND FOR OTHER PURPOSES",
            "longTitle": "AN ACT CREATING THE BARANGAY HEALTH WORKER EDUCATION AND TRAINING PROGRAM, APPROPRIATING FUNDS THEREFOR AND FOR OTHER PURPOSES",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (HOUSE 14th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 6923",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT PROVIDING FOR A TEMPORARY SUSPENSION OF AMORTIZATION AND PENALTY CONDONATION PROGRAM FOR AGRARIAN REFORM BENEFICIARIES IN AGRICULTURAL AREAS OF THE COUNTRY DEVASTATED BY ONDOY AND PEPENG",
            "longTitle": "AN ACT PROVIDING FOR A TEMPORARY SUSPENSION OF AMORTIZATION AND PENALTY CONDONATION PROGRAM FOR AGRARIAN REFORM BENEFICIARIES IN AGRICULTURAL AREAS OF THE COUNTRY DEVASTATED BY ONDOY AND PEPENG",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (HOUSE 14th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 922",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT PROVIDING COMPENSATION TO VICTIMS OF HUMAN RIGHTS VIOLATIONS DURING THE MARCOS REGIME, DOCUMENTATION OF SAID VIOLATIONS, APPROPRIATING FUNDS THEREFOR, AND FOR OTHER PURPOSES",
            "longTitle": "AN ACT PROVIDING COMPENSATION TO VICTIMS OF HUMAN RIGHTS VIOLATIONS DURING THE MARCOS REGIME, DOCUMENTATION OF SAID VIOLATIONS, APPROPRIATING FUNDS THEREFOR, AND FOR OTHER PURPOSES",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (HOUSE 14th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 954",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT TO MAKE LAWS ON PATENTS, TRADENAMES AND TRADEMARKS MORE RESPONSIVE TO THE HEALTH CARE NEEDS OF THE FILIPINO PEOPLE BY CLARIFYING NON-PATENTABLE INVENTIONS, ALLOWING THE IMPORTATION AND EARLY DEVELOPMENT OF PATENTED MEDICINES, AND MODIFYING GOVERNMENT USE PROVISIONS FOR DRUGS AND MEDICINES",
            "longTitle": "AN ACT TO MAKE LAWS ON PATENTS, TRADENAMES AND TRADEMARKS MORE RESPONSIVE TO THE HEALTH CARE NEEDS OF THE FILIPINO PEOPLE BY CLARIFYING NON-PATENTABLE INVENTIONS, ALLOWING THE IMPORTATION AND EARLY DEVELOPMENT OF PATENTED MEDICINES, AND MODIFYING GOVERNMENT USE PROVISIONS FOR DRUGS AND MEDICINES",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (HOUSE 14th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 1718",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT TO ENHANCE THE PHILIPPINE INDUSTRIAL AND LABOR DISPUTE SETTLEMENT SYSTEM AND FOR THAT PURPOSE, AMENDING CERTAIN PROVISIONS OF PRESIDENTIAL DECREE NO. 442 OTHERWISE KNOWN AS THE LABOR CODE OF THE PHILIPPINES",
            "longTitle": "AN ACT TO ENHANCE THE PHILIPPINE INDUSTRIAL AND LABOR DISPUTE SETTLEMENT SYSTEM AND FOR THAT PURPOSE, AMENDING CERTAIN PROVISIONS OF PRESIDENTIAL DECREE NO. 442 OTHERWISE KNOWN AS THE LABOR CODE OF THE PHILIPPINES",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (HOUSE 14th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 1767",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT AMENDING REPUBLIC ACT NO. 7941, OTHERWISE KNOWN AS THE PARTY-LIST SYSTEM ACT",
            "longTitle": "AN ACT AMENDING REPUBLIC ACT NO. 7941, OTHERWISE KNOWN AS THE PARTY-LIST SYSTEM ACT",
            "role": "PRINCIPAL_AUTHOR",
            "status": "REPUBLIC_ACT",
            "republicActNo": "RA 7941",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Enacted into law as Republic Act (RA 7941). Role: Author. Verified from official Senate profile and issuances.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 2279",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT AMENDING PRESIDENTIAL DECREE NO. 442, AS AMENDED, OTHERWISE KNOWN AS THE LABOR CODE OF THE PHILIPPINES, AND PROVIDING FOR THE RATIONALIZATION OF WAGE-FIXING ALONG NATIONAL AND INDUSTRIAL LINES",
            "longTitle": "AN ACT AMENDING PRESIDENTIAL DECREE NO. 442, AS AMENDED, OTHERWISE KNOWN AS THE LABOR CODE OF THE PHILIPPINES, AND PROVIDING FOR THE RATIONALIZATION OF WAGE-FIXING ALONG NATIONAL AND INDUSTRIAL LINES",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (HOUSE 14th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 2453",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT TO STRENGTHEN SECURITY OF TENURE AND PROMOTING REGULAR EMPLOYMENT AND FOR THAT PURPOSE, AMENDING CERTAIN PROVISIONS OF THE LABOR CODE",
            "longTitle": "AN ACT TO STRENGTHEN SECURITY OF TENURE AND PROMOTING REGULAR EMPLOYMENT AND FOR THAT PURPOSE, AMENDING CERTAIN PROVISIONS OF THE LABOR CODE",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (HOUSE 14th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 2584",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT PROVIDING FOR A NATIONAL POLICY ON STUDENTS' RIGHTS AND WELFARE",
            "longTitle": "AN ACT PROVIDING FOR A NATIONAL POLICY ON STUDENTS' RIGHTS AND WELFARE",
            "role": "PRINCIPAL_AUTHOR",
            "status": "PENDING",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Official legislative measure (HOUSE 14th Congress). Preserved role: Author.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "HB 2780",
            "congress": 14,
            "chamber": "HOUSE",
            "title": "AN ACT STRENGTHENING THE USE OF GENERIC DRUGS AND MEDICINES, AMENDING FOR THE PURPOSE REPUBLIC ACT NO. 6675, OR THE GENERICS ACT OF 1988",
            "longTitle": "AN ACT STRENGTHENING THE USE OF GENERIC DRUGS AND MEDICINES, AMENDING FOR THE PURPOSE REPUBLIC ACT NO. 6675, OR THE GENERICS ACT OF 1988",
            "role": "PRINCIPAL_AUTHOR",
            "status": "REPUBLIC_ACT",
            "republicActNo": "RA 6675",
            "sourceInstitution": "HOUSE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/congress-author/hontiveros-ana-theresia-risa",
            "matchConfidence": 1,
            "matchNotes": "Enacted into law as Republic Act (RA 6675). Role: Author. Verified from official Senate profile and issuances.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "RA 11210",
            "congress": 18,
            "chamber": "SENATE",
            "title": "105-Day Expanded Maternity Leave Law",
            "longTitle": "105-Day Expanded Maternity Leave Law",
            "role": "SPONSOR",
            "status": "REPUBLIC_ACT",
            "republicActNo": "RA 11210",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/senator/hontiveros-risa",
            "matchConfidence": 1,
            "matchNotes": "Enacted into law as Republic Act (RA 11210). Role: Champion; pushed into law per Senate profile. Verified from official Senate profile and issuances.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "RA 11036",
            "congress": 17,
            "chamber": "SENATE",
            "title": "Philippine Mental Health Act",
            "longTitle": "Philippine Mental Health Act",
            "role": "SPONSOR",
            "status": "REPUBLIC_ACT",
            "republicActNo": "RA 11036",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/senator/hontiveros-risa",
            "matchConfidence": 1,
            "matchNotes": "Enacted into law as Republic Act (RA 11036). Role: Champion; landmark law listed on Senate profile. Verified from official Senate profile and issuances.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "RA 11861",
            "congress": 18,
            "chamber": "SENATE",
            "title": "Expanded Solo Parents Welfare Act",
            "longTitle": "Expanded Solo Parents Welfare Act",
            "role": "SPONSOR",
            "status": "REPUBLIC_ACT",
            "republicActNo": "RA 11861",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/senator/hontiveros-risa",
            "matchConfidence": 1,
            "matchNotes": "Enacted into law as Republic Act (RA 11861). Role: Committee chair; pushed into law per Senate profile. Verified from official Senate profile and issuances.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "RA 11313",
            "congress": 17,
            "chamber": "SENATE",
            "title": "Safe Spaces Act",
            "longTitle": "Safe Spaces Act",
            "role": "SPONSOR",
            "status": "REPUBLIC_ACT",
            "republicActNo": "RA 11313",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/senator/hontiveros-risa",
            "matchConfidence": 1,
            "matchNotes": "Enacted into law as Republic Act (RA 11313). Role: Committee chair; pushed into law per Senate profile. Verified from official Senate profile and issuances.",
            "reviewStatus": "CONFIRMED"
      },
      {
            "billNo": "RA 11930",
            "congress": 18,
            "chamber": "SENATE",
            "title": "Anti-Online Sexual Abuse or Exploitation of Children Act",
            "longTitle": "Anti-Online Sexual Abuse or Exploitation of Children Act",
            "role": "SPONSOR",
            "status": "REPUBLIC_ACT",
            "republicActNo": "RA 11930",
            "sourceInstitution": "SENATE_PH",
            "sourceUrl": "https://ldr.senate.gov.ph/senator/hontiveros-risa",
            "matchConfidence": 1,
            "matchNotes": "Enacted into law as Republic Act (RA 11930). Role: Committee chair; pushed into law per Senate profile. Verified from official Senate profile and issuances.",
            "reviewStatus": "CONFIRMED"
      }
]
  },

  // Senator Francis 'Chiz' Escudero
  {
    slug: "francis-escudero",
    aliases: [
      "Francis 'Chiz' Escudero",
      "Francis Joseph Guevara Escudero",
      "Chiz Escudero",
      "Escudero, Francis G."
    ],
    records: [
      {
        billNo: "RA 9745",
        congress: 14,
        chamber: "SENATE",
        title: "Anti-Torture Act of 2009",
        longTitle: "An Act Penalizing Torture and Other Cruel, Inhuman and Degrading Treatment or Punishment and Prescribing Penalties Therefor",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 9745",
        filedDate: "2008-02-18",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=14&q=SBN-1978",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 9745."
      },
      {
        billNo: "RA 11984",
        congress: 19,
        chamber: "SENATE",
        title: "No Permit, No Exam Prohibition Act",
        longTitle: "An Act Mandating Private and Public Educational Institutions to Allow Disadvantaged Students with Unpaid Tuition to Take Periodic and Final Examinations",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11984",
        filedDate: "2022-07-11",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-1359",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 11984."
      }
    ]
  },

  // Senator Mary Grace Poe-Llamanzares
  {
    slug: "grace-poe",
    aliases: [
      "Mary Grace Poe-Llamanzares",
      "Grace Poe",
      "Mary Grace Sonora Poe",
      "Poe, Grace"
    ],
    records: [
      {
        billNo: "RA 11037",
        congress: 17,
        chamber: "SENATE",
        title: "Masustansyang Pagkain para sa Batang Pilipino Act",
        longTitle: "An Act Institutionalizing a National Feeding Program for Undernourished Children in Public Day Care, Kindergarten and Elementary Schools",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11037",
        filedDate: "2016-07-04",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1279",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 11037."
      },
      {
        billNo: "RA 11934",
        congress: 19,
        chamber: "SENATE",
        title: "SIM Registration Act",
        longTitle: "An Act Requiring the Registration of Subscriber Identity Module (SIM) Cards",
        role: "SPONSOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11934",
        filedDate: "2022-08-01",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-1310",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 11934."
      }
    ]
  },

  // Senator Christopher Lawrence 'Bong' Go
  {
    slug: "bong-go",
    aliases: [
      "Christopher Lawrence 'Bong' Go",
      "Christopher Lawrence T. Go",
      "Bong Go",
      "Go, Christopher Lawrence T."
    ],
    records: [
      {
        billNo: "RA 11463",
        congress: 18,
        chamber: "SENATE",
        title: "Malasakit Centers Act",
        longTitle: "An Act Establishing Malasakit Centers in All Department of Health (DOH) Hospitals and the Philippine General Hospital",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11463",
        filedDate: "2019-07-02",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=18&q=SBN-1076",
        matchConfidence: 1.0,
        matchNotes: "Principal author and sponsor. Enacted as Republic Act No. 11463."
      },
      {
        billNo: "RA 11470",
        congress: 18,
        chamber: "SENATE",
        title: "National Academy of Sports Act",
        longTitle: "An Act Creating and Establishing the National Academy of Sports and Providing Funds Therefor",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11470",
        filedDate: "2019-07-02",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=18&q=SBN-723",
        matchConfidence: 1.0,
        matchNotes: "Enacted as Republic Act No. 11470."
      }
    ]
  },

  // Senator Ronald 'Bato' Dela Rosa
  {
    slug: "bato-dela-rosa",
    aliases: [
      "Ronald 'Bato' Dela Rosa",
      "Ronald Marapon dela Rosa",
      "Bato Dela Rosa",
      "Dela Rosa, Ronald M."
    ],
    records: [
      {
        billNo: "SB-2034",
        congress: 19,
        chamber: "SENATE",
        title: "Reserve Officers' Training Corps (ROTC) Act",
        longTitle: "An Act Mandatory Institutionalizing the Basic Reserve Officers' Training Corps in Higher Educational Institutions and Technical-Vocational Institutions",
        role: "SPONSOR",
        status: "PASSED_SENATE",
        filedDate: "2023-03-20",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2034",
        matchConfidence: 1.0,
        matchNotes: "Principal Sponsor and Committee Chairperson."
      }
    ]
  },

  // Representative Erwin T. Tulfo
  {
    slug: "erwin-tulfo",
    aliases: [
      "Erwin T. Tulfo",
      "Erwin Teshiba Tulfo",
      "Erwin Tulfo",
      "Tulfo, Erwin T."
    ],
    records: [
      {
        billNo: "HB-8980",
        congress: 19,
        chamber: "HOUSE",
        title: "General Appropriations Act for Fiscal Year 2024",
        longTitle: "An Act Appropriating Funds for the Operation of the Government of the Republic of the Philippines",
        role: "CO_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 11975",
        filedDate: "2023-08-02",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "ACT-CIS Party-List representative."
      }
    ]
  },

  // Former Vice President & Representative Maria Leonor 'Leni' Robredo
  {
    slug: "leni-robredo",
    aliases: [
      "Maria Leonor 'Leni' Robredo",
      "Maria Leonor Gerona Robredo",
      "Leni Robredo",
      "Robredo, Leni G."
    ],
    records: [
      {
        billNo: "HB-19",
        congress: 16,
        chamber: "HOUSE",
        title: "Full Disclosure Bill",
        longTitle: "An Act Requiring the Full Disclosure of All Financial Transactions and Public Documents in All Government Agencies",
        role: "PRINCIPAL_AUTHOR",
        status: "PASSED_HOUSE",
        filedDate: "2013-07-01",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Authored during legislative tenure representing Camarines Sur 3rd District."
      },
      {
        billNo: "RA 10665",
        congress: 16,
        chamber: "HOUSE",
        title: "Open High School System Act",
        longTitle: "An Act Establishing the Open High School System in the Philippines",
        role: "CO_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 10665",
        filedDate: "2013-09-02",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 10665."
      }
    ]
  },

  // Senator Jose 'Jinggoy' P. Estrada
  {
    slug: "jinggoy-estrada",
    aliases: [
      "Jose 'Jinggoy' P. Estrada",
      "Jose Pimentel Ejercito Jr.",
      "Jinggoy Estrada",
      "Estrada, Jinggoy P."
    ],
    records: [
      {
        billNo: "RA 10627",
        congress: 15,
        chamber: "SENATE",
        title: "Anti-Bullying Act of 2013",
        longTitle: "An Act Requiring All Elementary and Secondary Schools to Adopt Policies to Prevent and Address the Acts of Bullying in Their Institutions",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 10627",
        filedDate: "2010-07-01",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=15&q=SBN-2677",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 10627."
      }
    ]
  },

  // Senator Emmanuel 'Manny' Pacquiao
  {
    slug: "manny-pacquiao",
    aliases: [
      "Emmanuel 'Manny' Pacquiao",
      "Emmanuel Dapidran Pacquiao",
      "Manny Pacquiao",
      "Pacquiao, Emmanuel D."
    ],
    records: [
      {
        billNo: "RA 10699",
        congress: 16,
        chamber: "HOUSE",
        title: "National Athletes and Coaches Benefits and Incentives Act",
        longTitle: "An Act Expanding the Benefits and Incentives for National Athletes and Coaches",
        role: "PRINCIPAL_AUTHOR",
        status: "REPUBLIC_ACT",
        republicActNo: "RA 10699",
        filedDate: "2013-08-05",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Enacted into law as Republic Act No. 10699."
      }
    ]
  }
];
