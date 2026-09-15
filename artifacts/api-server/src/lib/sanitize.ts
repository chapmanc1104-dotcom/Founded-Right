/** Hard caps on anything a client can put into a model prompt. */
export const LIMITS = {
  chatMessage: 4000,
  chatHistoryTurns: 8,
  chatHistoryMessage: 4000,
  naicsQuery: 500,
  profileField: 500,
  missionStatement: 2000,
  arrayItems: 25,
} as const;

/** Coerces to a trimmed string and truncates to `max` characters. */
export function clampText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

/** Coerces to an array of short strings, dropping anything else. */
export function clampStringArray(
  value: unknown,
  maxItems: number = LIMITS.arrayItems as number,
  maxLen: number = LIMITS.profileField as number,
): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => clampText(v, maxLen))
    .filter(Boolean)
    .slice(0, maxItems);
}

/**
 * Government-adjacent hosts we are willing to surface as an "apply here" link.
 * Anything else the model invents is dropped rather than shown to a user who
 * is about to hand over business and financial details.
 */
const TRUSTED_SUFFIXES = [".gov", ".mil"];
const TRUSTED_HOSTS = new Set([
  "sbir.gov",
  "www.sbir.gov",
  "grants.gov",
  "www.grants.gov",
  "sam.gov",
  "www.sam.gov",
  "sba.gov",
  "www.sba.gov",
]);

/**
 * Returns the URL only when it is https and points at an official source.
 * Model-invented application links are a phishing-shaped risk and are very
 * often dead, so an unverifiable link is better replaced by a real search.
 */
export function safeApplyUrl(value: unknown): string | null {
  const raw = clampText(value, 500);
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();
  if (TRUSTED_HOSTS.has(host)) return url.toString();
  if (TRUSTED_SUFFIXES.some((suffix) => host.endsWith(suffix))) {
    return url.toString();
  }
  return null;
}

/** Grants.gov search for a program name, used when the model's link is unusable. */
export function grantsSearchUrl(programName: string): string {
  return `https://www.grants.gov/search-grants?keywords=${encodeURIComponent(programName)}`;
}
