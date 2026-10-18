"use client";

import React, { useState } from "react";
import { Search, Map, Hexagon, Info, ChevronRight, Layers, Sparkles } from "lucide-react";

import ElectionLiveBadge from "./ElectionLiveBadge";

interface ProvinceData {
  id: string;
  name: string;
  regionId: string;
  islandGroup: "Luzon" | "Visayas" | "Mindanao";
  svgX: number;
  svgY: number;
  totalSubmissions: number;
  hasSufficientData: boolean;
  leadingPresident?: {
    id: string;
    name: string;
    color: string;
    votes: number;
    share: number;
  } | null;
  leadingVicePresident?: {
    id: string;
    name: string;
    color: string;
    votes: number;
    share: number;
  } | null;
  topSenators?: {
    id: string;
    name: string;
    color: string;
    votes: number;
  }[];
  cities: string[];
}

interface Props {
  provinces: ProvinceData[];
  selectedPosition: "PRESIDENT" | "VICE_PRESIDENT" | "SENATOR";
  onSelectProvince: (province: ProvinceData) => void;
  selectedProvinceId?: string | null;
}

// Hex Cartogram layout coordinates (Col: 0-14, Row: 0-16)
export const CARTOGRAM_GRID: Record<string, { col: number; row: number; code: string }> = {
  // North Luzon
  "batanes": { col: 6, row: 0, code: "BTN" },
  "ilocos-norte": { col: 4, row: 1, code: "ILN" },
  "apayao": { col: 6, row: 1, code: "APA" },
  "cagayan": { col: 8, row: 1, code: "CAG" },
  "abra": { col: 4, row: 2, code: "ABR" },
  "kalinga": { col: 6, row: 2, code: "KAL" },
  "isabela": { col: 8, row: 2, code: "ISA" },
  "ilocos-sur": { col: 4, row: 3, code: "ILS" },
  "mountain-province": { col: 6, row: 3, code: "MTP" },
  "ifugao": { col: 7, row: 3, code: "IFU" },
  "quirino": { col: 8, row: 3, code: "QUI" },
  "la-union": { col: 4, row: 4, code: "LAU" },
  "benguet": { col: 5, row: 4, code: "BEN" },
  "nueva-vizcaya": { col: 7, row: 4, code: "NVI" },
  "aurora": { col: 8, row: 4, code: "AUR" },
  "pangasinan": { col: 4, row: 5, code: "PAN" },
  "tarlac": { col: 5, row: 5, code: "TAR" },
  "nueva-ecija": { col: 7, row: 5, code: "NEC" },
  "zambales": { col: 3, row: 6, code: "ZAM" },
  "pampanga": { col: 5, row: 6, code: "PAM" },
  "bulacan": { col: 6, row: 6, code: "BUL" },
  "bataan": { col: 4, row: 7, code: "BAT" },
  "metro-manila": { col: 6, row: 7, code: "NCR" },
  "rizal": { col: 7, row: 7, code: "RIZ" },
  "cavite": { col: 5, row: 8, code: "CAV" },
  "laguna": { col: 6, row: 8, code: "LAG" },
  "quezon": { col: 8, row: 8, code: "QUE" },
  "batangas": { col: 5, row: 9, code: "BTG" },
  "marinduque": { col: 7, row: 9, code: "MRQ" },
  "camarines-norte": { col: 9, row: 8, code: "CAN" },
  "camarines-sur": { col: 10, row: 9, code: "CAS" },
  "catanduanes": { col: 12, row: 8, code: "CAT" },
  "albay": { col: 11, row: 10, code: "ALB" },
  "sorsogon": { col: 11, row: 11, code: "SOR" },
  "masbate": { col: 9, row: 11, code: "MAS" },
  "occidental-mindoro": { col: 4, row: 10, code: "MDO" },
  "oriental-mindoro": { col: 5, row: 10, code: "MDR" },
  "romblon": { col: 7, row: 10, code: "ROM" },
  "palawan": { col: 2, row: 11, code: "PLW" },

  // Visayas
  "northern-samar": { col: 12, row: 11, code: "NSA" },
  "eastern-samar": { col: 13, row: 12, code: "ESA" },
  "samar": { col: 12, row: 12, code: "WSA" },
  "biliran": { col: 11, row: 12, code: "BIL" },
  "leyte": { col: 12, row: 13, code: "LEY" },
  "southern-leyte": { col: 12, row: 14, code: "SLE" },
  "aklan": { col: 6, row: 11, code: "AKL" },
  "capiz": { col: 7, row: 11, code: "CAP" },
  "antique": { col: 5, row: 12, code: "ANT" },
  "iloilo": { col: 6, row: 12, code: "ILO" },
  "guimaras": { col: 6, row: 13, code: "GUI" },
  "negros-occidental": { col: 7, row: 13, code: "NOC" },
  "negros-oriental": { col: 7, row: 14, code: "NOR" },
  "cebu": { col: 8, row: 13, code: "CEB" },
  "bohol": { col: 9, row: 14, code: "BOH" },
  "siquijor": { col: 7, row: 15, code: "SIQ" },

  // Mindanao
  "dinagat-islands": { col: 12, row: 15, code: "DNG" },
  "surigao-del-norte": { col: 12, row: 16, code: "SUN" },
  "surigao-del-sur": { col: 13, row: 17, code: "SUS" },
  "agusan-del-norte": { col: 11, row: 16, code: "AGN" },
  "agusan-del-sur": { col: 12, row: 17, code: "AGS" },
  "camiguin": { col: 9, row: 15, code: "CAM" },
  "misamis-oriental": { col: 10, row: 16, code: "MOR" },
  "bukidnon": { col: 10, row: 17, code: "BUK" },
  "davao-de-oro": { col: 11, row: 18, code: "DVO" },
  "davao-del-norte": { col: 10, row: 18, code: "DVN" },
  "davao-oriental": { col: 12, row: 18, code: "DOR" },
  "davao-del-sur": { col: 10, row: 19, code: "DVS" },
  "davao-occidental": { col: 10, row: 20, code: "DVO" },
  "zamboanga-del-norte": { col: 6, row: 16, code: "ZDN" },
  "misamis-occidental": { col: 7, row: 16, code: "MOC" },
  "lanao-del-norte": { col: 8, row: 17, code: "LDN" },
  "lanao-del-sur": { col: 8, row: 18, code: "LDS" },
  "cotabato": { col: 9, row: 18, code: "COT" },
  "maguindanao": { col: 8, row: 19, code: "MAG" },
  "sultan-kudarat": { col: 8, row: 20, code: "SKU" },
  "south-cotabato": { col: 9, row: 20, code: "SCO" },
  "sarangani": { col: 9, row: 21, code: "SAR" },
  "zamboanga-del-sur": { col: 6, row: 17, code: "ZDS" },
  "zamboanga-sibugay": { col: 5, row: 17, code: "ZSI" },
  "basilan": { col: 4, row: 18, code: "BAS" },
  "sulu": { col: 3, row: 19, code: "SUL" },
  "tawi-tawi": { col: 2, row: 20, code: "TAW" },
};

