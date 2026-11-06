"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Hexagon, Map as MapIcon, Minus, Plus, RotateCcw, Search, X } from "@/components/icons";
import { PHILIPPINE_PROVINCES, PHILIPPINE_REGIONS } from "@/lib/philippines-geo";

/* ------------------------------------------------------------------ types */

type Position = "PRESIDENT" | "VICE_PRESIDENT" | "SENATOR";
type ViewMode = "MAP" | "HEX";

interface CandidateItem {
  id: string;
  name: string;
  position?: string;
  party: string | null;
  color: string;
  votes: number;
  percentage?: number;
}

interface GeoProvince {
  id: string;
  regionId: string;
  d: string;
  cx: number;
  cy: number;
  bbox: [number, number, number, number];
  hex: { x: number; y: number };
}

interface GeoData {
  width: number;
  height: number;
  hexSize: number;
  hexWidth: number;
  hexHeight: number;
  provinces: GeoProvince[];
}

interface CityShape {
  psgc: string;
  name: string;
  d: string;
  cx: number;
  cy: number;
  a: number; // projected area, used to decide which labels fit
}

interface CityResult {
  psgc: string;
  name: string;
  type: "City" | "Municipality";
  responses: number;
  hasSufficientData: boolean;
  votes: Record<Position, Record<string, number>> | null;
}

export interface PhilippineResultsMapProps {
  candidates?: CandidateItem[];
  presidentialRankings?: CandidateItem[];
  vicePresidentialRankings?: CandidateItem[];
  senatorialRankings?: CandidateItem[];
  provinces?: any[];
  regions?: any[];
  lastUpdated?: string;
  onSelectProvince?: (province: any) => void;
}

/* ---------------------------------------------------------------- helpers */

const POSITIONS: { id: Position; fil: string; en: string }[] = [
  { id: "PRESIDENT", fil: "Pangulo", en: "President" },
  { id: "VICE_PRESIDENT", fil: "Pangalawang Pangulo", en: "Vice President" },
  { id: "SENATOR", fil: "Senador", en: "Senators" },
];

const NO_DATA = "#E5E9F0";

/** ISO 3166-2:PH province codes, used as hex labels. */
const PROVINCE_CODES: Record<string, string> = {"abra": "ABR", "agusan-del-norte": "AGN", "agusan-del-sur": "AGS", "aklan": "AKL", "albay": "ALB", "antique": "ANT", "apayao": "APA", "aurora": "AUR", "basilan": "BAS", "bataan": "BAN", "batanes": "BTN", "batangas": "BTG", "benguet": "BEN", "biliran": "BIL", "bohol": "BOH", "bukidnon": "BUK", "bulacan": "BUL", "cagayan": "CAG", "camarines-norte": "CAN", "camarines-sur": "CAS", "camiguin": "CAM", "capiz": "CAP", "catanduanes": "CAT", "cavite": "CAV", "cebu": "CEB", "davao-de-oro": "COM", "cotabato": "NCO", "davao-del-norte": "DAV", "davao-del-sur": "DAS", "davao-oriental": "DAO", "davao-occidental": "DVO", "dinagat-islands": "DIN", "eastern-samar": "EAS", "guimaras": "GUI", "ifugao": "IFU", "ilocos-norte": "ILN", "ilocos-sur": "ILS", "iloilo": "ILI", "isabela": "ISA", "kalinga": "KAL", "la-union": "LUN", "laguna": "LAG", "lanao-del-norte": "LAN", "lanao-del-sur": "LAS", "leyte": "LEY", "maguindanao": "MAG", "marinduque": "MAD", "masbate": "MAS", "misamis-occidental": "MSC", "misamis-oriental": "MSR", "mountain-province": "MOU", "negros-occidental": "NEC", "negros-oriental": "NER", "northern-samar": "NSA", "nueva-ecija": "NUE", "nueva-vizcaya": "NUV", "occidental-mindoro": "MDC", "oriental-mindoro": "MDR", "palawan": "PLW", "pampanga": "PAM", "pangasinan": "PAN", "quezon": "QUE", "quirino": "QUI", "rizal": "RIZ", "romblon": "ROM", "samar": "WSA", "sarangani": "SAR", "siquijor": "SIG", "sorsogon": "SOR", "south-cotabato": "SCO", "southern-leyte": "SLE", "sultan-kudarat": "SUK", "sulu": "SLU", "surigao-del-norte": "SUN", "surigao-del-sur": "SUR", "tarlac": "TAR", "tawi-tawi": "TAW", "zambales": "ZMB", "zamboanga-del-norte": "ZAN", "zamboanga-del-sur": "ZAS", "zamboanga-sibugay": "ZSI", "metro-manila": "NCR"};
const VOTE_KEY: Record<Position, "presVotes" | "vpVotes" | "senVotes"> = {
  PRESIDENT: "presVotes",
  VICE_PRESIDENT: "vpVotes",
  SENATOR: "senVotes",
};

