// Fails if an older docs version mentions a feature added after that version was released.
// The features are listed in version-features.txt; the versions come from versions.json.
//
//   node scripts/check-version-features.mjs
//
// Prints each match as file:line and exits 1 if there is any.
import fs from "node:fs";
import path from "node:path";
import {walk} from "./lib/parse-docs.mjs";

const older = (a, b) => a.localeCompare(b, undefined, {numeric: true}) < 0;

const features = fs.readFileSync("version-features.txt", "utf8").split("\n")
  .map(line => line.trim())
  .filter(line => line && !line.startsWith("#"))
  .map(line => {
    const [added, term] = line.split(/\s+/);
    return {added, term, re: new RegExp(`\\b${term}\\b`, "i")};
  });

let found = 0;
for (const version of JSON.parse(fs.readFileSync("versions.json", "utf8"))) {
  const banned = features.filter(f => older(version, f.added));
  for (const file of walk(path.join("versioned_docs", `version-${version}`))) {
    if (!file.endsWith(".md")) continue;
    fs.readFileSync(file, "utf8").split("\n").forEach((line, i) => {
      for (const f of banned) {
        if (f.re.test(line)) {
          console.log(`${file}:${i + 1}: "${f.term}" was added in ${f.added}, after ${version}`);
          found++;
        }
      }
    });
  }
}
if (found) {
  console.log(`\n${found} mention(s) of features newer than their docs version. Remove them, or check the feature really exists in that release and fix version-features.txt.`);
  process.exit(1);
}
console.log("No older docs version mentions a newer feature.");
