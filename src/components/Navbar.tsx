"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Vote, MapPin, BarChart3, Users, BookOpen, Menu, X, ShieldCheck } from "lucide-react";

import ElectionLiveBadge from "./ElectionLiveBadge";

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
    { name: "Cast Vote", href: "/survey", icon: Vote, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B1E36] text-white border-b border-slate-700/60 shadow-md">
      {/* Top Civic-Tech Official Bar */}
      <div className="bg-[#071324] border-b border-white/10 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ElectionLiveBadge label="CIVIC MONITOR" sublabel="Swing Labs" />
            <span className="text-slate-300 font-medium text-[11px] hidden sm:inline">
              Independent Philippine Pre-Election Poll & Legislative Records Registry
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-300 font-medium">
            <span className="hidden md:inline text-sky-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Public Records
            </span>
            <span className="hidden sm:inline text-slate-500">&bull;</span>
            <Link
              href="/survey"
              className="text-amber-300 hover:text-white font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Cast Your Ballot</span>
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
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#004B93] to-sky-600 border border-sky-400/30 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Vote className="w-5 h-5 text-amber-300" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors uppercase leading-none truncate">
                ELEKSYON <span className="text-red-500">2028</span>
              </div>
              <div className="text-[10px] font-medium tracking-wide text-slate-300 uppercase mt-1 truncate">
                PHILIPPINES &bull; PUBLIC OPINION & LEGISLATIVE ARCHIVE
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

              if (link.highlight) {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="ml-3 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs tracking-wider uppercase shadow flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Vote className="w-3.5 h-3.5 text-amber-300" />
                    <span>{link.name}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                    isActive
                      ? "text-sky-300 bg-white/10"
                      : "text-slate-200 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
            <Link
              href="/survey"
              className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs tracking-wider uppercase shadow transition-colors"
            >
              VOTE
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#071324] border-t border-white/10 px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top duration-150">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-colors ${
                  isActive
                    ? "bg-[#004B93] text-sky-200"
                    : "text-slate-200 hover:bg-white/5 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
