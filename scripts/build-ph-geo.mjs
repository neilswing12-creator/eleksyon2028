/**
 * Builds the Philippine map + location data used by the app from PSGC-coded GeoJSON.
 *
 * Source: faeldon/philippines-json-maps (MIT), "latest/geojson" lowres files.
 *   git clone --depth 1 --filter=blob:none --sparse https://github.com/faeldon/philippines-json-maps.git
 *   git sparse-checkout set --no-cone 'latest/geojson/regions/lowres/*' 'latest/geojson/provdists/medres/*'
 *
 * Usage (needs mapshaper + d3-geo installed somewhere on NODE_PATH):
 *   node scripts/build-ph-geo.mjs /path/to/philippines-json-maps/latest/geojson
 *
 * Outputs:
 *   src/lib/ph-locations.json      every city/municipality, keyed by the app's province id
 *   public/geo/provinces.json      projected SVG paths for the 82 app provinces + layout meta
 *   public/geo/cities/<id>.json    projected SVG paths for each province's cities/municipalities
 *
 * Province ids are the app's existing ids (stored on old submissions), so they must not change.
 */
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const d3 = require("d3-geo");

const SRC = process.argv[2];
if (!SRC) throw new Error("Pass the path to philippines-json-maps/latest/geojson");
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TMP = fs.mkdtempSync("/tmp/phgeo-");
const MAPSHAPER = process.env.MAPSHAPER || "mapshaper";
const PROV_RES = "regions/lowres"; // used only for the PSGC province -> app id mapping
const HEX_SIZE = process.env.HEX_SIZE || "40";

// PSGC region code -> app region id
const REGION_IDS = {
  100000000: "R01", 200000000: "R02", 300000000: "R03", 400000000: "R04A", 500000000: "R05",
  600000000: "R06", 700000000: "R07", 800000000: "R08", 900000000: "R09", 1000000000: "R10",
  1100000000: "R11", 1200000000: "R12", 1300000000: "NCR", 1400000000: "CAR", 1600000000: "R13",
  1700000000: "MIMAROPA", 1900000000: "BARMM",
};

// PSGC province names that do not slugify to the app's existing ids
const NAME_OVERRIDES = {
  "NCR, City of Manila, First District (Not a Province)": "metro-manila",
  "NCR, Second District (Not a Province)": "metro-manila",
  "NCR, Third District (Not a Province)": "metro-manila",
  "NCR, Fourth District (Not a Province)": "metro-manila",
  "Maguindanao del Norte": "maguindanao",
  "Maguindanao del Sur": "maguindanao",
  "Special Geographic Area": "maguindanao",
  "City of Isabela (Not a Province)": "basilan",
};

const slug = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const provinceIdFor = (name) => NAME_OVERRIDES[name] || slug(name);

// "City of Batac" -> "Batac City"; "City of Manila" -> "Manila"
function friendlyCityName(name) {
  let n = name.replace(/\s*\(Capital\)\s*/i, "").trim();
  const m = n.match(/^City of (.+)$/i);
  if (m) n = m[1] === "Manila" ? "Manila" : `${m[1]} City`;
  // Spanish particles are lower-case in official usage: "Cagayan de Oro", "San Jose del Monte"
  return n.replace(/ (De|Del) /g, (s) => s.toLowerCase());
}

// d3-geo wants exterior rings clockwise (the reverse of RFC 7946). If a feature's spherical
// area is more than a hemisphere its rings are wound the wrong way, so reverse them.
function rewindForD3(fc) {
  for (const ft of fc.features) {
    if (!ft.geometry) continue;
    if (d3.geoArea(ft) > 2 * Math.PI) {
      const flip = (polygon) => polygon.map((ring) => ring.slice().reverse());
      if (ft.geometry.type === "Polygon") ft.geometry.coordinates = flip(ft.geometry.coordinates);
      else if (ft.geometry.type === "MultiPolygon") ft.geometry.coordinates = ft.geometry.coordinates.map(flip);
    }
  }
  return fc;
}

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const writeJson = (p, v) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(v));
};

// The app's existing province ids, read from philippines-geo.ts
const geoTs = fs.readFileSync(path.join(ROOT, "src/lib/philippines-geo.ts"), "utf8");
const appProvinces = [...geoTs.matchAll(/id: "([^"]+)",\s*name: "([^"]+)",\s*regionId: "([^"]+)"/g)].map((m) => ({
  id: m[1], name: m[2], regionId: m[3],
}));
const appIds = new Set(appProvinces.map((p) => p.id));

// ---------------------------------------------------------------- provinces
const psgcToProvinceId = {};
for (const f of fs.readdirSync(path.join(SRC, PROV_RES))) {
  for (const ft of readJson(path.join(SRC, PROV_RES, f)).features) {
    const id = provinceIdFor(ft.properties.adm2_en);
    if (!appIds.has(id)) throw new Error(`No app province for "${ft.properties.adm2_en}" (-> ${id})`);
    const regionId = REGION_IDS[ft.properties.adm1_psgc];
    const expected = appProvinces.find((p) => p.id === id).regionId;
    // The app's region grouping wins; PSGC differences (e.g. Negros Island Region, Sulu after
    // the 2024 Supreme Court BARMM ruling) are reported so they can be reviewed.
    if (regionId !== expected) console.warn(`note: ${id} is ${regionId || ft.properties.adm1_psgc} in PSGC, ${expected} in app`);
    psgcToProvinceId[ft.properties.adm2_psgc] = id;
  }
}

