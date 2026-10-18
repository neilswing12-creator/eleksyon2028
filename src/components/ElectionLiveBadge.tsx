"use client";

import React from "react";
import { Vote } from "lucide-react";

interface ElectionLiveBadgeProps {
  label?: string;
  sublabel?: string;
  className?: string;
}

export default function ElectionLiveBadge({
  label = "LIVE SURVEY",
  sublabel,
  className = "",
}: ElectionLiveBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D90429] text-white font-headline font-bold text-[10px] sm:text-xs tracking-wider uppercase shadow-sm select-none ${className}`}
    >
      {/* Animated Election Ballot / Survey Icon */}
      <span className="relative flex items-center justify-center">
        {/* Animated pulsing glow backdrop */}
        <span className="absolute w-4 h-4 rounded bg-amber-400/40 animate-ping"></span>
        <Vote className="w-3.5 h-3.5 text-amber-300 relative z-10 transition-transform transform hover:scale-110" />
      </span>
      <span>{label}</span>
      {sublabel && <span className="opacity-80 text-[10px] hidden sm:inline">&bull; {sublabel}</span>}
    </span>
  );
}
