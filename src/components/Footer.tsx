import Link from "next/link";
import { ExternalLink } from "@/components/icons";

const COLS = [
  {
    title: "Survey",
    links: [
      { href: "/survey", label: "Bumoto sa survey" },
      { href: "/results", label: "Resulta" },
      { href: "/map", label: "Mapa" },
      { href: "/voters", label: "Profile ng botante" },
    ],
  },
  {
    title: "Kandidato",
    links: [
      { href: "/candidates", label: "Lahat ng kandidato" },
      { href: "/platforms", label: "Mga plataporma" },
    ],
  },
  {
    title: "Tungkol",
    links: [
      { href: "/about", label: "Tungkol sa amin" },
      { href: "/methodology", label: "Metodolohiya" },
      { href: "/privacy", label: "Privacy notice" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <img src="/e28-logo.svg" alt="" width={40} height={40} className="h-10 w-10" />
              <span className="text-[17px] font-bold text-ink">
                Eleksyon <span className="text-ph-blue">2028</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink-muted">
              Isang malayang survey ng opinyon publiko para sa Halalan 2028. Hindi ito kaugnay ng COMELEC o anumang ahensya ng pamahalaan,
              at ang mga resulta ay hindi opisyal na bilang ng boto.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="text-[13px] font-semibold text-ink">{c.title}</p>
                <ul className="mt-3 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[14px] text-ink-muted hover:text-ph-blue">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="text-[13px] font-semibold text-ink">Opisyal na sanggunian</p>
              <ul className="mt-3 space-y-2.5">
                {[
                  { href: "https://comelec.gov.ph", label: "COMELEC" },
                  { href: "https://senate.gov.ph", label: "Senado" },
                  { href: "https://www.congress.gov.ph", label: "Kamara" },
                  { href: "https://psa.gov.ph", label: "PSA" },
                ].map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[14px] text-ink-muted hover:text-ph-blue">
                      {l.label} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-[12.5px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Eleksyon 2028 · Malayang proyekto ng civic tech</p>
          <p>Mga hangganan sa mapa: PSGC boundaries via faeldon/philippines-json-maps (MIT).</p>
        </div>
      </div>
    </footer>
  );
}
