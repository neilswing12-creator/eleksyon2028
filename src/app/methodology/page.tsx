import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, AlertTriangle, FileText, Vote, MapPin, Users } from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      <div className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Research Transparency &amp; Survey Governance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B1E36] tracking-tight">
            Survey Methodology &amp; Integrity Framework
          </h1>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Detailed disclosure of sampling parameters, abuse deterrence mechanisms, IP hashing rules, and vote
            retraction architecture for the Philippine 2028 National Election Survey.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Important Disclaimer Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>Official Non-Affiliation Disclaimer</span>
          </div>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            This platform is an independent public opinion research initiative. It is not affiliated with,
            endorsed by, or connected to the Commission on Elections (COMELEC) or any Philippine government
            agency. Results reflect voluntary responses submitted by online participants and do not constitute
            certified official election results or scientific probability forecasts.
          </p>
        </div>

        {/* 1. Anonymous Participation */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-[#0B1E36] flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>1. Anonymous Registration-Free Voting</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            To ensure complete accessibility and remove participation barriers, users are not required to create
            accounts, provide email addresses, phone numbers, passwords, or government-issued identification.
            Participants provide their declared name (or pseudonym) and optional geographic location (region,
            province, and municipality).
          </p>
        </div>

        {/* 2. One Active Vote Per IP Address */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-[#0B1E36] flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            <span>2. IP-Based Duplicate Abuse Prevention</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            To discourage automated vote stuffing and repetitive submissions, the system enforces a policy of
            <strong> one active survey submission per public IP address per campaign</strong>.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2">
            <div className="font-semibold text-[#0B1E36]">Cryptographic HMAC-SHA-256 IP Hashing:</div>
            <p className="leading-relaxed">
              Participant IP addresses are never saved in plain text or shared. Incoming IP addresses are
              immediately transformed into a one-way cryptographic hash using HMAC-SHA-256 with a private server
              salt. Only this derived hash is stored to verify uniqueness.
            </p>
            <div className="font-semibold text-[#0B1E36] pt-2">Shared Network Notice:</div>
            <p className="leading-relaxed">
              Because public IP addresses may be shared by households, universities, mobile telecom carrier CGNAT
              gateways, and office networks, an IP restriction is strictly an abuse-deterrent measure and does not
              represent verified proof of unique biological identity.
            </p>
          </div>
        </div>

        {/* 3. Vote Retraction & Private Management Tokens */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-[#0B1E36] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>3. Vote Retraction and Private Management Tokens</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Voters have the right to change their mind. After submitting, a cryptographically secure, high-entropy
            random 64-character token is generated. Only a SHA-256 hash of this token is stored in the database.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            The voter is provided with a private link (<code className="bg-slate-100 px-1 py-0.5 rounded">/survey/manage/[token]</code>).
            When a vote is retracted:
          </p>
          <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
            <li>Its status is updated atomically to <code className="bg-slate-100 px-1 py-0.5 rounded">RETRACTED</code>.</li>
            <li>It immediately ceases to contribute to all public rankings, percentages, and choropleth maps.</li>
            <li>All live analytics recalculate active totals in real time.</li>
          </ul>
        </div>

        {/* 4. Senatorial Slate Calculation Rules */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-[#0B1E36] flex items-center gap-2">
            <Vote className="w-5 h-5 text-blue-600" />
            <span>4. Senatorial Slate Selection Rules</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            In accordance with Philippine Senate electoral rules, participants may select <strong>up to 12</strong>
            senatorial candidates. Selection percentages in Senate charts represent the proportion of participating
            voters who selected that candidate, rather than dividing by total candidate selections.
          </p>
        </div>

        {/* 5. Geographic Thresholds */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-[#0B1E36] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <span>5. Geographic Sample Thresholds</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Provinces with fewer responses than the administrator-configured minimum response threshold are marked
            with an &quot;Insufficient Sample&quot; advisory, reminding viewers that provisional sample sizes should
            not be generalized as provincial consensus.
          </p>
        </div>
      </div>
    </div>
  );
}
