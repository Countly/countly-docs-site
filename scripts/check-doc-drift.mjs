// Compares the classic API endpoints (/i/..., /o/...) defined in countly-platform with the
// endpoint pages in docs/api/. /v2 routes are out of scope.
//
//   node scripts/check-doc-drift.mjs [path-to-countly-platform]   (default: ./countly-platform)
//
// Writes drift-report/drift.json and drift-report/drift.md:
//   missing  endpoints the code handles that no page documents
//   removed  pages whose endpoint no longer appears anywhere in the code
// Endpoints listed in docs-drift-ignore.txt are left out of both lists.
import fs from "node:fs";
import path from "node:path";
import {parseDoc, walk} from "./lib/parse-docs.mjs";

const ROOT = process.cwd();
const PLATFORM = path.resolve(process.argv[2] || "countly-platform");
const OUT_DIR = path.join(ROOT, "drift-report");
const IGNORE_FILE = path.join(ROOT, "docs-drift-ignore.txt");
const CORE_ROUTER = "api/utils/requestProcessor.js";

const QUOTED = "['\"`]([^'\"`]+)['\"`]";
const METHOD_EXPR = /qstring\.method\b|qstring\[['"]method['"]\]/;
const SEGMENT_EXPR = /paths\[3\]/;
const SUBSEGMENT_EXPR = /paths\[4\]/;
const COMPARISONS = [
  new RegExp(`(?<!typeof\\s+)(qstring\\.method|paths\\[[34]\\])\\s*[!=]==?\\s*${QUOTED}`, "g"),
  new RegExp(`${QUOTED}\\s*[!=]==?\\s*[\\w.]*(qstring\\.method|paths\\[[34]\\])`, "g"),
];
const exprKind = (expr) => (METHOD_EXPR.test(expr) ? "method" : SEGMENT_EXPR.test(expr) ? "segment" : SUBSEGMENT_EXPR.test(expr) ? "subsegment" : null);

// Source files that can define classic API routes: core api/ and plugins/*/api/, minus v2, tests and deps.
function codeFiles() {
  const files = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      if (["node_modules", "v2", "test", "tests", "frontend"].includes(entry.name)) {
        continue;
      }
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        visit(full);
      }
      // aggregator.* files register internal pipeline hooks, not HTTP endpoints.
      else if (/\.(js|ts)$/.test(entry.name) && !/\.(d|test|spec)\.ts$/.test(entry.name) && !/^aggregator\./.test(entry.name)) {
        files.push(full);
      }
    }
  };
  visit(path.join(PLATFORM, "api"));
  for (const plugin of fs.readdirSync(path.join(PLATFORM, "plugins"))) {
    const apiDir = path.join(PLATFORM, "plugins", plugin, "api");
    if (fs.existsSync(apiDir)) {
      visit(apiDir);
    }
  }
  return files;
}

// Net brace depth change of a line, ignoring braces inside strings and comments.
function braceDelta(line, state) {
  let delta = 0;
  let quote = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (state.inComment) {
      if (ch === "*" && line[i + 1] === "/") {
        state.inComment = false;
        i++;
      }
      continue;
    }
    if (quote) {
      if (ch === "\\") {
        i++;
      }
      else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === "/" && line[i + 1] === "/") {
      break;
    }
    if (ch === "/" && line[i + 1] === "*") {
      state.inComment = true;
      i++;
    }
    else if (ch === "'" || ch === "\"" || ch === "`") {
      quote = ch;
    }
    else if (ch === "{") {
      delta++;
    }
    else if (ch === "}") {
      delta--;
    }
  }
  return delta;
}

