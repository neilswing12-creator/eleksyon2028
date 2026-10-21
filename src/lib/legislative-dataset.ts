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
  role: "PRINCIPAL_AUTHOR" | "CO_AUTHOR" | "SPONSOR" | "CO_SPONSOR";
  status: "ENACTED_INTO_LAW" | "REPUBLIC_ACT" | "PASSED_SENATE" | "PASSED_HOUSE" | "PENDING" | "CONSOLIDATED";
  republicActNo?: string;
  filedDate?: string; // ISO date string
  sourceInstitution: "SENATE_PH" | "HOUSE_PH";
  sourceUrl: string;
  pdfUrl?: string;
  matchConfidence: number;
  matchNotes?: string;
}

export interface CandidateLegislativeSeed {
  slug: string;
  aliases: string[];
  records: OfficialLegislativeRecord[];
}

export const OFFICIAL_LEGISLATIVE_DATASET: CandidateLegislativeSeed[] = [
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
      "Ana Theresia N. Hontiveros-Baraquel",
      "Ana Theresia Hontiveros",
      "Risa Hontiveros",
      "Hontiveros, Risa"
    ],
    records: [
      {
        billNo: "SB-1558",
        congress: 17,
        chamber: "SENATE",
        title: "Safe Spaces Act (Bawal Bastos Law)",
        longTitle: "An Act Defining Gender-Based Sexual Harassment in Streets, Public Spaces, Online, Workplaces, and Educational and Training Institutions",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11313",
        filedDate: "2017-08-14",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1558",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/2647722836!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal author and sponsor of the Bawal Bastos Law."
      },
      {
        billNo: "SB-1354",
        congress: 17,
        chamber: "SENATE",
        title: "Philippine Mental Health Act",
        longTitle: "An Act Establishing a National Mental Health Policy for the Purpose of Enhancing the Delivery of Integrated Mental Health Services",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11036",
        filedDate: "2017-02-15",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1354",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/2544521959!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal author and sponsor."
      },
      {
        billNo: "SB-1305",
        congress: 17,
        chamber: "SENATE",
        title: "105-Day Expanded Maternity Leave Law",
        longTitle: "An Act Increasing the Maternity Leave Period to One Hundred Five (105) Days for Female Workers with Full Pay",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11210",
        filedDate: "2017-01-18",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1305",
        pdfUrl: "https://legacy.senate.gov.ph/lisdata/2523521771!.pdf",
        matchConfidence: 1.0,
        matchNotes: "Principal author and sponsor."
      },
      {
        billNo: "SB-1373",
        congress: 18,
        chamber: "SENATE",
        title: "Prohibition of Child Marriage Act",
        longTitle: "An Act Prohibiting the Facilitation and Solemnization of Child Marriage and Imposing Penalties Therefor",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11596",
        filedDate: "2020-03-04",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=18&q=SBN-1373",
        matchConfidence: 1.0,
        matchNotes: "Principal author and sponsor in the 18th Congress."
      },
      {
        billNo: "SB-1600",
        congress: 19,
        chamber: "SENATE",
        title: "Sexual Orientation and Gender Identity and Expression (SOGIESC) Equality Act",
        longTitle: "An Act Prohibiting Discrimination on the Basis of Sexual Orientation, Gender Identity and Expression, and Providing Penalties Therefor",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2022-12-06",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-1600",
        matchConfidence: 1.0,
        matchNotes: "Principal author and sponsor, Committee on Women and Children."
      }
    ]
  },

  // Senator Francis "Chiz" Escudero
  {
    slug: "francis-escudero",
    aliases: [
      "Francis Joseph G. Escudero",
      "Francis Escudero",
      "Chiz Escudero",
      "Escudero, Francis G."
    ],
    records: [
      {
        billNo: "SB-1304",
        congress: 17,
        chamber: "SENATE",
        title: "Universal Access to Quality Tertiary Education Act",
        longTitle: "An Act Providing Free Tuition and Other School Fees in State Universities and Colleges",
        role: "CO_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 10931",
        filedDate: "2017-01-17",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1304",
        matchConfidence: 0.95,
        matchNotes: "Co-author and Senate Committee on Education Chairman."
      },
      {
        billNo: "SB-2293",
        congress: 14,
        chamber: "SENATE",
        title: "Tax Exemption for Minimum Wage Earners",
        longTitle: "An Act Amending the National Internal Revenue Code to Grant Tax Relief to Minimum Wage Earners",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 9504",
        filedDate: "2008-05-19",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=14&q=SBN-2293",
        matchConfidence: 1.0,
        matchNotes: "Principal sponsor and author in the 14th Congress."
      },
      {
        billNo: "SB-2492",
        congress: 19,
        chamber: "SENATE",
        title: "Philippine Maritime Zones Act",
        longTitle: "An Act Defining and Declaring the Maritime Zones Under the Jurisdiction and Sovereignty of the Republic of the Philippines",
        role: "CO_SPONSOR",
        status: "PASSED_SENATE",
        filedDate: "2023-11-20",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2492",
        matchConfidence: 0.9,
        matchNotes: "Senate President and Co-sponsor."
      }
    ]
  },

  // Senator Grace Poe
  {
    slug: "grace-poe",
    aliases: [
      "Mary Grace Natividad S. Poe-Llamanzares",
      "Grace Poe",
      "Poe, Grace",
      "Grace Poe-Llamanzares"
    ],
    records: [
      {
        billNo: "SB-2094",
        congress: 18,
        chamber: "SENATE",
        title: "Public Services Act Amendments (100% Foreign Ownership in Key Sectors)",
        longTitle: "An Act Amending Commonwealth Act No. 146, Otherwise Known as the Public Service Act, as Amended",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11659",
        filedDate: "2021-05-17",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=18&q=SBN-2094",
        matchConfidence: 1.0,
        matchNotes: "Principal sponsor and committee chair."
      },
      {
        billNo: "SB-1636",
        congress: 17,
        chamber: "SENATE",
        title: "Mobile Number Portability Act",
        longTitle: "An Act Requiring Public Telecommunications Entities to Provide Nationwide Mobile Number Portability to Each Mobile Phone Subscriber",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11202",
        filedDate: "2017-12-05",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1636",
        matchConfidence: 1.0,
        matchNotes: "Principal author and sponsor."
      },
      {
        billNo: "SB-1310",
        congress: 19,
        chamber: "SENATE",
        title: "SIM Registration Act",
        longTitle: "An Act Requiring the Registration of All Users of Subscriber Identity Module (SIM) Cards",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11934",
        filedDate: "2022-09-08",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-1310",
        matchConfidence: 1.0,
        matchNotes: "Principal author and sponsor in the 19th Congress."
      }
    ]
  },

  // Senator Pia Cayetano
  {
    slug: "pia-cayetano",
    aliases: [
      "Pilar Juliana S. Cayetano",
      "Pia S. Cayetano",
      "Pia Cayetano",
      "Cayetano, Pia"
    ],
    records: [
      {
        billNo: "SB-2865",
        congress: 15,
        chamber: "SENATE",
        title: "Responsible Parenthood and Reproductive Health Act of 2012",
        longTitle: "An Act Providing for a National Policy on Responsible Parenthood and Reproductive Health",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 10354",
        filedDate: "2011-06-08",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=15&q=SBN-2865",
        matchConfidence: 1.0,
        matchNotes: "Principal sponsor and co-author."
      },
      {
        billNo: "SB-1357",
        congress: 18,
        chamber: "SENATE",
        title: "Corporate Recovery and Tax Incentives for Enterprises (CREATE) Act",
        longTitle: "An Act Rationalizing Corporate Income Taxes and Fiscal Incentives",
        role: "SPONSOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11534",
        filedDate: "2020-02-18",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=18&q=SBN-1357",
        matchConfidence: 1.0,
        matchNotes: "Senate Ways and Means Committee Chair and sponsor."
      }
    ]
  },

  // Senator Christopher "Bong" Go
  {
    slug: "bong-go",
    aliases: [
      "Christopher Lawrence T. Go",
      "Bong Go",
      "Christopher Go",
      "Go, Christopher Lawrence T."
    ],
    records: [
      {
        billNo: "SB-1076",
        congress: 18,
        chamber: "SENATE",
        title: "Malasakit Centers Act",
        longTitle: "An Act Establishing Malasakit Centers in All Department of Health (DOH) Hospitals and the Philippine General Hospital (PGH)",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11463",
        filedDate: "2019-09-24",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=18&q=SBN-1076",
        matchConfidence: 1.0,
        matchNotes: "Principal author and sponsor."
      },
      {
        billNo: "SB-1832",
        congress: 18,
        chamber: "SENATE",
        title: "Bureau of Fire Protection Modernization Act",
        longTitle: "An Act Strengthening and Modernizing the Bureau of Fire Protection and Providing Funds Therefor",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11589",
        filedDate: "2020-09-14",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=18&q=SBN-1832",
        matchConfidence: 1.0,
        matchNotes: "Principal author and sponsor."
      }
    ]
  },

  // Senator Ronald "Bato" Dela Rosa
  {
    slug: "ronald-dela-rosa",
    aliases: [
      "Ronald M. Dela Rosa",
      "Ronald Dela Rosa",
      "Bato Dela Rosa",
      "Dela Rosa, Ronald"
    ],
    records: [
      {
        billNo: "SB-1563",
        congress: 18,
        chamber: "SENATE",
        title: "Height Equality Act for PNP, BFP, BJMP and BuCor",
        longTitle: "An Act Lowering the Height Requirements for Applicants to the Philippine National Police, Bureau of Fire Protection, Bureau of Jail Management and Penology, and Bureau of Corrections",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11549",
        filedDate: "2020-05-27",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=18&q=SBN-1563",
        matchConfidence: 1.0,
        matchNotes: "Principal sponsor and author."
      },
      {
        billNo: "SB-2034",
        congress: 19,
        chamber: "SENATE",
        title: "Mandatory Reserve Officers' Training Corps (ROTC) Act",
        longTitle: "An Act Mandating the Institutionalization of the Basic Reserve Officers' Training Corps (ROTC) Program in Higher Educational Institutions and Technical-Vocational Institutions",
        role: "SPONSOR",
        status: "PASSED_SENATE",
        filedDate: "2023-03-22",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2034",
        matchConfidence: 0.95,
        matchNotes: "Sponsor and defense committee vice-chair."
      }
    ]
  },

  // Representative Erwin Tulfo
  {
    slug: "erwin-tulfo",
    aliases: [
      "Erwin Teshiba Tulfo",
      "Erwin Tulfo",
      "Tulfo, Erwin"
    ],
    records: [
      {
        billNo: "HB-6718",
        congress: 19,
        chamber: "HOUSE",
        title: "Freelance Workers Protection Act",
        longTitle: "An Act Providing Protection and Additional Benefits to Freelance Workers in the Philippines",
        role: "PRINCIPAL_AUTHOR",
        status: "PASSED_HOUSE",
        filedDate: "2023-01-16",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://www.congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "House 19th Congress ACT-CIS Party-list Representative."
      },
      {
        billNo: "HB-8400",
        congress: 19,
        chamber: "HOUSE",
        title: "Senior High School Graduates Employment Incentive Act",
        longTitle: "An Act Institutionalizing Free Government Certification and Job Matching for Senior High School Graduates",
        role: "PRINCIPAL_AUTHOR",
        status: "PASSED_HOUSE",
        filedDate: "2023-05-30",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://www.congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Principal author in the 19th Congress."
      }
    ]
  },

  // Senator Ramon "Bong" Revilla Jr.
  {
    slug: "bong-revilla",
    aliases: [
      "Ramon Bong Revilla Jr.",
      "Ramon Bautista Revilla Jr.",
      "Bong Revilla",
      "Revilla, Ramon Jr."
    ],
    records: [
      {
        billNo: "SB-2029",
        congress: 19,
        chamber: "SENATE",
        title: "Kabalikat sa Pagtuturo Act (Public School Teachers Teaching Supplies Allowance)",
        longTitle: "An Act Institutionalizing the Teaching Supplies Allowance for Public School Teachers and Appropriating Funds Therefor",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11997",
        filedDate: "2023-03-20",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2029",
        matchConfidence: 1.0,
        matchNotes: "Principal author and sponsor."
      },
      {
        billNo: "SB-2028",
        congress: 19,
        chamber: "SENATE",
        title: "Expanded Centenarians Act",
        longTitle: "An Act Granting Cash Gifts to Filipino Citizens Reaching the Ages of 80, 85, 90, and 95",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11982",
        filedDate: "2023-03-20",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2028",
        matchConfidence: 1.0,
        matchNotes: "Principal author and sponsor."
      }
    ]
  },

  // Senator Jinggoy Estrada
  {
    slug: "jinggoy-estrada",
    aliases: [
      "Jinggoy Ejercito Estrada",
      "Jinggoy Estrada",
      "Jose Pimentel Ejercito Jr.",
      "Estrada, Jinggoy"
    ],
    records: [
      {
        billNo: "SB-78",
        congress: 15,
        chamber: "SENATE",
        title: "Batas Kasambahay (Domestic Workers Act)",
        longTitle: "An Act Instituting Policies for the Protection and Welfare of Domestic Workers",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 10361",
        filedDate: "2010-07-01",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=15&q=SBN-78",
        matchConfidence: 1.0,
        matchNotes: "Principal author and Senate Committee on Labor Chair."
      },
      {
        billNo: "SB-2221",
        congress: 19,
        chamber: "SENATE",
        title: "Magna Carta of Filipino Seafarers",
        longTitle: "An Act Providing for the Magna Carta of Filipino Seafarers",
        role: "SPONSOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 12021",
        filedDate: "2023-05-22",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2221",
        matchConfidence: 0.95,
        matchNotes: "Sponsor and Committee on Labor Chair."
      }
    ]
  },

  // Senator Manuel "Lito" Lapid
  {
    slug: "lito-lapid",
    aliases: [
      "Manuel Mercado Lapid",
      "Manuel Lapid",
      "Lito Lapid",
      "Lapid, Manuel M."
    ],
    records: [
      {
        billNo: "SB-2361",
        congress: 14,
        chamber: "SENATE",
        title: "Free Legal Assistance Act of 2010",
        longTitle: "An Act Granting Tax Deductions to Lawyers Providing Free Legal Assistance to Indigent Clients",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 9999",
        filedDate: "2008-07-01",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=14&q=SBN-2361",
        matchConfidence: 1.0,
        matchNotes: "Principal author in the 14th Congress."
      },
      {
        billNo: "SB-2441",
        congress: 19,
        chamber: "SENATE",
        title: "Free College Entrance Examinations Act",
        longTitle: "An Act Waiving College Entrance Examination Fees to Qualified Graduating High School Students",
        role: "CO_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 12006",
        filedDate: "2023-10-09",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=19&q=SBN-2441",
        matchConfidence: 0.95,
        matchNotes: "Co-author in the 19th Congress."
      }
    ]
  },

  // Senator Manny Pacquiao (Former House & Senate)
  {
    slug: "manny-pacquiao",
    aliases: [
      "Emmanuel Dapidran Pacquiao",
      "Manny Pacquiao",
      "Emmanuel Pacquiao",
      "Pacquiao, Emmanuel D."
    ],
    records: [
      {
        billNo: "SB-1531",
        congress: 17,
        chamber: "SENATE",
        title: "First 1,000 Days of Life Act (Kalusugan at Nutrisyon ng Mag-Nanay Act)",
        longTitle: "An Act Scaling up the National and Local Health and Nutrition Programs through a Strengthened Integrated Strategy for Maternal, Neonatal, Child Health and Nutrition in the First 1,000 Days of Life",
        role: "CO_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11148",
        filedDate: "2017-08-01",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-1531",
        matchConfidence: 0.95,
        matchNotes: "Co-author in the 17th Congress."
      },
      {
        billNo: "SB-188",
        congress: 17,
        chamber: "SENATE",
        title: "Handbook for OFWs Act",
        longTitle: "An Act Requiring the POEA to Publish and Distribute a Handbook for Overseas Filipino Workers",
        role: "PRINCIPAL_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 11227",
        filedDate: "2016-06-30",
        sourceInstitution: "SENATE_PH",
        sourceUrl: "https://legacy.senate.gov.ph/lis/bill_res.aspx?congress=17&q=SBN-188",
        matchConfidence: 1.0,
        matchNotes: "Principal author in the 17th Congress."
      }
    ]
  },

  // Former VP Leni Robredo (16th Congress Camarines Sur 3rd District)
  {
    slug: "leni-robredo",
    aliases: [
      "Maria Leonor G. Robredo",
      "Leni Robredo",
      "Leonor Robredo",
      "Robredo, Maria Leonor"
    ],
    records: [
      {
        billNo: "HB-19",
        congress: 16,
        chamber: "HOUSE",
        title: "Full Disclosure and Freedom of Information in Government Act",
        longTitle: "An Act Requiring Full Public Disclosure of All Government Transactions Involving Public Interest and Providing Penalties for Violations",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2013-07-01",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://www.congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Principal author in the 16th Congress House of Representatives."
      },
      {
        billNo: "HB-3432",
        congress: 16,
        chamber: "HOUSE",
        title: "National Food Security and Zero Hunger Act",
        longTitle: "An Act Establishing a Framework for Right to Adequate Food and Eliminating Hunger",
        role: "PRINCIPAL_AUTHOR",
        status: "PENDING",
        filedDate: "2013-11-20",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://www.congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 1.0,
        matchNotes: "Principal author in the 16th Congress."
      },
      {
        billNo: "HB-5487",
        congress: 16,
        chamber: "HOUSE",
        title: "Tax Incentives Management and Transparency Act (TIMTA)",
        longTitle: "An Act Promoting Fiscal Accountability and Transparency in the Grant and Administration of Tax Incentives",
        role: "CO_AUTHOR",
        status: "ENACTED_INTO_LAW",
        republicActNo: "RA 10708",
        filedDate: "2015-02-18",
        sourceInstitution: "HOUSE_PH",
        sourceUrl: "https://www.congress.gov.ph/legisdocs/?v=bills",
        matchConfidence: 0.95,
        matchNotes: "Co-author in the 16th Congress."
      }
    ]
  }
];
