import dns from "node:dns/promises";
import net from "node:net";

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    return (
      a === 10 || a === 127 || a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127)
    );
  }
  const v = ip.toLowerCase();
  return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80") || v.startsWith("::ffff:");
}

async function isSafeHost(hostname: string): Promise<boolean> {
  if (net.isIP(hostname)) return !isPrivateIp(hostname);
  try {
    const addrs = await dns.lookup(hostname, { all: true });
    return addrs.length > 0 && addrs.every((a) => !isPrivateIp(a.address));
  } catch {
    return false;
  }
}

export async function reachable(url: string): Promise<boolean> {
  let current = url;
  for (let hop = 0; hop < 4; hop++) {
    const u = new URL(current);
    if (u.protocol !== "https:" || !(await isSafeHost(u.hostname))) return false;
    for (const method of ["HEAD", "GET"]) {
      try {
        const r = await fetch(current, {
          method,
          redirect: "manual",
          signal: AbortSignal.timeout(6000),
          headers: { "User-Agent": "Mozilla/5.0 (compatible; FoundedRightLinkCheck/1.0)" },
        });
        if (r.status >= 300 && r.status < 400) {
          const loc = r.headers.get("location");
          if (!loc) return false;
          current = new URL(loc, current).toString();
          break; // follow redirect (re-validated at top of loop)
        }
        if (r.status < 400) return true;
        if (method === "GET") return false;
      } catch {
        if (method === "GET") return false;
      }
    }
  }
  return false;
}

/**
 * Returns a working https URL for the given AI-suggested link, or null.
 * Falls back to the site's origin if the specific page is dead.
 */
export async function verifyOrFallbackUrl(raw: unknown): Promise<string | null> {
  if (typeof raw !== "string") return null;
  let u: URL;
  try { u = new URL(raw.trim()); } catch { return null; }
  if (u.protocol !== "https:") return null;
  if (await reachable(u.toString())) return u.toString();
  if (u.pathname !== "/" && (await reachable(u.origin + "/"))) return u.origin + "/";
  return null;
}
