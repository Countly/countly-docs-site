// Fails if a docs page links to a page that does not exist, for example a page the
// drift check deleted. Pages link to each other with relative .md paths
// ("./surveys/index.md", "../cohorts/index.md#overview"), so each such link must point
// to a file. A link that is neither a web link nor a .md path is reported too.
//
//   node scripts/check-doc-links.mjs <docs folder>...
//   node scripts/check-doc-links.mjs docs
//   node scripts/check-doc-links.mjs versioned_docs/version-24.05
//
// Prints each broken link as file:line: link and exits 1 if there is any.
import fs from "node:fs";
import path from "node:path";
import {walk} from "./lib/parse-docs.mjs";

const dirs = process.argv.slice(2);
if (!dirs.length) {
  console.error("Usage: node scripts/check-doc-links.mjs <docs folder>...");
  process.exit(2);
}

const broken = [];
for (const dir of dirs) {
  for (const file of walk(dir).filter(f => /\.mdx?$/.test(f))) {
    let inCode = false;
    fs.readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inCode = !inCode;
        return;
      }
      if (inCode) {
        return;
      }
      // Links inside `inline code` are examples, not links.
      const text = line.replace(/`[^`]*`/g, "");
      for (const [, raw] of text.matchAll(/\]\(([^)\s]+)[^)]*\)/g)) {
        if (/^(https?:|mailto:|#)/.test(raw)) {
          continue;
        }
        const target = decodeURIComponent(raw.split("#")[0]);
        const ok = /\.mdx?$/.test(target) && !target.startsWith("/")
          && fs.existsSync(path.resolve(path.dirname(file), target));
        if (!ok) {
          broken.push(`${file}:${i + 1}: ${raw}`);
        }
      }
    });
  }
}

if (broken.length) {
  console.log(broken.join("\n"));
  process.exit(1);
}
console.log("No broken links.");