const stringConstants = (text) => Object.fromEntries([...text.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*['"]([\w-]+)['"]/g)].map((m) => [m[1], m[2]]));

// Finds routes in one file. Core routes come from `switch (apiPath)` in the request processor,
// plugin routes from plugins.register("/i/..."|"/o/..."). Inside either, `switch`es and
// comparisons on params.qstring.method or paths[3] split a route into its sub-endpoints.
function extractRoutes(file, hookPaths, sharedConstants) {
  const rel = path.relative(PLATFORM, file);
  const isCore = rel === CORE_ROUTER;
  const text = fs.readFileSync(file, "utf8");
  // Resolves `/o/${FEATURE_NAME}/x` against `const FEATURE_NAME = "name"` in the same file.
  const constants = {...sharedConstants, ...stringConstants(text)};
  const resolve = (value) => value.replace(/\$\{(\w+)\}/g, (all, name) => constants[name] ?? all);
  const lines = text.split("\n");
  const routes = [];
  const stack = [];
  const state = {inComment: false};
  let depth = 0;

  const currentRoute = () => {
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i].route) {
        return stack[i].route;
      }
    }
    return null;
  };
  const addVariant = (route, kind, value, lineNo) => {
    if (!/^[\w.-]+$/.test(value) || value === "undefined" || value === "null") {
      return;
    }
    // paths[3] and paths[4] are the 3rd and 4th URL segments. A wildcard stands for a
    // segment the code reads into a variable, e.g. /o/surveys/*/data.
    const segments = route.path.split("/").filter(Boolean);
    let variantPath = route.path;
    if (kind === "segment") {
      if (segments.length !== 2) {
        return;
      }
      variantPath = `${route.path}/${value}`;
    }
    else if (kind === "subsegment") {
      const parentCase = [...stack].reverse().find((entry) => entry.kind === "segment" && entry.currentCase)?.currentCase;
      if (segments.length === 2) {
        variantPath = `${route.path}/${parentCase || "*"}/${value}`;
      }
      else if (segments.length === 3) {
        variantPath = `${route.path}/${value}`;
      }
      else {
        return;
      }
    }
    route.variants.push({
      path: variantPath,
      method: kind === "method" ? value : null,
      line: lineNo,
    });
  };

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    const delta = braceDelta(line, state);

    const register = !isCore && line.match(new RegExp(`plugins\\.register\\(\\s*${QUOTED}`));
    const switchMatch = line.match(/^\s*switch\s*\((.+)\)\s*\{/);
    const caseMatch = line.match(new RegExp(`^\\s*case\\s+${QUOTED}\\s*:`));

    const registered = register && resolve(register[1]);
    if (registered && /^\/(i|o)(\/|$)/.test(registered) && !registered.includes("${")) {
      const route = {path: registered.replace(/\/+$/, "") || registered, line: lineNo, variants: [], hook: [...hookPaths].some((h) => h === registered || (h.length > 1 && h.endsWith("/") && registered.startsWith(h)))};
      routes.push(route);
      if (delta > 0) {
        stack.push({depth, route});
      }
    }
    else if (switchMatch) {
      const expr = switchMatch[1];
      const kind = isCore && /\bapiPath\b/.test(expr) ? "base" : exprKind(expr);
      stack.push({depth, kind, switchOwner: true});
    }
    else if (caseMatch) {
      const owner = [...stack].reverse().find((entry) => entry.switchOwner);
      if (owner?.kind === "base" && /^\/(i|o)(\/|$)/.test(caseMatch[1])) {
        owner.route = {path: caseMatch[1], line: lineNo, variants: [], hook: false};
        routes.push(owner.route);
      }
      else if (owner?.kind && owner.kind !== "base") {
        const route = currentRoute();
        if (owner.kind === "segment") {
          owner.currentCase = caseMatch[1];
        }
        if (route) {
          addVariant(route, owner.kind, caseMatch[1], lineNo);
        }
      }
    }

    const route = currentRoute();
    if (route) {
      for (const regex of COMPARISONS) {
        for (const match of line.matchAll(regex)) {
          const [expr, value] = exprKind(match[1]) ? [match[1], match[2]] : [match[2], match[1]];
          addVariant(route, exprKind(expr), value, lineNo);
        }
      }
    }

    depth += delta;
    while (stack.length && depth <= stack[stack.length - 1].depth) {
      stack.pop();
    }
  });

  // A route with sub-endpoints is documented through them, not on its own. A plugin
  // registration on a path the platform dispatches by name (e.g. /i/apps/delete) is an
  // event hook, so only its sub-endpoints count. Bare /i and /o are never endpoints.
  const endpoints = [];
  for (const r of routes) {
    if (r.variants.length) {
      endpoints.push(...r.variants.map((v) => ({...v, file: rel})));
    }
    else if (!r.hook && r.path !== "/i" && r.path !== "/o") {
      endpoints.push({path: r.path, method: null, line: r.line, file: rel});
    }
  }
  return endpoints;
}

