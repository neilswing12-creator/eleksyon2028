"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Vote, MapPin, BarChart3, Users, BookOpen, Menu, X, ShieldCheck, Flame } from "lucide-react";

import ElectionLiveBadge from "./ElectionLiveBadge";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "MAP & RESULTS", href: "/map", icon: MapPin },
    { name: "LIVE TALLY", href: "/results", icon: BarChart3 },
    { name: "VOTERS PROFILE", href: "/voters", icon: Users },
    { name: "CAST VOTE", href: "/survey", icon: Vote, highlight: true },
    { name: "CANDIDATES", href: "/candidates", icon: Users },
    { name: "PLATFORMS", href: "/platforms", icon: BookOpen },
    { name: "METHODOLOGY", href: "/methodology" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B132B] text-white border-b-2 border-gma-red shadow-broadcast">
      {/* Top Live Survey Ticker */}
      <div className="bg-[#070D1F] border-b border-white/10 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ElectionLiveBadge label="LIVE SURVEY" sublabel="Made by Swing Labs" />
          <span className="text-slate-300 font-medium text-[11px] hidden sm:inline">
            Partial, Unofficial Results &bull; 2028 Philippine National Pre-Election Poll
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-300 font-medium">
          <span className="hidden md:inline text-amber-400 font-bold">100% PRECINCTS MAPPED</span>
          <span className="hidden sm:inline">&bull;</span>
          <Link href="/survey" className="text-white hover:text-amber-400 font-bold flex items-center gap-1">
            <span>CAST YOUR VOTE NOW</span>
            <span className="text-amber-400">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Main Broadcast Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Swing Labs Branding */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-tr from-gma-blue to-blue-600 border border-blue-400/40 flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform">
                <Vote className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-xl font-headline font-black tracking-wide text-white group-hover:text-amber-400 transition-colors uppercase leading-none truncate">
                ELEKSYON <span className="text-gma-red">2028</span>
              </div>
              <div className="text-[9px] sm:text-[10px] font-sans font-bold tracking-wider sm:tracking-widest text-slate-300 uppercase mt-0.5 truncate">
                PHILIPPINE 2028 SURVEY &bull; SWING LABS
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 font-headline">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              if (link.highlight) {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="ml-2 px-4 py-2 rounded-lg bg-gma-red hover:bg-red-700 text-white font-bold text-sm tracking-wider uppercase shadow-md flex items-center gap-1.5 transition-all transform hover:scale-105 active:scale-95"
                  >
                    <Vote className="w-4 h-4 text-amber-300" />
                    <span>{link.name}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-md text-sm font-bold tracking-wide uppercase transition-colors ${
                    isActive
                      ? "text-amber-400 bg-white/10"
                      : "text-slate-200 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <Link
              href="/survey"
              className="px-2.5 sm:px-3 py-1.5 rounded bg-gma-red text-white font-headline font-bold text-xs tracking-wider uppercase shadow hover:bg-red-700 transition-colors"
            >
              VOTE
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070D1F] border-t border-white/10 px-4 pt-3 pb-6 space-y-1 font-headline animate-in slide-in-from-top duration-150">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-bold tracking-wider uppercase transition-colors ${
                  isActive
                    ? "bg-gma-blue text-amber-300"
                    : "text-slate-200 hover:bg-white/5"
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
