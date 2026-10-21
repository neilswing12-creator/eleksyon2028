export interface OverseasCountry {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  region: "Middle East" | "Asia Pacific" | "North America" | "Europe" | "Latin America" | "Africa" | "Other";
  flag: string;
  isTopDestination?: boolean;
}

export const OVERSEAS_REGIONS = [
  "Middle East",
  "Asia Pacific",
  "North America",
  "Europe",
  "Latin America",
  "Africa",
  "Other",
] as const;

export const OVERSEAS_COUNTRIES: OverseasCountry[] = [
  // Top OFW / Filipino Diaspora destinations
  { code: "SA", name: "Saudi Arabia", region: "Middle East", flag: "🇸🇦", isTopDestination: true },
  { code: "AE", name: "United Arab Emirates", region: "Middle East", flag: "🇦🇪", isTopDestination: true },
  { code: "US", name: "United States", region: "North America", flag: "🇺🇸", isTopDestination: true },
  { code: "CA", name: "Canada", region: "North America", flag: "🇨🇦", isTopDestination: true },
  { code: "SG", name: "Singapore", region: "Asia Pacific", flag: "🇸🇬", isTopDestination: true },
  { code: "JP", name: "Japan", region: "Asia Pacific", flag: "🇯🇵", isTopDestination: true },
  { code: "HK", name: "Hong Kong", region: "Asia Pacific", flag: "🇭🇰", isTopDestination: true },
  { code: "QA", name: "Qatar", region: "Middle East", flag: "🇶🇦", isTopDestination: true },
  { code: "KW", name: "Kuwait", region: "Middle East", flag: "🇰🇼", isTopDestination: true },
  { code: "TW", name: "Taiwan", region: "Asia Pacific", flag: "🇹🇼", isTopDestination: true },
  { code: "GB", name: "United Kingdom", region: "Europe", flag: "🇬🇧", isTopDestination: true },
  { code: "IT", name: "Italy", region: "Europe", flag: "🇮🇹", isTopDestination: true },
  { code: "AU", name: "Australia", region: "Asia Pacific", flag: "🇦🇺", isTopDestination: true },
  { code: "KR", name: "South Korea", region: "Asia Pacific", flag: "🇰🇷", isTopDestination: true },
  { code: "MY", name: "Malaysia", region: "Asia Pacific", flag: "🇲🇾", isTopDestination: true },
  { code: "NZ", name: "New Zealand", region: "Asia Pacific", flag: "🇳🇿", isTopDestination: true },
  { code: "ES", name: "Spain", region: "Europe", flag: "🇪🇸", isTopDestination: true },
  { code: "DE", name: "Germany", region: "Europe", flag: "🇩🇪", isTopDestination: true },

  // Middle East
  { code: "BH", name: "Bahrain", region: "Middle East", flag: "🇧🇭" },
  { code: "OM", name: "Oman", region: "Middle East", flag: "🇴🇲" },
  { code: "IL", name: "Israel", region: "Middle East", flag: "🇮🇱" },
  { code: "JO", name: "Jordan", region: "Middle East", flag: "🇯🇴" },
  { code: "LB", name: "Lebanon", region: "Middle East", flag: "🇱🇧" },
  { code: "CY", name: "Cyprus", region: "Middle East", flag: "🇨🇾" },
  { code: "TR", name: "Turkey", region: "Middle East", flag: "🇹🇷" },

  // Asia Pacific
  { code: "TH", name: "Thailand", region: "Asia Pacific", flag: "🇹🇭" },
  { code: "MO", name: "Macau", region: "Asia Pacific", flag: "🇲🇴" },
  { code: "BN", name: "Brunei", region: "Asia Pacific", flag: "🇧🇳" },
  { code: "ID", name: "Indonesia", region: "Asia Pacific", flag: "🇮🇩" },
  { code: "VN", name: "Vietnam", region: "Asia Pacific", flag: "🇻🇳" },
  { code: "CN", name: "China", region: "Asia Pacific", flag: "🇨🇳" },
  { code: "PG", name: "Papua New Guinea", region: "Asia Pacific", flag: "🇵🇬" },
  { code: "GU", name: "Guam (USA)", region: "Asia Pacific", flag: "🇬🇺" },
  { code: "MP", name: "Northern Mariana Islands (Saipan)", region: "Asia Pacific", flag: "🇲🇵" },
  { code: "KH", name: "Cambodia", region: "Asia Pacific", flag: "🇰🇭" },
  { code: "IN", name: "India", region: "Asia Pacific", flag: "🇮🇳" },

  // Europe
  { code: "FR", name: "France", region: "Europe", flag: "🇫🇷" },
  { code: "NL", name: "Netherlands", region: "Europe", flag: "🇳🇱" },
  { code: "CH", name: "Switzerland", region: "Europe", flag: "🇨🇭" },
  { code: "IE", name: "Ireland", region: "Europe", flag: "🇮🇪" },
  { code: "NO", name: "Norway", region: "Europe", flag: "🇳🇴" },
  { code: "SE", name: "Sweden", region: "Europe", flag: "🇸🇪" },
  { code: "DK", name: "Denmark", region: "Europe", flag: "🇩🇰" },
  { code: "AT", name: "Austria", region: "Europe", flag: "🇦🇹" },
  { code: "BE", name: "Belgium", region: "Europe", flag: "🇧🇪" },
  { code: "PL", name: "Poland", region: "Europe", flag: "🇵🇱" },
  { code: "GR", name: "Greece", region: "Europe", flag: "🇬🇷" },
  { code: "PT", name: "Portugal", region: "Europe", flag: "🇵🇹" },
  { code: "FI", name: "Finland", region: "Europe", flag: "🇫🇮" },
  { code: "CZ", name: "Czech Republic", region: "Europe", flag: "🇨🇿" },
  { code: "HU", name: "Hungary", region: "Europe", flag: "🇭🇺" },
  { code: "MT", name: "Malta", region: "Europe", flag: "🇲🇹" },
  { code: "IS", name: "Iceland", region: "Europe", flag: "🇮🇸" },
  { code: "RO", name: "Romania", region: "Europe", flag: "🇷🇴" },

  // Americas
  { code: "MX", name: "Mexico", region: "North America", flag: "🇲🇽" },
  { code: "BR", name: "Brazil", region: "Latin America", flag: "🇧🇷" },
  { code: "AR", name: "Argentina", region: "Latin America", flag: "🇦🇷" },
  { code: "CL", name: "Chile", region: "Latin America", flag: "🇨🇱" },
  { code: "PA", name: "Panama", region: "Latin America", flag: "🇵🇦" },
  { code: "CO", name: "Colombia", region: "Latin America", flag: "🇨🇴" },

  // Africa
  { code: "ZA", name: "South Africa", region: "Africa", flag: "🇿🇦" },
  { code: "EG", name: "Egypt", region: "Africa", flag: "🇪🇬" },
  { code: "NG", name: "Nigeria", region: "Africa", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", region: "Africa", flag: "🇰🇪" },
  { code: "GH", name: "Ghana", region: "Africa", flag: "🇬🇭" },

  // Other / Global Seafarers
  { code: "SEA", name: "International Maritime (Seafarer / Cruise)", region: "Other", flag: "🚢" },
  { code: "OTHER", name: "Other Country Not Listed", region: "Other", flag: "🌐" },
];

const countryMap = new Map<string, OverseasCountry>();
OVERSEAS_COUNTRIES.forEach((c) => {
  countryMap.set(c.code.toUpperCase(), c);
});

export function getCountryByCode(code?: string | null): OverseasCountry | undefined {
  if (!code) return undefined;
  return countryMap.get(code.toUpperCase());
}

export function isValidCountryCode(code?: string | null): boolean {
  if (!code) return false;
  return countryMap.has(code.toUpperCase());
}

export function searchOverseasCountries(query: string): OverseasCountry[] {
  const q = (query || "").toLowerCase().trim();
  if (!q) return OVERSEAS_COUNTRIES;
  return OVERSEAS_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q)
  );
}
