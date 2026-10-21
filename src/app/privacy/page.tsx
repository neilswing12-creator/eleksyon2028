import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, Server, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-light pb-16">
      <div className="bg-white border-b border-brand-border py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Republic Act No. 10173 (Data Privacy Act of 2012) Compliance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-brand-navy tracking-tight">Privacy Policy &amp; Data Ethics</h1>
          <p className="text-sm text-brand-slate mt-2 leading-relaxed">
            How participant data is protected, why we do not require account registration, and how cryptographic
            hashing safeguards your anonymity.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-brand-navy">1. Information We Collect</h2>
          <p className="text-xs text-brand-slate leading-relaxed">
            In accordance with data minimization principles, we only collect information necessary to operate the
            public opinion survey:
          </p>
          <ul className="list-disc pl-5 text-xs text-brand-slate space-y-1.5">
            <li><strong>Participant Declared Name:</strong> Used to identify your submission and enable vote recovery.</li>
            <li><strong>Voluntary Location:</strong>
              <ul className="list-circle pl-5 mt-1 space-y-1 text-slate-500">
                <li><em>Within the Philippines (Domestic):</em> Optional region, province, and municipality to aggregate geographic provincial maps.</li>
                <li><em>Outside the Philippines (OFW / Overseas Filipino):</em> Declared country of residence and optional city abroad to aggregate global diaspora participation. Overseas responses are never assigned to Philippine provinces.</li>
              </ul>
            </li>
            <li><strong>Candidate Selections:</strong> Your choices for President, Vice President, and Senate.</li>
            <li><strong>Cryptographic IP Identifier:</strong> A one-way HMAC-SHA256 salted hash of your connection IP used strictly to enforce the one-vote-per-network policy. The raw IP is discarded immediately.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-brand-navy">2. What We Never Collect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {[
              "No government ID cards or PhilSys numbers",
              "No passwords or account credentials",
              "No email addresses or phone numbers",
              "No precise GPS coordinates or home addresses",
              "No advertising tracking pixels or commercial cookies",
              "No biometric or financial information",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-brand-slate p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <EyeOff className="w-4 h-4 text-brand-blue flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-brand-navy">3. Right to Vote Retraction and Rectification</h2>
          <p className="text-xs text-brand-slate leading-relaxed">
            Under Section 16 of the Data Privacy Act (Rights of the Data Subject), participants hold full authority
            to retract or modify their submissions. Upon voting, participants receive a private 64-character
            management token. Accessing this token allows immediate withdrawal of their vote from all public totals.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-brand-navy">4. Public Data Aggregation</h2>
          <p className="text-xs text-brand-slate leading-relaxed">
            All publicly viewable analytics, live ranking boards, and interactive Philippine maps display only
            aggregated statistical totals. Individual responses and individual voter names are never linked to
            their private selections in public endpoints.
          </p>
        </div>
      </div>
    </div>
  );
}
