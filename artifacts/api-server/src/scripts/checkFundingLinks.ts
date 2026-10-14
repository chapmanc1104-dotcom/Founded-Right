// Verifies every curated federal program: URLs must load and entries must be fresh.
// Run: pnpm --filter @workspace/api-server run check:funding
// Exits non-zero if any link is dead or any entry is past the 180-day hide threshold.
import { FEDERAL_PROGRAMS } from "../data/federalPrograms";
import { reachable } from "../lib/urlCheck";

const DAY_MS = 24 * 60 * 60 * 1000;

async function main() {
  let failures = 0;
  const seen = new Set<string>();
  for (const p of FEDERAL_PROGRAMS) {
    const ageDays = Math.floor((Date.now() - new Date(p.lastVerified).getTime()) / DAY_MS);
    const age = ageDays > 180 ? "HIDDEN (>180d)" : ageDays > 90 ? "needs re-check (>90d)" : "fresh";
    if (ageDays > 180) failures++;
    for (const url of new Set([p.applyUrl, p.sourceUrl])) {
      if (seen.has(url)) continue;
      seen.add(url);
      const ok = await reachable(url);
      if (!ok) failures++;
      console.log(`${ok ? "OK  " : "FAIL"} ${p.id.padEnd(18)} ${url}`);
    }
    console.log(`     ${p.id.padEnd(18)} verified ${p.lastVerified} (${ageDays}d): ${age}`);
  }
  if (failures) {
    console.error(`\n${failures} problem(s) found. Re-check these programs on their official pages and update src/data/federalPrograms.ts.`);
    process.exit(1);
  }
  console.log("\nAll federal program links load and entries are fresh.");
}
main();
