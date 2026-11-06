"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Info } from "@/components/icons";

export interface BallotCandidate {
  id: string;
  slug: string;
  name: string;
  position: "PRESIDENT" | "VICE_PRESIDENT" | "SENATOR";
  party: string | null;
  color: string;
}

const SUFFIXES = /^(Jr\.?|Sr\.?|II|III|IV|V)$/;
const PARTICLES = /^(de|dela|del|delos|de los|de la|san|sta\.?|sto\.?)$/i;

/**
 * Ballot-style name, the way Filipino ballots print it: "ROBREDO, LENI".
 * Uses the quoted nickname when there is one ("Maria Leonor 'Leni' Robredo").
 */
export function ballotName(full: string) {
  const nick = full.match(/['"‘’“”]([^'"‘’“”]+)['"‘’“”]/)?.[1];
  const words = full
    .replace(/['"‘’“”][^'"‘’“”]+['"‘’“”]/, " ")
    .split(/\s+/)
    .filter((w) => w && !/^[A-Z]\.$/.test(w));
  const suffix = words.length > 2 && SUFFIXES.test(words[words.length - 1]) ? words.pop() : "";
  let surnameStart = words.length - 1;
  while (surnameStart > 1 && PARTICLES.test(words[surnameStart - 1])) surnameStart--;
  const surname = words.slice(surnameStart).join(" ");
  const given = nick || words.slice(0, Math.max(1, surnameStart)).join(" ");
  return `${surname}${suffix ? ` ${suffix}` : ""}, ${given}`.toUpperCase();
}

/** "Liberal / Angat Buhay" -> "LP"-style short party label for the ballot line. */
export function partyAbbr(party: string | null) {
  if (!party) return "IND";
  const inParens = party.match(/\(([^)]+)\)/)?.[1];
  if (inParens) return inParens.toUpperCase();
  const first = party.split(/[\/,]/)[0].trim();
  if (/^independent$/i.test(first)) return "IND";
  if (/^liberal/i.test(first)) return "LP";
  const letters = first
    .split(/[\s-]+/)
    .filter((w) => w && !/^(ng|sa|of|the|and|para|at)$/i.test(w))
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return letters.length >= 2 ? letters.slice(0, 6) : first.slice(0, 6).toUpperCase();
}

function surnameKey(c: BallotCandidate) {
  return ballotName(c.name);
}

function Oval({ filled, inline = false }: { filled: boolean; inline?: boolean }) {
  return (
    <svg viewBox="0 0 30 18" className={`${inline ? "inline-block align-[-3px] mx-0.5" : ""} h-[18px] w-[30px] shrink-0`} aria-hidden>
      <ellipse cx="15" cy="9" rx="13.5" ry="7.5" fill={filled ? "#111827" : "#FFFFFF"} stroke="#111827" strokeWidth="1.5" />
    </svg>
  );
}

