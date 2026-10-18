import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-brand-border text-brand-slate text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-brand-navy font-bold text-base">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-blue inline-block"></span>
              Philippine 2028 National Election Survey
            </div>
            <p className="text-xs text-brand-slate leading-relaxed max-w-md">
              An independent, non-partisan civic data platform providing voluntary public opinion research,
              candidate policy directories, and geographic sentiment analytics for the upcoming 2028 Philippine
              National Elections.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Compliant with the Philippine Data Privacy Act of 2012 (RA 10173).</span>
            </div>
          </div>

          {/* Survey Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-brand-navy uppercase tracking-wider mb-3">
              Platform Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/survey" className="hover:text-brand-blue transition-colors">
                  Cast Your Vote
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-brand-blue transition-colors">
                  Live Survey Results
                </Link>
              </li>
              <li>
                <Link href="/map" className="hover:text-brand-blue transition-colors">
                  Interactive Philippine Map
                </Link>
              </li>
              <li>
                <Link href="/candidates" className="hover:text-brand-blue transition-colors">
                  Candidate Directory
                </Link>
              </li>
              <li>
                <Link href="/platforms" className="hover:text-brand-blue transition-colors">
                  Agendas &amp; Platforms
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-xs font-semibold text-brand-navy uppercase tracking-wider mb-3">
              Methodology &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/methodology" className="hover:text-brand-blue transition-colors">
                  Survey Methodology &amp; IP Rules
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-blue transition-colors">
                  Privacy Notice &amp; Data Ethics
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-blue transition-colors">
                  About the Research Project
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            &copy; {new Date().getFullYear()} Philippine 2028 Election Survey Platform. All rights reserved.
            This survey is independent and not affiliated with the Commission on Elections (COMELEC).
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Strict Non-Partisan Standard</span>
            <span className="text-slate-400">&bull;</span>
            <span className="text-slate-400">Anonymized HMAC IP Verification</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