const missingIds = [...appIds].filter((id) => !Object.values(psgcToProvinceId).includes(id));
if (missingIds.length) throw new Error(`App provinces without data: ${missingIds.join(", ")}`);

// ------------------------------------------------------------ cities/munis
// Every town and city goes into ONE layer that is snapped and simplified together, so
// neighbouring towns keep identical shared borders (no slivers or gaps). Province shapes
// are then made by dissolving their towns, so they line up with the towns exactly.
const CITY_RES = fs.existsSync(path.join(SRC, "provdists/medres")) ? "provdists/medres" : "provdists/lowres";
const locations = {}; // provinceId -> [{ psgc, name, type }]
const allTowns = [];
for (const f of fs.readdirSync(path.join(SRC, CITY_RES))) {
  for (const ft of readJson(path.join(SRC, CITY_RES, f)).features) {
    const id = psgcToProvinceId[ft.properties.adm2_psgc];
    if (!id) throw new Error(`City ${ft.properties.adm3_en} has unknown province ${ft.properties.adm2_psgc}`);
    const name = friendlyCityName(ft.properties.adm3_en);
    const psgc = String(ft.properties.adm3_psgc);
    const isCity = /^City of /i.test(ft.properties.adm3_en) || / City$/.test(ft.properties.adm3_en);
    (locations[id] ||= []).push({ psgc, name, type: isCity ? "City" : "Municipality" });
    allTowns.push({ type: "Feature", properties: { pid: id, psgc, name }, geometry: ft.geometry });
  }
}
let cityCount = 0;
for (const id of Object.keys(locations)) {
  locations[id].sort((a, b) => a.name.localeCompare(b.name));
  cityCount += locations[id].length;
}
writeJson(path.join(ROOT, "src/lib/ph-locations.json"), locations);

writeJson(`${TMP}/towns-raw.json`, { type: "FeatureCollection", features: allTowns });
execFileSync(MAPSHAPER, [
  "-i", `${TMP}/towns-raw.json`, "snap",
  "-simplify", "visvalingam", process.env.TOWN_SIMPLIFY || "8%", "keep-shapes",
  "-filter-islands", "min-area=0.5km2", "remove-empty",
  "-o", `${TMP}/towns.json`, "format=geojson", "precision=0.0001",
  "-dissolve", "pid", "-filter-islands", "min-area=4km2", "remove-empty",
  "-o", `${TMP}/prov.json`, "format=geojson", "precision=0.0001",
], { stdio: "inherit" });

const provinces = rewindForD3(readJson(`${TMP}/prov.json`));
const towns = rewindForD3(readJson(`${TMP}/towns.json`));

// One projection for everything so province and town layers line up.
const WIDTH = 1000;
const HEIGHT = 1400;
const projection = d3.geoMercator().fitExtent([[20, 20], [WIDTH - 20, HEIGHT - 20]], provinces);
const pathGen = d3.geoPath(projection).digits(1);

const provinceOut = provinces.features.map((ft) => {
  const id = ft.properties.pid;
  const [cx, cy] = pathGen.centroid(ft);
  const [[x0, y0], [x1, y1]] = pathGen.bounds(ft);
  return {
    id,
    regionId: appProvinces.find((p) => p.id === id).regionId,
    d: pathGen(ft),
    cx: Math.round(cx), cy: Math.round(cy),
    bbox: [x0, y0, x1, y1].map((v) => Math.round(v)),
    lng: +d3.geoCentroid(ft)[0].toFixed(3), lat: +d3.geoCentroid(ft)[1].toFixed(3),
  };
});

const townsByProvince = {};
for (const ft of towns.features) {
  if (!ft.geometry) continue;
  const [cx, cy] = pathGen.centroid(ft);
  (townsByProvince[ft.properties.pid] ||= []).push({
    psgc: ft.properties.psgc, name: ft.properties.name, d: pathGen(ft),
    cx: Math.round(cx * 10) / 10, cy: Math.round(cy * 10) / 10, a: Math.round(pathGen.area(ft) * 10) / 10,
  });
}
fs.rmSync(path.join(ROOT, "public/geo/cities"), { recursive: true, force: true });
for (const [id, list] of Object.entries(townsByProvince)) {
  writeJson(path.join(ROOT, "public/geo/cities", `${id}.json`), list);
}

// -------------------------------------------------------------- hex layout
// Assign each province to one hex cell so the cartogram keeps the archipelago's shape:
// solve a min-cost assignment between province centroids and a hex grid (python/scipy).
writeJson(`${TMP}/centroids.json`, provinceOut.map((p) => ({ id: p.id, x: p.cx, y: p.cy })));
const hex = JSON.parse(execFileSync("python3", [path.join(ROOT, "scripts/hex-layout.py"), `${TMP}/centroids.json`, HEX_SIZE]).toString());

writeJson(path.join(ROOT, "public/geo/provinces.json"), {
  source: "PSGC boundaries via faeldon/philippines-json-maps (MIT)",
  width: WIDTH, height: HEIGHT,
  provinces: provinceOut.map((p) => ({ ...p, hex: hex.cells[p.id] })),
  hexSize: hex.size, hexWidth: hex.width, hexHeight: hex.height,
});

console.log(`provinces: ${provinceOut.length}, cities/municipalities: ${cityCount}`);
fs.rmSync(TMP, { recursive: true, force: true });
