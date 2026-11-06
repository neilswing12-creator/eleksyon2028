"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Vote, X, ShieldCheck } from "@/components/icons";

const NAV = [
  { name: "Home", href: "/" },
  { name: "Mapa", en: "Map", href: "/map" },
  { name: "Resulta", en: "Results", href: "/results" },
  { name: "Botante", en: "Voters", href: "/voters" },
  { name: "Kandidato", en: "Candidates", href: "/candidates" },
  { name: "Plataporma", en: "Platforms", href: "/platforms" },
  { name: "Metodolohiya", en: "Methodology", href: "/methodology" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur pt-[env(safe-area-inset-top)]">
      {/* Flag stripe */}
      <div aria-hidden className="flex h-[3px]">
        <span className="flex-[5] bg-ph-blue" />
        <span className="flex-[5] bg-ph-red" />
        <span className="flex-[1] bg-ph-gold" />
      </div>

      {/* Notice strip */}
      <div className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 text-[11.5px] text-ink-muted sm:px-6 lg:px-8">
          <p className="flex min-w-0 items-center gap-1.5 truncate">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-ph-blue" />
            <span className="truncate">
              Malayang survey ng opinyon publiko · <span className="hidden sm:inline">Independent opinion survey, </span>not affiliated with COMELEC
            </span>
          </p>
          <Link href="/methodology" className="hidden shrink-0 font-medium text-ph-blue hover:underline sm:inline">
            Paano ito gumagana?
          </Link>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 rounded-md" aria-label="Eleksyon 2028 home">
          <img src="/e28-logo.svg" alt="" width={40} height={40} className="h-10 w-10 shrink-0 object-contain" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[17px] font-bold tracking-tight text-ink">
              Eleksyon <span className="text-ph-blue">2028</span>
            </span>
            <span className="hidden truncate text-[12px] text-ink-muted sm:block">Pambansang survey ng opinyon publiko</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              title={l.en}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`relative rounded-md px-3 py-2 text-[14px] font-medium transition-colors ${
                isActive(l.href) ? "text-ph-blue" : "text-ink-soft hover:bg-paper hover:text-ink"
              }`}
            >
              {l.name}
              {isActive(l.href) && <span className="absolute inset-x-3 -bottom-[13px] h-[2px] rounded-full bg-ph-blue" />}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/survey"
            className="inline-flex items-center gap-2 rounded-lg bg-ph-blue px-4 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-ph-blueDeep"
          >
            <Vote className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">Bumoto sa survey</span>
            <span className="sm:hidden">Bumoto</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-soft hover:bg-paper lg:hidden"
            aria-label={open ? "Isara ang menu" : "Buksan ang menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" className="border-t border-line bg-white px-4 pb-5 pt-2 lg:hidden" aria-label="Mobile">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`flex items-center justify-between rounded-lg px-3 py-3 text-[15px] font-medium ${
                isActive(l.href) ? "bg-ph-sky text-ph-blue" : "text-ink hover:bg-paper"
              }`}
            >
              {l.name}
              {l.en && <span className="text-[12px] font-normal text-ink-faint">{l.en}</span>}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
