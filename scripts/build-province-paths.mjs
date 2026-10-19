/**
 * build-province-paths.mjs
 * 
 * Reads the merged provinces GeoJSON (public/geo/provinces.geojson),
 * projects each province polygon using equirectangular projection
 * into a 500x900 SVG viewbox, simplifies paths, and outputs a TypeScript
 * module with all province SVG path strings pre-computed.
 * 
 * Run: node scripts/build-province-paths.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

// ─── Projection Config ───────────────────────────────────────────────────────
// Philippine geographic bounds
const LAT_MIN = 4.0;
const LAT_MAX = 21.5;
const LNG_MIN = 116.0;
const LNG_MAX = 127.5;

// SVG viewBox dimensions
const SVG_W = 500;
const SVG_H = 920;

// Project [lng, lat] → [svgX, svgY]
function project(lng, lat) {
  // Clamp to bounds
  const clampedLng = Math.max(LNG_MIN, Math.min(LNG_MAX, lng));
  const clampedLat = Math.max(LAT_MIN, Math.min(LAT_MAX, lat));
  
  const x = ((clampedLng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * SVG_W;
  const y = SVG_H - ((clampedLat - LAT_MIN) / (LAT_MAX - LAT_MIN)) * SVG_H;
  
  return [x, y];
}

// Convert GeoJSON ring (array of [lng, lat] coords) to SVG path string
function ringToPath(ring) {
  if (!ring || ring.length < 3) return '';
  const points = ring.map(([lng, lat]) => project(lng, lat));
  const start = points[0];
  let d = `M${start[0].toFixed(2)},${start[1].toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    d += `L${points[i][0].toFixed(2)},${points[i][1].toFixed(2)}`;
  }
  d += 'Z';
  return d;
}

// Convert GeoJSON geometry (Polygon or MultiPolygon) to SVG path string
function geometryToPath(geometry) {
  if (!geometry) return '';
  
  if (geometry.type === 'Polygon') {
    // Each ring is a path (outer + holes)
    return geometry.coordinates.map(ringToPath).filter(Boolean).join(' ');
  }
  
  if (geometry.type === 'MultiPolygon') {
    // Each polygon in the multipolygon
    return geometry.coordinates
      .flatMap(polygon => polygon.map(ringToPath))
      .filter(Boolean)
      .join(' ');
  }
  
  return '';
}

// Compute centroid from geometry for label placement
function computeCentroid(geometry) {
  let totalX = 0, totalY = 0, count = 0;
  
  const processRing = (ring) => {
    ring.forEach(([lng, lat]) => {
      const [x, y] = project(lng, lat);
      totalX += x;
      totalY += y;
      count++;
    });
  };
  
  if (geometry.type === 'Polygon') {
    processRing(geometry.coordinates[0]);
  } else if (geometry.type === 'MultiPolygon') {
    // Use the largest polygon's outer ring
    let largestRing = null;
    let largestLen = 0;
    geometry.coordinates.forEach(polygon => {
      if (polygon[0].length > largestLen) {
        largestLen = polygon[0].length;
        largestRing = polygon[0];
      }
    });
    if (largestRing) processRing(largestRing);
  }
  
  if (count === 0) return [SVG_W / 2, SVG_H / 2];
  return [totalX / count, totalY / count];
}

// ─── PSGC → Province ID Mapping ──────────────────────────────────────────────
// Maps GeoJSON adm2_en (province name from PSGC) → our app's province ID
const PSGC_NAME_TO_ID = {
  // Region I - Ilocos
  'Ilocos Norte': 'ilocos-norte',
  'Ilocos Sur': 'ilocos-sur',
  'La Union': 'la-union',
  'Pangasinan': 'pangasinan',
  
  // Region II - Cagayan Valley
  'Batanes': 'batanes',
  'Cagayan': 'cagayan',
  'Isabela': 'isabela',
  'Nueva Vizcaya': 'nueva-vizcaya',
  'Quirino': 'quirino',
  
  // Region III - Central Luzon
  'Aurora': 'aurora',
  'Bataan': 'bataan',
  'Bulacan': 'bulacan',
  'Nueva Ecija': 'nueva-ecija',
  'Pampanga': 'pampanga',
  'Tarlac': 'tarlac',
  'Zambales': 'zambales',
  
  // Region IV-A - CALABARZON
  'Batangas': 'batangas',
  'Cavite': 'cavite',
  'Laguna': 'laguna',
  'Quezon': 'quezon',
  'Rizal': 'rizal',
  
  // Region V - Bicol
  'Albay': 'albay',
  'Camarines Norte': 'camarines-norte',
  'Camarines Sur': 'camarines-sur',
  'Catanduanes': 'catanduanes',
  'Masbate': 'masbate',
  'Sorsogon': 'sorsogon',
  
  // Region VI - Western Visayas
  'Aklan': 'aklan',
  'Antique': 'antique',
  'Capiz': 'capiz',
  'Guimaras': 'guimaras',
  'Iloilo': 'iloilo',
  'Negros Occidental': 'negros-occidental',
  
  // Region VII - Central Visayas
  'Bohol': 'bohol',
  'Cebu': 'cebu',
  'Negros Oriental': 'negros-oriental',
  'Siquijor': 'siquijor',
  
  // Region VIII - Eastern Visayas
  'Biliran': 'biliran',
  'Eastern Samar': 'eastern-samar',
  'Leyte': 'leyte',
  'Northern Samar': 'northern-samar',
  'Samar': 'samar',
  'Southern Leyte': 'southern-leyte',
  
  // Region IX - Zamboanga Peninsula
  'Zamboanga del Norte': 'zamboanga-del-norte',
  'Zamboanga del Sur': 'zamboanga-del-sur',
  'Zamboanga Sibugay': 'zamboanga-sibugay',
  'City of Isabela (Not a Province)': 'zamboanga-del-sur', // city of Isabela is part of Basilan/Zamboanga area
  
  // Region X - Northern Mindanao
  'Bukidnon': 'bukidnon',
  'Camiguin': 'camiguin',
  'Lanao del Norte': 'lanao-del-norte',
  'Misamis Occidental': 'misamis-occidental',
  'Misamis Oriental': 'misamis-oriental',
  
  // Region XI - Davao
  'Davao de Oro': 'davao-de-oro',
  'Davao del Norte': 'davao-del-norte',
  'Davao del Sur': 'davao-del-sur',
  'Davao Occidental': 'davao-occidental',
  'Davao Oriental': 'davao-oriental',
  
  // Region XII - SOCCSKSARGEN
  'Cotabato': 'cotabato',
  'Sarangani': 'sarangani',
  'South Cotabato': 'south-cotabato',
  'Sultan Kudarat': 'sultan-kudarat',
  
  // NCR - Metro Manila (treat 4 NCR districts as metro-manila)
  'NCR, City of Manila, First District (Not a Province)': 'metro-manila',
  'NCR, Second District (Not a Province)': 'metro-manila',
  'NCR, Third District (Not a Province)': 'metro-manila',
  'NCR, Fourth District (Not a Province)': 'metro-manila',
  
  // CAR - Cordillera
  'Abra': 'abra',
  'Apayao': 'apayao',
  'Benguet': 'benguet',
  'Ifugao': 'ifugao',
  'Kalinga': 'kalinga',
  'Mountain Province': 'mountain-province',
  
  // MIMAROPA
  'Marinduque': 'marinduque',
  'Occidental Mindoro': 'occidental-mindoro',
  'Oriental Mindoro': 'oriental-mindoro',
  'Palawan': 'palawan',
  'Romblon': 'romblon',
  
  // Region XIII - Caraga
  'Agusan del Norte': 'agusan-del-norte',
  'Agusan del Sur': 'agusan-del-sur',
  'Dinagat Islands': 'dinagat-islands',
  'Surigao del Norte': 'surigao-del-norte',
  'Surigao del Sur': 'surigao-del-sur',
  
  // BARMM - Bangsamoro
  'Basilan': 'basilan',
  'Lanao del Sur': 'lanao-del-sur',
  'Maguindanao del Norte': 'maguindanao',
  'Maguindanao del Sur': 'maguindanao',
  'Sulu': 'sulu',
  'Tawi-Tawi': 'tawi-tawi',
};

// ─── Main Processing ─────────────────────────────────────────────────────────
console.log('Reading GeoJSON...');
const geojsonPath = join(rootDir, 'public', 'geo', 'provinces.geojson');
const rawJson = readFileSync(geojsonPath, 'utf8').replace(/^\uFEFF/, '');
const geojson = JSON.parse(rawJson);

console.log(`Found ${geojson.features.length} features`);

// Map: province-id → { pathData, centroid, name }
const provincePathMap = {};
const unmapped = [];

for (const feature of geojson.features) {
  const name = feature.properties?.adm2_en || '';
  const psgcCode = feature.properties?.adm2_psgc || '';
  
  const provinceId = PSGC_NAME_TO_ID[name];
  
  if (!provinceId) {
    unmapped.push(`${psgcCode} | ${name}`);
    continue;
  }
  
  const pathData = geometryToPath(feature.geometry);
  const [cx, cy] = computeCentroid(feature.geometry);
  
  if (!pathData) {
    console.warn(`Empty path for: ${name} (${provinceId})`);
    continue;
  }
  
  // Merge multiple NCR districts into one metro-manila path
  if (provincePathMap[provinceId]) {
    provincePathMap[provinceId].pathData += ' ' + pathData;
    // Average centroid
    provincePathMap[provinceId].cx = (provincePathMap[provinceId].cx + cx) / 2;
    provincePathMap[provinceId].cy = (provincePathMap[provinceId].cy + cy) / 2;
  } else {
    provincePathMap[provinceId] = {
      pathData,
      cx: Number(cx.toFixed(1)),
      cy: Number(cy.toFixed(1)),
      name,
    };
  }
}

if (unmapped.length > 0) {
  console.warn('\nUnmapped features:');
  unmapped.forEach(u => console.warn(' ', u));
}

const mappedCount = Object.keys(provincePathMap).length;
console.log(`\nMapped ${mappedCount} provinces`);

// ─── Generate TypeScript Module ───────────────────────────────────────────────
const entries = Object.entries(provincePathMap)
  .map(([id, { pathData, cx, cy }]) => {
    // Escape backticks in path data (shouldn't be any, but just in case)
    const safeD = pathData.replace(/`/g, '\\`');
    return `  "${id}": { d: \`${safeD}\`, cx: ${cx}, cy: ${cy} }`;
  })
  .join(',\n');

const tsContent = `// AUTO-GENERATED by scripts/build-province-paths.mjs
// Do NOT edit manually. Re-run the script to regenerate.
// 
// Pre-projected SVG paths for Philippine provinces.
// Projection: equirectangular, Lat 4.0–21.5, Lng 116.0–127.5 → SVG 500×920
// Source: faeldon/philippines-json-maps (2023 PSGC boundaries)

export interface ProvincePath {
  /** SVG path data string (pre-projected, equirectangular) */
  d: string;
  /** Centroid X for label placement */
  cx: number;
  /** Centroid Y for label placement */
  cy: number;
}

