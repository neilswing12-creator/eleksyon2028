"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Vote, MapPin, BarChart3, Users, BookOpen, Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer upon route change or Escape key
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

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
      <div className="bg-[#F8FAFC] border-b border-slate-200/60 px-3 sm:px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200/60 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              Civic Survey
            </span>
            <span className="hidden md:inline text-slate-600 font-medium truncate">
              Independent Philippine 2028 National Pre-Election Public Opinion Poll
            </span>
            <span className="inline md:hidden text-slate-600 font-medium text-[10px] truncate">
              Philippine 2028 Civic Poll
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
            <span className="hidden lg:inline-flex items-center gap-1 text-slate-500 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Non-binding Public Opinion Research
            </span>
            <span className="hidden lg:inline text-slate-300">&bull;</span>
            <Link
              href="/survey"
              className="font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
            >
              <span>Submit Response</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Identity with Official E28 Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group min-w-0 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            aria-label="Eleksyon 2028 Homepage"
          >
            <img
              src="/e28-logo.svg"
              alt="Eleksyon 2028 Official Logo"
              width={40}
              height={40}
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="min-w-0 flex flex-col justify-center">
              <div className="text-base sm:text-lg font-bold tracking-tight text-[#0B1E36] group-hover:text-blue-700 transition-colors uppercase leading-none truncate">
                ELEKSYON <span className="text-blue-600 font-extrabold">2028</span>
              </div>
              <div className="text-[10px] font-medium tracking-wide text-slate-500 uppercase mt-1 truncate hidden sm:block">
                Philippine Public Opinion &amp; Civic Registry
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-normal transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
              className="ml-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-normal shadow-sm flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Vote className="w-3.5 h-3.5" />
              <span>Participate in Survey</span>
            </Link>
          </nav>

          {/* Mobile Actions: CTA + Accessible Hamburger Menu */}
          <div className="flex lg:hidden items-center gap-2 flex-shrink-0">
            <Link
              href="/survey"
              className="px-3 py-2 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-normal shadow-xs flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Vote className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Participate</span>
              <span className="xs:hidden">Vote</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-1 animate-in slide-in-from-top-2 duration-150 shadow-xl"
        >
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-semibold tracking-normal transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-bold border border-blue-200/60"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-700"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-3">
            <Link
              href="/survey"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center min-h-[44px] w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-colors"
            >
              <Vote className="w-4 h-4 mr-1.5" />
              <span>Participate in Survey &rarr;</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