export default function Philippine2DMap({
  provinces,
  selectedPosition,
  onSelectProvince,
  selectedProvinceId,
}: Props) {
  const [mapStyle, setMapStyle] = useState<"GEOGRAPHIC" | "HEX_CARTOGRAM">("HEX_CARTOGRAM");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIslandGroup, setSelectedIslandGroup] = useState<string>("ALL");
  const [hovered, setHovered] = useState<ProvinceData | null>(null);

  const getCandidateColor = (p: ProvinceData) => {
    if (selectedPosition === "PRESIDENT" && p.leadingPresident) {
      return p.leadingPresident.color;
    } else if (selectedPosition === "VICE_PRESIDENT" && p.leadingVicePresident) {
      return p.leadingVicePresident.color;
    } else if (selectedPosition === "SENATOR" && p.topSenators && p.topSenators.length > 0) {
      return p.topSenators[0].color;
    } else if (p.leadingPresident) {
      return p.leadingPresident.color;
    }
    return "#CBD5E1"; // neutral slate
  };

  // Filter provinces
  const filteredProvinces = provinces.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesIsland = selectedIslandGroup === "ALL" || p.islandGroup === selectedIslandGroup;
    return matchesSearch && matchesIsland;
  });

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-card flex flex-col">
      {/* Map Header Toolbar */}
      <div className="bg-[#0B132B] text-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-gma-red">
        <div>
          <div className="flex items-center gap-2">
            <ElectionLiveBadge label="RESULTS MAP" />
            <span className="text-[11px] font-headline font-bold tracking-widest text-amber-400 uppercase">
              MADE BY NEIL SWING
            </span>
          </div>
          <h2 className="text-xl font-headline font-bold uppercase tracking-wide text-white mt-1">
            {mapStyle === "HEX_CARTOGRAM" ? "Hexagonal Cartogram" : "Geographic Heatmap"}
          </h2>
        </div>

        {/* View Mode Toggle: Hex Cartogram vs Geographic */}
        <div className="flex items-center gap-2 bg-[#070D1F] p-1 rounded-xl border border-white/10 font-headline text-xs">
          <button
            onClick={() => setMapStyle("HEX_CARTOGRAM")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition-all ${
              mapStyle === "HEX_CARTOGRAM"
                ? "bg-gma-red text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Hexagon className="w-3.5 h-3.5 text-amber-300" />
            <span>Hex Cartogram</span>
          </button>

          <button
            onClick={() => setMapStyle("GEOGRAPHIC")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold tracking-wider uppercase transition-all ${
              mapStyle === "GEOGRAPHIC"
                ? "bg-gma-red text-white shadow"
                : "text-slate-300 hover:text-white"
            }`}
          >
            <Map className="w-3.5 h-3.5 text-amber-300" />
            <span>Geographic</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Sub-bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search province (e.g. NCR, Cebu, Davao)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-gma-blue/30 focus:border-gma-blue outline-none"
          />
        </div>

        {/* Island Group Filter Buttons */}
        <div className="flex items-center gap-1 font-headline text-xs w-full sm:w-auto overflow-x-auto">
          {["ALL", "Luzon", "Visayas", "Mindanao"].map((island) => (
            <button
              key={island}
              onClick={() => setSelectedIslandGroup(island)}
              className={`px-3 py-1 rounded-lg font-bold uppercase tracking-wider transition-colors ${
                selectedIslandGroup === island
                  ? "bg-[#0B132B] text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {island === "ALL" ? "All Philippines" : island}
            </button>
          ))}
        </div>
      </div>

      {/* MAP CANVAS / RENDERING AREA */}
      <div className="relative p-6 flex justify-center bg-[#F1F5F9] min-h-[620px] overflow-hidden select-none">
        {/* MODE A: GMA SIGNATURE HEXAGONAL CARTOGRAM */}
        {mapStyle === "HEX_CARTOGRAM" ? (
          <div className="w-full flex flex-col items-center justify-center">
            {/* Cartogram Explanation Banner */}
            <div className="mb-4 text-center max-w-lg">
              <span className="text-[11px] font-headline font-bold uppercase tracking-wider text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Equal-Representation Cartogram: Eliminates Geographic Landmass Bias</span>
              </span>
            </div>

            {/* Hexagon Grid SVG */}
            <svg
              viewBox="0 0 680 940"
              className="w-full max-w-[620px] h-auto drop-shadow-md select-none"
            >
              <defs>
                <filter id="hexShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0B132B" floodOpacity="0.12" />
                </filter>
              </defs>

              {/* Grid Background Guide */}
              <text x="30" y="80" className="font-headline font-bold text-xs fill-slate-400 uppercase tracking-widest">
                LUZON
              </text>
              <text x="30" y="520" className="font-headline font-bold text-xs fill-slate-400 uppercase tracking-widest">
                VISAYAS
              </text>
              <text x="30" y="740" className="font-headline font-bold text-xs fill-slate-400 uppercase tracking-widest">
                MINDANAO
              </text>

              {/* Render Each Province as a Hexagon Tile */}
              {provinces.map((p) => {
                const coord = CARTOGRAM_GRID[p.id];
                if (!coord) return null;

                // Hex dimensions
                const hexRadius = 22;
                const hexW = 44;
                const hexH = 38;
                // Offset odd columns for interlocking honeycomb
                const x = 50 + coord.col * (hexW * 0.95);
                const y = 50 + coord.row * hexH + (coord.col % 2 === 1 ? hexH * 0.5 : 0);

                const color = getCandidateColor(p);
                const isSelected = selectedProvinceId === p.id;
                const isHovered = hovered?.id === p.id;

                // Calculate regular hexagon points
                const points = [
                  `${x},${y - hexRadius}`,
                  `${x + hexRadius * 0.866},${y - hexRadius * 0.5}`,
                  `${x + hexRadius * 0.866},${y + hexRadius * 0.5}`,
                  `${x},${y + hexRadius}`,
                  `${x - hexRadius * 0.866},${y + hexRadius * 0.5}`,
                  `${x - hexRadius * 0.866},${y - hexRadius * 0.5}`,
                ].join(" ");

                return (
                  <g
                    key={p.id}
                    className="cursor-pointer transition-transform duration-100 hover:scale-110 transform-gpu"
                    onClick={() => onSelectProvince(p)}
                    onMouseEnter={() => setHovered(p)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Hexagon shape */}
                    <polygon
                      points={points}
                      fill={color}
                      stroke={isSelected ? "#FFB703" : isHovered ? "#0B132B" : "#FFFFFF"}
                      strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                      filter="url(#hexShadow)"
                    />

                    {/* 3-letter province code in bold white */}
                    <text
                      x={x}
                      y={y + 4}
                      textAnchor="middle"
                      className="font-headline font-bold text-[10px] fill-white pointer-events-none drop-shadow select-none tracking-tight"
                    >
                      {coord.code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        ) : (
          /* MODE B: AUTHENTIC GEOGRAPHIC SHAPE OF THE PHILIPPINES */
          <div className="w-full flex flex-col items-center justify-center">
            <svg
              viewBox="100 0 700 1150"
              className="w-full max-w-[620px] h-auto drop-shadow-md select-none"
            >
              <defs>
                <filter id="geoGlow">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0B132B" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Accurate archipelagic silhouette backdrop */}
              <g fill="#CBD5E1" stroke="#94A3B8" strokeWidth="1.5" opacity="0.6">
                <path d="M 320 80 Q 360 40 450 60 Q 480 120 470 240 Q 420 330 380 430 Q 320 400 310 320 Q 340 180 320 80 Z" />
                <path d="M 460 440 Q 560 480 620 540 Q 580 620 530 570 Q 480 480 460 440 Z" />
                <ellipse cx="370" cy="535" rx="35" ry="45" transform="rotate(-20 370 535)" />
                <path d="M 160 810 Q 230 680 270 630 Q 285 640 240 730 Q 180 830 160 810 Z" />
                <ellipse cx="460" cy="670" rx="35" ry="30" />
                <path d="M 500 680 Q 535 710 525 790 Q 500 790 500 710 Z" />
                <path d="M 555 700 Q 575 730 560 780 Q 550 760 555 700 Z" />
                <ellipse cx="600" cy="770" rx="22" ry="18" />
                <path d="M 640 600 Q 690 640 660 710 Q 630 670 640 600 Z" />
                <path d="M 645 700 Q 665 740 655 780 Q 635 740 645 700 Z" />
                <path d="M 420 880 Q 500 840 660 840 Q 710 930 660 1020 Q 580 1050 510 960 Q 430 940 420 880 Z" />
              </g>

              {/* Dynamic Interactive Province Bubbles */}
              {filteredProvinces.map((p) => {
                const color = getCandidateColor(p);
                const isSelected = selectedProvinceId === p.id;
                const isHovered = hovered?.id === p.id;
                const radius = Math.min(22, Math.max(11, (p.totalSubmissions || 1) * 3.5));

                return (
                  <g
                    key={p.id}
                    className="cursor-pointer transition-all duration-100"
                    onClick={() => onSelectProvince(p)}
                    onMouseEnter={() => setHovered(p)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <circle
                      cx={p.svgX}
                      cy={p.svgY}
                      r={radius}
                      fill={color}
                      stroke={isSelected ? "#FFB703" : isHovered ? "#0B132B" : "#FFFFFF"}
                      strokeWidth={isSelected ? 3.5 : 2}
                      filter="url(#geoGlow)"
                    />
                    {(p.totalSubmissions > 1 || p.id === "metro-manila" || p.id === "cebu" || p.id === "davao-del-sur") && (
                      <text
                        x={p.svgX}
                        y={p.svgY + radius + 11}
                        textAnchor="middle"
                        className="font-headline font-bold text-[9px] fill-[#0B132B] uppercase tracking-wider drop-shadow-sm select-none"
                      >
                        {p.name.replace(" (NCR)", "").replace(" (Western)", "")}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Hover Tooltip (GMA Eleksyon broadcast style card) */}
        {hovered && (
          <div className="absolute top-4 right-4 bg-[#0B132B] text-white rounded-xl p-3.5 border-2 border-amber-400 shadow-broadcast text-xs min-w-[220px] pointer-events-none animate-in fade-in duration-100">
            <div className="text-[10px] font-headline font-bold tracking-widest text-amber-400 uppercase">
              {hovered.islandGroup} &bull; {hovered.regionId}
            </div>
            <div className="font-headline font-black text-lg text-white mt-0.5 uppercase tracking-wide">
              {hovered.name}
            </div>
            <div className="text-[11px] font-sans font-semibold text-slate-300">
              {hovered.totalSubmissions} Votes Counted
            </div>

            {selectedPosition === "SENATOR" && hovered.topSenators && hovered.topSenators.length > 0 ? (
              <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: hovered.topSenators[0].color }}
                  ></span>
                  <span className="font-headline font-bold text-xs text-white uppercase">
                    {hovered.topSenators[0].name}
                  </span>
                </div>
                <span className="font-headline font-black text-sm text-amber-400">
                  {hovered.topSenators[0].votes} votes
                </span>
              </div>
            ) : selectedPosition === "VICE_PRESIDENT" && hovered.leadingVicePresident ? (
              <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: hovered.leadingVicePresident.color }}
                  ></span>
                  <span className="font-headline font-bold text-xs text-white uppercase">
                    {hovered.leadingVicePresident.name}
                  </span>
                </div>
                <span className="font-headline font-black text-sm text-amber-400">
                  {hovered.leadingVicePresident.share}%
                </span>
              </div>
            ) : hovered.leadingPresident ? (
              <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: hovered.leadingPresident.color }}
                  ></span>
                  <span className="font-headline font-bold text-xs text-white uppercase">
                    {hovered.leadingPresident.name}
                  </span>
                </div>
                <span className="font-headline font-black text-sm text-amber-400">
                  {hovered.leadingPresident.share}%
                </span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Map Bottom Legend Bar */}
      <div className="bg-slate-50 border-t border-slate-200 p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-slate-600 font-sans">
          <Info className="w-4 h-4 text-gma-blue flex-shrink-0" />
          <span>Click any province or hexagon tile to view localized provincial vote tallies.</span>
        </div>
        <div className="font-headline font-bold text-[11px] uppercase text-slate-400 tracking-wider">
          Philippine 2028 National Election Survey &bull; Made by Neil Swing
        </div>
      </div>
    </div>
  );
}
