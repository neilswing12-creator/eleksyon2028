"use client";

import React from "react";
import { X, Award, Users, AlertCircle, CheckCircle2 } from "lucide-react";

interface ProvinceData {
  id: string;
  name: string;
  regionId: string;
  islandGroup: "Luzon" | "Visayas" | "Mindanao";
  totalSubmissions: number;
  hasSufficientData: boolean;
  leadingPresident?: {
    id: string;
    name: string;
    color: string;
    votes: number;
    share: number;
    margin: number;
  } | null;
  leadingVicePresident?: {
    id: string;
    name: string;
    color: string;
    votes: number;
    share: number;
  } | null;
  topSenators: Array<{
    id: string;
    name: string;
    color: string;
    votes: number;
  }>;
  cities: string[];
}

interface Props {
  province: ProvinceData | null;
  onClose: () => void;
  minThreshold: number;
}

export default function ProvinceDetailModal({ province, onClose, minThreshold }: Props) {
  if (!province) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-xl border-2 border-slate-300 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* GMA News Broadcast Header */}
        <div className="bg-[#0B1E36] text-white p-5 border-b-2 border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-headline font-bold uppercase tracking-wider text-amber-400">
              <span>{province.islandGroup}</span>
              <span>&bull;</span>
              <span>{province.regionId}</span>
            </div>
            <h3 className="text-2xl font-headline font-black mt-1 text-white uppercase tracking-wide">
              {province.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300 font-sans">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {province.totalSubmissions.toLocaleString()} active response{province.totalSubmissions !== 1 ? "s" : ""} recorded
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto font-sans">
          {/* Sample Threshold Verification */}
          {!province.hasSufficientData ? (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3 text-amber-950 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-headline font-bold text-sm text-amber-900 uppercase">PROVISIONAL SAMPLE SIZE</p>
                <p className="text-amber-800 mt-0.5">
                  This province has fewer than {minThreshold} response(s). Under public election survey disclosure
                  rules, leaders are provisional and should not be interpreted as definitive consensus.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center gap-2 text-emerald-900 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-semibold">Sufficient provincial response threshold met for reporting.</span>
            </div>
          )}

          {/* Leading Presidential Candidate */}
          <div className="border-2 border-slate-200 rounded-xl p-4 bg-slate-50/70">
            <div className="text-xs font-headline font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
              <span>Presidential Survey Leader</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>

            {province.leadingPresident ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-10 rounded-full"
                    style={{ backgroundColor: province.leadingPresident.color }}
                  ></span>
                  <div>
                    <h4 className="text-lg font-headline font-bold text-[#0B1E36] uppercase">
                      {province.leadingPresident.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold">
                      {province.leadingPresident.votes} votes &bull;{" "}
                      {province.leadingPresident.share}% of provincial responses
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-headline font-black text-blue-700 tabular-nums">
                    {province.leadingPresident.share}%
                  </div>
                  {province.leadingPresident.margin > 0 && (
                    <div className="text-[11px] font-headline font-bold text-emerald-700">
                      +{province.leadingPresident.margin}% lead margin
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No presidential preferences cast yet.</p>
            )}
          </div>

          {/* Leading Vice Presidential Candidate */}
          <div className="border-2 border-slate-200 rounded-xl p-4 bg-slate-50/70">
            <div className="text-xs font-headline font-bold uppercase tracking-wider text-slate-500 mb-2">
              Vice Presidential Survey Leader
            </div>
            {province.leadingVicePresident ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3.5 h-8 rounded-full"
                    style={{ backgroundColor: province.leadingVicePresident.color }}
                  ></span>
                  <div>
                    <h4 className="text-base font-headline font-bold text-[#0B1E36] uppercase">
                      {province.leadingVicePresident.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold">
                      {province.leadingVicePresident.votes} votes &bull; {province.leadingVicePresident.share}% share
                    </p>
                  </div>
                </div>
                <div className="text-xl font-headline font-black text-[#0B1E36] tabular-nums">
                  {province.leadingVicePresident.share}%
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No VP responses recorded.</p>
            )}
          </div>

          {/* Top Senatorial Choices */}
          {province.topSenators && province.topSenators.length > 0 && (
            <div>
              <div className="text-xs font-headline font-bold uppercase tracking-wider text-slate-500 mb-3">
                Top Senatorial Choices in {province.name}
              </div>
              <div className="space-y-2">
                {province.topSenators.map((sen, idx) => (
                  <div
                    key={sen.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-headline font-bold flex items-center justify-center text-[10px]">
                        #{idx + 1}
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: sen.color }}
                      ></span>
                      <span className="font-headline font-bold text-sm text-[#0B1E36] uppercase">
                        {sen.name}
                      </span>
                    </div>
                    <span className="font-headline font-black text-slate-700 text-xs">
                      {sen.votes} voters
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Included Cities */}
          {province.cities && province.cities.length > 0 && (
            <div className="border-t border-slate-200 pt-4">
              <div className="text-xs font-headline font-bold text-slate-500 uppercase tracking-wider mb-2">
                Key Cities &amp; Municipalities Covered
              </div>
              <div className="flex flex-wrap gap-1.5">
                {province.cities.map((city) => (
                  <span
                    key={city}
                    className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold"
                  >
                    {city}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs transition-colors hover:bg-blue-700 shadow-xs"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
