import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, Vote } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F8FAFC] border-t border-slate-200/80 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 text-[#0B1E36] font-bold text-base">
              <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Vote className="w-3.5 h-3.5" />
              </div>
              <span>Philippine 2028 National Election Survey</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              An independent, non-partisan civic data platform providing voluntary public opinion research,
              candidate legislative records, and geographic sentiment analytics for the upcoming 2028 Philippine
              National Elections.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Compliant with Philippine Data Privacy Act of 2012 (RA 10173).</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Disclaimer: This survey is an independent public opinion study and is not an official COMELEC voting system or certified election result.
            </p>
          </div>

          {/* Survey Navigation */}
          <div>
            <h4 className="text-xs font-bold text-[#0B1E36] uppercase tracking-wider mb-3">
              Civic Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/survey" className="hover:text-blue-700 transition-colors">
                  Participate in Survey
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-blue-700 transition-colors">
                  Live Survey Results
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-blue-700 transition-colors">
                  Interactive Philippine Map
                </Link>
              </li>
              <li>
                <Link href="/voters" className="hover:text-blue-700 transition-colors">
                  Voters&apos; Profile &amp; Demographics
                </Link>
              </li>
              <li>
                <Link href="/candidates" className="hover:text-blue-700 transition-colors">
                  Candidate Directory &amp; Records
                </Link>
              </li>
              <li>
                <Link href="/platforms" className="hover:text-blue-700 transition-colors">
                  Agendas &amp; Platforms
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-xs font-bold text-[#0B1E36] uppercase tracking-wider mb-3">
              Methodology &amp; Standards
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/methodology" className="hover:text-blue-700 transition-colors">
                  Survey Methodology &amp; IP Rules
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-700 transition-colors">
                  Privacy Policy &amp; Security
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-700 transition-colors">
                  About the Research Project
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-slate-600 transition-colors">
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Philippine Election Survey 2028. All public domain legislative records sourced from the Senate and House of Representatives.
          </div>
          <div className="text-[11px] text-slate-400">
            Open Civic Technology &bull; Made by Swing Labs
          </div>
        </div>
      </div>
    </footer>
  );
}
