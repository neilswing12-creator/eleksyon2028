import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PHILIPPINE_PROVINCES, getCitiesForProvince } from "@/lib/philippines-geo";

export const dynamic = "force-dynamic";

type Position = "PRESIDENT" | "VICE_PRESIDENT" | "SENATOR";

/**
 * City / municipality breakdown for one province: response counts and per-candidate
 * selections for every PSGC city or municipality, so the map can drill down past provinces.
 * Only raw survey responses are counted here (administrative adjustments are national,
 * regional or provincial and are never attributed to a town).
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const province = PHILIPPINE_PROVINCES.find((p) => p.id === params.id);
  if (!province) {
    return NextResponse.json({ error: "Unknown province." }, { status: 404 });
  }

  const campaign = await prisma.surveyCampaign.findFirst({
    where: { status: { in: ["ACTIVE", "PAUSED", "CLOSED"] } },
    orderBy: { createdAt: "desc" },
  });
  if (campaign && (!campaign.publicResultsVisible || !campaign.geographicResultsVisible)) {
    return NextResponse.json({ provinceId: province.id, hidden: true, cities: [] });
  }
  const minThreshold = Math.max(1, campaign?.minResponseThreshold ?? 1);

  const submissions = await prisma.surveySubmission.findMany({
    where: {
      status: "ACTIVE",
      provinceId: province.id,
      ...(campaign ? { campaignId: campaign.id } : {}),
    },
    select: {
      cityId: true,
      cityName: true,
      selections: { select: { candidateId: true, position: true } },
    },
  });

  const cities = getCitiesForProvince(province.id);
  const byPsgc = new Map(cities.map((c) => [c.psgc, c]));
  // Older responses saved short names ("Makati", "Caloocan"); compare without "City".
  const key = (n: string) => n.toLowerCase().replace(/^city of /, "").replace(/ city$/, "").trim();
  const byName = new Map(cities.map((c) => [key(c.name), c]));

  type Tally = { responses: number; votes: Record<Position, Record<string, number>> };
  const empty = (): Tally => ({ responses: 0, votes: { PRESIDENT: {}, VICE_PRESIDENT: {}, SENATOR: {} } });
  const tallies = new Map<string, Tally>();
  let unspecified = 0;

  for (const s of submissions) {
    // Older responses stored the city name in both fields; newer ones store the PSGC code.
    const city =
      (s.cityId && byPsgc.get(s.cityId)) ||
      (s.cityName && byName.get(key(s.cityName))) ||
      (s.cityId && byName.get(key(s.cityId)));
    if (!city) {
      unspecified++;
      continue;
    }
    const t = tallies.get(city.psgc) || empty();
    t.responses++;
    for (const sel of s.selections) {
      const pos = sel.position as Position;
      if (!t.votes[pos]) continue;
      t.votes[pos][sel.candidateId] = (t.votes[pos][sel.candidateId] || 0) + 1;
    }
    tallies.set(city.psgc, t);
  }

  return NextResponse.json({
    provinceId: province.id,
    minResponseThreshold: minThreshold,
    unspecifiedCityResponses: unspecified,
    cities: cities.map((c) => {
      const t = tallies.get(c.psgc);
      const sufficient = !!t && t.responses >= minThreshold;
      return {
        psgc: c.psgc,
        name: c.name,
        type: c.type,
        responses: t?.responses || 0,
        hasSufficientData: sufficient,
        // Below the threshold only the count is shown, never the split, to protect privacy.
        votes: sufficient ? t!.votes : null,
      };
    }),
  });
}
