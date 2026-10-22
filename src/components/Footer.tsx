import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F8FAFC] border-t border-slate-200/80 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="sm:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 text-[#0B1E36] font-bold text-base group">
              <img
                src="/e28-logo.svg"
                alt="Eleksyon 2028 Official Logo"
                width={32}
                height={32}
                className="h-7 w-7 object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
              />
              <span className="group-hover:text-blue-700 transition-colors">
                Philippine 2028 National Election Survey
              </span>
            </Link>
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
                <Link href="/survey" className="hover:text-blue-700 transition-colors py-0.5 inline-block">
                  Participate in Survey
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-blue-700 transition-colors py-0.5 inline-block">
                  Live Survey Results
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-blue-700 transition-colors py-0.5 inline-block">
                  Interactive Philippine Map
                </Link>
              </li>
              <li>
                <Link href="/voters" className="hover:text-blue-700 transition-colors py-0.5 inline-block">
                  Voters&apos; Profile &amp; Demographics
                </Link>
              </li>
              <li>
                <Link href="/candidates" className="hover:text-blue-700 transition-colors py-0.5 inline-block">
                  Candidate Directory &amp; Records
                </Link>
              </li>
              <li>
                <Link href="/platforms" className="hover:text-blue-700 transition-colors py-0.5 inline-block">
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
                <Link href="/methodology" className="hover:text-blue-700 transition-colors py-0.5 inline-block">
                  Research Methodology
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-blue-700 transition-colors py-0.5 inline-block">
                  Data Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-700 transition-colors py-0.5 inline-block">
                  About the Platform
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Eleksyon 2028 Civic Survey Platform. Open Public Opinion Project.</p>
          <div className="flex items-center gap-4 text-xs">
            <a
              href="https://comelec.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-600 transition-colors flex items-center gap-1"
            >
              <span>COMELEC Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>&bull;</span>
            <a
              href="https://psa.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-600 transition-colors flex items-center gap-1"
            >
              <span>PSA Demographics</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
