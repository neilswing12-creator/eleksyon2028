import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Vote, Shield, Globe, Award, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Eleksyon 2028 | Philippine Civic Technology Initiative",
  description:
    "About the Philippine 2028 National Election Survey platform: an independent, non-partisan civic-technology initiative providing transparent public sentiment data and voter education.",
  alternates: {
    canonical: "https://eleksyon.swingneil.com/about",
  },
  openGraph: {
    title: "About Eleksyon 2028 | Philippine Civic Technology Initiative",
    description: "Independent civic-technology initiative providing transparent public sentiment data.",
    url: "https://eleksyon.swingneil.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-light pb-16">
      <div className="bg-white border-b border-brand-border py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-bold mb-3">
            <Vote className="w-3.5 h-3.5" />
            <span>Civic Technology &amp; Public Sentiment Research</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
            About the Philippine 2028 National Election Survey
          </h1>
          <p className="text-sm sm:text-base text-brand-slate mt-2 leading-relaxed">
            Empowering voters with transparent public sentiment data, interactive 3D spatial mapping, and verified
            candidate policy platforms ahead of the 2028 national elections.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand-blue" />
            <span>Our Non-Partisan Mandate</span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
            The 2028 Philippine National Pre-Election Public Opinion Poll is a non-governmental, open civic-tech
            platform designed to measure public sentiment objectively across the archipelago. We do not endorse,
            campaign for, or accept financial contributions from any candidate, political party, or political action
            committee.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-brand-navy flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-blue" />
            <span>Civic-Tech Core Pillars</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-brand-navy">1. Complete Anonymity</h3>
              <p className="text-xs text-brand-slate leading-relaxed">
                Zero personal data or email collection. Submissions are secured via one-way salted HMAC hashes.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-brand-navy">2. Open Geographic Data</h3>
              <p className="text-xs text-brand-slate leading-relaxed">
                Aggregated provincial and regional trends visualized transparently for all 82 Philippine provinces.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <h3 className="font-bold text-sm text-brand-navy">3. Verified Platforms</h3>
              <p className="text-xs text-brand-slate leading-relaxed">
                Candidate policy stances and legislative records cited with direct links to primary government records.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Link
            href="/survey"
            className="px-8 py-3.5 rounded-xl bg-brand-blue text-white font-bold text-sm shadow-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <span>Participate in the 2028 Survey</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