/**
 * Map from province ID (matching PHILIPPINE_PROVINCES[].id) to pre-projected SVG path.
 * ViewBox: "0 0 500 920" — Philippines centered, Luzon at top, Mindanao at bottom.
 */
export const PROVINCE_GEO_PATHS: Record<string, ProvincePath> = {
${entries}
};
`;

const outputPath = join(rootDir, 'src', 'lib', 'ph-province-paths.ts');
writeFileSync(outputPath, tsContent, 'utf8');

const fileSize = tsContent.length;
console.log(`\nWrote ${outputPath}`);
console.log(`File size: ${(fileSize / 1024).toFixed(1)} KB`);
console.log(`Provinces mapped: ${mappedCount}`);

// Check which app provinces are missing
const appProvinceIds = [
  'metro-manila', 'ilocos-norte', 'ilocos-sur', 'la-union', 'pangasinan',
  'batanes', 'cagayan', 'isabela', 'nueva-vizcaya', 'quirino',
  'aurora', 'bataan', 'bulacan', 'nueva-ecija', 'pampanga', 'tarlac', 'zambales',
  'batangas', 'cavite', 'laguna', 'quezon', 'rizal',
  'marinduque', 'occidental-mindoro', 'oriental-mindoro', 'palawan', 'romblon',
  'albay', 'camarines-norte', 'camarines-sur', 'catanduanes', 'masbate', 'sorsogon',
  'aklan', 'antique', 'capiz', 'guimaras', 'iloilo', 'negros-occidental',
  'bohol', 'cebu', 'negros-oriental', 'siquijor',
  'biliran', 'eastern-samar', 'leyte', 'northern-samar', 'samar', 'southern-leyte',
  'zamboanga-del-norte', 'zamboanga-del-sur', 'zamboanga-sibugay',
  'bukidnon', 'camiguin', 'lanao-del-norte', 'misamis-occidental', 'misamis-oriental',
  'davao-de-oro', 'davao-del-norte', 'davao-del-sur', 'davao-occidental', 'davao-oriental',
  'cotabato', 'sarangani', 'south-cotabato', 'sultan-kudarat',
  'agusan-del-norte', 'agusan-del-sur', 'dinagat-islands', 'surigao-del-norte', 'surigao-del-sur',
  'abra', 'apayao', 'benguet', 'ifugao', 'kalinga', 'mountain-province',
  'basilan', 'lanao-del-sur', 'maguindanao', 'sulu', 'tawi-tawi',
];

const missing = appProvinceIds.filter(id => !provincePathMap[id]);
if (missing.length > 0) {
  console.log('\nMissing from GeoJSON (will use centroid dot fallback):');
  missing.forEach(m => console.log(' ', m));
} else {
  console.log('\nAll app provinces are covered!');
}
