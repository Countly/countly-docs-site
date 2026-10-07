// Turns tests/reports/latest.json (written by validate-api-docs.mjs) into a Markdown summary
// on stdout, listing every page whose endpoint failed. Exits 1 when any endpoint failed.
import fs from "node:fs";
import path from "node:path";

const report = JSON.parse(fs.readFileSync(path.join(process.cwd(), "tests", "reports", "latest.json"), "utf8"));
const {total, passed, failed, skipped} = report.summary;
const failures = report.results.filter((r) => r.live.status === "failed");
const cell = (value) => String(value || "").replaceAll("|", "\\|").replaceAll("\n", " ");

console.log("## API endpoint test");
console.log("");
console.log(`Pages: ${total}. Passed: ${passed}. Failed: ${failed}. Skipped: ${skipped}.`);
if (report.stoppedEarly) {
  console.log("");
  console.log(`Stopped early: ${cell(report.stopReason)}`);
}
const skipReasons = new Map();
for (const r of report.results.filter((r) => r.live.status === "skipped")) {
  // "Missing resolver for required parameter: widget_id" -> "Missing resolver for required parameter"
  const reason = (r.live.reason || "No reason given").split(":")[0];
  skipReasons.set(reason, (skipReasons.get(reason) || 0) + 1);
}
if (skipReasons.size) {
  console.log("");
  console.log("| Skipped because | Pages |");
  console.log("|---|---|");
  for (const [reason, count] of [...skipReasons].sort((a, b) => b[1] - a[1])) {
    console.log(`| ${cell(reason)} | ${count} |`);
  }
}
if (failures.length) {
  console.log("");
  console.log("Failing endpoints need a look: the page may describe an endpoint that changed or no longer exists, or the server may have a bug.");
  console.log("");
  console.log("| Endpoint | Page | Reason |");
  console.log("|---|---|---|");
  for (const r of failures) {
    console.log(`| \`${cell(r.endpoint)}\` | \`${cell(r.file)}\` | ${cell(r.live.reason)} |`);
  }
}
process.exitCode = failures.length ? 1 : 0;
