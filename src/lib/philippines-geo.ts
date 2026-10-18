export interface RegionInfo {
  id: string;
  code: string;
  name: string;
  islandGroup: "Luzon" | "Visayas" | "Mindanao";
  centerLat: number;
  centerLng: number;
  registeredVoters?: number;
}

export interface ProvinceInfo {
  id: string;
  name: string;
  regionId: string;
  islandGroup: "Luzon" | "Visayas" | "Mindanao";
  centerLat: number;
  centerLng: number;
  cities: string[];
  registeredVoters?: number;
  // SVG / 2D Canvas coordinate approximate bounding polygon or centroid
  svgX: number; // 0-1000 scale
  svgY: number; // 0-1200 scale
  path?: string;
}

export const PHILIPPINE_REGIONS: RegionInfo[] = [
  { id: "NCR", code: "NCR", name: "National Capital Region (Metro Manila)", islandGroup: "Luzon", centerLat: 14.5995, centerLng: 120.9842, registeredVoters: 7322361 },
  { id: "CAR", code: "CAR", name: "Cordillera Administrative Region", islandGroup: "Luzon", centerLat: 17.3513, centerLng: 121.1719, registeredVoters: 1077900 },
  { id: "R01", code: "Region I", name: "Ilocos Region", islandGroup: "Luzon", centerLat: 16.5662, centerLng: 120.3995, registeredVoters: 3540664 },
  { id: "R02", code: "Region II", name: "Cagayan Valley", islandGroup: "Luzon", centerLat: 17.6132, centerLng: 121.727, registeredVoters: 2312797 },
  { id: "R03", code: "Region III", name: "Central Luzon", islandGroup: "Luzon", centerLat: 15.4828, centerLng: 120.712, registeredVoters: 7289791 },
  { id: "R04A", code: "Region IV-A", name: "CALABARZON", islandGroup: "Luzon", centerLat: 14.1008, centerLng: 121.0794, registeredVoters: 9192203 },
  { id: "MIMAROPA", code: "MIMAROPA", name: "MIMAROPA Region", islandGroup: "Luzon", centerLat: 12.8797, centerLng: 121.774, registeredVoters: 1991599 },
  { id: "R05", code: "Region V", name: "Bicol Region", islandGroup: "Luzon", centerLat: 13.421, centerLng: 123.4137, registeredVoters: 3910261 },
  { id: "R06", code: "Region VI", name: "Western Visayas", islandGroup: "Visayas", centerLat: 11.005, centerLng: 122.5373, registeredVoters: 5026482 },
  { id: "R07", code: "Region VII", name: "Central Visayas", islandGroup: "Visayas", centerLat: 9.85, centerLng: 123.85, registeredVoters: 5249096 },
  { id: "R08", code: "Region VIII", name: "Eastern Visayas", islandGroup: "Visayas", centerLat: 11.2444, centerLng: 125.0039, registeredVoters: 3166262 },
  { id: "R09", code: "Region IX", name: "Zamboanga Peninsula", islandGroup: "Mindanao", centerLat: 7.8399, centerLng: 122.836, registeredVoters: 2298930 },
  { id: "R10", code: "Region X", name: "Northern Mindanao", islandGroup: "Mindanao", centerLat: 8.228, centerLng: 124.646, registeredVoters: 3060485 },
  { id: "R11", code: "Region XI", name: "Davao Region", islandGroup: "Mindanao", centerLat: 7.1907, centerLng: 125.4553, registeredVoters: 3335315 },
  { id: "R12", code: "Region XII", name: "SOCCSKSARGEN", islandGroup: "Mindanao", centerLat: 6.2707, centerLng: 124.6857, registeredVoters: 2606492 },
  { id: "R13", code: "Region XIII", name: "Caraga", islandGroup: "Mindanao", centerLat: 8.8015, centerLng: 125.7408, registeredVoters: 1868798 },
  { id: "BARMM", code: "BARMM", name: "Bangsamoro Autonomous Region in Muslim Mindanao", islandGroup: "Mindanao", centerLat: 7.2045, centerLng: 124.2415, registeredVoters: 2491333 },
];

