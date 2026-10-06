#!/usr/bin/env node
/**
 * platform-log.mjs -- `git log` over the countly-platform checkout, for the
 * docs-drift reviewer.
 *
 * Usage: node scripts/platform-log.mjs [log options] [-- paths]
 *
 * The reviewer may search history but must not be able to write files or run
 * anything, and plain `git log` can do both (--output, --ext-diff). So only the
 * options a source search needs are passed through, and anything else is
 * refused before git runs.
 */
import {execFileSync} from "node:child_process";

const PLATFORM = "countly-platform";
const VALUE_OPTIONS = /^(-S|-G|--since=|--until=|--after=|--before=|--format=|--pretty=|--date=|--diff-filter=|--grep=|--author=|-n)/;
const FLAG_OPTIONS = new Set([
  "--oneline", "--reverse", "--name-only", "--name-status", "--stat", "--follow",
  "--first-parent", "--merges", "--no-merges", "-p", "-i", "--regexp-ignore-case",
]);

const args = process.argv.slice(2);
let afterSeparator = false;
for (const arg of args) {
  if (afterSeparator) {
    if (arg.startsWith("-")) {
      fail(`a path may not start with "-": ${arg}`);
    }
    continue;
  }
  if (arg === "--") {
    afterSeparator = true;
  }
  else if (/^-\d+$/.test(arg) || FLAG_OPTIONS.has(arg) || VALUE_OPTIONS.test(arg)) {
    continue;
  }
  else if (arg.startsWith("-")) {
    fail(`option not allowed: ${arg}`);
  }
}

process.stdout.write(execFileSync("git", ["-C", PLATFORM, "log", ...args], {encoding: "utf8", maxBuffer: 1 << 26}));

function fail(message) {
  console.error(`platform-log: ${message}`);
  process.exit(2);
}
