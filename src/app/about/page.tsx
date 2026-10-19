import React from "react";
import Link from "next/link";
import { Vote, Shield, Globe, Award, ArrowRight } from "lucide-react";

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
          <h2 className="text-xl font-bold text-brand-navy">Our Mission</h2>
          <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
            The 2028 Philippine National Elections represent a pivotal democratic moment. This survey platform was
            built by an independent team of civic technologists and data journalists to provide a modern,
            accessible, and privacy-first digital polling ecosystem.
          </p>
          <p className="text-xs sm:text-sm text-brand-slate leading-relaxed">
            By combining high-fidelity Three.js geographic data visualization with structured policy platform
            comparisons, our goal is to foster informed civic discussion and help every Filipino citizen understand
            how public preferences and policy proposals evolve across Luzon, Visayas, and Mindanao.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-brand-navy">Strict Independence</h3>
            <p className="text-xs text-brand-slate leading-relaxed">
              Non-partisan and independent. We accept no political funding, endorsements, or proprietary candidate
              sponsorships.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-brand-navy">Open Data Journalism</h3>
            <p className="text-xs text-brand-slate leading-relaxed">
              All aggregated statistical tallies, geographic breakdowns, and verified policy citations are published
              openly for public research.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-brand-border p-6 shadow-subtle space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center font-bold">
              <Vote className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-brand-navy">Voter Respect</h3>
            <p className="text-xs text-brand-slate leading-relaxed">
              Zero passwords, zero tracking trackers. Full right of vote retraction anytime through private
              cryptographic tokens.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-brand-navy to-slate-900 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold">Have your voice counted in the 2028 Survey</h3>
            <p className="text-xs text-blue-200">
              Cast your anonymous preference and view real-time nationwide results immediately.
            </p>
          </div>
          <Link
            href="/survey"
            className="px-6 py-3 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-blue-600 transition-colors shadow-card flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Cast Your Vote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