export const PHILIPPINE_PROVINCES: ProvinceInfo[] = [
  // NCR
  {
    id: "metro-manila",
    name: "Metro Manila (NCR)",
    regionId: "NCR",
    islandGroup: "Luzon",
    centerLat: 14.5995,
    centerLng: 120.9842,
    svgX: 385,
    svgY: 420,
    cities: ["Manila", "Quezon City", "Caloocan", "Makati", "Taguig", "Pasig", "Parañaque", "Las Piñas", "Mandaluyong", "Muntinlupa", "Marikina", "Pasay", "Valenzuela", "Navotas", "Malabon", "San Juan", "Pateros"],
  },
  // Region I - Ilocos
  { id: "ilocos-norte", name: "Ilocos Norte", regionId: "R01", islandGroup: "Luzon", centerLat: 18.196, centerLng: 120.5927, svgX: 360, svgY: 130, cities: ["Laoag City", "Batac City", "Currimao", "San Nicolas"] },
  { id: "ilocos-sur", name: "Ilocos Sur", regionId: "R01", islandGroup: "Luzon", centerLat: 17.5747, centerLng: 120.3869, svgX: 350, svgY: 190, cities: ["Vigan City", "Candon City", "Narvacan", "Santa"] },
  { id: "la-union", name: "La Union", regionId: "R01", islandGroup: "Luzon", centerLat: 16.6159, centerLng: 120.3209, svgX: 345, svgY: 260, cities: ["San Fernando City", "Agoo", "Bauang", "Bacnotan"] },
  { id: "pangasinan", name: "Pangasinan", regionId: "R01", islandGroup: "Luzon", centerLat: 15.9254, centerLng: 120.3338, svgX: 340, svgY: 310, cities: ["Dagupan City", "San Carlos City", "Alaminos City", "Urdaneta City", "Lingayen"] },
  // CAR
  { id: "benguet", name: "Benguet", regionId: "CAR", islandGroup: "Luzon", centerLat: 16.4023, centerLng: 120.596, svgX: 375, svgY: 265, cities: ["Baguio City", "La Trinidad", "Itogon", "Tuba"] },
  { id: "abra", name: "Abra", regionId: "CAR", islandGroup: "Luzon", centerLat: 17.5966, centerLng: 120.6872, svgX: 370, svgY: 185, cities: ["Bangued", "Bucay", "Dolores", "Tayum"] },
  { id: "kalinga", name: "Kalinga", regionId: "CAR", islandGroup: "Luzon", centerLat: 17.3228, centerLng: 121.2981, svgX: 420, svgY: 190, cities: ["Tabuk City", "Pinukpuk", "Rizal", "Tinglayan"] },
  { id: "apayao", name: "Apayao", regionId: "CAR", islandGroup: "Luzon", centerLat: 18.0673, centerLng: 121.1719, svgX: 410, svgY: 140, cities: ["Conner", "Kabugao", "Flora", "Luna"] },
  { id: "mountain-province", name: "Mountain Province", regionId: "CAR", islandGroup: "Luzon", centerLat: 17.0864, centerLng: 121.0258, svgX: 400, svgY: 220, cities: ["Bontoc", "Sagada", "Bauko", "Besao"] },
  { id: "ifugao", name: "Ifugao", regionId: "CAR", islandGroup: "Luzon", centerLat: 16.8049, centerLng: 121.1299, svgX: 415, svgY: 245, cities: ["Lagawe", "Banaue", "Kiangan", "Aguinaldo"] },
  // Region II - Cagayan Valley
  { id: "cagayan", name: "Cagayan", regionId: "R02", islandGroup: "Luzon", centerLat: 18.2588, centerLng: 121.8496, svgX: 460, svgY: 135, cities: ["Tuguegarao City", "Aparri", "Lal-lo", "Buguey"] },
  { id: "isabela", name: "Isabela", regionId: "R02", islandGroup: "Luzon", centerLat: 16.9754, centerLng: 121.8107, svgX: 470, svgY: 225, cities: ["Ilagan City", "Cauayan City", "Santiago City", "Roxas"] },
  { id: "nueva-vizcaya", name: "Nueva Vizcaya", regionId: "R02", islandGroup: "Luzon", centerLat: 16.3223, centerLng: 121.1719, svgX: 425, svgY: 285, cities: ["Bayombong", "Solano", "Bambang", "Aritao"] },
  { id: "quirino", name: "Quirino", regionId: "R02", islandGroup: "Luzon", centerLat: 16.2798, centerLng: 121.5794, svgX: 465, svgY: 280, cities: ["Cabarroguis", "Diffun", "Maddela", "Saguday"] },
  { id: "batanes", name: "Batanes", regionId: "R02", islandGroup: "Luzon", centerLat: 20.4485, centerLng: 121.9708, svgX: 465, svgY: 40, cities: ["Basco", "Itbayat", "Mahatao", "Ivana"] },
  // Region III - Central Luzon
  { id: "pampanga", name: "Pampanga", regionId: "R03", islandGroup: "Luzon", centerLat: 15.0794, centerLng: 120.62, svgX: 365, svgY: 375, cities: ["San Fernando City", "Angeles City", "Mabalacat City", "Guagua", "Lubao"] },
  { id: "bulacan", name: "Bulacan", regionId: "R03", islandGroup: "Luzon", centerLat: 14.9544, centerLng: 121.0794, svgX: 400, svgY: 385, cities: ["Malolos City", "Meycauayan City", "San Jose del Monte City", "Marilao", "Santa Maria"] },
  { id: "nueva-ecija", name: "Nueva Ecija", regionId: "R03", islandGroup: "Luzon", centerLat: 15.5905, centerLng: 120.9726, svgX: 400, svgY: 335, cities: ["Cabanatuan City", "Gapan City", "Palayan City", "San Jose City", "Science City of Muñoz"] },
  { id: "tarlac", name: "Tarlac", regionId: "R03", islandGroup: "Luzon", centerLat: 15.4802, centerLng: 120.5979, svgX: 360, svgY: 345, cities: ["Tarlac City", "Capas", "Concepcion", "Paniqui"] },
  { id: "bataan", name: "Bataan", regionId: "R03", islandGroup: "Luzon", centerLat: 14.6417, centerLng: 120.473, svgX: 340, svgY: 410, cities: ["Balanga City", "Mariveles", "Dinalupihan", "Orani"] },
  { id: "zambales", name: "Zambales", regionId: "R03", islandGroup: "Luzon", centerLat: 15.3256, centerLng: 119.9822, svgX: 305, svgY: 355, cities: ["Olongapo City", "Iba", "Subic", "Castillejos"] },
  { id: "aurora", name: "Aurora", regionId: "R03", islandGroup: "Luzon", centerLat: 15.7597, centerLng: 121.5794, svgX: 460, svgY: 330, cities: ["Baler", "Casiguran", "Dingalan", "Dipaculao"] },
  // Region IV-A - CALABARZON
  { id: "cavite", name: "Cavite", regionId: "R04A", islandGroup: "Luzon", centerLat: 14.2456, centerLng: 120.8786, svgX: 360, svgY: 450, cities: ["Imus City", "Bacoor City", "Dasmariñas City", "Tagaytay City", "General Trias City"] },
  { id: "laguna", name: "Laguna", regionId: "R04A", islandGroup: "Luzon", centerLat: 14.2691, centerLng: 121.3484, svgX: 410, svgY: 455, cities: ["Santa Rosa City", "Calamba City", "Biñan City", "San Pablo City", "Cabuyao City"] },
  { id: "batangas", name: "Batangas", regionId: "R04A", islandGroup: "Luzon", centerLat: 13.7565, centerLng: 121.0583, svgX: 380, svgY: 485, cities: ["Batangas City", "Lipa City", "Tanauan City", "Santo Tomas City", "Nasugbu"] },
  { id: "rizal", name: "Rizal", regionId: "R04A", islandGroup: "Luzon", centerLat: 14.6037, centerLng: 121.3084, svgX: 415, svgY: 420, cities: ["Antipolo City", "Cainta", "Taytay", "San Mateo", "Binangonan"] },
  { id: "quezon", name: "Quezon", regionId: "R04A", islandGroup: "Luzon", centerLat: 14.0416, centerLng: 121.924, svgX: 470, svgY: 460, cities: ["Lucena City", "Tayabas City", "Candelaria", "Sariaya", "Gumaca"] },
  // MIMAROPA
  { id: "occidental-mindoro", name: "Occidental Mindoro", regionId: "MIMAROPA", islandGroup: "Luzon", centerLat: 13.0645, centerLng: 120.7301, svgX: 345, svgY: 535, cities: ["Mamburao", "San Jose", "Sablayan"] },
  { id: "oriental-mindoro", name: "Oriental Mindoro", regionId: "MIMAROPA", islandGroup: "Luzon", centerLat: 13.1537, centerLng: 121.3653, svgX: 395, svgY: 530, cities: ["Calapan City", "Naujan", "Pinamalayan", "Puerto Galera"] },
  { id: "marinduque", name: "Marinduque", regionId: "MIMAROPA", islandGroup: "Luzon", centerLat: 13.35, centerLng: 121.95, svgX: 440, svgY: 515, cities: ["Boac", "Gasan", "Mogpog", "Santa Cruz"] },
  { id: "romblon", name: "Romblon", regionId: "MIMAROPA", islandGroup: "Luzon", centerLat: 12.57, centerLng: 122.28, svgX: 460, svgY: 575, cities: ["Romblon", "Odiongan", "San Fernando", "Cajidiocan"] },
  { id: "palawan", name: "Palawan", regionId: "MIMAROPA", islandGroup: "Luzon", centerLat: 9.8349, centerLng: 118.7384, svgX: 200, svgY: 710, cities: ["Puerto Princesa City", "Coron", "El Nido", "Brooke's Point", "Roxas"] },
  // Region V - Bicol
  { id: "camarines-sur", name: "Camarines Sur", regionId: "R05", islandGroup: "Luzon", centerLat: 13.6218, centerLng: 123.1948, svgX: 540, svgY: 495, cities: ["Naga City", "Iriga City", "Pili", "Libmanan"] },
  { id: "camarines-norte", name: "Camarines Norte", regionId: "R05", islandGroup: "Luzon", centerLat: 14.1675, centerLng: 122.7844, svgX: 515, svgY: 450, cities: ["Daet", "Labo", "Jose Panganiban"] },
  { id: "albay", name: "Albay", regionId: "R05", islandGroup: "Luzon", centerLat: 13.1775, centerLng: 123.6444, svgX: 575, svgY: 530, cities: ["Legazpi City", "Ligao City", "Tabaco City", "Daraga", "Guinobatan"] },
  { id: "sorsogon", name: "Sorsogon", regionId: "R05", islandGroup: "Luzon", centerLat: 12.8617, centerLng: 123.9534, svgX: 605, svgY: 565, cities: ["Sorsogon City", "Bulan", "Irosin", "Gubat"] },
  { id: "catanduanes", name: "Catanduanes", regionId: "R05", islandGroup: "Luzon", centerLat: 13.7667, centerLng: 124.2333, svgX: 615, svgY: 480, cities: ["Virac", "San Andres", "Caramoran", "Pandan"] },
  { id: "masbate", name: "Masbate", regionId: "R05", islandGroup: "Luzon", centerLat: 12.2189, centerLng: 123.4475, svgX: 550, svgY: 605, cities: ["Masbate City", "Aroroy", "Milagros", "Cataingan"] },
  // Region VI - Western Visayas
  { id: "iloilo", name: "Iloilo", regionId: "R06", islandGroup: "Visayas", centerLat: 10.7202, centerLng: 122.5621, svgX: 470, svgY: 690, cities: ["Iloilo City", "Passi City", "Oton", "Santa Barbara", "Pototan"] },
  { id: "negros-occidental", name: "Negros Occidental", regionId: "R06", islandGroup: "Visayas", centerLat: 10.6667, centerLng: 123.0, svgX: 515, svgY: 710, cities: ["Bacolod City", "Bago City", "Cadiz City", "Silay City", "Kabankalan City"] },
  { id: "capiz", name: "Capiz", regionId: "R06", islandGroup: "Visayas", centerLat: 11.4137, centerLng: 122.7533, svgX: 490, svgY: 650, cities: ["Roxas City", "Panay", "Pontevedra", "Dumarao"] },
  { id: "aklan", name: "Aklan", regionId: "R06", islandGroup: "Visayas", centerLat: 11.6667, centerLng: 122.3333, svgX: 450, svgY: 640, cities: ["Kalibo", "Malay (Boracay)", "Ibajay", "New Washington"] },
  { id: "antique", name: "Antique", regionId: "R06", islandGroup: "Visayas", centerLat: 11.1667, centerLng: 122.0833, svgX: 430, svgY: 680, cities: ["San Jose de Buenavista", "Sibalom", "Hamtic", "Culasi"] },
  { id: "guimaras", name: "Guimaras", regionId: "R06", islandGroup: "Visayas", centerLat: 10.5667, centerLng: 122.6167, svgX: 470, svgY: 715, cities: ["Jordan", "Buenavista", "Nueva Valencia"] },
  // Region VII - Central Visayas
  { id: "cebu", name: "Cebu", regionId: "R07", islandGroup: "Visayas", centerLat: 10.3157, centerLng: 123.8854, svgX: 565, svgY: 730, cities: ["Cebu City", "Mandaue City", "Lapu-Lapu City", "Talisay City", "Toledo City", "Danao City"] },
  { id: "bohol", name: "Bohol", regionId: "R07", islandGroup: "Visayas", centerLat: 9.85, centerLng: 124.1435, svgX: 605, svgY: 770, cities: ["Tagbilaran City", "Panglao", "Tubigon", "Carmen", "Ubay"] },
  { id: "negros-oriental", name: "Negros Oriental", regionId: "R07", islandGroup: "Visayas", centerLat: 9.3068, centerLng: 123.3054, svgX: 520, svgY: 775, cities: ["Dumaguete City", "Bais City", "Bayawan City", "Tanjay City", "Guihulngan City"] },
  { id: "siquijor", name: "Siquijor", regionId: "R07", islandGroup: "Visayas", centerLat: 9.2141, centerLng: 123.5157, svgX: 535, svgY: 810, cities: ["Siquijor", "Larena", "San Juan"] },
  // Region VIII - Eastern Visayas
  { id: "leyte", name: "Leyte", regionId: "R08", islandGroup: "Visayas", centerLat: 10.8333, centerLng: 124.8333, svgX: 650, svgY: 700, cities: ["Tacloban City", "Ormoc City", "Baybay City", "Palo", "Tanauan"] },
  { id: "southern-leyte", name: "Southern Leyte", regionId: "R08", islandGroup: "Visayas", centerLat: 10.2333, centerLng: 124.9833, svgX: 660, svgY: 760, cities: ["Maasin City", "Sogod", "Macrohon"] },
  { id: "samar", name: "Samar (Western)", regionId: "R08", islandGroup: "Visayas", centerLat: 11.75, centerLng: 124.8833, svgX: 655, svgY: 640, cities: ["Catbalogan City", "Calbayog City", "Basey"] },
  { id: "northern-samar", name: "Northern Samar", regionId: "R08", islandGroup: "Visayas", centerLat: 12.3333, centerLng: 124.6667, svgX: 645, svgY: 595, cities: ["Catarman", "Laoang", "Allen"] },
  { id: "eastern-samar", name: "Eastern Samar", regionId: "R08", islandGroup: "Visayas", centerLat: 11.6667, centerLng: 125.4167, svgX: 690, svgY: 650, cities: ["Borongan City", "Guiuan", "Dolores"] },
  { id: "biliran", name: "Biliran", regionId: "R08", islandGroup: "Visayas", centerLat: 11.5833, centerLng: 124.4667, svgX: 630, svgY: 665, cities: ["Naval", "Caibiran", "Biliran"] },
  // Region IX - Zamboanga Peninsula
  { id: "zamboanga-del-sur", name: "Zamboanga del Sur", regionId: "R09", islandGroup: "Mindanao", centerLat: 7.82, centerLng: 123.3, svgX: 470, svgY: 900, cities: ["Pagadian City", "Zamboanga City (Chartered)", "Aurora", "Molave"] },
  { id: "zamboanga-del-norte", name: "Zamboanga del Norte", regionId: "R09", islandGroup: "Mindanao", centerLat: 8.2435, centerLng: 123.125, svgX: 470, svgY: 855, cities: ["Dipolog City", "Dapitan City", "Sindangan"] },
  { id: "zamboanga-sibugay", name: "Zamboanga Sibugay", regionId: "R09", islandGroup: "Mindanao", centerLat: 7.7833, centerLng: 122.6167, svgX: 430, svgY: 915, cities: ["Ipil", "Titay", "Kabasalan"] },
  // Region X - Northern Mindanao
  { id: "misamis-oriental", name: "Misamis Oriental", regionId: "R10", islandGroup: "Mindanao", centerLat: 8.5833, centerLng: 124.75, svgX: 585, svgY: 865, cities: ["Cagayan de Oro City", "Gingoog City", "El Salvador City", "Balingasag"] },
  { id: "misamis-occidental", name: "Misamis Occidental", regionId: "R10", islandGroup: "Mindanao", centerLat: 8.3167, centerLng: 123.75, svgX: 520, svgY: 865, cities: ["Ozamiz City", "Oroquieta City", "Tangub City"] },
  { id: "bukidnon", name: "Bukidnon", regionId: "R10", islandGroup: "Mindanao", centerLat: 7.9167, centerLng: 125.0, svgX: 595, svgY: 915, cities: ["Malaybalay City", "Valencia City", "Manolo Fortich", "Maramag"] },
  { id: "lanao-del-norte", name: "Lanao del Norte", regionId: "R10", islandGroup: "Mindanao", centerLat: 8.0, centerLng: 124.0, svgX: 535, svgY: 895, cities: ["Iligan City", "Tubod", "Kauswagan"] },
  { id: "camiguin", name: "Camiguin", regionId: "R10", islandGroup: "Mindanao", centerLat: 9.1736, centerLng: 124.7297, svgX: 595, svgY: 825, cities: ["Mambajao", "Catarman", "Mahinog"] },
  // Region XI - Davao Region
  { id: "davao-del-sur", name: "Davao del Sur", regionId: "R11", islandGroup: "Mindanao", centerLat: 6.75, centerLng: 125.35, svgX: 635, svgY: 990, cities: ["Davao City", "Digos City", "Santa Cruz", "Bansalan"] },
  { id: "davao-del-norte", name: "Davao del Norte", regionId: "R11", islandGroup: "Mindanao", centerLat: 7.55, centerLng: 125.7, svgX: 645, svgY: 940, cities: ["Tagum City", "Panabo City", "Samal Island City", "Carmen"] },
  { id: "davao-oriental", name: "Davao Oriental", regionId: "R11", islandGroup: "Mindanao", centerLat: 7.15, centerLng: 126.25, svgX: 690, svgY: 965, cities: ["Mati City", "Lupon", "Baganga", "Cateel"] },
  { id: "davao-de-oro", name: "Davao de Oro (Compostela Valley)", regionId: "R11", islandGroup: "Mindanao", centerLat: 7.6, centerLng: 126.0, svgX: 665, svgY: 935, cities: ["Nabunturan", "Monkayo", "Compostela", "Pantukan"] },
  { id: "davao-occidental", name: "Davao Occidental", regionId: "R11", islandGroup: "Mindanao", centerLat: 6.2, centerLng: 125.6, svgX: 645, svgY: 1045, cities: ["Malita", "Santa Maria", "Jose Abad Santos"] },
  // Region XII - SOCCSKSARGEN
  { id: "south-cotabato", name: "South Cotabato", regionId: "R12", islandGroup: "Mindanao", centerLat: 6.3, centerLng: 124.8, svgX: 580, svgY: 1010, cities: ["General Santos City", "Koronadal City", "Polomolok", "Surallah"] },
  { id: "cotabato", name: "Cotabato (North Cotabato)", regionId: "R12", islandGroup: "Mindanao", centerLat: 7.2, centerLng: 125.0, svgX: 580, svgY: 950, cities: ["Kidapawan City", "Midsayap", "Carmen", "Kabacan"] },
  { id: "sultan-kudarat", name: "Sultan Kudarat", regionId: "R12", islandGroup: "Mindanao", centerLat: 6.6, centerLng: 124.5, svgX: 545, svgY: 990, cities: ["Tacurong City", "Isulan", "Lebak", "Esperanza"] },
  { id: "sarangani", name: "Sarangani", regionId: "R12", islandGroup: "Mindanao", centerLat: 5.9, centerLng: 125.15, svgX: 600, svgY: 1045, cities: ["Alabel", "Glan", "Kiamba", "Maitum"] },
  // Region XIII - Caraga
  { id: "agusan-del-norte", name: "Agusan del Norte", regionId: "R13", islandGroup: "Mindanao", centerLat: 9.0, centerLng: 125.5, svgX: 650, svgY: 840, cities: ["Butuan City", "Cabadbaran City", "Nasipit", "Tubay"] },
  { id: "agusan-del-sur", name: "Agusan del Sur", regionId: "R13", islandGroup: "Mindanao", centerLat: 8.5, centerLng: 125.8, svgX: 660, svgY: 890, cities: ["Bayugan City", "San Francisco", "Prosperidad", "Trento"] },
  { id: "surigao-del-norte", name: "Surigao del Norte", regionId: "R13", islandGroup: "Mindanao", centerLat: 9.75, centerLng: 125.55, svgX: 665, svgY: 795, cities: ["Surigao City", "Dapa (Siargao)", "Del Carmen", "General Luna"] },
  { id: "surigao-del-sur", name: "Surigao del Sur", regionId: "R13", islandGroup: "Mindanao", centerLat: 8.7, centerLng: 126.1, svgX: 690, svgY: 865, cities: ["Tandag City", "Bislig City", "Hinatuan", "Cantilan"] },
  { id: "dinagat-islands", name: "Dinagat Islands", regionId: "R13", islandGroup: "Mindanao", centerLat: 10.15, centerLng: 125.6, svgX: 665, svgY: 765, cities: ["San Jose", "Basilisa", "Cagdianao"] },
  // BARMM
  { id: "maguindanao", name: "Maguindanao", regionId: "BARMM", islandGroup: "Mindanao", centerLat: 7.0, centerLng: 124.3, svgX: 535, svgY: 960, cities: ["Cotabato City", "Shariff Aguak", "Buluan", "Datu Odin Sinsuat"] },
  { id: "lanao-del-sur", name: "Lanao del Sur", regionId: "BARMM", islandGroup: "Mindanao", centerLat: 7.8, centerLng: 124.3, svgX: 545, svgY: 920, cities: ["Marawi City", "Malabang", "Wao", "Balabagan"] },
  { id: "basilan", name: "Basilan", regionId: "BARMM", islandGroup: "Mindanao", centerLat: 6.55, centerLng: 122.0, svgX: 410, svgY: 995, cities: ["Isabela City", "Lamitan City", "Maluso"] },
  { id: "sulu", name: "Sulu", regionId: "BARMM", islandGroup: "Mindanao", centerLat: 6.0, centerLng: 121.0, svgX: 345, svgY: 1030, cities: ["Jolo", "Patikul", "Indanan", "Maimbung"] },
  { id: "tawi-tawi", name: "Tawi-Tawi", regionId: "BARMM", islandGroup: "Mindanao", centerLat: 5.15, centerLng: 119.95, svgX: 270, svgY: 1080, cities: ["Bongao", "Panglima Sugala", "Sitangkai", "Simunul"] },
];