// "/i/app_users/deleteExport/:filename?method=x&app_id=..." -> {path: "/i/app_users/deleteExport", method: "x"}
function normalizeDocEndpoint(value) {
  const [rawPath, query = ""] = value.replaceAll("\\", "").split("?");
  const segments = rawPath.split("/").filter(Boolean);
  while (segments.length && /^(:|\{|<)/.test(segments[segments.length - 1])) {
    segments.pop();
  }
  const method = new URLSearchParams(query).get("method");
  return {path: `/${segments.join("/")}`, method: method && /^[\w.-]+$/.test(method) ? method : null};
}

// Methods a page covers without naming one in its endpoint: `method=x` anywhere, plus
// backticked names in list items (e.g. the "Supported core methods" list on the /o page).
function methodMentions(raw) {
  const names = [...raw.matchAll(/method=([\w.-]+)/g)].map((m) => m[1]);
  for (const line of raw.split("\n").filter((l) => /^\s*[-*]\s+`/.test(l))) {
    names.push(...[...line.matchAll(/`([\w.-]+)`/g)].map((m) => m[1]));
  }
  return new Set(names.map((n) => n.toLowerCase()));
}

const keyOf = (e) => (e.method ? `${e.path}?method=${e.method}` : e.path).toLowerCase();

function loadIgnore() {
  if (!fs.existsSync(IGNORE_FILE)) {
    return new Set();
  }
  return new Set(fs.readFileSync(IGNORE_FILE, "utf8").split("\n")
    .map((line) => line.replace(/#.*/, "").trim().toLowerCase())
    .filter(Boolean));
}

function main() {
  if (!fs.existsSync(path.join(PLATFORM, CORE_ROUTER))) {
    throw new Error(`${PLATFORM} does not look like a countly-platform checkout (no ${CORE_ROUTER}).`);
  }
  const files = codeFiles();
  const sources = new Map(files.map((f) => [f, fs.readFileSync(f, "utf8")]));
  const hookPaths = new Set();
  for (const text of sources.values()) {
    for (const match of text.matchAll(new RegExp(`dispatch\\(\\s*${QUOTED}`, "g"))) {
      hookPaths.add(match[1]);
    }
  }

  // Exported constants such as FEATURE_NAME, for route names built from another file's constant.
  const sharedConstants = {};
  for (const text of sources.values()) {
    for (const m of text.matchAll(/export\s+const\s+([A-Z_]+)\s*=\s*['"]([\w-]+)['"]/g)) {
      sharedConstants[m[1]] ??= m[2];
    }
  }

  const code = new Map();
  for (const file of files) {
    for (const endpoint of extractRoutes(file, hookPaths, sharedConstants)) {
      const key = keyOf(endpoint);
      if (!code.has(key)) {
        code.set(key, endpoint);
      }
    }
  }

  const docs = walk(path.join(ROOT, "docs", "api"))
    .filter((f) => f.endsWith(".md"))
    .map(parseDoc)
    .filter((d) => !d.isOverview && d.endpoint)
    // A page can list several endpoints in its Endpoint block, one per line.
    .flatMap((d) => (d.raw.match(/## Endpoint\s+```[a-z]*\s*([\s\S]*?)```/m)?.[1].split("\n") ?? [d.endpoint])
      .map((line) => line.trim().replace(/^(GET|POST|PUT|DELETE|PATCH)\s+/i, ""))
      .filter((endpoint) => /^\/(i|o)(\/|\?|$)/.test(endpoint))
      .map((endpoint) => ({file: d.relativePath, endpoint, mentions: methodMentions(d.raw), ...normalizeDocEndpoint(endpoint)})));
  const ignore = loadIgnore();

  // A code endpoint matches a page when the paths agree (a "*" segment matches anything)
  // and, if the code names a method, the page uses or mentions the same one.
  const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pathRegex = (p) => new RegExp(`^${p.split("/").map((s) => (s === "*" ? "[^/]+" : escape(s))).join("/")}$`, "i");
  const codeList = [...code.values()].map((e) => ({...e, regex: pathRegex(e.path)}));
  const matches = (e, d) => e.regex.test(d.path) && (!e.method || (d.method ? e.method.toLowerCase() === d.method.toLowerCase() : d.mentions.has(e.method.toLowerCase())));

  // Undocumented: the code handles it and no page matches it.
  const missing = codeList
    .filter((e) => !ignore.has(keyOf(e)) && !docs.some((d) => matches(e, d)))
    .map((e) => ({endpoint: keyOf(e), file: e.file, line: e.line}))
    .sort((a, b) => a.endpoint.localeCompare(b.endpoint));

  // Removed: no extracted route matches the page, and its path (or its method name, in the
  // files that define that path) no longer appears in the code. Pages the extractor merely
  // failed to match are left alone rather than flagged.
  const quoted = (text, value) => new RegExp(`['"\`]${escape(value)}['"\`]`).test(text);
  const removed = docs.filter((d) => {
    if (ignore.has(keyOf(d)) || codeList.some((e) => matches(e, d))) {
      return false;
    }
    // e.g. /o/system/kafka/events/meta: a file quoting "/o/system" and also "kafka", "events", "meta".
    const segments = d.path.split("/").filter(Boolean);
    const root = `/${segments.slice(0, 2).join("/")}`;
    for (const text of sources.values()) {
      if (quoted(text, d.path) && (!d.method || quoted(text, d.method))) {
        return false;
      }
      if (segments.length > 2 && quoted(text, root) && segments.slice(2).every((s) => quoted(text, s))) {
        return false;
      }
    }
    return true;
  }).map((d) => ({endpoint: d.endpoint, file: d.file}));

  const report = {
    generatedAt: new Date().toISOString(),
    codeEndpoints: code.size,
    docEndpoints: docs.length,
    missing,
    removed,
  };
  fs.mkdirSync(OUT_DIR, {recursive: true});
  fs.writeFileSync(path.join(OUT_DIR, "drift.json"), JSON.stringify(report, null, 2));

  const md = [
    "# API docs drift report",
    "",
    `Classic API endpoints found in countly-platform: ${code.size}. Endpoints documented in docs/api: ${docs.length}.`,
    "",
    `## Undocumented endpoints (${missing.length})`,
    "",
    ...(missing.length ? ["| Endpoint | Defined in |", "|---|---|", ...missing.map((m) => `| \`${m.endpoint}\` | \`${m.file}:${m.line}\` |`)] : ["None."]),
    "",
    `## Pages for removed endpoints (${removed.length})`,
    "",
    ...(removed.length ? ["| Endpoint | Page |", "|---|---|", ...removed.map((r) => `| \`${r.endpoint}\` | \`${r.file}\` |`)] : ["None."]),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "drift.md"), md);

  console.log(`Code endpoints: ${code.size}, documented endpoints: ${docs.length}, undocumented: ${missing.length}, removed: ${removed.length}`);
  console.log(`Report: ${path.relative(ROOT, OUT_DIR)}/drift.md`);
}

main();
