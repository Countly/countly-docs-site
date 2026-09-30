import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

export function parseDoc(file) {
  const raw = fs.readFileSync(file, "utf8");
  const relativePath = path.relative(ROOT, file).replaceAll(path.sep, "/");
  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const endpoint = parseEndpoint(raw);
  const requestParams = parseRequestParams(raw);
  const isOverview = path.basename(file) === "index.md";

  return {
    file,
    relativePath,
    title: titleMatch ? titleMatch[1].trim() : null,
    endpoint,
    requestParams,
    hasRequestParamsSection: raw.includes("## Request Parameters"),
    hasNoRequestParamsStatement: /This endpoint (has no|required no|does not require|does not use) (required )?(request|query) parameters\./i.test(raw),
    isWorkflowDoc: /does not define a standalone public endpoint|not a direct public API endpoint/i.test(raw),
    isOverview,
    raw
  };
}

export function parseEndpoint(raw) {
  const fencedMatch = raw.match(/## Endpoint\s+```[a-z]*\s*([\s\S]*?)```/m);
  if (fencedMatch) {
    return normalizeEndpoint(fencedMatch[1]);
  }
  const inlineMatch = raw.match(/## Endpoint\s+`([^`]+)`/m);
  if (inlineMatch) {
    return normalizeEndpoint(inlineMatch[1]);
  }
  return null;
}

export function normalizeEndpoint(value) {
  return value
    .trim()
    .replace(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+/i, "")
    .replace(/\s+/g, "");
}

export function parseRequestParams(raw) {
  const sectionMatch = raw.match(/## Request Parameters([\s\S]*?)(?:\n## |\n---|\Z)/m);
  if (!sectionMatch) {
    return [];
  }

  const section = sectionMatch[1];
  const normalizedLines = section.split("\n").map((line) => line.trim());
  const tableLines = [];
  let inTable = false;

  for (const line of normalizedLines) {
    if (!line) {
      if (inTable) {
        break;
      }
      continue;
    }

    if (line.startsWith("|")) {
      tableLines.push(line);
      inTable = true;
      continue;
    }

    if (inTable) {
      break;
    }
  }

  if (tableLines.length >= 3) {
    return tableLines.slice(2).map((line) => {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim());

      return {
        name: normalizeParamName(cells[0] || ""),
        type: cells[1] || "",
        required: cells[2] || "",
        description: cells[3] || ""
      };
    }).filter((row) => row.name);
  }

  const bulletLines = [];
  let inBullets = false;

  for (const line of normalizedLines) {
    if (!line) {
      if (inBullets) {
        break;
      }
      continue;
    }

    if (line.startsWith("- `") || line.startsWith("- **")) {
      bulletLines.push(line);
      inBullets = true;
      continue;
    }

    if (inBullets) {
      break;
    }
  }

  return bulletLines
    .map((line) => {
      const backtickMatch = line.match(/-\s+`([^`]+)`\s+\(([^)]+)\):\s+(.*)$/);
      if (backtickMatch) {
        return {
          name: normalizeParamName(backtickMatch[1]),
          type: "",
          required: backtickMatch[2],
          description: backtickMatch[3]
        };
      }
      const boldMatch = line.match(/-\s+\*\*([^*]+)\*\*:\s+(.*)$/);
      if (boldMatch) {
        return {
          name: normalizeParamName(boldMatch[1]),
          type: "",
          required: "",
          description: boldMatch[2]
        };
      }
      return null;
    })
    .filter(Boolean);
}

export function normalizeParamName(value) {
  return value.replaceAll("`", "").trim();
}

export function walk(dir) {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    }
    else {
      files.push(fullPath);
    }
  }
  return files;
}
