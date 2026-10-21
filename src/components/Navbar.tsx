"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Vote, MapPin, BarChart3, Users, BookOpen, Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Map & Results", href: "/map", icon: MapPin },
    { name: "Live Tally", href: "/results", icon: BarChart3 },
    { name: "Voters Profile", href: "/voters", icon: Users },
    { name: "Candidates", href: "/candidates", icon: Users },
    { name: "Platforms", href: "/platforms", icon: BookOpen },
    { name: "Methodology", href: "/methodology" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
      {/* Top Civic Service Ticker */}
      <div className="bg-[#F8FAFC] border-b border-slate-200/60 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              Civic Survey
            </span>
            <span className="hidden sm:inline text-slate-600 font-medium">
              Independent Philippine 2028 National Pre-Election Public Opinion Poll
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1 text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Non-binding Public Opinion Research
            </span>
            <span className="hidden sm:inline text-slate-300">&bull;</span>
            <Link
              href="/survey"
              className="font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
            >
              <span>Submit Survey Response</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-700 shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
              <Vote className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-bold tracking-tight text-[#0B1E36] group-hover:text-blue-700 transition-colors uppercase leading-none truncate">
                ELEKSYON <span className="text-blue-600 font-extrabold">2028</span>
              </div>
              <div className="text-[10px] font-medium tracking-wide text-slate-500 uppercase mt-1 truncate">
                Philippine Public Opinion &amp; Civic Registry
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-colors ${
                    isActive
                      ? "text-blue-700 bg-blue-50/80 border border-blue-200/50"
                      : "text-slate-600 hover:text-blue-700 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            {/* Prominent CTA */}
            <Link
              href="/survey"
              className="ml-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-normal shadow-sm flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Participate in Survey</span>
            </Link>
          </nav>

          {/* Mobile Actions */}
          <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
            <Link
              href="/survey"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-normal shadow-xs transition-colors"
            >
              Vote
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top duration-150 shadow-lg">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold tracking-normal transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-bold border border-blue-200/60"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-700"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link
              href="/survey"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm"
            >
              Participate in Survey &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
