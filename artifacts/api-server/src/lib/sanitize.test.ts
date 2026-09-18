import { test } from "node:test";
import assert from "node:assert/strict";
import {
  safeApplyUrl,
  clampText,
  clampStringArray,
  grantsSearchUrl,
  LIMITS,
} from "./sanitize";

// The apply links on the funding screen come from a language model, not an
// authoritative feed. Anything that is not demonstrably an official government
// host must be dropped — a plausible-looking but attacker-controlled or dead
// link is shown to someone about to hand over business and financial details.
test("safeApplyUrl keeps official government hosts", () => {
  for (const url of [
    "https://www.grants.gov/search-results",
    "https://www.sba.gov/funding-programs/loans",
    "https://business.maryland.gov/fund",
    "https://www.sbir.gov/about",
    "https://www.navy.mil/contracts",
  ]) {
    assert.equal(safeApplyUrl(url), url, `expected to keep ${url}`);
  }
});

test("safeApplyUrl drops everything else", () => {
  for (const url of [
    "https://grants-gov.co/apply", // lookalike domain
    "https://www.grants.gov.evil.com/apply", // suffix smuggled into a subdomain
    "https://grantfinder.example.com/apply", // ordinary commercial site
    "http://www.grants.gov/x", // not https
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "see the SBA website", // not a URL at all
    "",
    null,
    undefined,
    42,
  ]) {
    assert.equal(safeApplyUrl(url), null, `expected to drop ${String(url)}`);
  }
});

test("grantsSearchUrl escapes the program name", () => {
  const url = grantsSearchUrl('Small Business & "Innovation"');
  assert.ok(url.startsWith("https://www.grants.gov/search-grants?keywords="));
  assert.ok(!url.includes(" "));
  assert.ok(!url.includes('"'));
});

// Every value below is interpolated into a model prompt, so an unbounded string
// is an unbounded bill.
test("clampText truncates, trims, and rejects non-strings", () => {
  assert.equal(clampText("x".repeat(9999), 100).length, 100);
  assert.equal(clampText("  padded  ", 100), "padded");
  assert.equal(clampText(null, 100), "");
  assert.equal(clampText({ toString: () => "nope" }, 100), "");
});

test("clampStringArray bounds both item count and item length", () => {
  const out = clampStringArray(["a".repeat(999), ...Array(99).fill("b")], 5, 10);
  assert.equal(out.length, 5);
  assert.equal(out[0].length, 10);
  assert.deepEqual(clampStringArray("not an array"), []);
  assert.deepEqual(clampStringArray([null, "", "  ", "kept"]), ["kept"]);
});

test("chat limits stay small enough to bound per-request cost", () => {
  assert.ok(LIMITS.chatMessage <= 8000);
  assert.ok(LIMITS.chatHistoryTurns <= 20);
});