/**
 * Utility to map GPS lat/lng to 3D normalized coordinates for Three.js
 * Philippine bounds approximately:
 * Lat: 4.5° N to 21.5° N
 * Lng: 116.5° E to 127.0° E
 */
export function geoTo3D(lat: number, lng: number): [number, number, number] {
  // Center roughly at 13.0°N, 122.0°E
  const x = (lng - 122.0) * 0.9;
  const z = -(lat - 13.0) * 0.9;
  return [x, 0.05, z];
}

export interface VoterDemographicCohort {
  label: string;
  ageBracket: string;
  count: number;
  percentage: number;
  description: string;
}

export const PHILIPPINE_VOTERS_DEMOGRAPHICS = {
  totalRegisteredVoters: 65745512,
  asOf: "COMELEC Certified Official Registry / 2028 Projection",
  youthVoteShare: 56.4, // Combined Millennials & Gen Z
  gender: {
    female: { count: 33648147, percentage: 51.2, label: "Female" },
    male: { count: 32097365, percentage: 48.8, label: "Male" },
  },
  generations: [
    {
      label: "Millennials",
      ageBracket: "Ages 26–41",
      count: 23931366,
      percentage: 36.4,
      description: "Largest single generational voting bloc; dominant active workforce and civic influencers.",
    },
    {
      label: "Generation X",
      ageBracket: "Ages 42–57",
      count: 16765106,
      percentage: 25.5,
      description: "Mid-career heads of households and established community leaders.",
    },
    {
      label: "Generation Z",
      ageBracket: "Ages 18–25",
      count: 13017611,
      percentage: 19.8,
      description: "First-time registered voters and digital natives driving social media discourse.",
    },
    {
      label: "Boomers & Elders",
      ageBracket: "Ages 58+",
      count: 12031429,
      percentage: 18.3,
      description: "Senior citizens, retirees, and legacy voters with consistent high turnout.",
    },
  ],
  civilStatus: [
    { label: "Single", count: 34187666, percentage: 52.0 },
    { label: "Married", count: 27613115, percentage: 42.0 },
    { label: "Widowed", count: 2629820, percentage: 4.0 },
    { label: "Separated / Other", count: 1314911, percentage: 2.0 },
  ],
  topVoteRichProvinces: [
    { rank: 1, name: "Cebu", registeredVoters: 3288778, islandGroup: "Visayas", share: 5.0 },
    { rank: 2, name: "Cavite", registeredVoters: 2302353, islandGroup: "Luzon", share: 3.5 },
    { rank: 3, name: "Pangasinan", registeredVoters: 2096936, islandGroup: "Luzon", share: 3.2 },
    { rank: 4, name: "Laguna", registeredVoters: 2045987, islandGroup: "Luzon", share: 3.1 },
    { rank: 5, name: "Bulacan", registeredVoters: 2007523, islandGroup: "Luzon", share: 3.0 },
    { rank: 6, name: "Negros Occidental", registeredVoters: 1946639, islandGroup: "Visayas", share: 2.9 },
    { rank: 7, name: "Batangas", registeredVoters: 1819071, islandGroup: "Luzon", share: 2.8 },
    { rank: 8, name: "Iloilo", registeredVoters: 1628752, islandGroup: "Visayas", share: 2.5 },
    { rank: 9, name: "Rizal", registeredVoters: 1601292, islandGroup: "Luzon", share: 2.4 },
    { rank: 10, name: "Pampanga", registeredVoters: 1580473, islandGroup: "Luzon", share: 2.4 },
    { rank: 11, name: "Davao del Sur", registeredVoters: 1449156, islandGroup: "Mindanao", share: 2.2 },
    { rank: 12, name: "Leyte", registeredVoters: 1334166, islandGroup: "Visayas", share: 2.0 },
  ],
};