function BallotLine({
  number,
  candidate,
  selected,
  disabled,
  onToggle,
  inputType,
  groupName,
}: {
  number: number;
  candidate: BallotCandidate;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
  inputType: "radio" | "checkbox";
  groupName: string;
}) {
  return (
    <label
      className={`group flex min-h-[44px] items-center gap-2.5 border-b border-dotted border-slate-300 px-2 py-1.5 ${
        disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer hover:bg-amber-50"
      } ${selected ? "bg-amber-50" : ""}`}
    >
      <input
        type={inputType}
        name={groupName}
        checked={selected}
        disabled={disabled}
        onChange={onToggle}
        className="peer sr-only"
      />
      <span className="w-6 shrink-0 text-right font-mono text-xs text-ink-muted">{number}</span>
      <span className="rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-[#0038A8] peer-focus-visible:ring-offset-1">
        <Oval filled={selected} />
      </span>
      <span className="min-w-0 flex-1 text-[13px] leading-tight text-ink">
        <span className="font-semibold tracking-wide">{ballotName(candidate.name)}</span>{" "}
        <span className="text-ink-muted">({partyAbbr(candidate.party)})</span>
      </span>
      <Link
        href={`/candidates/${candidate.slug}`}
        target="_blank"
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 rounded p-1 text-slate-300 hover:bg-white hover:text-[#0038A8]"
        aria-label={`Profile of ${candidate.name}`}
        title="Tingnan ang profile · View profile"
      >
        <Info className="h-3.5 w-3.5" />
      </Link>
    </label>
  );
}

function SectionHeader({ en, fil, rule }: { en: string; fil: string; rule: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 bg-[#111827] px-3 py-2 text-white">
      <p className="text-sm font-bold uppercase tracking-wider">
        {en} <span className="font-normal normal-case text-slate-300">/ {fil}</span>
      </p>
      <p className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-amber-300">{rule}</p>
    </div>
  );
}

export default function SurveyBallot({
  candidates,
  president,
  vicePresident,
  senators,
  maxSenators = 12,
  onPresident,
  onVicePresident,
  onToggleSenator,
}: {
  candidates: BallotCandidate[];
  president: string;
  vicePresident: string;
  senators: string[];
  maxSenators?: number;
  onPresident: (id: string) => void;
  onVicePresident: (id: string) => void;
  onToggleSenator: (id: string) => void;
}) {
  const sorted = useMemo(() => {
    const by = (pos: BallotCandidate["position"]) =>
      candidates.filter((c) => c.position === pos).sort((a, b) => surnameKey(a).localeCompare(surnameKey(b)));
    return { pres: by("PRESIDENT"), vp: by("VICE_PRESIDENT"), sen: by("SENATOR") };
  }, [candidates]);

  const full = senators.length >= maxSenators;

  return (
    <div className="border-2 border-[#111827] bg-white shadow-[6px_6px_0_0_rgba(17,24,39,0.12)]">
      {/* Ballot head */}
      <div className="border-b-2 border-[#111827] px-4 py-4 text-center sm:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-muted">Eleksyon 2028 · Pambansang Survey</p>
        <h2 className="mt-1 text-2xl font-bold text-[#111827]">Balota ng Survey</h2>
        <p className="mt-1 text-xs text-ink-soft">
          Eleksyon 2028 opinion survey. <strong>Hindi ito opisyal na balota ng COMELEC</strong> · This is not an official ballot.
        </p>
      </div>

      {/* Instructions */}
      <div className="border-b border-slate-300 bg-slate-50 px-4 py-3 text-xs text-ink-soft sm:px-6">
        <p>
          <strong>Panuto:</strong> Itiman ang bilog <Oval filled inline /> sa tabi ng pangalan ng iyong napili. Puwedeng iwanang blangko
          ang isang posisyon.
        </p>
        <p className="mt-0.5 text-ink-muted">
          Instructions: shade the oval beside the name of your choice. You may leave a position blank.
        </p>
      </div>

      <div className="grid gap-0 md:grid-cols-2">
        <section className="border-b border-slate-300 md:border-r">
          <SectionHeader en="President" fil="Pangulo" rule="Vote for 1" />
          <div role="radiogroup" aria-label="President">
            {sorted.pres.map((c, i) => (
              <BallotLine
                key={c.id}
                number={i + 1}
                candidate={c}
                groupName="president"
                inputType="radio"
                selected={president === c.id}
                disabled={false}
                onToggle={() => onPresident(president === c.id ? "" : c.id)}
              />
            ))}
          </div>
          {president && (
            <button onClick={() => onPresident("")} className="px-3 py-2 text-[11px] text-ink-muted underline hover:text-ink">
              Burahin ang pinili · Clear
            </button>
          )}
        </section>

        <section className="border-b border-slate-300">
          <SectionHeader en="Vice-President" fil="Pangalawang Pangulo" rule="Vote for 1" />
          <div role="radiogroup" aria-label="Vice-President">
            {sorted.vp.map((c, i) => (
              <BallotLine
                key={c.id}
                number={i + 1}
                candidate={c}
                groupName="vice-president"
                inputType="radio"
                selected={vicePresident === c.id}
                disabled={false}
                onToggle={() => onVicePresident(vicePresident === c.id ? "" : c.id)}
              />
            ))}
          </div>
          {vicePresident && (
            <button onClick={() => onVicePresident("")} className="px-3 py-2 text-[11px] text-ink-muted underline hover:text-ink">
              Burahin ang pinili · Clear
            </button>
          )}
        </section>
      </div>

      <section>
        <SectionHeader en="Senator" fil="Senador" rule={`Vote for not more than ${maxSenators}`} />
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-300 bg-white/95 px-3 py-2 text-xs backdrop-blur">
          <span className="text-ink-soft">
            Napili: <strong className="tabular-nums text-ink">{senators.length}</strong> / {maxSenators}
          </span>
          {full ? (
            <span className="font-semibold text-[#CE1126]">Puno na · Limit reached</span>
          ) : (
            <span className="text-ink-faint">{maxSenators - senators.length} pa ang puwede</span>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Senators">
          {sorted.sen.map((c, i) => {
            const selected = senators.includes(c.id);
            return (
              <div key={c.id} className="sm:border-r sm:border-line">
                <BallotLine
                  number={i + 1}
                  candidate={c}
                  groupName="senator"
                  inputType="checkbox"
                  selected={selected}
                  disabled={!selected && full}
                  onToggle={() => onToggleSenator(c.id)}
                />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/** Review step styled like the printed voter's receipt. */
export function BallotReceipt({
  candidates,
  president,
  vicePresident,
  senators,
  voterLine,
  locationLine,
}: {
  candidates: BallotCandidate[];
  president: string;
  vicePresident: string;
  senators: string[];
  voterLine: string;
  locationLine: string;
}) {
  const byId = new Map(candidates.map((c) => [c.id, c]));
  const line = (id: string) => {
    const c = byId.get(id);
    return c ? `${ballotName(c.name)} (${partyAbbr(c.party)})` : "";
  };
  const senList = senators
    .map((id) => byId.get(id))
    .filter(Boolean)
    .sort((a, b) => surnameKey(a!).localeCompare(surnameKey(b!))) as BallotCandidate[];

  return (
    <div className="mx-auto w-full max-w-sm bg-[#FFFEF8] px-5 py-6 font-mono text-[12px] leading-relaxed text-ink shadow-[0_1px_0_#e5e7eb,0_10px_30px_-12px_rgba(0,0,0,0.25)]">
      <p className="text-center font-bold tracking-widest">ELEKSYON 2028</p>
      <p className="text-center">RESIBO NG SURVEY</p>
      <p className="text-center text-[10px] text-ink-muted">HINDI OPISYAL · NOT AN OFFICIAL RECEIPT</p>
      <div className="my-3 border-t border-dashed border-slate-400" />
      <p className="truncate">BOTANTE: {voterLine.toUpperCase()}</p>
      <p className="truncate">LUGAR: {locationLine.toUpperCase()}</p>
      <div className="my-3 border-t border-dashed border-slate-400" />

      <p className="font-bold">PRESIDENT</p>
      <p className="pl-3">{president ? line(president) : "— WALANG PINILI —"}</p>
      <p className="mt-2 font-bold">VICE-PRESIDENT</p>
      <p className="pl-3">{vicePresident ? line(vicePresident) : "— WALANG PINILI —"}</p>
      <p className="mt-2 font-bold">SENATOR ({senList.length}/12)</p>
      {senList.length ? (
        senList.map((c, i) => (
          <p key={c.id} className="pl-3">
            {String(i + 1).padStart(2, "0")} {ballotName(c.name)} ({partyAbbr(c.party)})
          </p>
        ))
      ) : (
        <p className="pl-3">— WALANG PINILI —</p>
      )}
      <div className="my-3 border-t border-dashed border-slate-400" />
      <p className="text-center text-[10px] text-ink-muted">Suriin bago isumite · Check before submitting</p>
    </div>
  );
}