/** "Emmanuel 'Manny' Pacquiao" -> "Manny Pacquiao", "Sara Z. Duterte" -> "Sara Duterte" */
function shortName(full: string) {
  const nick = full.match(/['"‘’“”]([^'"‘’“”]+)['"‘’“”]/);
  const words = full.replace(/['"‘’“”][^'"‘’“”]+['"‘’“”]/, " ").split(/\s+/).filter((w) => w && !/^[A-Z]\.$/.test(w) && !/^(Jr\.?|Sr\.?|III|II|IV)$/.test(w));
  const last = words[words.length - 1] || full;
  return `${nick ? nick[1] : words[0]} ${last}`.trim();
}

const fmt = (n: number) => n.toLocaleString("en-PH");

function votesOf(entity: any, position: Position): Record<string, number> {
  return (entity && entity[VOTE_KEY[position]]) || {};
}

function rank(votes: Record<string, number>) {
  const total = Object.values(votes).reduce((a, b) => a + b, 0);
  const rows = Object.entries(votes)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([id, v]) => ({ id, votes: v, share: total > 0 ? (v / total) * 100 : 0 }));
  return { total, rows };
}

/** Pointy-top hexagon polygon points. */
function hexPoints(x: number, y: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 30);
    return `${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

type Box = [number, number, number, number]; // x, y, w, h

function useAnimatedViewBox(target: Box) {
  const [box, setBox] = useState<Box>(target);
  const boxRef = useRef(box);
  boxRef.current = box;
  useEffect(() => {
    const from = boxRef.current;
    const start = performance.now();
    const dur = 450;
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      setBox(from.map((v, i) => v + (target[i] - v) * e) as Box);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.join(",")]);
  return box;
}

function fitBox(bounds: [number, number, number, number], pad: number, aspect: number): Box {
  let [x0, y0, x1, y1] = bounds;
  x0 -= pad; y0 -= pad; x1 += pad; y1 += pad;
  let w = x1 - x0;
  let h = y1 - y0;
  if (w / h > aspect) {
    const nh = w / aspect;
    y0 -= (nh - h) / 2;
    h = nh;
  } else {
    const nw = h * aspect;
    x0 -= (nw - w) / 2;
    w = nw;
  }
  return [x0, y0, w, h];
}

/* -------------------------------------------------------------- component */

export default function PhilippineResultsMap({
  candidates = [],
  presidentialRankings = [],
  vicePresidentialRankings = [],
  senatorialRankings = [],
  provinces = [],
  regions = [],
  lastUpdated,
  onSelectProvince,
}: PhilippineResultsMapProps) {
  const [geo, setGeo] = useState<GeoData | null>(null);
  const [geoError, setGeoError] = useState(false);
  const [position, setPosition] = useState<Position>("PRESIDENT");
  const [view, setView] = useState<ViewMode>("MAP");
  const [regionId, setRegionId] = useState<string>("");
  const [provinceId, setProvinceId] = useState<string>("");
  const [cityPsgc, setCityPsgc] = useState<string>("");
  const [hover, setHover] = useState<{ kind: "province" | "city"; id: string; x: number; y: number } | null>(null);
  const [cityShapes, setCityShapes] = useState<Record<string, CityShape[]>>({});
  const [cityResults, setCityResults] = useState<Record<string, CityResult[]>>({});
  const [cityQuery, setCityQuery] = useState("");
  const [zoom, setZoom] = useState(1);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/geo/provinces.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setGeo)
      .catch(() => setGeoError(true));
  }, []);

  // Province drill-down: load city shapes + city results on demand
  useEffect(() => {
    if (!provinceId) return;
    if (!cityShapes[provinceId]) {
      fetch(`/geo/cities/${provinceId}.json`)
        .then((r) => (r.ok ? r.json() : []))
        .then((shapes) => setCityShapes((m) => ({ ...m, [provinceId]: shapes })))
        .catch(() => setCityShapes((m) => ({ ...m, [provinceId]: [] })));
    }
    fetch(`/api/analytics/province/${provinceId}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { cities: [] }))
      .then((data) => setCityResults((m) => ({ ...m, [provinceId]: data.cities || [] })))
      .catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceId]);

  const candidateLookup = useMemo(() => {
    const m = new Map<string, CandidateItem>();
    [...candidates, ...presidentialRankings, ...vicePresidentialRankings, ...senatorialRankings].forEach((c) => {
      if (c?.id) m.set(c.id, c);
    });
    return m;
  }, [candidates, presidentialRankings, vicePresidentialRankings, senatorialRankings]);

  const provinceData = useMemo(() => new Map(provinces.map((p: any) => [p.id, p])), [provinces]);
  const regionData = useMemo(() => new Map(regions.map((r: any) => [r.id, r])), [regions]);
  const provinceMeta = useMemo(() => new Map(PHILIPPINE_PROVINCES.map((p) => [p.id, p])), []);
  const regionMeta = useMemo(() => new Map(PHILIPPINE_REGIONS.map((r) => [r.id, r])), []);

  const nationalRows = useMemo(() => {
    const list =
      position === "PRESIDENT" ? presidentialRankings : position === "VICE_PRESIDENT" ? vicePresidentialRankings : senatorialRankings;
    const total = list.reduce((a, c) => a + (c.votes || 0), 0);
    return {
      total,
      rows: list
        .filter((c) => c.votes > 0)
        .map((c) => ({ id: c.id, votes: c.votes, share: c.percentage ?? (total ? (c.votes / total) * 100 : 0) })),
    };
  }, [position, presidentialRankings, vicePresidentialRankings, senatorialRankings]);

  // Only candidates on the public ballot (present in the rankings) can lead an area.
  const known = useCallback(
    (votes: Record<string, number>) =>
      Object.fromEntries(Object.entries(votes).filter(([id]) => candidateLookup.has(id))),
    [candidateLookup]
  );

  const provinceRank = useCallback(
    (id: string) => {
      const p = provinceData.get(id);
      if (!p || p.hasSufficientData === false) return null;
      const r = rank(known(votesOf(p, position)));
      return r.rows.length ? r : null;
    },
    [provinceData, position, known]
  );

  const leaderColor = useCallback(
    (r: ReturnType<typeof rank> | null) => {
      if (!r || !r.rows.length) return NO_DATA;
      return candidateLookup.get(r.rows[0].id)?.color || "#64748B";
    },
    [candidateLookup]
  );

  // Fill opacity reflects how decisive the lead is (margin over 2nd place).
  const leadOpacity = (r: ReturnType<typeof rank> | null) => {
    if (!r || r.rows.length === 0) return 1;
    const margin = r.rows[0].share - (r.rows[1]?.share || 0);
    return 0.55 + Math.min(1, margin / 40) * 0.45;
  };

  const cityResultMap = useMemo(() => {
    const list = cityResults[provinceId] || [];
    return new Map(list.map((c) => [c.psgc, c]));
  }, [cityResults, provinceId]);

  const cityRank = useCallback(
    (psgc: string) => {
      const c = cityResultMap.get(psgc);
      if (!c || !c.votes) return null;
      const r = rank(known(c.votes[position] || {}));
      return r.rows.length ? r : null;
    },
    [cityResultMap, position, known]
  );

  /* ------------------------------------------------------ view box/zoom */

  const ASPECT = 0.78;
  const targetBox: Box = useMemo(() => {
    if (!geo) return [0, 0, 1000, 1400];
    if (view === "HEX" && !provinceId) {
      const r = geo.hexSize;
      const hexes = geo.provinces.filter((p) => !regionId || p.regionId === regionId);
      const b = hexes.reduce(
        (acc, p) => [Math.min(acc[0], p.hex.x - r), Math.min(acc[1], p.hex.y - r), Math.max(acc[2], p.hex.x + r), Math.max(acc[3], p.hex.y + r)],
        [Infinity, Infinity, -Infinity, -Infinity]
      ) as [number, number, number, number];
      const [x, y, w, h] = fitBox(b, regionId ? r * 2 : 10, ASPECT);
      const zw = w / zoom;
      const zh = h / zoom;
      return [x + (w - zw) / 2, y + (h - zh) / 2, zw, zh];
    }
    const pick = provinceId
      ? geo.provinces.filter((p) => p.id === provinceId)
      : regionId
      ? geo.provinces.filter((p) => p.regionId === regionId)
      : geo.provinces;
    const b = pick.reduce(
      (acc, p) => [Math.min(acc[0], p.bbox[0]), Math.min(acc[1], p.bbox[1]), Math.max(acc[2], p.bbox[2]), Math.max(acc[3], p.bbox[3])],
      [Infinity, Infinity, -Infinity, -Infinity]
    ) as [number, number, number, number];
    const base = fitBox(b, provinceId ? 12 : regionId ? 30 : 10, ASPECT);
    const [x, y, w, h] = base;
    const zw = w / zoom;
    const zh = h / zoom;
    return [x + (w - zw) / 2, y + (h - zh) / 2, zw, zh];
  }, [geo, view, provinceId, regionId, zoom]);
  const box = useAnimatedViewBox(targetBox);
  const strokeScale = box[2] / 1000;

  /* ---------------------------------------------------------- actions */

  const goNational = () => {
    setRegionId("");
    setProvinceId("");
    setCityPsgc("");
    setZoom(1);
  };
  const goRegion = (id: string) => {
    setRegionId(id);
    setProvinceId("");
    setCityPsgc("");
    setZoom(1);
  };
  const goProvince = (id: string) => {
    const meta = provinceMeta.get(id);
    setRegionId(meta?.regionId || "");
    setProvinceId(id);
    setCityPsgc("");
    setCityQuery("");
    setZoom(1);
    if (onSelectProvince && provinceData.get(id)) onSelectProvince(provinceData.get(id));
  };

  /* -------------------------------------------------------- side panel */

  const scope = useMemo(() => {
    if (provinceId && cityPsgc) {
      const c = cityResultMap.get(cityPsgc);
      return {
        level: "Lungsod / Bayan",
        title: c?.name || "",
        subtitle: `${provinceMeta.get(provinceId)?.name} · ${c?.type === "City" ? "City" : "Municipality"}`,
        responses: c?.responses || 0,
        ranking: cityRank(cityPsgc),
        insufficient: !!c && c.responses > 0 && !c.hasSufficientData,
      };
    }
    if (provinceId) {
      const p = provinceData.get(provinceId);
      return {
        level: "Lalawigan",
        title: provinceMeta.get(provinceId)?.name || "",
        subtitle: regionMeta.get(provinceMeta.get(provinceId)?.regionId || "")?.name || "",
        responses: p?.totalSubmissions || 0,
        ranking: provinceRank(provinceId),
        insufficient: !!p && p.totalSubmissions > 0 && p.hasSufficientData === false,
      };
    }
    if (regionId) {
      const r = regionData.get(regionId);
      const ranking = rank(known(votesOf(r, position)));
      return {
        level: "Rehiyon",
        title: regionMeta.get(regionId)?.name || "",
        subtitle: `${PHILIPPINE_PROVINCES.filter((p) => p.regionId === regionId).length} provinces`,
        responses: r?.totalSubmissions || 0,
        ranking: ranking.rows.length ? ranking : null,
        insufficient: false,
      };
    }
    return {
      level: "Pambansa",
      title: "Buong Pilipinas",
      subtitle: "Nationwide",
      responses: nationalRows.total,
      ranking: nationalRows.rows.length ? nationalRows : null,
      insufficient: false,
    };
  }, [provinceId, cityPsgc, regionId, position, cityResultMap, cityRank, provinceData, provinceRank, regionData, provinceMeta, regionMeta, nationalRows, known]);

  const legend = useMemo(() => {
    const counts = new Map<string, number>();
    let none = 0;
    (geo?.provinces || []).forEach((p) => {
      const r = provinceRank(p.id);
      if (!r) none++;
      else counts.set(r.rows[0].id, (counts.get(r.rows[0].id) || 0) + 1);
    });
    return {
      leaders: Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([id, n]) => ({ c: candidateLookup.get(id), n })),
      none,
    };
  }, [geo, provinceRank, candidateLookup]);

  const filteredCities = useMemo(() => {
    const list = cityResults[provinceId] || [];
    const q = cityQuery.trim().toLowerCase();
    return q ? list.filter((c) => c.name.toLowerCase().includes(q)) : list;
  }, [cityResults, provinceId, cityQuery]);

  const hoverInfo = useMemo(() => {
    if (!hover) return null;
    if (hover.kind === "province") {
      const r = provinceRank(hover.id);
      const p = provinceData.get(hover.id);
      return {
        name: provinceMeta.get(hover.id)?.name || hover.id,
        leader: r ? candidateLookup.get(r.rows[0].id) : null,
        share: r?.rows[0].share,
        responses: p?.totalSubmissions || 0,
      };
    }
    const c = cityResultMap.get(hover.id);
    const r = cityRank(hover.id);
    return {
      name: c?.name || "",
      leader: r ? candidateLookup.get(r.rows[0].id) : null,
      share: r?.rows[0].share,
      responses: c?.responses || 0,
    };
  }, [hover, provinceRank, provinceData, provinceMeta, candidateLookup, cityResultMap, cityRank]);

  const onHover = (kind: "province" | "city", id: string) => (e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHover({ kind, id, x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const positionMeta = POSITIONS.find((p) => p.id === position)!;
  const showCities = !!provinceId && view === "MAP";

  /* ------------------------------------------------------------ render */

  return (
    <section className="rounded-xl border border-line bg-white overflow-hidden">
      {/* Position tabs + view toggle */}
      <div className="flex flex-col gap-3 border-b border-line px-4 py-3 md:flex-row md:items-center md:justify-between md:px-6">
        <div role="tablist" aria-label="Posisyon" className="flex gap-1 overflow-x-auto">
          {POSITIONS.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={position === p.id}
              onClick={() => setPosition(p.id)}
              className={`shrink-0 rounded-md px-3 py-2 text-left transition-colors ${
                position === p.id ? "bg-[#0038A8] text-white" : "text-ink-soft hover:bg-slate-100"
              }`}
            >
              <span className="block text-sm font-semibold leading-tight">{p.fil}</span>
              <span className={`block text-[11px] leading-tight ${position === p.id ? "text-blue-100" : "text-ink-faint"}`}>{p.en}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 self-start rounded-md bg-slate-100 p-1 md:self-auto" aria-label="Map style">
          {([
            ["MAP", "Mapa", MapIcon],
            ["HEX", "Hex", Hexagon],
          ] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              aria-pressed={view === id}
              className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-semibold ${
                view === id ? "bg-white text-[#0038A8] shadow-sm" : "text-ink-muted hover:text-ink"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Breadcrumb */}
      <nav aria-label="Location" className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs md:px-6">
        <button onClick={goNational} className={`font-semibold ${regionId ? "text-[#0038A8] hover:underline" : "text-ink"}`}>
          Pilipinas
        </button>
        {regionId && (
          <>
            <ChevronRight className="h-3 w-3 text-ink-faint" />
            <button onClick={() => goRegion(regionId)} className={`font-semibold ${provinceId ? "text-[#0038A8] hover:underline" : "text-ink"}`}>
              {regionMeta.get(regionId)?.code}
            </button>
          </>
        )}
        {provinceId && (
          <>
            <ChevronRight className="h-3 w-3 text-ink-faint" />
            <button onClick={() => setCityPsgc("")} className={`font-semibold ${cityPsgc ? "text-[#0038A8] hover:underline" : "text-ink"}`}>
              {provinceMeta.get(provinceId)?.name}
            </button>
          </>
        )}
        {cityPsgc && (
          <>
            <ChevronRight className="h-3 w-3 text-ink-faint" />
            <span className="font-semibold text-ink">{cityResultMap.get(cityPsgc)?.name}</span>
          </>
        )}
        <span className="ml-auto hidden text-ink-faint sm:inline">
          Hindi opisyal na resulta ng survey · Unofficial survey results
          {lastUpdated ? ` · as of ${new Date(lastUpdated).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}` : ""}
        </span>
      </nav>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Map */}
        <div ref={wrapRef} className="relative min-h-[460px] bg-[#F4F7FB]" onMouseLeave={() => setHover(null)}>
          <div className="absolute left-3 top-3 z-10 flex w-48 flex-col gap-2">
            <select
              value={regionId}
              onChange={(e) => (e.target.value ? goRegion(e.target.value) : goNational())}
              className="w-full rounded-md border border-line bg-white px-2 py-1.5 text-xs text-ink-soft shadow-sm"
              aria-label="Pumili ng rehiyon"
            >
              <option value="">Lahat ng rehiyon</option>
              {PHILIPPINE_REGIONS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.code} – {r.name.replace(/ \(.*\)$/, "")}
                </option>
              ))}
            </select>
            {regionId && (
              <select
                value={provinceId}
                onChange={(e) => (e.target.value ? goProvince(e.target.value) : goRegion(regionId))}
                className="w-full rounded-md border border-line bg-white px-2 py-1.5 text-xs text-ink-soft shadow-sm"
                aria-label="Pumili ng lalawigan"
              >
                <option value="">Lahat ng lalawigan</option>
                {PHILIPPINE_PROVINCES.filter((p) => p.regionId === regionId).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="absolute right-3 top-3 z-10 flex flex-col overflow-hidden rounded-md border border-line bg-white shadow-sm">
            <button aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(6, z * 1.4))} className="p-2 hover:bg-slate-50">
              <Plus className="h-4 w-4 text-ink-soft" />
            </button>
            <button aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(1, z / 1.4))} className="border-t border-line p-2 hover:bg-slate-50">
              <Minus className="h-4 w-4 text-ink-soft" />
            </button>
            <button aria-label="Reset map" onClick={goNational} className="border-t border-line p-2 hover:bg-slate-50">
              <RotateCcw className="h-4 w-4 text-ink-soft" />
            </button>
          </div>

          {!geo && (
            <div className="flex h-[560px] items-center justify-center text-sm text-ink-muted">
              {geoError ? "Hindi ma-load ang mapa. Pakisubukang muli." : "Nilo-load ang mapa…"}
            </div>
          )}

          {geo && (
            <svg viewBox={box.join(" ")} className="block h-[560px] w-full md:h-[680px]" role="img" aria-label={`Survey map, ${positionMeta.en}`}>
              {view === "MAP" &&
                geo.provinces.map((p) => {
                  const r = provinceRank(p.id);
                  const dimmed = (regionId && p.regionId !== regionId) || (provinceId && p.id !== provinceId);
                  const selected = p.id === provinceId;
                  return (
                    <path
                      key={p.id}
                      d={p.d}
                      fill={showCities && selected ? "#FFFFFF" : dimmed ? "#DCE3EC" : leaderColor(r)}
                      fillOpacity={dimmed ? 1 : leadOpacity(r)}
                      stroke="#FFFFFF"
                      strokeWidth={0.9 * strokeScale}
                      className="cursor-pointer transition-[fill-opacity] duration-300"
                      onMouseMove={onHover("province", p.id)}
                      onClick={() => (p.id === provinceId ? undefined : goProvince(p.id))}
                    />
                  );
                })}

              {showCities &&
                (cityShapes[provinceId] || []).map((c) => {
                  const r = cityRank(c.psgc);
                  const selected = c.psgc === cityPsgc;
                  return (
                    <path
                      key={c.psgc}
                      d={c.d}
                      fill={leaderColor(r)}
                      fillOpacity={leadOpacity(r)}
                      stroke={selected ? "#0B1E36" : "#FFFFFF"}
                      strokeWidth={(selected ? 2.2 : 0.6) * strokeScale}
                      className="cursor-pointer"
                      onMouseMove={onHover("city", c.psgc)}
                      onClick={() => setCityPsgc(c.psgc)}
                    />
                  );
                })}

              {showCities &&
                (cityShapes[provinceId] || [])
                  .filter((c) => c.psgc === cityPsgc || c.a / (box[2] * box[3]) > 0.004)
                  .map((c) => (
                    <text
                      key={`t-${c.psgc}`}
                      x={c.cx}
                      y={c.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={19 * strokeScale}
                      className="pointer-events-none select-none fill-slate-800"
                      style={{ paintOrder: "stroke", stroke: "rgba(255,255,255,0.85)", strokeWidth: 4 * strokeScale, fontWeight: c.psgc === cityPsgc ? 700 : 500 }}
                    >
                      {c.name}
                    </text>
                  ))}

              {view === "MAP" && !provinceId &&
                geo.provinces
                  .filter((p) => (regionId ? p.regionId === regionId : false))
                  .map((p) => (
                    <text
                      key={`l-${p.id}`}
                      x={p.cx}
                      y={p.cy}
                      textAnchor="middle"
                      fontSize={11 * strokeScale}
                      className="pointer-events-none select-none fill-slate-900 font-semibold"
                      style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: 3 * strokeScale }}
                    >
                      {provinceMeta.get(p.id)?.name.replace(/ \(.*\)$/, "")}
                    </text>
                  ))}

              {view === "HEX" && !provinceId &&
                geo.provinces.map((p) => {
                  const r = provinceRank(p.id);
                  const dimmed = regionId && p.regionId !== regionId;
                  const name = provinceMeta.get(p.id)?.name.replace(/ \(.*\)$/, "") || p.id;
                  const short = PROVINCE_CODES[p.id] || name.slice(0, 3).toUpperCase();
                  const fill = leaderColor(r);
                  return (
                    <g key={p.id} className="cursor-pointer" onMouseMove={onHover("province", p.id)} onClick={() => goProvince(p.id)}>
                      <polygon
                        points={hexPoints(p.hex.x, p.hex.y, geo.hexSize * 0.95)}
                        fill={dimmed ? "#DCE3EC" : fill}
                        fillOpacity={dimmed ? 1 : leadOpacity(r)}
                        stroke="#FFFFFF"
                        strokeWidth={1.5}
                      />
                      <text
                        x={p.hex.x}
                        y={p.hex.y + 4}
                        textAnchor="middle"
                        fontSize={13}
                        letterSpacing={0.5}
                        className={`pointer-events-none select-none font-semibold ${fill === NO_DATA || dimmed ? "fill-slate-500" : "fill-white"}`}
                        opacity={dimmed ? 0.6 : 1}
                      >
                        {short}
                      </text>
                    </g>
                  );
                })}

              {view === "HEX" && provinceId && (
                <text x={box[0] + box[2] / 2} y={box[1] + box[3] / 2} textAnchor="middle" fontSize={14 * strokeScale} className="fill-slate-500">
                  Switch to Mapa to see towns
                </text>
              )}
            </svg>
          )}

          {hover && hoverInfo && (
            <div
              className="pointer-events-none absolute z-20 w-56 rounded-md border border-line bg-white p-3 text-xs shadow-soft"
              style={{ left: Math.min(hover.x + 14, (wrapRef.current?.clientWidth || 600) - 236), top: hover.y + 14 }}
            >
              <p className="font-semibold text-ink">{hoverInfo.name}</p>
              {hoverInfo.leader ? (
                <p className="mt-1 flex items-center gap-1.5 text-ink-soft">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: hoverInfo.leader.color }} />
                  <span className="truncate">{hoverInfo.leader.name}</span>
                  <span className="ml-auto font-semibold tabular-nums">{hoverInfo.share?.toFixed(1)}%</span>
                </p>
              ) : (
                <p className="mt-1 text-ink-faint">Wala pang sapat na tugon · Not enough responses</p>
              )}
              <p className="mt-1 text-ink-faint tabular-nums">{fmt(hoverInfo.responses)} responses</p>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-white/90 px-3 py-2 text-[11px] text-ink-soft backdrop-blur">
            <span className="font-semibold text-ink">Nangunguna sa lalawigan:</span>
            {legend.leaders.slice(0, 5).map(({ c, n }) =>
              c ? (
                <span key={c.id} className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: c.color }} />
                  {shortName(c.name)} <span className="tabular-nums text-ink-faint">{n}</span>
                </span>
              ) : null
            )}
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm border border-slate-300" style={{ background: NO_DATA }} />
              Walang sapat na datos <span className="tabular-nums text-ink-faint">{legend.none}</span>
            </span>
          </div>
        </div>

        {/* Side panel */}
        <aside className="flex max-h-[680px] flex-col border-t border-line lg:border-l lg:border-t-0">
          <div className="border-b border-line px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#CE1126]">{scope.level}</p>
            <h3 className="mt-0.5 text-xl font-semibold text-ink">{scope.title}</h3>
            <p className="text-xs text-ink-muted">{scope.subtitle}</p>
            <p className="mt-2 text-xs text-ink-muted">
              <span className="font-semibold tabular-nums text-ink">{fmt(scope.ranking ? scope.ranking.total : scope.responses)}</span>{" "}
              {scope.ranking ? "boto · votes" : "tugon · responses"} para sa {positionMeta.fil}
            </p>
          </div>

          <div className="overflow-y-auto">
            {/* Tally */}
            <ol className="divide-y divide-slate-100 px-5">
              {scope.ranking ? (
                scope.ranking.rows.slice(0, position === "SENATOR" ? 12 : 8).map((row, i) => {
                  const c = candidateLookup.get(row.id);
                  return (
                    <li key={row.id} className="py-2.5">
                      <div className="flex items-baseline gap-2">
                        <span className="w-5 shrink-0 text-xs font-semibold tabular-nums text-ink-faint">{i + 1}</span>
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{c?.name || "—"}</span>
                        <span className="text-sm font-semibold tabular-nums text-ink">{row.share.toFixed(1)}%</span>
                      </div>
                      <div className="ml-7 mt-1 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                          <div className="h-1.5 rounded-full" style={{ width: `${Math.max(2, row.share)}%`, background: c?.color || "#64748B" }} />
                        </div>
                        <span className="w-14 text-right text-[11px] tabular-nums text-ink-faint">{fmt(row.votes)}</span>
                      </div>
                      {c?.party && <p className="ml-7 mt-0.5 truncate text-[11px] text-ink-faint">{c.party}</p>}
                    </li>
                  );
                })
              ) : (
                <li className="py-6 text-sm text-ink-muted">
                  {scope.insufficient
                    ? "May mga tugon na, pero kulang pa para ipakita ang hatian. · Not enough responses to show a breakdown yet."
                    : "Wala pang tugon dito. · No responses here yet."}
                </li>
              )}
            </ol>

            {/* Provinces in region */}
            {regionId && !provinceId && (
              <div className="border-t border-line px-5 py-4">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Mga Lalawigan</p>
                <ul className="space-y-1">
                  {PHILIPPINE_PROVINCES.filter((p) => p.regionId === regionId).map((p) => {
                    const r = provinceRank(p.id);
                    const lead = r ? candidateLookup.get(r.rows[0].id) : null;
                    return (
                      <li key={p.id}>
                        <button onClick={() => goProvince(p.id)} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-slate-50">
                          <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: leaderColor(r) }} />
                          <span className="flex-1 truncate text-ink">{p.name}</span>
                          <span className="truncate text-xs text-ink-faint">{lead ? shortName(lead.name) : "—"}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Cities / municipalities in province */}
            {provinceId && (
              <div className="border-t border-line px-5 py-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                    Mga Lungsod at Bayan · {(cityResults[provinceId] || []).length}
                  </p>
                  {cityPsgc && (
                    <button onClick={() => setCityPsgc("")} className="flex items-center gap-1 text-[11px] text-[#0038A8]">
                      <X className="h-3 w-3" /> Clear
                    </button>
                  )}
                </div>
                <label className="relative mb-2 block">
                  <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-ink-faint" />
                  <input
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                    placeholder="Hanapin ang bayan o lungsod…"
                    className="w-full rounded-md border border-line py-1.5 pl-7 pr-2 text-xs"
                  />
                </label>
                <ul className="space-y-0.5">
                  {filteredCities.map((c) => {
                    const r = cityRank(c.psgc);
                    return (
                      <li key={c.psgc}>
                        <button
                          onClick={() => setCityPsgc(c.psgc)}
                          className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm ${
                            c.psgc === cityPsgc ? "bg-blue-50" : "hover:bg-slate-50"
                          }`}
                        >
                          <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: leaderColor(r) }} />
                          <span className="flex-1 truncate text-ink">
                            {c.name}
                            {c.type === "City" && <span className="ml-1 text-[10px] font-semibold text-ink-faint">LUNGSOD</span>}
                          </span>
                          <span className="text-xs tabular-nums text-ink-faint">{c.responses}</span>
                        </button>
                      </li>
                    );
                  })}
                  {!cityResults[provinceId] && <li className="py-3 text-xs text-ink-faint">Nilo-load…</li>}
                </ul>
              </div>
            )}

            {!regionId && (
              <p className="border-t border-line px-5 py-4 text-xs text-ink-muted">
                I-click ang isang lalawigan para makita ang resulta sa bawat bayan at lungsod. · Click a province to see every town and city.
              </p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
