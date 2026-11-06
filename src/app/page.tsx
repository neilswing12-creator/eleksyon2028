"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import PhilippineResultsMap from "@/components/PhilippineResultsMap";
import GMATripleLeaderboard from "@/components/GMATripleLeaderboard";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  Globe,
  Landmark,
  Lock,
  MapPin,
  ShieldCheck,
  Users,
  Vote,
  BarChart3,
} from "@/components/icons";

const fmt = (n?: number) => (typeof n === "number" ? n.toLocaleString("en-PH") : "—");

function SectionHead({ eyebrow, title, sub, action }: { eyebrow: string; title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ph-red">{eyebrow}</p>
        <h2 className="mt-2 text-[28px] font-bold leading-tight text-ink sm:text-[32px]">{title}</h2>
        {sub && <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function MiniStanding({ label, rows }: { label: string; rows: any[] }) {
  const total = rows.reduce((a, r) => a + (r.votes || 0), 0);
  return (
    <div>
      <p className="mb-3 text-[13px] font-semibold text-ink-soft">{label}</p>
      <ol className="space-y-3">
        {rows.slice(0, 3).map((r, i) => {
          const pct = r.percentage ?? (total ? (r.votes / total) * 100 : 0);
          return (
            <li key={r.id}>
              <div className="flex items-baseline justify-between gap-3 text-[14px]">
                <span className="min-w-0 truncate font-medium text-ink">
                  <span className="mr-2 text-ink-faint tabular-nums">{i + 1}</span>
                  {r.name}
                </span>
                <span className="font-semibold tabular-nums text-ink">{Number(pct).toFixed(1)}%</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-paper">
                <div className="h-1.5 rounded-full" style={{ width: `${Math.max(2, pct)}%`, background: r.color }} />
              </div>
            </li>
          );
        })}
        {!rows.length && <li className="text-[13px] text-ink-faint">Wala pang datos.</li>}
      </ol>
    </div>
  );
}

const EXPLORE = [
  { href: "/map", icon: MapPin, title: "Mapa ng resulta", en: "Results map", body: "Tingnan ang nangunguna sa bawat lalawigan, lungsod at bayan." },
  { href: "/candidates", icon: Users, title: "Mga kandidato", en: "Candidates", body: "Talambuhay, edukasyon at mga panukalang batas mula sa Senado at Kamara." },
  { href: "/platforms", icon: BookOpen, title: "Mga plataporma", en: "Platforms", body: "Ihambing ang mga plano ng kandidato ayon sa paksa: ekonomiya, kalusugan, edukasyon at iba pa." },
  { href: "/voters", icon: BarChart3, title: "Profile ng botante", en: "Voter profile", body: "Bilang ng rehistradong botante at hatian ayon sa rehiyon at edad." },
];

const STEPS = [
  { icon: Vote, title: "Punan ang balota", body: "Itiman ang bilog sa tabi ng napili mo para Pangulo, Pangalawang Pangulo at hanggang 12 Senador." },
  { icon: Lock, title: "Isang boto bawat koneksyon", body: "Hindi namin hinihingi ang email o ID. Isang tugon lang ang tinatanggap bawat internet connection." },
  { icon: FileText, title: "Itago ang iyong link", body: "Makakatanggap ka ng pribadong link para baguhin o bawiin ang boto mo anumang oras." },
];

export default function HomePage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analytics", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then(setAnalytics)
      .catch(() => undefined);
  }, []);

  const s = analytics?.summary || {};
  const updated = s.lastUpdated ? new Date(s.lastUpdated).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" }) : null;

  return (
    <div className="bg-paper">
      {/* Hero */}
      <section className="border-b border-line bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:px-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 text-[12.5px] font-medium text-ink-soft">
              <Landmark className="h-4 w-4 text-ph-blue" />
              Halalan 2028 · Pambansang survey
            </p>
            <h1 className="mt-5 text-[40px] font-extrabold leading-[1.08] text-ink sm:text-[54px]">
              Ano ang pulso ng bayan para sa 2028?
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-soft">
              Isang malaya at walang kinikilingang survey para sa Pangulo, Pangalawang Pangulo at Senado.
              Bukas sa lahat ng Pilipino, nasa bansa man o nasa ibang bansa.
            </p>
            <p className="mt-2 max-w-xl text-[14px] text-ink-muted">
              An independent, non-partisan opinion survey for the 2028 Philippine elections. Results are voluntary responses, not official election returns.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/survey" className="inline-flex items-center gap-2 rounded-lg bg-ph-blue px-5 py-3 text-[15px] font-semibold text-white hover:bg-ph-blueDeep">
                <Vote className="h-5 w-5" /> Bumoto sa survey
              </Link>
              <Link href="/map" className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-[15px] font-semibold text-ink hover:bg-paper">
                Tingnan ang resulta <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13.5px] text-ink-soft">
              {["Walang email o ID", "Isang boto bawat koneksyon", "Puwedeng bawiin anumang oras"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Live snapshot */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-7">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-bold text-ink">Kasalukuyang resulta</p>
              <span className="rounded-md bg-paper px-2 py-1 text-[11.5px] font-medium text-ink-muted">Hindi opisyal</span>
            </div>
            <p className="mt-1 text-[12.5px] text-ink-muted">{updated ? `Huling update: ${updated}` : "Nilo-load…"}</p>
            <div className="mt-6 space-y-7">
              <MiniStanding label="Pangulo · President" rows={analytics?.presidentialRankings || []} />
              <MiniStanding label="Pangalawang Pangulo · Vice President" rows={analytics?.vicePresidentialRankings || []} />
            </div>
            <Link href="/results" className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ph-blue hover:underline">
              Buong resulta at Senado <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-4">
          {[
            { k: "Mga tugon", en: "Survey responses", v: fmt(s.totalActiveSubmissions) },
            { k: "Ngayong araw", en: "Today (PH time)", v: fmt(s.todaySubmissions) },
            { k: "Lalawigang may tugon", en: "Provinces reporting", v: s.totalProvinces ? `${s.provincesReporting} / ${s.totalProvinces}` : "—" },
            { k: "Mula sa ibang bansa", en: "Overseas Filipinos", v: fmt(s.overseasSubmissionsCount) },
          ].map((x) => (
            <div key={x.k} className="bg-white p-5 sm:p-6">
              <dt className="text-[13px] font-medium text-ink-soft">
                {x.k}
                <span className="block text-[12px] font-normal text-ink-faint">{x.en}</span>
              </dt>
              <dd className="mt-2 text-[30px] font-bold tabular-nums tracking-tight text-ink">{x.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Map */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <SectionHead
          eyebrow="Mapa"
          title="Resulta sa bawat lalawigan, lungsod at bayan"
          sub="Pumili ng rehiyon o i-click ang lalawigan para makita ang lahat ng bayan at lungsod nito."
          action={
            <Link href="/map" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-ph-blue hover:underline">
              Buksan ang buong mapa <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        {analytics ? (
          <PhilippineResultsMap
            candidates={analytics.candidates || []}
            presidentialRankings={analytics.presidentialRankings || []}
            vicePresidentialRankings={analytics.vicePresidentialRankings || []}
            senatorialRankings={analytics.senatorialRankings || []}
            provinces={analytics.provinces || []}
            regions={analytics.regions || []}
            lastUpdated={analytics.summary?.lastUpdated}
          />
        ) : (
          <div className="flex h-[560px] items-center justify-center rounded-xl border border-line bg-white text-[14px] text-ink-muted">Nilo-load ang mapa…</div>
        )}
      </section>

      {/* Standings */}
      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Talaan"
            title="Pangulo, Pangalawang Pangulo at Magic 12"
            action={
              <Link href="/results" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-ph-blue hover:underline">
                Detalyadong resulta <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <GMATripleLeaderboard
            presidentialRankings={analytics?.presidentialRankings || []}
            vicePresidentialRankings={analytics?.vicePresidentialRankings || []}
            senatorialRankings={analytics?.senatorialRankings || []}
            lastUpdated={analytics?.summary?.lastUpdated}
          />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHead eyebrow="Paano ito gumagana" title="Tatlong hakbang, wala pang limang minuto" />
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((st, i) => (
            <div key={st.title} className="rounded-2xl border border-line bg-white p-6">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ph-sky text-ph-blue">
                  <st.icon className="h-6 w-6" />
                </span>
                <span className="text-[13px] font-semibold tabular-nums text-ink-faint">0{i + 1}</span>
              </div>
              <h3 className="mt-5 text-[18px] font-bold text-ink">{st.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-muted">{st.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore */}
      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHead eyebrow="Alamin" title="Kilalanin ang mga kandidato bago bumoto" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {EXPLORE.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="group flex flex-col rounded-2xl border border-line border-t-[3px] border-t-ph-blue bg-white p-6 transition-shadow hover:shadow-soft"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ph-sky text-ph-blue">
                  <c.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-[17px] font-bold text-ink">{c.title}</h3>
                <p className="text-[12.5px] text-ink-faint">{c.en}</p>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink-muted">{c.body}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ph-blue">
                  Tingnan <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency band */}
      <section className="bg-[#111827] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:px-8">
          <div>
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ph-gold/15 text-ph-gold">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h2 className="mt-5 text-[30px] font-bold leading-tight">Bukas, malinaw at walang kinikilingan</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-slate-300">
              Ang mga panukalang batas ay kinuha mula sa opisyal na talaan ng Senado at Kamara, may link sa bawat isa.
              Basahin ang aming <Link href="/privacy" className="font-semibold text-white underline underline-offset-2">privacy notice</Link> para malaman kung paano iniingatan ang iyong tugon.
            </p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Landmark, t: "Opisyal na pinagmulan", d: "Senate LIS at House of Representatives records." },
              { icon: Lock, t: "Pribado", d: "Walang email, telepono o government ID na kailangan." },
              { icon: Globe, t: "Para sa lahat", d: "Kasama ang mga OFW at Pilipino sa ibang bansa." },
              { icon: FileText, t: "Malinaw na metodolohiya", d: "Alamin kung paano binibilang ang bawat tugon." },
            ].map((x) => (
              <li key={x.t} className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
                <x.icon className="h-6 w-6 text-ph-gold" />
                <p className="mt-3 text-[15px] font-semibold">{x.t}</p>
                <p className="mt-1 text-[13.5px] text-slate-400">{x.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
