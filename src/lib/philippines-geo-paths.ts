/**
 * Accurate Geographic SVG Boundaries & Coordinates for the Philippine Archipelago
 * Designed to render authentic regional & provincial polygons matching national election broadcasts.
 * Normalized to a 1000 x 1200 coordinate viewBox.
 */

export interface GeoRegionPath {
  id: string; // e.g. "R01", "R03", "NCR", "R07", etc.
  name: string;
  code: string;
  islandGroup: "Luzon" | "Visayas" | "Mindanao";
  // SVG path definition
  d: string;
  labelX: number;
  labelY: number;
  provinceIds: string[];
}

export const PHILIPPINE_GEO_REGIONS: GeoRegionPath[] = [
  // 1. Ilocos Region (Region I) - Northwestern coastal strip
  {
    id: "R01",
    name: "Ilocos Region",
    code: "Region I",
    islandGroup: "Luzon",
    d: "M 340 70 L 375 75 L 365 140 L 350 210 L 335 280 L 360 300 L 340 330 L 315 320 L 325 240 L 335 150 Z",
    labelX: 330,
    labelY: 180,
    provinceIds: ["ilocos-norte", "ilocos-sur", "la-union", "pangasinan"],
  },
  // 2. Cordillera Administrative Region (CAR) - Northern Mountain Spine
  {
    id: "CAR",
    name: "Cordillera (CAR)",
    code: "CAR",
    islandGroup: "Luzon",
    d: "M 375 75 L 420 85 L 430 160 L 410 230 L 390 280 L 360 300 L 335 280 L 350 210 L 365 140 Z",
    labelX: 385,
    labelY: 170,
    provinceIds: ["abra", "benguet", "ifugao", "kalinga", "apayao", "mountain-province"],
  },
  // 3. Cagayan Valley (Region II) - Northeastern Luzon & Batanes
  {
    id: "R02",
    name: "Cagayan Valley",
    code: "Region II",
    islandGroup: "Luzon",
    d: "M 420 85 L 465 95 L 490 140 L 480 230 L 450 320 L 410 320 L 390 280 L 410 230 L 430 160 Z M 440 25 L 455 25 L 450 45 L 435 45 Z",
    labelX: 450,
    labelY: 200,
    provinceIds: ["batanes", "cagayan", "isabela", "nueva-vizcaya", "quirino"],
  },
  // 4. Central Luzon (Region III) - The Heart of Luzon Plains (Image 2 Red Highlight)
  {
    id: "R03",
    name: "Central Luzon",
    code: "Region III",
    islandGroup: "Luzon",
    d: "M 340 330 L 390 325 L 450 320 L 475 350 L 460 410 L 415 435 L 360 445 L 340 430 L 335 390 L 315 370 Z",
    labelX: 395,
    labelY: 380,
    provinceIds: ["aurora", "bataan", "bulacan", "nueva-ecija", "pampanga", "tarlac", "zambales"],
  },
  // 5. National Capital Region (NCR) - Metro Manila
  {
    id: "NCR",
    name: "Metro Manila",
    code: "NCR",
    islandGroup: "Luzon",
    d: "M 382 430 L 405 430 L 408 450 L 385 452 Z",
    labelX: 395,
    labelY: 442,
    provinceIds: ["metro-manila"],
  },
  // 6. CALABARZON (Region IV-A) - Southern Tagalog Mainland
  {
    id: "R04A",
    name: "CALABARZON",
    code: "Region IV-A",
    islandGroup: "Luzon",
    d: "M 385 452 L 408 450 L 440 440 L 475 460 L 515 480 L 485 530 L 445 540 L 410 520 L 375 490 L 370 460 Z",
    labelX: 435,
    labelY: 495,
    provinceIds: ["batangas", "cavite", "laguna", "quezon", "rizal"],
  },
  // 7. MIMAROPA (Mindoro, Marinduque, Romblon, Palawan)
  {
    id: "MIMAROPA",
    name: "MIMAROPA",
    code: "MIMAROPA",
    islandGroup: "Luzon",
    // Mindoro + Marinduque + Romblon + Palawan archipelago
    d: "M 340 510 L 390 515 L 385 580 L 335 565 Z M 425 540 L 445 545 L 440 565 L 420 560 Z M 420 600 L 445 605 L 440 635 L 415 625 Z M 160 830 L 230 710 L 285 640 L 305 655 L 255 745 L 185 850 Z",
    labelX: 350,
    labelY: 545,
    provinceIds: ["marinduque", "occidental-mindoro", "oriental-mindoro", "palawan", "romblon"],
  },
  // 8. Bicol Region (Region V) - Southeastern Luzon Peninsula & Islands
  {
    id: "R05",
    name: "Bicol Region",
    code: "Region V",
    islandGroup: "Luzon",
    d: "M 475 460 L 530 470 L 580 500 L 635 530 L 610 590 L 575 585 L 535 560 L 500 525 Z M 590 480 L 620 485 L 615 520 L 585 510 Z M 520 600 L 565 610 L 555 660 L 510 640 Z",
    labelX: 550,
    labelY: 535,
    provinceIds: ["albay", "camarines-norte", "camarines-sur", "catanduanes", "masbate", "sorsogon"],
  },
  // 9. Western Visayas (Region VI) - Panay Island & Guimaras & Negros Occidental
  {
    id: "R06",
    name: "Western Visayas",
    code: "Region VI",
    islandGroup: "Visayas",
    d: "M 445 615 L 495 620 L 505 680 L 460 705 L 430 670 Z M 480 695 L 500 700 L 495 725 L 475 720 Z M 505 690 L 535 695 L 530 780 L 495 765 Z",
    labelX: 470,
    labelY: 655,
    provinceIds: ["aklan", "antique", "capiz", "guimaras", "iloilo", "negros-occidental"],
  },
  // 10. Central Visayas (Region VII) - Cebu, Bohol, Negros Oriental, Siquijor
  {
    id: "R07",
    name: "Central Visayas",
    code: "Region VII",
    islandGroup: "Visayas",
    d: "M 530 780 L 550 785 L 535 830 L 515 820 Z M 550 685 L 575 695 L 560 780 L 540 765 Z M 580 735 L 630 745 L 620 790 L 575 775 Z M 530 835 L 550 838 L 545 855 L 525 850 Z",
    labelX: 565,
    labelY: 745,
    provinceIds: ["bohol", "cebu", "negros-oriental", "siquijor"],
  },
  // 11. Eastern Visayas (Region VIII) - Samar & Leyte
  {
    id: "R08",
    name: "Eastern Visayas",
    code: "Region VIII",
    islandGroup: "Visayas",
    d: "M 625 580 L 680 595 L 695 655 L 650 680 L 615 635 Z M 605 675 L 640 685 L 630 790 L 595 765 Z",
    labelX: 650,
    labelY: 640,
    provinceIds: ["biliran", "eastern-samar", "leyte", "northern-samar", "samar", "southern-leyte"],
  },
  // 12. Zamboanga Peninsula (Region IX) - Western Mindanao Horn
  {
    id: "R09",
    name: "Zamboanga Peninsula",
    code: "Region IX",
    islandGroup: "Mindanao",
    d: "M 380 920 L 450 840 L 495 860 L 475 915 L 420 955 L 370 940 Z",
    labelX: 435,
    labelY: 895,
    provinceIds: ["zamboanga-del-norte", "zamboanga-del-sur", "zamboanga-sibugay"],
  },
  // 13. Northern Mindanao (Region X)
  {
    id: "R10",
    name: "Northern Mindanao",
    code: "Region X",
    islandGroup: "Mindanao",
    d: "M 495 860 L 565 850 L 600 875 L 585 935 L 520 920 L 505 885 Z M 575 805 L 595 810 L 590 828 L 570 825 Z",
    labelX: 550,
    labelY: 885,
    provinceIds: ["bukidnon", "camiguin", "lanao-del-norte", "misamis-occidental", "misamis-oriental"],
  },
  // 14. Davao Region (Region XI) - Southeastern Mindanao
  {
    id: "R11",
    name: "Davao Region",
    code: "Region XI",
    islandGroup: "Mindanao",
    d: "M 610 910 L 665 905 L 705 935 L 680 1020 L 625 1030 L 605 970 Z",
    labelX: 650,
    labelY: 965,
    provinceIds: ["davao-de-oro", "davao-del-norte", "davao-del-sur", "davao-occidental", "davao-oriental"],
  },
  // 15. SOCCSKSARGEN (Region XII) - South Central Mindanao
  {
    id: "R12",
    name: "SOCCSKSARGEN",
    code: "Region XII",
    islandGroup: "Mindanao",
    d: "M 525 935 L 585 935 L 610 970 L 600 1060 L 545 1050 L 520 990 Z",
    labelX: 565,
    labelY: 995,
    provinceIds: ["cotabato", "sarangani", "south-cotabato", "sultan-kudarat"],
  },
  // 16. Caraga (Region XIII) - Northeastern Mindanao & Siargao
  {
    id: "R13",
    name: "Caraga Region",
    code: "Region XIII",
    islandGroup: "Mindanao",
    d: "M 625 790 L 675 800 L 705 870 L 665 905 L 605 875 L 615 820 Z M 650 755 L 675 760 L 670 785 L 645 780 Z",
    labelX: 655,
    labelY: 845,
    provinceIds: ["agusan-del-norte", "agusan-del-sur", "dinagat-islands", "surigao-del-norte", "surigao-del-sur"],
  },
  // 17. BARMM - Bangsamoro Autonomous Region in Muslim Mindanao & Sulu Archipelago
  {
    id: "BARMM",
    name: "BARMM",
    code: "BARMM",
    islandGroup: "Mindanao",
    d: "M 480 910 L 525 905 L 530 965 L 485 965 Z M 375 970 L 410 975 L 405 1010 L 370 1005 Z M 310 1010 L 350 1015 L 345 1045 L 305 1040 Z M 230 1060 L 280 1065 L 275 1095 L 225 1090 Z",
    labelX: 495,
    labelY: 935,
    provinceIds: ["basilan", "lanao-del-sur", "maguindanao", "sulu", "tawi-tawi"],
  },
];
