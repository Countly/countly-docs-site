import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {spawnSync} from "node:child_process";

const ROOT = process.cwd();
const DOCS_ROOT = path.join(ROOT, "docs", "api");
const TESTS_ROOT = path.join(ROOT, "tests");
const REPORTS_ROOT = path.join(TESTS_ROOT, "reports");
const ENV_PATH = path.join(TESTS_ROOT, ".env");
const ASSETS_ROOT = path.join(TESTS_ROOT, "assets");
const VALIDATOR_UPLOAD_FILE = path.join(ASSETS_ROOT, "validator-logo.png");
const VALIDATOR_SCHEMA_CSV_FILE = path.join(ASSETS_ROOT, "data-manager-schema.csv");
const VALIDATOR_SOURCE_MAP_FILE = path.join(ASSETS_ROOT, "validator-source-map.map");
const CONFIG_TRANSFER_IMPORT_FILE = path.join(ASSETS_ROOT, "config-transfer-empty.json");

const DOC_GROUP_TO_PLUGIN = {
  "ab-testing": "ab-testing",
  "active_directory": "active_directory",
  "active_users": "active_users",
  "activity-map": "activity-map",
  "adjust": "adjust",
  "ai-assistants": "ai-assistants",
  "attribution": "attribution",
  "block": "block",
  "browser": "browser",
  "clickhouse": "clickhouse",
  "cognito": "cognito",
  "cohorts": "cohorts",
  "compare": "compare",
  "compliance-hub": "compliance-hub",
  "concurrent_users": "concurrent_users",
  "config-transfer": "config-transfer",
  "content": "content",
  "crash_symbolication": "crash_symbolication",
  "crashes": "crashes",
  "crashes-jira": "crashes-jira",
  "dashboards": "dashboards",
  "data-manager": "data-manager",
  "data_migration": "data_migration",
  "dbviewer": "dbviewer",
  "density": "density",
  "drill": "drill",
  "errorlogs": "errorlogs",
  "flows": "flows",
  "formulas": "formulas",
  "funnels": "funnels",
  "geo": "geo",
  "groups": "groups",
  "hooks": "hooks",
  "journey_engine": "journey_engine",
  "kafka": "kafka",
  "ldap": "ldap",
  "oidc": "oidc",
  "okta": "okta",
  "populator": "populator",
  "push": "push",
  "push_approver": "push_approver",
  "recaptcha": "recaptcha",
  "remote-config": "remote-config",
  "reports": "reports",
  "retention_segments": "retention_segments",
  "revenue": "revenue",
  "sdk": "sdk",
  "server-stats": "server-stats",
  "slipping-away-users": "slipping-away-users",
  "sources": "sources",
  "star-rating": "star-rating",
  "surveys": "surveys",
  "system-utility": "system-utility",
  "systemlogs": "systemlogs",
  "times-of-day": "times-of-day",
  "two-factor-auth": "two-factor-auth",
  "users": "users",
  "views": "views",
  "white-labeling": "white-labeling"
};

const SAFE_ENDPOINT_ALLOWLIST = new Set([
  "/o",
  "/o/apps/all",
  "/o/apps/mine",
  "/o/apps/details",
  "/o/apps/plugins",
  "/o/users/all",
  "/o/users/me",
  "/o/users/id",
  "/o/users/permissions",
  "/o/ping",
  "/o/countly_version",
  "/o/plugins",
  "/o/plugins-check",
  "/o/themes",
  "/o/configs",
  "/o/userconfigs",
  "/o/export/db",
  "/o/export/data",
  "/o/notes",
  "/o/tasks/all",
  "/o/tasks/list",
  "/o/tasks/count",
  "/o/tasks/check",
  "/o/tasks/task",
  "/o/token/check",
  "/o/token/list",
  "/o/analytics/dashboard",
  "/o/analytics/countries",
  "/o/analytics/sessions",
  "/o/analytics/metric",
  "/o/analytics/events",
  "/o/analytics/tops",
  "/o/analytics/loyalty",
  "/o/analytics/frequency",
  "/o/analytics/durations",
  "/o/app_users/loyalty",
  "/o/system/version",
  "/o/system/plugins",
  "/o/db",
  "/o/feedback/data",
  "/o/feedback/widget",
  "/o/feedback/widgets",
  "/o/feedback/multiple-widgets-by-id",
  "/o/slipping",
  "/o/times-of-day",
  "/o/campaign"
]);

const ENV = loadEnv(ENV_PATH);
const CONFIG = {
  baseUrl: requiredEnv("COUNTLY_BASE_URL"),
  appId: ENV.COUNTLY_APP_ID || "",
  appKey: ENV.COUNTLY_APP_KEY || "",
  apiKey: ENV.COUNTLY_API_KEY || "",
  authToken: ENV.COUNTLY_AUTH_TOKEN || "",
  logFilter: ENV.COUNTLY_LOG_FILTER || "",
  hostOverrideIp: ENV.COUNTLY_HOST_OVERRIDE_IP || "",
  timeoutMs: Number(ENV.COUNTLY_TIMEOUT_MS || 15000),
  defaultPeriod: ENV.COUNTLY_DEFAULT_PERIOD || "7days",
  interRequestDelayMs: Number(ENV.COUNTLY_INTER_REQUEST_DELAY_MS || 1000),
  retryableErrorCooldownMs: Number(ENV.COUNTLY_RETRYABLE_ERROR_COOLDOWN_MS || 15000),
  retryableErrorStatusCodes: new Set((ENV.COUNTLY_RETRYABLE_ERROR_STATUS_CODES || "502,503")
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value))),
  docFilter: splitCsvEnv(ENV.COUNTLY_DOC_FILTER),
  endpointFilter: splitCsvEnv(ENV.COUNTLY_ENDPOINT_FILTER),
  maxDocs: Number(ENV.COUNTLY_MAX_DOCS || 0),
  stopAfterRetryableError: (ENV.COUNTLY_STOP_AFTER_RETRYABLE_ERROR || "false").toLowerCase() === "true",
  allowMutation: (ENV.COUNTLY_ALLOW_MUTATION || "false").toLowerCase() === "true",
  useCurlFallback: (ENV.COUNTLY_USE_CURL_FALLBACK || "false").toLowerCase() === "true"
};
const BASE_URL = new URL(CONFIG.baseUrl);

const DUMMY = {
  name: "Docs Validator Resource",
  title: "Docs Validator Title",
  description: "Temporary resource created by the API docs validator",
  note: "Docs validator note",
  text: "Docs validator text",
  deviceId: "docs-validator-device",
  surveyMsg: '{"mainQuestion":"How likely are you to recommend us?","thanks":"Thank you"}',
  surveyQuestions: '[{"id":"q1","type":"text","question":"How can we improve?","required":false}]',
  surveyAppearance: '{"position":"bLeft","show":"uSubmit","color":"#0166D6"}',
  surveyTargeting: '{"type":"all"}',
  concurrentAlert: '{"name":"Docs Validator Concurrent Alert","condition_title":"Online users exceed 1","enabled":true,"type":"t","def":"max","users":1,"minutes":5}',
  remoteConfigCondition: '{"condition_name":"Docs Validator Condition","condition_color":1,"condition":{"up._os":{"$eq":"iOS"}},"seed_value":"docs_validator_param"}',
  remoteConfigParameter: '{"parameter_key":"docs_validator_param","default_value":"enabled","status":"Running","conditions":[]}',
  remoteConfigConfig: '{"parameters":[{"parameter_key":"docs_validator_rollout","exp_value":"variant_b","default_value":"variant_a","description":"Docs validator rollout"}],"condition":{"condition_name":"Docs Validator Rollout","condition":{"up.nc":{"$eq":1}}}}',
  shareWith: "none",
  theme: "1",
  event: "[CLY]_session",
  steps: '[{"event":"[CLY]_session","type":"did","period":"7days"}]',
  funnelSteps: '["[CLY]_session","[CLY]_view"]',
  funnelQueries: '["{}","{}"]',
  funnelQueryTexts: '["All Users","All Users"]',
  funnelStepGroups: '[{"c":"and"},{"c":"and"}]',
  args: '{"name":"Docs Validator Resource","description":"Temporary resource created by the API docs validator"}',
  data: '{"enabled":true}',
  alertConfig: '{"alertName":"Docs Validator Alert","alertDataType":"events","alertDataSubType":"[CLY]_session","selectedApps":["__APP_ID__"],"enabled":true}',
  hookConfig: '{"name":"Docs Validator Hook","description":"Temporary resource created by the API docs validator","apps":["__APP_ID__"],"trigger":{"type":"InternalEventTrigger","configuration":{"eventType":"/session/start"}},"effects":[{"type":"EmailEffect","configuration":{"address":["as@count.ly"],"emailTemplate":"Docs validator hook fired"}}],"enabled":true}',
  widget: '{"widget_type":"analytics","feature":"core","apps":["__APP_ID__"],"data_type":"session","metrics":["t","u"],"title":"Docs Validator Widget","position":[0,0],"size":[4,3]}',
  groups: '[]',
  pushPlatforms: '["a"]',
  pushFilter: '{}',
  pushTriggers: '[{"kind":"plain","start":1775300000000}]',
  pushContents: '[{"message":"Docs Validator Push","title":"Docs Validator"}]',
  pushVariables: '{}'
};

const STATE = {
  enabledPlugins: null,
  currentUser: null,
  appsMine: null,
  firstCampaignId: null,
  tempToken: null,
  firstTaskId: null,
  firstFunnelId: null,
  firstFlowId: null,
  firstCohortId: null,
  firstWidgetId: null,
  firstCrashGroupId: null,
  firstCrashReportId: null,
  firstCrashDrillReportId: null,
  firstCrashSymbolId: null,
  firstDashboardId: null,
  firstDashboardWidgetId: null,
  firstNpsWidgetId: null,
  firstSurveyWidgetId: null,
  firstAlertId: null,
  firstHookId: null,
  firstConcurrentAlertId: null,
  firstFeedbackWidgetId: null,
  firstRemoteConfigConditionId: null,
  firstRemoteConfigParameterId: null,
  firstPushMessageId: null,
  firstPushToggleMessageId: null,
  firstDrillBookmarkId: null,
  firstAbExperimentId: null,
  firstNoteId: null,
  firstDatePresetId: null,
  firstAppUserExportId: null,
  firstGroupId: null,
  firstEventGroupId: null,
  firstGeoLocationId: null,
  firstViewId: null,
  firstFormulaId: null,
  firstDataManagerTransformationId: null,
  firstJourneyDefinitionId: null,
  firstAiThreadId: null,
  firstBlockId: null,
  firstContentBlockId: null,
  firstContentAssetId: null,
  firstPopulatorTemplateId: null,
  firstPopulatorEnvironmentId: null,
  assignableMemberEmail: null,
  createdFunnels: [],
  createdCohorts: [],
  createdDashboards: [],
  createdDashboardWidgets: [],
  createdSurveyWidgets: [],
  createdAlerts: [],
  createdHooks: [],
  createdConcurrentAlerts: [],
  createdFeedbackWidgets: [],
  createdRemoteConfigConditions: [],
  createdRemoteConfigParameters: [],
  createdPushMessages: [],
  createdDrillBookmarks: [],
  createdAbExperiments: [],
  createdAbParameters: [],
  createdNoteIds: [],
  createdDatePresetIds: [],
  createdAppUserExportIds: [],
  createdTaskIds: [],
  createdFlowIds: [],
  createdUserIds: [],
  createdAppIds: [],
  createdAppUsers: [],
  createdGroups: [],
  createdEventGroups: [],
  createdGeoLocations: [],
  createdViewIds: [],
  createdFormulaIds: [],
  createdCrashGroupIds: [],
  createdCrashSymbolIds: [],
  createdDataManagerTransformationIds: [],
  createdJourneyDefinitionIds: [],
  createdBlocks: [],
  createdContentBlockIds: [],
  createdContentAssetIds: [],
  createdPopulatorTemplateIds: [],
  createdPopulatorEnvironments: [],
  docContexts: new Map()
};

main().catch((error) => {
  console.error("Validator failed:", error);
  process.exitCode = 1;
});

async function main() {
  fs.mkdirSync(REPORTS_ROOT, {recursive: true});
  const results = [];
  let stoppedEarly = false;
  let stopReason = null;

  try {
    await getEnabledPlugins();
    await warmSeededResources();
    const files = walk(DOCS_ROOT).filter((file) => file.endsWith(".md"));
    const docs = files
      .map(parseDoc)
      .filter((doc) => doc.endpoint)
      .filter(matchesDocFilters)
      .sort((a, b) => a.relativePath.localeCompare(b.relativePath))
      .slice(0, CONFIG.maxDocs > 0 ? CONFIG.maxDocs : undefined);

    for (const doc of docs) {
      const result = await validateDoc(doc);
      results.push(result);
      printResult(result);
      if (
        CONFIG.stopAfterRetryableError
        && result.live.status === "failed"
        && isRetryableFailure(result.live)
      ) {
        stoppedEarly = true;
        stopReason = result.live.reason;
        break;
      }
    }
  }
  finally {
    await cleanupSeededResources();
  }

  const summary = summarize(results);
  const report = {
    generatedAt: new Date().toISOString(),
    config: {
      baseUrl: CONFIG.baseUrl,
      appIdPresent: Boolean(CONFIG.appId),
      apiKeyPresent: Boolean(CONFIG.apiKey),
      authTokenPresent: Boolean(CONFIG.authToken),
      hostOverrideIp: CONFIG.hostOverrideIp || "",
      docFilter: CONFIG.docFilter,
      endpointFilter: CONFIG.endpointFilter,
      maxDocs: CONFIG.maxDocs,
      stopAfterRetryableError: CONFIG.stopAfterRetryableError,
      allowMutation: CONFIG.allowMutation
    },
    stoppedEarly,
    stopReason,
    summary,
    results
  };

  fs.writeFileSync(
    path.join(REPORTS_ROOT, "latest.json"),
    JSON.stringify(report, null, 2) + "\n",
    "utf8"
  );

  console.log("");
  console.log("Summary");
  console.log(`  docs: ${summary.total}`);
  console.log(`  passed: ${summary.passed}`);
  console.log(`  failed: ${summary.failed}`);
  console.log(`  skipped: ${summary.skipped}`);
}

async function warmSeededResources() {
  if (!CONFIG.allowMutation) {
    return;
  }

  if (shouldWarmFamily("push")) {
    await getFirstPushMessageId();
    await getFirstPushToggleMessageId();
  }
}

async function validateDoc(doc) {
  const issues = [];

  if (!doc.title) {
    issues.push("Missing H1 title");
  }
  if (!doc.endpoint && !doc.isOverview && !doc.isWorkflowDoc) {
    issues.push("Missing endpoint block");
  }
  if (doc.hasRequestParamsSection && doc.requestParams.length === 0 && !doc.isOverview && !doc.hasNoRequestParamsStatement) {
    issues.push("Request parameter section exists but no parameters were parsed");
  }

  const result = {
    file: doc.relativePath,
    title: doc.title || null,
    endpoint: doc.endpoint || null,
    static: {
      ok: issues.length === 0,
      issues
    },
    live: {
      status: "skipped",
      reason: null,
      request: null,
      response: null
    }
  };

  if (!doc.endpoint) {
    result.live.reason = "No endpoint";
    return result;
  }

  const pluginName = mapPluginName(doc);
  let enabledPlugins = null;
  if (pluginName) {
    enabledPlugins = await getEnabledPlugins();
    if (enabledPlugins && !enabledPlugins.has(pluginName)) {
      result.live.reason = `Plugin disabled on target instance: ${pluginName}`;
      return result;
    }
  }

  const configurationSkipReason = getConfigurationSkipReason(doc);
  if (configurationSkipReason) {
    result.live.reason = configurationSkipReason;
    return result;
  }

  if (isMutatingDoc(doc) && !CONFIG.allowMutation) {
    result.live.status = "failed";
    result.live.reason = "Mutating endpoint skipped by configuration";
    return result;
  }

  if (!isSafeToCall(doc) && !CONFIG.allowMutation) {
    result.live.status = "failed";
    result.live.reason = "Endpoint not in safe live-call allowlist";
    return result;
  }

  let built;
  try {
    built = await buildRequest(doc);
  }
  catch (error) {
    result.live.status = "failed";
    result.live.reason = `Request build failed: ${error.message}`;
    return result;
  }
  if (!built.ok) {
    if (typeof built.reason === "string" && built.reason.startsWith("Seed failure:")) {
      result.live.status = "failed";
      result.live.reason = built.reason;
    }
    else {
      result.live.status = "failed";
      result.live.reason = built.reason;
    }
    return result;
  }

  result.live.request = built.request;

  try {
    const response = await performRequest(built.request);
    result.live.response = response;
    if (response.ok) {
      result.live.status = "passed";
    }
    else {
      result.live.status = "failed";
      result.live.reason = classifyFailureReason(doc, response, pluginName, enabledPlugins);
    }
  }
  catch (error) {
    result.live.status = "failed";
    result.live.reason = error.message;
  }

  return result;
}

function parseDoc(file) {
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

function parseEndpoint(raw) {
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

function normalizeEndpoint(value) {
  return value
    .trim()
    .replace(/^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+/i, "")
    .replace(/\s+/g, "");
}

function parseRequestParams(raw) {
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

function normalizeParamName(value) {
  return value.replaceAll("`", "").trim();
}

function splitCsvEnv(value) {
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function shouldWarmFamily(family) {
  if (CONFIG.docFilter.length === 0 && CONFIG.endpointFilter.length === 0) {
    return true;
  }

  if (CONFIG.docFilter.some((filter) => filter.includes(family))) {
    return true;
  }

  if (family === "push" && CONFIG.endpointFilter.some((filter) => filter.includes("/push/"))) {
    return true;
  }

  return false;
}

function matchesDocFilters(doc) {
  if (CONFIG.docFilter.length > 0) {
    const matchedDocFilter = CONFIG.docFilter.some((filter) =>
      doc.relativePath.includes(filter)
      || doc.relativePath.startsWith(filter)
      || doc.relativePath.startsWith(`docs/api/${filter}/`)
    );
    if (!matchedDocFilter) {
      return false;
    }
  }

  if (CONFIG.endpointFilter.length > 0) {
    const endpoint = doc.endpoint || "";
    const matchedEndpointFilter = CONFIG.endpointFilter.some((filter) => endpoint.includes(filter));
    if (!matchedEndpointFilter) {
      return false;
    }
  }

  return true;
}

function isRetryableFailure(live) {
  const statusMatch = typeof live.reason === "string" ? live.reason.match(/^HTTP\s+(\d+)/) : null;
  if (!statusMatch) {
    return false;
  }
  return CONFIG.retryableErrorStatusCodes.has(Number(statusMatch[1]));
}

function walk(dir) {
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

function mapPluginName(doc) {
  const relative = path.relative(DOCS_ROOT, doc.file).replaceAll(path.sep, "/");
  const rootGroup = relative.split("/")[0];
  if (rootGroup === "core" || rootGroup === "guides" || rootGroup === "plugins") {
    return null;
  }
  return DOC_GROUP_TO_PLUGIN[rootGroup] || null;
}

function isMutatingDoc(doc) {
  if (!doc.endpoint) {
    return false;
  }
  if (doc.endpoint === "/api-key") {
    return false;
  }
  return doc.endpoint.startsWith("/i");
}

function isSafeToCall(doc) {
  if (doc.endpoint === "/api-key") {
    return false;
  }
  if (doc.endpoint.startsWith("/o?")) {
    return true;
  }
  return SAFE_ENDPOINT_ALLOWLIST.has(doc.endpoint);
}

function getConfigurationSkipReason(doc) {
  if (doc.relativePath.startsWith("docs/api/crashes-jira/")) {
    return "Plugin enabled but JIRA integration is not configured on target instance";
  }

  if (doc.endpoint === "/api-key") {
    return "Requires dashboard Basic Auth credentials";
  }

  if ([
    "/o/push/message/all",
    "/o/push/message/estimate",
    "/i/push/message/test"
  ].includes(doc.endpoint)) {
    return "Push credentials are not configured on target app";
  }

  if (doc.endpoint === "/o/email_test") {
    return "SMTP/mail transport is not configured on target instance";
  }

  return null;
}

async function getEnabledPlugins() {
  if (STATE.enabledPlugins) {
    return STATE.enabledPlugins;
  }
  if (!CONFIG.authToken && !CONFIG.apiKey) {
    return null;
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const url = new URL("/o/plugins", CONFIG.baseUrl);
      setAuth(url);

      const response = await performRequest({
        method: "GET",
        url: url.toString(),
        headers: {}
      });

      if (!response.ok) {
        continue;
      }

      const enabled = new Set();
      if (Array.isArray(response.json)) {
        for (const item of response.json) {
          if (item && item.enabled === true && typeof item.code === "string" && item.code) {
            enabled.add(item.code);
          }
        }
      }
      else if (response.json && typeof response.json === "object") {
        for (const [key, value] of Object.entries(response.json)) {
          if (value) {
            enabled.add(key);
          }
        }
      }
      STATE.enabledPlugins = enabled;
      return enabled;
    }
    catch {
      if (attempt < 2) {
        await sleep(1000);
      }
    }
  }

  return null;
}

async function getCurrentUser() {
  if (STATE.currentUser) {
    return STATE.currentUser;
  }
  const url = new URL("/o/users/me", CONFIG.baseUrl);
  setAuth(url);
  try {
    const response = await performRequest({
      method: "GET",
      url: url.toString(),
      headers: {}
    });
    if (response.ok && response.json && typeof response.json === "object") {
      STATE.currentUser = response.json;
    }
  }
  catch {
    return null;
  }
  return STATE.currentUser;
}

async function getAppsMine() {
  if (STATE.appsMine) {
    return STATE.appsMine;
  }
  const url = new URL("/o/apps/mine", CONFIG.baseUrl);
  setAuth(url);
  try {
    const response = await performRequest({
      method: "GET",
      url: url.toString(),
      headers: {}
    });
    if (response.ok && response.json) {
      STATE.appsMine = response.json;
    }
  }
  catch {
    return null;
  }
  return STATE.appsMine;
}

async function getFirstCampaignId() {
  if (STATE.firstCampaignId !== null) {
    return STATE.firstCampaignId;
  }

  try {
    const url = new URL("/o/campaign", CONFIG.baseUrl);
    url.searchParams.set("app_id", CONFIG.appId);
    url.searchParams.set("list", "true");
    setAuth(url);
    const response = await performRequest({
      method: "GET",
      url: url.toString(),
      headers: {}
    });
    if (response.ok && Array.isArray(response.json) && response.json.length > 0) {
      STATE.firstCampaignId = response.json[0]._id || null;
      return STATE.firstCampaignId;
    }
  }
  catch {
    // Ignore resolver failure and fall back to skip.
  }

  STATE.firstCampaignId = null;
  return null;
}

async function getOrCreateTempToken() {
  if (STATE.tempToken) {
    return STATE.tempToken;
  }

  const listed = await getFirstOwnedToken();
  if (listed) {
    STATE.tempToken = listed;
    return listed;
  }

  if (!CONFIG.allowMutation) {
    return null;
  }

  const url = new URL("/i/token/create", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("purpose", "docs-validator-temp");
  url.searchParams.set("ttl", "3600");
  url.searchParams.set("multi", "false");

  const response = await performRequest({
    method: "GET",
    url: url.toString(),
    headers: {}
  });

  const tokenValue = response?.json?.result;
  if (!tokenValue || typeof tokenValue !== "string") {
    return null;
  }

  STATE.tempToken = {
    token: tokenValue,
    tokenid: tokenValue,
    purpose: "docs-validator-temp",
    created: true
  };
  return STATE.tempToken;
}

async function getFirstOwnedToken() {
  const url = new URL("/o/token/list", CONFIG.baseUrl);
  if (CONFIG.authToken) {
    url.searchParams.set("auth_token", CONFIG.authToken);
  }
  else {
    url.searchParams.set("api_key", CONFIG.apiKey);
  }

  try {
    const response = await performRequest({
      method: "GET",
      url: url.toString(),
      headers: {}
    });
    const list = response?.json?.result;
    if (Array.isArray(list) && list.length > 0) {
      const first = list.find((item) => item && item._id) || list[0];
      if (first && first._id) {
        return {
          token: first._id,
          tokenid: first._id,
          purpose: first.purpose || null,
          created: false
        };
      }
    }
  }
  catch {
    return null;
  }

  return null;
}

async function getFirstTaskId() {
  if (STATE.firstTaskId !== null) {
    return STATE.firstTaskId;
  }

  const listed = await getListedTaskId();
  if (listed) {
    STATE.firstTaskId = listed;
    return listed;
  }

  if (CONFIG.allowMutation) {
    const created = await createExportTask();
    if (created) {
      STATE.firstTaskId = created;
      return created;
    }
  }

  STATE.firstTaskId = null;
  return null;
}

async function getListedTaskId() {
  const url = new URL("/o/tasks/list", CONFIG.baseUrl);
  if (CONFIG.authToken) {
    url.searchParams.set("auth_token", CONFIG.authToken);
  }
  else {
    url.searchParams.set("api_key", CONFIG.apiKey);
  }
  if (CONFIG.appId) {
    url.searchParams.set("app_id", CONFIG.appId);
  }

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const rows = response?.json?.aaData;
    if (Array.isArray(rows) && rows.length > 0) {
      return findFirstId(rows) || null;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createTaskForEndpoint() {
  if (!CONFIG.allowMutation) {
    return null;
  }

  return await createExportTask(`docs-validator-${Date.now()}`);
}

async function getFirstFunnelId() {
  if (STATE.firstFunnelId !== null) {
    return STATE.firstFunnelId;
  }

  const url = new URL("/o", CONFIG.baseUrl);
  url.searchParams.set("method", "get_funnels");
  if (CONFIG.appId) {
    url.searchParams.set("app_id", CONFIG.appId);
  }
  if (CONFIG.authToken) {
    url.searchParams.set("auth_token", CONFIG.authToken);
  }
  else {
    url.searchParams.set("api_key", CONFIG.apiKey);
  }

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (Array.isArray(response?.json) && response.json.length > 0) {
      STATE.firstFunnelId = findFirstId(response.json) || null;
      return STATE.firstFunnelId;
    }
  }
  catch {
    // Fall through to optional seeding.
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedFunnel();
    if (created) {
      STATE.firstFunnelId = created;
      return created;
    }
  }

  STATE.firstFunnelId = null;
  return null;
}

async function getFirstFlowId() {
  if (STATE.firstFlowId !== null) {
    return STATE.firstFlowId;
  }

  const listed = await findFlowIdByName(null);
  if (listed) {
    STATE.firstFlowId = listed;
    return listed;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedFlow();
    if (created) {
      STATE.firstFlowId = created;
      return created;
    }
  }

  STATE.firstFlowId = null;
  return null;
}

async function getFirstGeoLocationId() {
  if (STATE.firstGeoLocationId !== null) {
    return STATE.firstGeoLocationId;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedGeoLocation();
    if (created) {
      STATE.firstGeoLocationId = created;
      return created;
    }
  }

  STATE.firstGeoLocationId = null;
  return null;
}

async function getFirstViewId() {
  if (STATE.firstViewId !== null) {
    return STATE.firstViewId;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedView();
    if (created) {
      STATE.firstViewId = created;
      return created;
    }
  }

  STATE.firstViewId = null;
  return null;
}

async function getFirstFormulaId() {
  if (STATE.firstFormulaId !== null) {
    return STATE.firstFormulaId;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedFormula();
    if (created) {
      STATE.firstFormulaId = created;
      return created;
    }
  }

  STATE.firstFormulaId = null;
  return null;
}

async function getFirstCohortId() {
  if (STATE.firstCohortId !== null) {
    return STATE.firstCohortId;
  }

  const url = new URL("/o", CONFIG.baseUrl);
  url.searchParams.set("method", "get_cohorts");
  if (CONFIG.appId) {
    url.searchParams.set("app_id", CONFIG.appId);
  }
  if (CONFIG.authToken) {
    url.searchParams.set("auth_token", CONFIG.authToken);
  }
  else {
    url.searchParams.set("api_key", CONFIG.apiKey);
  }

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (Array.isArray(response?.json) && response.json.length > 0) {
      STATE.firstCohortId = findFirstId(response.json) || null;
      return STATE.firstCohortId;
    }
  }
  catch {
    // Fall through to optional seeding.
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedCohort();
    if (created) {
      STATE.firstCohortId = created;
      return created;
    }
  }

  STATE.firstCohortId = null;
  return null;
}

async function getFirstWidgetId() {
  if (STATE.firstWidgetId !== null) {
    return STATE.firstWidgetId;
  }

  const url = new URL("/o/feedback/widgets", CONFIG.baseUrl);
  if (CONFIG.appId) {
    url.searchParams.set("app_id", CONFIG.appId);
  }
  if (CONFIG.authToken) {
    url.searchParams.set("auth_token", CONFIG.authToken);
  }
  else if (CONFIG.apiKey) {
    url.searchParams.set("api_key", CONFIG.apiKey);
  }

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (Array.isArray(response?.json) && response.json.length > 0) {
      STATE.firstWidgetId = findFirstId(response.json) || null;
      return STATE.firstWidgetId;
    }
  }
  catch {
    return null;
  }

  STATE.firstWidgetId = null;
  return null;
}

async function getFirstNpsWidgetId() {
  if (STATE.firstNpsWidgetId !== null) {
    return STATE.firstNpsWidgetId;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedSurveyWidget("nps");
    if (created) {
      STATE.firstNpsWidgetId = created;
      return created;
    }
  }

  STATE.firstNpsWidgetId = null;
  return null;
}

async function getFirstSurveyWidgetId() {
  if (STATE.firstSurveyWidgetId !== null) {
    return STATE.firstSurveyWidgetId;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedSurveyWidget("survey");
    if (created) {
      STATE.firstSurveyWidgetId = created;
      return created;
    }
  }

  STATE.firstSurveyWidgetId = null;
  return null;
}

async function getFirstCrashGroupId() {
  if (STATE.firstCrashGroupId !== null) {
    return STATE.firstCrashGroupId;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedCrashGroup();
    if (created) {
      STATE.firstCrashGroupId = created;
      return created;
    }
  }

  const url = new URL("/o", CONFIG.baseUrl);
  url.searchParams.set("method", "crashes");
  if (CONFIG.appId) {
    url.searchParams.set("app_id", CONFIG.appId);
  }
  if (CONFIG.authToken) {
    url.searchParams.set("auth_token", CONFIG.authToken);
  }
  else {
    url.searchParams.set("api_key", CONFIG.apiKey);
  }

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (Array.isArray(response?.json?.aaData) && response.json.aaData.length > 0) {
      STATE.firstCrashGroupId = findFirstId(response.json.aaData) || null;
      return STATE.firstCrashGroupId;
    }
  }
  catch {
    return null;
  }

  STATE.firstCrashGroupId = null;
  return null;
}

async function getFirstCrashReportId() {
  if (STATE.firstCrashReportId !== null) {
    return STATE.firstCrashReportId;
  }

  const reportId = await getFirstCrashDrillReportId();
  STATE.firstCrashReportId = reportId;
  return reportId;
}

async function getFirstCrashDownloadId() {
  return await getFirstCrashDrillReportId();
}

async function getFirstCrashDrillReportId() {
  if (STATE.firstCrashDrillReportId !== null) {
    return STATE.firstCrashDrillReportId;
  }

  const crashGroupId = await getFirstCrashGroupId();
  if (!crashGroupId) {
    STATE.firstCrashDrillReportId = null;
    return null;
  }

  const url = new URL("/o", CONFIG.baseUrl);
  url.searchParams.set("method", "crashes");
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("group", crashGroupId);
  setAuth(url);

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = Array.isArray(response?.json?.data) ? findFirstId(response.json.data) : null;
    STATE.firstCrashDrillReportId = id;
    return id;
  }
  catch {
    STATE.firstCrashDrillReportId = null;
    return null;
  }
}

function buildCrashPayload(version = `1.0.${Date.now()}`) {
  return {
    _os: "Android",
    _os_version: "13.0",
    _device: "Pixel 7",
    _manufacture: "Google",
    _resolution: "1080x1920",
    _app_version: version,
    _cpu: "arm64",
    _opengl: "OpenGL ES 3.0",
    _error: `java.lang.NullPointerException: Attempt to invoke virtual method on a null object reference ${version}\n  at com.example.app.MainActivity.onCreate(MainActivity.java:42)\n  at android.app.Activity.performCreate(Activity.java:8000)`,
    _nonfatal: false,
    _run: 42
  };
}

async function createSeedCrashGroup() {
  const version = `1.0.${Date.now()}`;
  const deviceId = crypto.randomUUID();
  const crash = buildCrashPayload(version);

  const ingestUrl = new URL("/i", CONFIG.baseUrl);
  ingestUrl.searchParams.set("app_key", CONFIG.appKey);
  ingestUrl.searchParams.set("device_id", deviceId);
  ingestUrl.searchParams.set("begin_session", "1");
  ingestUrl.searchParams.set("metrics", JSON.stringify({_app_version: version, _os: "Android"}));
  ingestUrl.searchParams.set("crash", JSON.stringify(crash));

  try {
    const ingestResponse = await performRequest({method: "GET", url: ingestUrl.toString(), headers: {}});
    if (!ingestResponse.ok) {
      return null;
    }
  }
  catch {
    return null;
  }

  const listUrl = new URL("/o", CONFIG.baseUrl);
  listUrl.searchParams.set("method", "crashes");
  listUrl.searchParams.set("app_id", CONFIG.appId);
  listUrl.searchParams.set("query", JSON.stringify({os: "Android", latest_version: version}));
  setAuth(listUrl);

  for (let attempt = 0; attempt < 8; attempt += 1) {
    await sleep(attempt === 0 ? 3000 : 2000);
    try {
      const response = await performRequest({method: "GET", url: listUrl.toString(), headers: {}});
      const id = Array.isArray(response?.json?.aaData) ? findFirstId(response.json.aaData) : null;
      if (response.ok && id) {
        STATE.firstCrashGroupId = id;
        STATE.createdCrashGroupIds.push(id);
        await getFirstCrashDrillReportId();
        return id;
      }
    }
    catch {
      // Retry while crash aggregation catches up.
    }
  }

  STATE.firstCrashReportId = null;
  STATE.firstCrashDrillReportId = null;
  return null;
}

async function getFirstCrashSymbolId() {
  if (STATE.firstCrashSymbolId !== null) {
    return STATE.firstCrashSymbolId;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedCrashSymbol();
    if (created) {
      STATE.firstCrashSymbolId = created;
      return created;
    }
  }

  const url = new URL("/o", CONFIG.baseUrl);
  url.searchParams.set("method", "crash_symbols");
  if (CONFIG.appId) {
    url.searchParams.set("app_id", CONFIG.appId);
  }
  if (CONFIG.authToken) {
    url.searchParams.set("auth_token", CONFIG.authToken);
  }
  else {
    url.searchParams.set("api_key", CONFIG.apiKey);
  }

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (Array.isArray(response?.json) && response.json.length > 0) {
      STATE.firstCrashSymbolId = findFirstId(response.json) || null;
      return STATE.firstCrashSymbolId;
    }
  }
  catch {
    return null;
  }

  STATE.firstCrashSymbolId = null;
  return null;
}

async function getFirstDashboardId() {
  if (STATE.firstDashboardId !== null) {
    return STATE.firstDashboardId;
  }

  const url = new URL("/o/dashboards/all", CONFIG.baseUrl);
  setAuth(url);

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (Array.isArray(response?.json) && response.json.length > 0) {
      STATE.firstDashboardId = findFirstId(response.json) || null;
      return STATE.firstDashboardId;
    }
  }
  catch {
    // Fall through to optional seeding.
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedDashboard();
    if (created) {
      STATE.firstDashboardId = created;
      return created;
    }
  }

  STATE.firstDashboardId = null;
  return null;
}

async function getFirstAlertId() {
  if (STATE.firstAlertId !== null) {
    return STATE.firstAlertId;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedAlert();
    if (created) {
      STATE.firstAlertId = created;
      return created;
    }
  }

  STATE.firstAlertId = null;
  return null;
}

async function getFirstHookId() {
  if (STATE.firstHookId !== null) {
    return STATE.firstHookId;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedHook();
    if (created) {
      STATE.firstHookId = created;
      return created;
    }
  }

  STATE.firstHookId = null;
  return null;
}

async function getFirstConcurrentAlertId() {
  if (STATE.firstConcurrentAlertId !== null) {
    return STATE.firstConcurrentAlertId;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedConcurrentAlert();
    if (created) {
      STATE.firstConcurrentAlertId = created;
      return created;
    }
  }

  STATE.firstConcurrentAlertId = null;
  return null;
}

async function getFirstFeedbackWidgetId() {
  if (STATE.firstFeedbackWidgetId !== null) {
    return STATE.firstFeedbackWidgetId;
  }

  const seeded = STATE.createdFeedbackWidgets.at(-1);
  if (seeded) {
    STATE.firstFeedbackWidgetId = seeded;
    return seeded;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedFeedbackWidget();
    if (created) {
      STATE.firstFeedbackWidgetId = created;
      return created;
    }
  }

  STATE.firstFeedbackWidgetId = null;
  return null;
}

async function getFirstRemoteConfigConditionId() {
  if (STATE.firstRemoteConfigConditionId !== null) {
    return STATE.firstRemoteConfigConditionId;
  }

  const remoteConfigState = await getRemoteConfigState();
  if (Array.isArray(remoteConfigState?.conditions) && remoteConfigState.conditions.length > 0) {
    STATE.firstRemoteConfigConditionId = findFirstId(remoteConfigState.conditions) || null;
    if (STATE.firstRemoteConfigConditionId) {
      return STATE.firstRemoteConfigConditionId;
    }
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedRemoteConfigCondition();
    if (created) {
      STATE.firstRemoteConfigConditionId = created;
      return created;
    }
  }

  STATE.firstRemoteConfigConditionId = null;
  return null;
}

async function getFirstRemoteConfigParameterId() {
  if (STATE.firstRemoteConfigParameterId !== null) {
    return STATE.firstRemoteConfigParameterId;
  }

  const remoteConfigState = await getRemoteConfigState();
  if (Array.isArray(remoteConfigState?.parameters) && remoteConfigState.parameters.length > 0) {
    STATE.firstRemoteConfigParameterId = findFirstId(remoteConfigState.parameters) || null;
    if (STATE.firstRemoteConfigParameterId) {
      return STATE.firstRemoteConfigParameterId;
    }
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedRemoteConfigParameter();
    if (created) {
      STATE.firstRemoteConfigParameterId = created;
      return created;
    }
  }

  STATE.firstRemoteConfigParameterId = null;
  return null;
}

async function getFirstRemoteConfigParameterKey() {
  const remoteConfigState = await getRemoteConfigState();
  if (Array.isArray(remoteConfigState?.parameters) && remoteConfigState.parameters.length > 0) {
    const parameter = remoteConfigState.parameters.find((item) => typeof item?.parameter_key === "string" && item.parameter_key);
    if (parameter?.parameter_key) {
      return parameter.parameter_key;
    }
  }

  const context = await getRemoteConfigParameterDocContext({relativePath: "docs/api/remote-config/generated-sdk-ab.md"});
  return context?.parameterKey || undefined;
}

async function getFirstPushMessageId() {
  if (STATE.firstPushMessageId !== null) {
    return STATE.firstPushMessageId;
  }

  const seeded = STATE.createdPushMessages.at(-1);
  if (seeded) {
    STATE.firstPushMessageId = seeded;
    return seeded;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedPushMessage("api");
    if (created) {
      STATE.firstPushMessageId = created;
      return created;
    }
  }

  STATE.firstPushMessageId = null;
  return null;
}

async function getFirstPushToggleMessageId() {
  if (STATE.firstPushToggleMessageId !== null) {
    return STATE.firstPushToggleMessageId;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedPushMessage("cohort");
    if (created) {
      STATE.firstPushToggleMessageId = created;
      return created;
    }
  }

  STATE.firstPushToggleMessageId = null;
  return null;
}

async function getFirstDrillBookmarkId() {
  if (STATE.firstDrillBookmarkId !== null) {
    return STATE.firstDrillBookmarkId;
  }

  const seeded = STATE.createdDrillBookmarks.at(-1);
  if (seeded) {
    STATE.firstDrillBookmarkId = seeded;
    return seeded;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedDrillBookmark();
    if (created) {
      STATE.firstDrillBookmarkId = created;
      return created;
    }
  }

  STATE.firstDrillBookmarkId = null;
  return null;
}

async function getFirstAbExperimentId() {
  if (STATE.firstAbExperimentId !== null) {
    return STATE.firstAbExperimentId;
  }

  const seeded = STATE.createdAbExperiments.at(-1);
  if (seeded) {
    STATE.firstAbExperimentId = seeded.experimentId;
    return seeded.experimentId;
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedAbExperiment();
    if (created?.experimentId) {
      STATE.firstAbExperimentId = created.experimentId;
      return created.experimentId;
    }
  }

  STATE.firstAbExperimentId = null;
  return null;
}

async function getFirstNoteId() {
  if (STATE.firstNoteId !== null) {
    return STATE.firstNoteId;
  }

  try {
    const url = new URL("/o/notes", CONFIG.baseUrl);
    setAuth(url);
    url.searchParams.set("app_id", CONFIG.appId);
    url.searchParams.set("period", "365days");
    url.searchParams.set("notes_apps", JSON.stringify([CONFIG.appId]));
    url.searchParams.set("iDisplayStart", "0");
    url.searchParams.set("iDisplayLength", "50");
    url.searchParams.set("sEcho", "1");
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const rows = response?.json?.aaData;
    if (Array.isArray(rows) && rows.length > 0) {
      const id = findFirstId(rows);
      STATE.firstNoteId = id || null;
      return STATE.firstNoteId;
    }
  }
  catch {
    // Fall through to seeding.
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedNote();
    if (created) {
      STATE.firstNoteId = created;
      return created;
    }
  }

  STATE.firstNoteId = null;
  return null;
}

async function getFirstDatePresetId() {
  if (STATE.firstDatePresetId !== null) {
    return STATE.firstDatePresetId;
  }

  try {
    const url = new URL("/o/date_presets/getAll", CONFIG.baseUrl);
    setAuth(url);
    url.searchParams.set("app_id", CONFIG.appId);
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (Array.isArray(response?.json) && response.json.length > 0) {
      const id = findFirstId(response.json);
      STATE.firstDatePresetId = id || null;
      return STATE.firstDatePresetId;
    }
  }
  catch {
    // Fall through to seeding.
  }

  if (CONFIG.allowMutation) {
    const created = await createSeedDatePreset();
    if (created) {
      STATE.firstDatePresetId = created;
      return created;
    }
  }

  STATE.firstDatePresetId = null;
  return null;
}

async function getFirstAppUserExportId() {
  if (STATE.firstAppUserExportId !== null) {
    return STATE.firstAppUserExportId;
  }

  const seeded = STATE.createdAppUserExportIds.at(-1);
  if (seeded) {
    STATE.firstAppUserExportId = seeded;
    return seeded;
  }

  if (CONFIG.allowMutation) {
    const created = await createAppUserExport();
    if (created) {
      STATE.firstAppUserExportId = created;
      return created;
    }
  }

  STATE.firstAppUserExportId = null;
  return null;
}

async function getAllDashboardUsers() {
  const url = new URL("/o/users/all", CONFIG.baseUrl);
  setAuth(url);

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (response.ok && response.json && typeof response.json === "object" && !Array.isArray(response.json)) {
      return Object.values(response.json);
    }
  }
  catch {
    return [];
  }

  return [];
}

async function getAssignableMemberEmail() {
  if (STATE.assignableMemberEmail !== null) {
    return STATE.assignableMemberEmail;
  }

  const users = await getAllDashboardUsers();
  const candidate = users.find((user) => user && user.email && user.global_admin !== true && user.locked !== true);
  if (candidate?.email) {
    STATE.assignableMemberEmail = candidate.email;
    return STATE.assignableMemberEmail;
  }

  const created = await createSeedDashboardUser();
  if (created?.email) {
    STATE.assignableMemberEmail = created.email;
    return STATE.assignableMemberEmail;
  }

  STATE.assignableMemberEmail = candidate?.email || null;
  return STATE.assignableMemberEmail;
}

async function getFirstGroupId() {
  if (STATE.firstGroupId !== null) {
    return STATE.firstGroupId;
  }

  const url = new URL("/o/groups", CONFIG.baseUrl);
  setAuth(url);

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (response.ok && Array.isArray(response.json)) {
      STATE.firstGroupId = findFirstId(response.json) || null;
      return STATE.firstGroupId;
    }
  }
  catch {
    // Fall through to seeded create.
  }

  const created = await createSeedGroup();
  if (created?._id) {
    STATE.firstGroupId = created._id;
    return STATE.firstGroupId;
  }

  STATE.firstGroupId = null;
  return null;
}

async function getFirstEventGroupId() {
  if (STATE.firstEventGroupId !== null) {
    return STATE.firstEventGroupId;
  }

  const url = new URL("/o", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("method", "get_event_groups");
  url.searchParams.set("app_id", CONFIG.appId);

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (response.ok && Array.isArray(response.json)) {
      STATE.firstEventGroupId = findFirstId(response.json) || null;
      return STATE.firstEventGroupId;
    }
  }
  catch {
    // Fall through to seeded create.
  }

  const created = await createSeedEventGroup();
  if (created?._id) {
    STATE.firstEventGroupId = created._id;
    return STATE.firstEventGroupId;
  }

  STATE.firstEventGroupId = null;
  return null;
}

async function getRemoteConfigState() {
  const url = new URL("/o", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("method", "remote-config");
  url.searchParams.set("app_id", CONFIG.appId);

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (response.ok && response.json && typeof response.json === "object") {
      return response.json;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function getFirstDashboardWidgetId() {
  if (STATE.firstDashboardWidgetId !== null) {
    return STATE.firstDashboardWidgetId;
  }

  const dashboardId = await getFirstDashboardId();
  if (!dashboardId) {
    STATE.firstDashboardWidgetId = null;
    return null;
  }

  try {
    const dashboardUrl = new URL("/o/dashboards", CONFIG.baseUrl);
    setAuth(dashboardUrl);
    dashboardUrl.searchParams.set("dashboard_id", dashboardId);
    const response = await performRequest({method: "GET", url: dashboardUrl.toString(), headers: {}});
    const widgets = response?.json?.widgets;
    if (Array.isArray(widgets) && widgets.length > 0) {
      const existingId = findFirstId(widgets);
      if (existingId) {
        STATE.firstDashboardWidgetId = existingId;
        return existingId;
      }
    }
  }
  catch {
    // Fall through to seeding.
  }

  const widgetId = await createSeedDashboardWidget(dashboardId);
  STATE.firstDashboardWidgetId = widgetId || null;
  return STATE.firstDashboardWidgetId;
}

async function getDashboardDocContext(doc) {
  const key = `${doc.relativePath}::dashboard`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const dashboardId = await createSeedDashboard();
  if (!dashboardId) {
    return null;
  }

  const context = {dashboardId, widgetId: null};
  STATE.docContexts.set(key, context);
  return context;
}

async function getDashboardWidgetDocContext(doc) {
  const key = `${doc.relativePath}::dashboard-widget`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const dashboardId = await createSeedDashboard();
  if (!dashboardId) {
    return null;
  }

  const widgetId = await createSeedDashboardWidget(dashboardId);
  if (!widgetId) {
    return null;
  }

  const context = {dashboardId, widgetId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getSurveyWidgetDocContext(doc, kind) {
  const key = `${doc.relativePath}::survey-widget::${kind}`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const widgetId = await createSeedSurveyWidget(kind);
  if (!widgetId) {
    return null;
  }

  const context = {kind, widgetId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getTaskDocContext(doc) {
  const key = `${doc.relativePath}::task`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  let taskId = await createExportTask(`docs-validator-${Date.now()}`);
  if (!taskId && doc.endpoint.startsWith("/o/tasks/")) {
    taskId = await getListedTaskId();
  }
  if (!taskId) {
    return null;
  }

  const context = {taskId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getDatePresetDocContext(doc) {
  const key = `${doc.relativePath}::date-preset`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const presetId = await createSeedDatePreset();
  if (!presetId) {
    return null;
  }

  const context = {presetId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getFunnelDocContext(doc) {
  const key = `${doc.relativePath}::funnel`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const funnelId = await createSeedFunnel();
  if (!funnelId) {
    return null;
  }

  const context = {funnelId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getFlowDocContext(doc) {
  const key = `${doc.relativePath}::flow`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const flowId = await createSeedFlow();
  if (!flowId) {
    return null;
  }

  const context = {flowId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getGeoLocationDocContext(doc) {
  const key = `${doc.relativePath}::geo-location`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const geoLocationId = await createSeedGeoLocation();
  if (!geoLocationId) {
    return null;
  }

  const context = {geoLocationId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getViewDocContext(doc) {
  const key = `${doc.relativePath}::view`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const viewId = await createSeedView(`docs-validator-view-${makeDocSlug(doc)}`);
  if (!viewId) {
    return null;
  }

  const context = {viewId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getFormulaDocContext(doc) {
  const key = `${doc.relativePath}::formula`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const formulaId = await createSeedFormula(`docs_validator_formula_${makeDocSlug(doc)}_${Date.now()}`);
  if (!formulaId) {
    return null;
  }

  const context = {formulaId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getCrashSymbolDocContext(doc) {
  const key = `${doc.relativePath}::crash-symbol`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const symbolId = await createSeedCrashSymbol(`docs-validator-symbol-${makeDocSlug(doc)}-${Date.now()}`);
  if (!symbolId) {
    return null;
  }

  const context = {symbolId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getDataManagerEventDocContext(doc) {
  const key = `${doc.relativePath}::data-manager-event`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const slug = makeDocSlug(doc);
  const eventKey = `docs_validator_event_${slug}_${Date.now()}`;
  const segmentName = "docs_validator_segment";
  const created = await createSeedDataManagerEvent(eventKey, segmentName);
  if (!created) {
    return null;
  }

  const context = {eventKey, segmentName};
  STATE.docContexts.set(key, context);
  return context;
}

async function getDataManagerTransformationDocContext(doc) {
  const key = `${doc.relativePath}::data-manager-transformation`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const transformationId = await createSeedDataManagerTransformation(makeDocSlug(doc));
  if (!transformationId) {
    return null;
  }

  const context = {transformationId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getJourneyDocContext(doc) {
  const key = `${doc.relativePath}::journey-engine`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const context = await createSeedJourneyDefinition(makeDocSlug(doc));
  if (!context?.journeyDefinitionId || !context?.versionId) {
    return null;
  }

  STATE.docContexts.set(key, context);
  return context;
}

async function getDrillBookmarkDocContext(doc) {
  const key = `${doc.relativePath}::drill-bookmark`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const bookmarkId = await createSeedDrillBookmark();
  if (!bookmarkId) {
    return null;
  }

  const context = {bookmarkId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getCohortDocContext(doc, type = "auto") {
  const key = `${doc.relativePath}::cohort::${type}`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const cohortId = await createSeedCohort(type);
  if (!cohortId) {
    return null;
  }

  const context = {cohortId, type};
  STATE.docContexts.set(key, context);
  return context;
}

async function getManualCohortMembershipDocContext(doc) {
  const key = `${doc.relativePath}::manual-cohort-membership`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const context = await getCohortDocContext(doc, "manual");
  const user = await createSeedAppUser(CONFIG.appId);
  if (!context?.cohortId || !user?.uid) {
    return null;
  }

  const url = new URL("/i/cohorts/add_users", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("cohort", context.cohortId);
  url.searchParams.set("uids", JSON.stringify([user.uid]));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (!response.ok) {
      return null;
    }
  }
  catch {
    return null;
  }

  const membershipContext = {...context, uid: user.uid};
  STATE.docContexts.set(key, membershipContext);
  return membershipContext;
}

async function getNoteDocContext(doc) {
  const key = `${doc.relativePath}::note`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const noteId = await createSeedNote();
  if (!noteId) {
    return null;
  }

  const context = {noteId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getDashboardUserDocContext(doc) {
  const key = `${doc.relativePath}::dashboard-user`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const created = await createSeedDashboardUser();
  if (!created?._id) {
    return null;
  }

  STATE.docContexts.set(key, created);
  return created;
}

async function getSelfDeletableDashboardUserDocContext(doc) {
  const key = `${doc.relativePath}::dashboard-user-self-delete`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const created = await createSeedSelfDeletableDashboardUser();
  if (!created?._id || !created?.api_key) {
    return null;
  }

  STATE.docContexts.set(key, created);
  return created;
}

async function getAppDocContext(doc) {
  const key = `${doc.relativePath}::app`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const created = await createSeedApp();
  if (!created?.appId) {
    return null;
  }

  STATE.docContexts.set(key, created);
  return created;
}

async function getAppUserDocContext(doc) {
  const key = `${doc.relativePath}::app-user`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const created = await createSeedAppUser(CONFIG.appId);
  if (!created?.did) {
    return null;
  }

  STATE.docContexts.set(key, created);
  return created;
}

async function getGroupDocContext(doc) {
  const key = `${doc.relativePath}::group`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const created = await createSeedGroup();
  if (!created?._id) {
    return null;
  }

  STATE.docContexts.set(key, created);
  return created;
}

async function getGroupMembershipDocContext(doc) {
  const key = `${doc.relativePath}::group-membership`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const group = await createSeedGroup();
  const email = await getAssignableMemberEmail();
  if (!group?._id || !email) {
    return null;
  }

  const url = new URL("/i/groups/save-user-group", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("args", JSON.stringify({email, group_id: [group._id]}));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (!response.ok) {
      return null;
    }
  }
  catch {
    return null;
  }

  const context = {_id: group._id, name: group.name, groupID: group.groupID, email};
  STATE.docContexts.set(key, context);
  return context;
}

async function getEventGroupDocContext(doc) {
  const key = `${doc.relativePath}::event-group`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const created = await createSeedEventGroup();
  if (!created?._id) {
    return null;
  }

  STATE.docContexts.set(key, created);
  return created;
}

async function getAiThreadDocContext(doc) {
  const key = `${doc.relativePath}::ai-thread`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const threadId = await createSeedAiThread();
  if (!threadId) {
    return null;
  }

  const context = {threadId};
  STATE.docContexts.set(key, context);
  return context;
}

async function getBlockDocContext(doc) {
  const key = `${doc.relativePath}::block`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const created = await createSeedBlock();
  if (!created?._id) {
    return null;
  }

  STATE.docContexts.set(key, created);
  return created;
}

async function getContentBlockDocContext(doc) {
  const key = `${doc.relativePath}::content-block`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const created = await createSeedContentBlock();
  if (!created?._id) {
    return null;
  }

  STATE.docContexts.set(key, created);
  return created;
}

async function getContentAssetDocContext(doc) {
  const key = `${doc.relativePath}::content-asset`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const created = await createSeedContentAsset(false);
  if (!created?._id) {
    return null;
  }

  STATE.docContexts.set(key, created);
  return created;
}

async function getPopulatorTemplateDocContext(doc) {
  const key = `${doc.relativePath}::populator-template`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const created = await createSeedPopulatorTemplate(false);
  if (!created?.templateId) {
    return null;
  }

  STATE.docContexts.set(key, created);
  return created;
}

async function getPopulatorEnvironmentDocContext(doc) {
  const key = `${doc.relativePath}::populator-environment`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const created = await createSeedPopulatorEnvironment(false);
  if (!created?.environmentId || !created?.templateId) {
    return null;
  }

  STATE.docContexts.set(key, created);
  return created;
}

async function getAbExperimentDocContext(doc) {
  const key = `${doc.relativePath}::ab-experiment`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const created = await createSeedAbExperiment();
  if (!created?.experimentId) {
    return null;
  }

  STATE.docContexts.set(key, created);
  return created;
}

async function getRunningAbExperimentDocContext(doc) {
  const key = `${doc.relativePath}::ab-experiment-running`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const created = await createSeedAbExperiment();
  if (!created?.experimentId) {
    return null;
  }

  const started = await startAbExperiment(created.experimentId);
  if (!started) {
    return null;
  }

  const context = {...created, status: "running"};
  STATE.docContexts.set(key, context);
  return context;
}

function findFirstId(items, preferredKeys = ["_id", "id"]) {
  for (const item of items) {
    if (!item || typeof item !== "object") {
      continue;
    }
    for (const key of preferredKeys) {
      if (typeof item[key] === "string" && item[key]) {
        return item[key];
      }
    }
  }
  return null;
}

function extractObjectId(value) {
  if (typeof value !== "string") {
    return null;
  }
  const match = value.match(/\b[a-f0-9]{24}\b/i);
  return match ? match[0] : null;
}

function setAuth(url) {
  if (CONFIG.apiKey) {
    url.searchParams.set("api_key", CONFIG.apiKey);
  }
  else if (CONFIG.authToken) {
    url.searchParams.set("auth_token", CONFIG.authToken);
  }
}

function withAppId(value) {
  return value.replaceAll("__APP_ID__", CONFIG.appId);
}

function createSha1(value) {
  return crypto.createHash("sha1").update(String(value)).digest("hex");
}

async function createSeedFunnel() {
  const url = new URL("/i/funnels/add", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("funnel_name", `Docs Validator Funnel ${Date.now()}`);
  url.searchParams.set("funnel_desc", "Temporary funnel created by docs validator");
  url.searchParams.set("funnel_type", "session-independent");
  url.searchParams.set("steps", '["[CLY]_session","[CLY]_view"]');
  url.searchParams.set("queries", '["{}","{}"]');
  url.searchParams.set("queryTexts", '["All Users","All Users"]');
  url.searchParams.set("stepGroups", '[{"c":"and"},{"c":"and"}]');

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = response?.json?.result;
    if (response.ok && typeof id === "string" && id) {
      STATE.createdFunnels.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function findFlowIdByName(name) {
  const url = new URL("/o/flows", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("method", "list");
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("iDisplayLength", "50");
  if (name) {
    url.searchParams.set("sSearch", name);
  }

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const rows = response?.json?.aaData;
    if (!Array.isArray(rows)) {
      return null;
    }

    const row = name
      ? rows.find((item) => item?.name === name)
      : rows.find((item) => typeof item?._id === "string" && item._id.startsWith(`${CONFIG.appId}_`));
    return typeof row?._id === "string" ? row._id : null;
  }
  catch {
    return null;
  }
}

async function createSeedFlow() {
  const name = `Docs Validator Flow ${Date.now()}`;
  const url = new URL("/i/flows/create", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("name", name);
  url.searchParams.set("type", "events");
  url.searchParams.set("start", '{"event":"[CLY]_session"}');
  url.searchParams.set("end", '{"event":"[CLY]_view"}');
  url.searchParams.set("exclude", "[]");
  url.searchParams.set("user_segmentation", "{}");
  url.searchParams.set("period", CONFIG.defaultPeriod);
  url.searchParams.set("disabled", "false");

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (!response.ok) {
      return null;
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      const id = await findFlowIdByName(name);
      if (id) {
        STATE.createdFlowIds.push(id);
        return id;
      }
      await sleep(500);
    }
  }
  catch {
    return null;
  }

  return null;
}

function buildGeoLocationArgs() {
  return {
    title: `Docs Validator Location ${Date.now()}`,
    radius: 5,
    unit: "km",
    geo: {
      type: "Point",
      coordinates: [24.1052, 56.9496]
    },
    app: CONFIG.appId
  };
}

async function createSeedGeoLocation() {
  const url = new URL("/i/geolocations/create", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("args", JSON.stringify(buildGeoLocationArgs()));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = response?.json?._id;
    if (response.ok && typeof id === "string" && id) {
      STATE.createdGeoLocations.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedView(name = `docs-validator-view-${Date.now()}`) {
  const url = new URL("/i", CONFIG.baseUrl);
  url.searchParams.set("app_key", CONFIG.appKey);
  url.searchParams.set("device_id", `${DUMMY.deviceId}-view`);
  url.searchParams.set("events", JSON.stringify([{
    key: "[CLY]_view",
    count: 1,
    segmentation: {name, visit: 1, start: 1}
  }]));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (!response.ok) {
      return null;
    }
    const viewId = `${CONFIG.appId}_${crypto.createHash("md5").update(name).digest("hex")}`;
    STATE.createdViewIds.push(viewId);
    await sleep(1000);
    return viewId;
  }
  catch {
    return null;
  }
}

function buildFormulaBuilderPayload() {
  return [{
    variables: [{
      selectedOperator: "add",
      group: {lpt: false, rpt: false},
      ex: {_do: "numberOf", _args: ["sessions"]}
    }]
  }];
}

function buildFormulaMetricPayload(key = `docs_validator_formula_${Date.now()}`) {
  return {
    title: `Docs Validator Formula ${Date.now()}`,
    description: DUMMY.description,
    key,
    visibility: "global",
    format: "float",
    dplaces: 2,
    unit: "",
    formula: JSON.stringify(buildFormulaBuilderPayload()),
    shared_email_edit: [],
    app: CONFIG.appId
  };
}

async function createSeedFormula(key) {
  const url = new URL("/i/calculated_metrics/save", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("metric", JSON.stringify(buildFormulaMetricPayload(key)));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = response?.json?.id;
    if (response.ok && typeof id === "string" && id) {
      STATE.createdFormulaIds.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedCrashSymbol(build = `docs-validator-symbol-${Date.now()}`) {
  const url = new URL("/i/crash_symbols/add_symbol", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("platform", "javascript");
  url.searchParams.set("build", build);
  url.searchParams.set("note", "Temporary symbol created by docs validator");

  try {
    const response = await performRequest({
      method: "POST",
      url: url.toString(),
      headers: {},
      multipart: [
        {
          name: "symbols",
          filePath: VALIDATOR_SOURCE_MAP_FILE,
          contentType: "application/json"
        }
      ]
    });
    const id = response?.json?._id || extractObjectId(response?.text || "");
    if (response.ok && id) {
      STATE.firstCrashSymbolId = String(id);
      STATE.createdCrashSymbolIds.push(String(id));
      return String(id);
    }
  }
  catch {
    return null;
  }

  return null;
}

function buildDataManagerEventPayload(eventKey, segmentName = "docs_validator_segment") {
  return {
    key: eventKey,
    name: `Docs Validator Event ${eventKey}`,
    description: DUMMY.description,
    segments: [{
      name: segmentName,
      type: "s",
      description: "Docs validator segment"
    }]
  };
}

function buildDataManagerTransformationPayload(slug = "default") {
  return {
    actionType: "rename",
    parentEvent: "CUSTOM_PROPERTY",
    transformTarget: [`docs_validator_prop_${slug}`],
    transformResult: `docs_validator_prop_${slug}_${Date.now()}`,
    transformationProcessTarget: "incoming"
  };
}

async function createSeedDataManagerEvent(eventKey, segmentName) {
  const url = new URL("/i/data-manager/event", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("event", JSON.stringify(buildDataManagerEventPayload(eventKey, segmentName)));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    return response.ok;
  }
  catch {
    return false;
  }
}

async function createSeedDataManagerTransformation(slug = "default") {
  const payload = buildDataManagerTransformationPayload(slug);
  const url = new URL("/i/data-manager/transformation", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("transformation", JSON.stringify(payload));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (!response.ok) {
      return null;
    }

    const listUrl = new URL("/o/data-manager/transformation", CONFIG.baseUrl);
    setAuth(listUrl);
    listUrl.searchParams.set("app_id", CONFIG.appId);
    const listResponse = await performRequest({method: "GET", url: listUrl.toString(), headers: {}});
    const rows = Array.isArray(listResponse?.json) ? listResponse.json : [];
    const created = rows.find((item) => item?.transformResult === payload.transformResult);
    const id = created?._id || null;
    if (id) {
      STATE.createdDataManagerTransformationIds.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

function buildJourneyBlocks() {
  return [{
    id: "block_1",
    blockType: "trigger",
    subType: "incoming-data",
    filters: [{key: "[CLY]_session"}],
    nextBlock: "block_2"
  }, {
    id: "block_2",
    blockType: "end",
    subType: "end"
  }];
}

function buildJourneySavePayload(slug = "default", context = null) {
  return {
    ...(context?.journeyDefinitionId ? {_id: context.journeyDefinitionId} : {}),
    app_id: CONFIG.appId,
    name: `Docs Validator Journey ${slug} ${Date.now()}`,
    version: {
      ...(context?.versionId ? {_id: context.versionId} : {}),
      blocks: buildJourneyBlocks()
    },
    skip_threshold: 0
  };
}

async function createSeedJourneyDefinition(slug = "default") {
  const url = new URL("/i/journey-engine/journeys/save", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  const payload = buildJourneySavePayload(slug);

  try {
    const response = await performRequest({
      method: "POST",
      url: url.toString(),
      headers: {"content-type": "application/json"},
      body: JSON.stringify(payload)
    });
    const journeyDefinitionId = response?.json?._id || extractObjectId(response?.text || "");
    const versionId = Array.isArray(response?.json?.versions)
      ? findFirstId(response.json.versions)
      : null;
    if (response.ok && journeyDefinitionId && versionId) {
      STATE.createdJourneyDefinitionIds.push(journeyDefinitionId);
      return {journeyDefinitionId, versionId, name: payload.name};
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedCohort(type = "auto") {
  const url = new URL("/i/cohorts/add", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("cohort_name", `Docs Validator Cohort ${Date.now()}`);
  url.searchParams.set("cohort_desc", "Temporary cohort created by docs validator");
  url.searchParams.set("type", type);
  if (type !== "manual") {
    url.searchParams.set("steps", `[{"event":"[CLY]_session","type":"did","period":"${CONFIG.defaultPeriod}"}]`);
  }

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = response?.json?.result;
    if (response.ok && typeof id === "string" && id) {
      STATE.createdCohorts.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createExportTask(filename = `docs-validator-${Date.now()}`) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const url = new URL("/o/export/requestQuery", CONFIG.baseUrl);
    setAuth(url);
    url.searchParams.set("app_id", CONFIG.appId);
    url.searchParams.set("path", "/o/analytics/events");
    url.searchParams.set("data", JSON.stringify({app_id: CONFIG.appId, period: CONFIG.defaultPeriod}));
    url.searchParams.set("type", "json");
    url.searchParams.set("filename", attempt === 0 ? filename : `${filename}-${attempt}`);

    try {
      const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
      const id = response?.json?.result?.task_id;
      if (response.ok && typeof id === "string" && id) {
        STATE.createdTaskIds.push(id);
        return id;
      }
    }
    catch {
      // Retry below.
    }

    if (attempt < 2) {
      await sleep(Math.max(CONFIG.interRequestDelayMs, 2000) * (attempt + 1));
    }
  }

  return null;
}

async function createAppUserExport() {
  const url = new URL("/i/app_users/export", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("query", "{}");

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = response?.json?.result?.task_id
      || response?.json?.task_id
      || (typeof response?.json?.result === "string" ? response.json.result : null);
    if (response.ok && typeof id === "string" && id) {
      STATE.createdAppUserExportIds.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedDashboardUser() {
  const suffix = Date.now();
  const email = `docs-validator-${suffix}@example.com`;
  const username = `docs_validator_${suffix}`;
  const password = "DocsValidator123!A";
  const url = new URL("/i/users/create", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("args", JSON.stringify({
    full_name: `Docs Validator User ${suffix}`,
    username,
    password,
    email,
    global_admin: false
  }));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = response?.json?._id || extractObjectId(response?.text);
    if (response.ok && typeof id === "string" && id) {
      STATE.createdUserIds.push(id);
      return {_id: id, email, username, password, api_key: response?.json?.api_key};
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedSelfDeletableDashboardUser() {
  const suffix = Date.now();
  const email = `docs-validator-self-${suffix}@example.com`;
  const username = `docs_validator_self_${suffix}`;
  const password = "DocsValidator123!A";
  const url = new URL("/i/users/create", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("args", JSON.stringify({
    full_name: `Docs Validator Self Delete ${suffix}`,
    username,
    password,
    email,
    global_admin: true
  }));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = response?.json?._id || extractObjectId(response?.text);
    if (response.ok && typeof id === "string" && id) {
      return {_id: id, email, username, password, api_key: response?.json?.api_key};
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedApp() {
  const suffix = Date.now();
  const url = new URL("/i/apps/create", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("args", JSON.stringify({
    name: `Docs Validator App ${suffix}`,
    country: "US",
    timezone: "Etc/UTC",
    category: "6",
    type: "mobile"
  }));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const app = response?.json;
    const id = app?._id || extractObjectId(response?.text);
    if (response.ok && typeof id === "string" && id) {
      const created = {
        appId: id,
        name: app?.name || `Docs Validator App ${suffix}`
      };
      STATE.createdAppIds.push(id);
      return created;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedAppUser(appId = CONFIG.appId) {
  const suffix = Date.now();
  const did = `docs-validator-device-${suffix}`;
  const url = new URL("/i/app_users/create", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", appId);
  url.searchParams.set("data", JSON.stringify({
    did,
    name: `Docs Validator App User ${suffix}`
  }));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (!response.ok) {
      return null;
    }
    const resultText = typeof response?.json?.result === "string" ? response.json.result : response?.text;
    const uidMatch = typeof resultText === "string" ? resultText.match(/"uid":"([^"]+)"/) : null;
    const idMatch = typeof resultText === "string" ? resultText.match(/"_id":"([^"]+)"/) : null;
    const created = {
      appId,
      did,
      uid: uidMatch?.[1] || null,
      _id: idMatch?.[1] || extractObjectId(resultText)
    };
    STATE.createdAppUsers.push(created);
    return created;
  }
  catch {
    return null;
  }
}

function buildGroupPermission() {
  return {
    _: {u: [], a: []},
    c: {},
    r: {},
    u: {},
    d: {}
  };
}

async function createSeedGroup() {
  const name = `Docs Validator Group ${Date.now()}`;
  const groupID = `docs-validator-group-${Date.now()}`;
  const url = new URL("/i/groups/create", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("args", JSON.stringify({
    name,
    groupID,
    global_admin: false,
    permission: buildGroupPermission()
  }));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const group = response?.json?.result?.group;
    const id = group?._id || extractObjectId(response?.text);
    if (response.ok && typeof id === "string" && id) {
      const created = {_id: id, name: group?.name || name, groupID: group?.groupID || groupID};
      STATE.createdGroups.push(id);
      return created;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedAiThread() {
  if (STATE.firstAiThreadId !== null) {
    return STATE.firstAiThreadId;
  }

  try {
    const url = new URL("/i/ai-assistants/create-thread", CONFIG.baseUrl);
    setAuth(url);
    url.searchParams.set("app_id", CONFIG.appId);
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (response.ok) {
      const threadId = response?.json?._id || response?.json?.value?._id || null;
      STATE.firstAiThreadId = threadId;
      return threadId;
    }
  }
  catch {
    // Ignore seed failure and fall back to null.
  }

  STATE.firstAiThreadId = null;
  return null;
}

async function createSeedBlock() {
  if (STATE.firstBlockId !== null) {
    return STATE.firstBlockId ? {_id: STATE.firstBlockId} : null;
  }

  const name = `Docs Validator Block ${Date.now()}`;
  const block = {
    type: "event",
    key: "docs_validator_never_block",
    name,
    rule: {"segmentation.__docs_validator_never__": {$in: ["1"]}},
    status: false
  };

  try {
    const createUrl = new URL("/i/blocks/create", CONFIG.baseUrl);
    setAuth(createUrl);
    createUrl.searchParams.set("app_id", CONFIG.appId);
    createUrl.searchParams.set("blocks", JSON.stringify(block));
    const createResponse = await performRequest({method: "GET", url: createUrl.toString(), headers: {}});
    if (!createResponse.ok) {
      STATE.firstBlockId = null;
      return null;
    }

    const listUrl = new URL("/o/blocks", CONFIG.baseUrl);
    setAuth(listUrl);
    listUrl.searchParams.set("app_id", CONFIG.appId);
    const listResponse = await performRequest({method: "GET", url: listUrl.toString(), headers: {}});
    const items = Array.isArray(listResponse?.json)
      ? listResponse.json
      : Array.isArray(listResponse?.json?.aaData)
        ? listResponse.json.aaData
        : [];
    const created = items.find((item) => item?.name === name);
    const blockId = created?._id || created?.id || null;
    if (!blockId) {
      STATE.firstBlockId = null;
      return null;
    }

    STATE.firstBlockId = blockId;
    STATE.createdBlocks.push(blockId);
    return {_id: blockId, name};
  }
  catch {
    STATE.firstBlockId = null;
    return null;
  }
}

async function createSeedContentBlock() {
  if (STATE.firstContentBlockId !== null) {
    return STATE.firstContentBlockId ? {_id: STATE.firstContentBlockId} : null;
  }

  try {
    const url = new URL("/i/content/save", CONFIG.baseUrl);
    setAuth(url);
    url.searchParams.set("app_id", CONFIG.appId);
    url.searchParams.set("type", "modal");
    url.searchParams.set("blocks", JSON.stringify([{
      layout: "modal",
      elements: {
        title: {
          text: "Docs Validator Content"
        }
      }
    }]));
    url.searchParams.set("details", JSON.stringify({
      title: `Docs Validator Content ${Date.now()}`,
      creatorId: (await getCurrentUser())?._id || "",
      favorite: false,
      created: 0
    }));

    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const contentId = response?.json?.contentId || extractObjectId(response?.text || "");
    if (!response.ok || !contentId) {
      STATE.firstContentBlockId = null;
      return null;
    }

    STATE.firstContentBlockId = contentId;
    STATE.createdContentBlockIds.push(contentId);
    return {_id: contentId};
  }
  catch {
    STATE.firstContentBlockId = null;
    return null;
  }
}

async function createSeedContentAsset(reuseCached = true) {
  if (reuseCached && STATE.firstContentAssetId !== null) {
    return STATE.firstContentAssetId ? {_id: STATE.firstContentAssetId} : null;
  }

  const name = `docs-validator-asset-${Date.now()}.png`;
  const url = new URL("/i/content/asset-upload", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("name", name);
  url.searchParams.set("tags", '["docs-validator"]');

  try {
    const response = await performRequest({
      method: "POST",
      url: url.toString(),
      headers: {},
      multipart: [
        {
          name: "assets",
          filePath: VALIDATOR_UPLOAD_FILE,
          contentType: "image/png"
        }
      ]
    });
    if (!response.ok) {
      STATE.firstContentAssetId = null;
      return null;
    }

    const listUrl = new URL("/o/content/assets", CONFIG.baseUrl);
    setAuth(listUrl);
    listUrl.searchParams.set("app_id", CONFIG.appId);
    const listResponse = await performRequest({method: "GET", url: listUrl.toString(), headers: {}});
    const items = Array.isArray(listResponse?.json) ? listResponse.json : [];
    const created = items.find((item) => item?.name === name || item?.filename === name || item?.metadata?.name === name);
    const assetId = created?._id || created?.id || response?.json?.assetId || extractObjectId(response?.text || "");
    if (!assetId) {
      STATE.firstContentAssetId = null;
      return null;
    }

    if (reuseCached) {
      STATE.firstContentAssetId = assetId;
    }
    STATE.createdContentAssetIds.push(assetId);
    return {_id: assetId};
  }
  catch {
    if (reuseCached) {
      STATE.firstContentAssetId = null;
    }
    return null;
  }
}

async function createSeedPopulatorTemplate(reuseCached = true) {
  if (reuseCached && STATE.firstPopulatorTemplateId !== null) {
    return STATE.firstPopulatorTemplateId ? {templateId: STATE.firstPopulatorTemplateId} : null;
  }

  const suffix = Date.now();
  const name = `Docs Validator Template ${suffix}`;
  try {
    const url = new URL("/i/populator/templates/create", CONFIG.baseUrl);
    setAuth(url);
    url.searchParams.set("app_id", CONFIG.appId);

    const response = await performRequest({
      method: "POST",
      url: url.toString(),
      headers: {"content-type": "application/json"},
      body: JSON.stringify({
        app_id: CONFIG.appId,
        api_key: CONFIG.apiKey,
        name,
        uniqueUserCount: 5,
        platformType: ["iOS", "Android"],
        isDefault: false,
        users: [{plan: ["free", "premium"]}],
        events: [],
        views: [],
        sequences: [],
        behavior: {}
      })
    });
    const templateId = extractObjectId(response?.json?.result || response?.text || "");
    if (!response.ok || !templateId) {
      if (reuseCached) {
        STATE.firstPopulatorTemplateId = null;
      }
      return null;
    }

    if (reuseCached) {
      STATE.firstPopulatorTemplateId = templateId;
    }
    STATE.createdPopulatorTemplateIds.push(templateId);
    return {templateId, name};
  }
  catch {
    if (reuseCached) {
      STATE.firstPopulatorTemplateId = null;
    }
    return null;
  }
}

async function createSeedPopulatorEnvironment(reuseCached = true) {
  if (reuseCached && STATE.firstPopulatorEnvironmentId !== null) {
    return STATE.firstPopulatorEnvironmentId ? {
      environmentId: STATE.firstPopulatorEnvironmentId,
      templateId: STATE.firstPopulatorTemplateId
    } : null;
  }

  const template = await createSeedPopulatorTemplate(reuseCached);
  if (!template?.templateId) {
    return null;
  }

  const suffix = Date.now();
  const environmentName = `Docs Validator Environment ${suffix}`;
  const environmentId = createSha1(`${CONFIG.appId}${environmentName}`);
  const users = [
    {
      appId: CONFIG.appId,
      templateId: template.templateId,
      environmentName,
      userName: `docs_validator_${suffix}`,
      platform: "iOS",
      device: "iPhone 15",
      appVersion: "1.0.0",
      deviceId: `docs-validator-device-${suffix}`,
      custom: {plan: "premium"}
    }
  ];

  try {
    const url = new URL("/i/populator/environment/save", CONFIG.baseUrl);
    setAuth(url);
    url.searchParams.set("app_id", CONFIG.appId);
    const params = new URLSearchParams();
    params.set("app_id", CONFIG.appId);
    params.set("api_key", CONFIG.apiKey);
    params.set("setEnviromentInformationOnce", "true");
    params.set("users", JSON.stringify(users));
    const response = await performRequest({
      method: "POST",
      url: url.toString(),
      headers: {"content-type": "application/x-www-form-urlencoded"},
      body: params.toString()
    });
    if (!response.ok) {
      if (reuseCached) {
        STATE.firstPopulatorEnvironmentId = null;
      }
      return null;
    }

    if (reuseCached) {
      STATE.firstPopulatorEnvironmentId = environmentId;
    }
    STATE.createdPopulatorEnvironments.push({environmentId, templateId: template.templateId});
    return {environmentId, templateId: template.templateId, environmentName};
  }
  catch {
    if (reuseCached) {
      STATE.firstPopulatorEnvironmentId = null;
    }
    return null;
  }
}

async function createSeedEventGroup() {
  const name = `Docs Validator Event Group ${Date.now()}`;
  const sourceEvents = ["[CLY]_session"];
  const url = new URL("/i/event_groups/create", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("args", JSON.stringify({
    app_id: CONFIG.appId,
    name,
    source_events: sourceEvents,
    display_map: {},
    status: true,
    description: "Temporary event group created by docs validator"
  }));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (!response.ok) {
      return null;
    }

    const readUrl = new URL("/o", CONFIG.baseUrl);
    setAuth(readUrl);
    readUrl.searchParams.set("method", "get_event_groups");
    readUrl.searchParams.set("app_id", CONFIG.appId);
    const listResponse = await performRequest({method: "GET", url: readUrl.toString(), headers: {}});
    const match = Array.isArray(listResponse?.json)
      ? listResponse.json.find((item) => item && item.name === name)
      : null;
    if (match?._id) {
      const created = {_id: match._id, name: match.name || name};
      STATE.createdEventGroups.push(match._id);
      return created;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedNote() {
  const noteText = `Docs validator note ${Date.now()}`;
  const noteTs = Date.now() - (60 * 60 * 1000);
  const url = new URL("/i/notes/save", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("args", JSON.stringify({
    app_id: CONFIG.appId,
    note: noteText,
    ts: noteTs,
    noteType: "public",
    color: "#F59E0B"
  }));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (!response.ok) {
      return null;
    }
    for (let attempt = 0; attempt < 8; attempt++) {
      await sleep(750);
      const listUrl = new URL("/o/notes", CONFIG.baseUrl);
      setAuth(listUrl);
      listUrl.searchParams.set("app_id", CONFIG.appId);
      listUrl.searchParams.set("period", "365days");
      listUrl.searchParams.set("notes_apps", JSON.stringify([CONFIG.appId]));
      listUrl.searchParams.set("iDisplayStart", "0");
      listUrl.searchParams.set("iDisplayLength", "200");
      listUrl.searchParams.set("sEcho", "1");
      listUrl.searchParams.set("sSearch", noteText);
      const listResponse = await performRequest({method: "GET", url: listUrl.toString(), headers: {}});
      const rows = listResponse?.json?.aaData;
      if (Array.isArray(rows) && rows.length > 0) {
        const seededRow = rows.find((row) => row && typeof row.note === "string" && row.note.includes(noteText));
        const id = seededRow?._id;
        if (id) {
          STATE.createdNoteIds.push(id);
          return id;
        }
      }
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedDatePreset() {
  const url = new URL("/i/date_presets/create", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("name", `Docs Validator Preset ${Date.now()}`);
  url.searchParams.set("range", JSON.stringify(["7days", "today"]));
  url.searchParams.set("share_with", "none");
  url.searchParams.set("shared_email_edit", "[]");
  url.searchParams.set("shared_email_view", "[]");
  url.searchParams.set("shared_user_groups_edit", "[]");
  url.searchParams.set("shared_user_groups_view", "[]");
  url.searchParams.set("exclude_current_day", "false");

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = response?.json?._id || findFirstId([response?.json].filter(Boolean));
    if (response.ok && typeof id === "string" && id) {
      STATE.createdDatePresetIds.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedDashboard() {
  const url = new URL("/i/dashboards/create", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("name", `Docs Validator Dashboard ${Date.now()}`);
  url.searchParams.set("share_with", "none");
  url.searchParams.set("theme", "1");

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = typeof response?.json === "string"
      ? response.json
      : response?.text?.replace(/^"|"$/g, "");
    if (response.ok && typeof id === "string" && id) {
      STATE.createdDashboards.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedDashboardWidget(dashboardId) {
  const url = new URL("/i/dashboards/add-widget", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("dashboard_id", dashboardId);
  url.searchParams.set("widget", withAppId(DUMMY.widget));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = typeof response?.json === "string"
      ? response.json
      : response?.text?.replace(/^"|"$/g, "");
    if (response.ok && typeof id === "string" && id) {
      STATE.createdDashboardWidgets.push({dashboardId, widgetId: id});
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedSurveyWidget(kind) {
  const endpoint = kind === "nps" ? "/i/surveys/nps/create" : "/i/surveys/survey/create";
  const url = new URL(endpoint, CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("name", `${kind.toUpperCase()} ${DUMMY.name}`);
  url.searchParams.set("internalName", `${kind}_docs_validator_${Date.now()}`);
  url.searchParams.set("status", "true");
  url.searchParams.set("msg", DUMMY.surveyMsg);
  url.searchParams.set("appearance", DUMMY.surveyAppearance);
  url.searchParams.set("targeting", DUMMY.surveyTargeting);
  if (kind === "nps") {
    url.searchParams.set("followUpType", "score");
  }
  else {
    url.searchParams.set("questions", DUMMY.surveyQuestions);
  }

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = response?.json?.result?._id;
    if (response.ok && typeof id === "string" && id) {
      STATE.createdSurveyWidgets.push({kind, widgetId: id});
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedAlert() {
  const url = new URL("/i/alert/save", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("alert_config", withAppId(DUMMY.alertConfig));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = typeof response?.json === "string"
      ? response.json
      : response?.text?.replace(/^"|"$/g, "");
    if (response.ok && typeof id === "string" && id) {
      STATE.createdAlerts.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedHook() {
  const url = new URL("/i/hook/save", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("hook_config", withAppId(DUMMY.hookConfig));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = typeof response?.json === "string"
      ? response.json
      : response?.text?.replace(/^"|"$/g, "");
    if (response.ok && typeof id === "string" && id) {
      STATE.createdHooks.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedConcurrentAlert() {
  const url = new URL("/i/concurrent_alert/save", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("alert", DUMMY.concurrentAlert);

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = typeof response?.json === "string"
      ? response.json
      : response?.text?.replace(/^"|"$/g, "");
    if (response.ok && typeof id === "string" && id) {
      STATE.createdConcurrentAlerts.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedFeedbackWidget() {
  const url = new URL("/i/feedback/widgets/create", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("popup_header_text", "Docs Validator Widget");
  url.searchParams.set("popup_comment_callout", "Leave comment");
  url.searchParams.set("popup_email_callout", "Leave email");
  url.searchParams.set("popup_button_callout", "Submit");
  url.searchParams.set("popup_thanks_message", "Thanks for feedback");
  url.searchParams.set("trigger_position", "mleft");
  url.searchParams.set("trigger_bg_color", "#123456");
  url.searchParams.set("trigger_font_color", "#122333");
  url.searchParams.set("trigger_button_text", "Leave feedback");
  url.searchParams.set("target_devices", '{"desktop":false,"phone":true,"tablet":true}');
  url.searchParams.set("target_page", "selected");
  url.searchParams.set("target_pages", '["/"]');
  url.searchParams.set("is_active", "true");
  url.searchParams.set("hide_sticker", "false");

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = extractObjectId(response?.json?.result)
      || (typeof response?.json === "string" ? extractObjectId(response.json) : null)
      || extractObjectId(response?.text);
    if (response.ok && typeof id === "string" && id) {
      STATE.createdFeedbackWidgets.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

function makeDocSlug(doc) {
  return doc.relativePath
    .replace(/^docs\/api\//, "")
    .replace(/\.md$/, "")
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function makeHumanLabel(slug) {
  return slug
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function buildRemoteConfigConditionPayload(name, seedValue, matcher = "iOS") {
  return {
    condition_name: name,
    condition_color: 1,
    condition: {"up._os": {$eq: matcher}},
    seed_value: seedValue
  };
}

function buildRemoteConfigParameterPayload(key, defaultValue = "enabled") {
  return {
    parameter_key: key,
    default_value: defaultValue,
    status: "Running",
    conditions: []
  };
}

async function createSeedRemoteConfigCondition(payload = DUMMY.remoteConfigCondition) {
  const url = new URL("/i/remote-config/add-condition", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("condition", typeof payload === "string" ? payload : JSON.stringify(payload));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = typeof response?.json === "string"
      ? response.json
      : response?.text?.replace(/^"|"$/g, "");
    if (response.ok && typeof id === "string" && id) {
      STATE.createdRemoteConfigConditions.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedRemoteConfigParameter(payload = DUMMY.remoteConfigParameter, expectedKey = null) {
  const url = new URL("/i/remote-config/add-parameter", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("parameter", typeof payload === "string" ? payload : JSON.stringify(payload));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (response.ok) {
      const remoteConfigState = await getRemoteConfigState();
      const parameters = remoteConfigState?.parameters;
      if (Array.isArray(parameters)) {
        const targetKey = expectedKey
          || (typeof payload === "string" ? JSON.parse(payload).parameter_key : payload?.parameter_key);
        const match = parameters.find((item) => item && item.parameter_key === targetKey && typeof item._id === "string");
        if (match?._id) {
          STATE.createdRemoteConfigParameters.push(match._id);
          return match._id;
        }
      }
    }
  }
  catch {
    return null;
  }

  return null;
}

async function getRemoteConfigConditionDocContext(doc) {
  const key = `remote-config-condition:${doc.relativePath}`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const slug = makeDocSlug(doc);
  const suffix = `${slug}_${Date.now()}`;
  const seedValue = `docs_validator_param_${suffix}`;
  const label = makeHumanLabel(slug);
  const createPayload = buildRemoteConfigConditionPayload(`Docs Validator Condition ${label} ${Date.now()}`, seedValue, "iOS");
  const conditionId = await createSeedRemoteConfigCondition(createPayload);
  if (!conditionId) {
    return null;
  }

  const updatePayload = buildRemoteConfigConditionPayload(`Docs Validator Condition Update ${label} ${Date.now()}`, seedValue, "Android");
  const context = {conditionId, createPayload, updatePayload, seedValue};
  STATE.docContexts.set(key, context);
  return context;
}

async function getRemoteConfigParameterDocContext(doc) {
  const key = `remote-config-parameter:${doc.relativePath}`;
  const cached = STATE.docContexts.get(key);
  if (cached) {
    return cached;
  }

  const slug = makeDocSlug(doc);
  const suffix = `${slug}_${Date.now()}`;
  const parameterKey = `docs_validator_param_${suffix}`;
  const createPayload = buildRemoteConfigParameterPayload(parameterKey, "enabled");
  const parameterId = await createSeedRemoteConfigParameter(createPayload, parameterKey);
  if (!parameterId) {
    return null;
  }

  const updatePayload = buildRemoteConfigParameterPayload(`${parameterKey}_updated`, "disabled");
  const context = {parameterId, parameterKey, createPayload, updatePayload};
  STATE.docContexts.set(key, context);
  return context;
}

async function createSeedPushMessage(kind = "api") {
  const url = new URL("/i/push/message/create", CONFIG.baseUrl);
  const trigger = kind === "cohort"
    ? {kind: "cohort", start: 1775300000000, cohorts: ["demo"]}
    : {kind: "api", start: 1775300000000};
  const body = {
    api_key: CONFIG.apiKey,
    app_id: CONFIG.appId,
    app: CONFIG.appId,
    platforms: ["a"],
    demo: true,
    status: "draft",
    triggers: [trigger],
    contents: [{message: "Docs Validator Push", title: "Docs Validator"}],
    info: {title: `Docs Validator Push ${kind}`}
  };

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await performRequest({
        method: "POST",
        url: url.toString(),
        headers: {"content-type": "application/json"},
        body: JSON.stringify(body)
      });
      const id = response?.json?._id || extractObjectId(response?.text);
      if (response.ok && typeof id === "string" && id) {
        STATE.createdPushMessages.push(id);
        return id;
      }
      if (response.status < 500) {
        return null;
      }
    }
    catch {
      // Retry on transient transport failures.
    }

    await sleep(500 * (attempt + 1));
  }

  try {
    const fallbackId = STATE.createdPushMessages.at(-1);
    if (fallbackId) {
      return fallbackId;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedDrillBookmark() {
  const url = new URL("/i/drill/add_bookmark", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("event_key", "[CLY]_session");
  url.searchParams.set("query_obj", "{}");
  url.searchParams.set("name", `Docs Validator Bookmark ${Date.now()}`);
  url.searchParams.set("desc", "Temporary drill bookmark created by docs validator");
  url.searchParams.set("global", "false");
  url.searchParams.set("query_text", "All sessions");
  url.searchParams.set("by_val", '["sg.p"]');
  url.searchParams.set("by_val_text", "Platform");

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    const id = response?.json?.result?.id || extractObjectId(response?.text);
    if (response.ok && typeof id === "string" && id) {
      STATE.createdDrillBookmarks.push(id);
      return id;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedAbParameter() {
  const key = `docs_validator_ab_param_${Date.now()}`;
  const url = new URL("/i/remote-config/add-parameter", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("parameter", JSON.stringify({
    parameter_key: key,
    default_value: "1",
    description: "-",
    conditions: [],
    status: "Running",
    expiry_dttm: null
  }));

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (response.ok) {
      const remoteConfigState = await getRemoteConfigState();
      const parameter = remoteConfigState?.parameters?.find((item) => item && item.parameter_key === key);
      if (parameter?._id) {
        STATE.createdAbParameters.push({parameterId: parameter._id, parameterKey: key});
        return {parameterId: parameter._id, parameterKey: key};
      }
    }
  }
  catch {
    return null;
  }

  return null;
}

async function createSeedAbExperiment() {
  const parameter = await createSeedAbParameter();
  if (!parameter?.parameterKey) {
    return null;
  }

  const experiment = buildAbExperimentPayload(parameter.parameterKey, `Docs Validator Experiment ${Date.now()}`);

  const url = new URL("/i/ab-testing/add-experiment", CONFIG.baseUrl);
  url.searchParams.set("api_key", CONFIG.apiKey);
  url.searchParams.set("app_id", CONFIG.appId);
  if (CONFIG.appKey) {
    url.searchParams.set("app_key", CONFIG.appKey);
  }

  try {
    const response = await performRequest({
      method: "POST",
      url: url.toString(),
      headers: {"content-type": "application/x-www-form-urlencoded"},
      body: `experiment=${encodeURIComponent(JSON.stringify(experiment))}`
    });
    const experimentId = typeof response?.json === "string"
      ? response.json
      : extractObjectId(response?.text);
    if (response.ok && typeof experimentId === "string" && experimentId) {
      const created = {experimentId, parameterId: parameter.parameterId, parameterKey: parameter.parameterKey};
      STATE.createdAbExperiments.push(created);
      return created;
    }
  }
  catch {
    return null;
  }

  return null;
}

async function startAbExperiment(experimentId) {
  const url = new URL("/i/ab-testing/start-experiment", CONFIG.baseUrl);
  setAuth(url);
  url.searchParams.set("app_id", CONFIG.appId);
  url.searchParams.set("experiment_id", experimentId);

  try {
    const response = await performRequest({method: "GET", url: url.toString(), headers: {}});
    if (response.ok && response?.json?.result === "Success") {
      return true;
    }
  }
  catch {
    return false;
  }

  return false;
}

function buildAbExperimentPayload(parameterKey, name) {
  return {
    name,
    description: "Temporary experiment created by docs validator",
    show_target_users: true,
    target_users: {
      byVal: [],
      byValText: "",
      percentage: "70",
      condition: {"up.av": {"$in": ["1:0"]}},
      condition_definition: "App Version = 1:0"
    },
    goals: [{
      user_segmentation: JSON.stringify({query: {}, queryText: ""}),
      steps: "[]"
    }],
    variants: [
      {
        name: "Control group",
        parameters: [{name: parameterKey, description: "", value: "1"}]
      },
      {
        name: "Variant A",
        parameters: [{name: parameterKey, description: "", value: "2"}]
      }
    ],
    type: "remote-config"
  };
}

async function cleanupSeededResources() {
  if (!CONFIG.allowMutation) {
    return;
  }

  await cleanupValidatorBlocksByName();

  for (const blockId of [...STATE.createdBlocks].reverse()) {
    try {
      const url = new URL("/i/blocks/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("block_id", blockId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const contentAssetId of [...STATE.createdContentAssetIds].reverse()) {
    try {
      const url = new URL("/i/content/asset-delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("asset_id", contentAssetId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const contentBlockId of [...STATE.createdContentBlockIds].reverse()) {
    try {
      const url = new URL("/i/content/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("_id", contentBlockId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const environment of [...STATE.createdPopulatorEnvironments].reverse()) {
    try {
      const url = new URL("/o/populator/environment/remove", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("template_id", environment.templateId);
      url.searchParams.set("environment_id", environment.environmentId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const templateId of [...STATE.createdPopulatorTemplateIds].reverse()) {
    try {
      const url = new URL("/i/populator/templates/remove", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("template_id", templateId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const groupId of [...STATE.createdGroups].reverse()) {
    try {
      const url = new URL("/i/groups/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("args", JSON.stringify({_id: groupId}));
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const eventGroupId of [...STATE.createdEventGroups].reverse()) {
    try {
      const url = new URL("/i/event_groups/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("args", JSON.stringify([eventGroupId]));
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const funnelId of [...STATE.createdFunnels].reverse()) {
    try {
      const url = new URL("/i/funnels/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("funnel_id", funnelId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const flowId of [...STATE.createdFlowIds].reverse()) {
    try {
      const url = new URL("/i/flows/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("_id", flowId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const geoLocationId of [...STATE.createdGeoLocations].reverse()) {
    try {
      const url = new URL("/i/geolocations/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("gid", geoLocationId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const viewId of [...STATE.createdViewIds].reverse()) {
    try {
      const url = new URL("/i/views", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("method", "delete_view");
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("view_id", viewId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const formulaId of [...STATE.createdFormulaIds].reverse()) {
    try {
      const url = new URL("/i/calculated_metrics/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("id", formulaId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const symbolId of [...STATE.createdCrashSymbolIds].reverse()) {
    try {
      const url = new URL("/i/crash_symbols/remove_symbol", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("id", symbolId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const crashGroupId of [...STATE.createdCrashGroupIds].reverse()) {
    try {
      const url = new URL("/i/crashes/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("args", JSON.stringify({crash_id: crashGroupId}));
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const transformationId of [...STATE.createdDataManagerTransformationIds].reverse()) {
    try {
      const url = new URL("/i/data-manager/transformation/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("id", transformationId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const journeyDefinitionId of [...STATE.createdJourneyDefinitionIds].reverse()) {
    try {
      const url = new URL("/i/journey-engine/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("id", journeyDefinitionId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const cohortId of [...STATE.createdCohorts].reverse()) {
    try {
      const url = new URL("/i/cohorts/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("cohort_id", cohortId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const {dashboardId, widgetId} of [...STATE.createdDashboardWidgets].reverse()) {
    try {
      const url = new URL("/i/dashboards/remove-widget", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("dashboard_id", dashboardId);
      url.searchParams.set("widget_id", widgetId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const {kind, widgetId} of [...STATE.createdSurveyWidgets].reverse()) {
    try {
      const endpoint = kind === "nps" ? "/i/surveys/nps/delete" : "/i/surveys/survey/delete";
      const url = new URL(endpoint, CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("widget_id", widgetId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const hookId of [...STATE.createdHooks].reverse()) {
    try {
      const url = new URL("/i/hook/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("hookID", hookId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const alertId of [...STATE.createdConcurrentAlerts].reverse()) {
    try {
      const url = new URL("/i/concurrent_alert/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("alertId", alertId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const alertId of [...STATE.createdAlerts].reverse()) {
    try {
      const url = new URL("/i/alert/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("alertID", alertId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const widgetId of [...STATE.createdFeedbackWidgets].reverse()) {
    try {
      const url = new URL("/i/feedback/widgets/remove", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("widget_id", widgetId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const bookmarkId of [...STATE.createdDrillBookmarks].reverse()) {
    try {
      const url = new URL("/i/drill/delete_bookmark", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("bookmark_id", bookmarkId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const experiment of [...STATE.createdAbExperiments].reverse()) {
    try {
      const url = new URL("/i/ab-testing/remove-experiment", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("experiment_id", experiment.experimentId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const parameter of [...STATE.createdAbParameters].reverse()) {
    try {
      const url = new URL("/i/remote-config/remove-parameter", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("parameter_id", parameter.parameterId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const pushMessageId of [...STATE.createdPushMessages].reverse()) {
    try {
      const url = new URL("/i/push/message/remove", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("_id", pushMessageId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const parameterId of [...STATE.createdRemoteConfigParameters].reverse()) {
    try {
      const url = new URL("/i/remote-config/remove-parameter", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("parameter_id", parameterId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const conditionId of [...STATE.createdRemoteConfigConditions].reverse()) {
    try {
      const url = new URL("/i/remote-config/remove-condition", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("condition_id", conditionId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const dashboardId of [...STATE.createdDashboards].reverse()) {
    try {
      const url = new URL("/i/dashboards/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("dashboard_id", dashboardId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const noteId of [...STATE.createdNoteIds].reverse()) {
    try {
      const url = new URL("/i/notes/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("note_id", noteId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const presetId of [...STATE.createdDatePresetIds].reverse()) {
    try {
      const url = new URL("/i/date_presets/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("preset_id", presetId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const exportId of [...STATE.createdAppUserExportIds].reverse()) {
    try {
      const url = new URL(`/i/app_users/deleteExport/${exportId}`, CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const user of [...STATE.createdAppUsers].reverse()) {
    try {
      const url = new URL("/i/app_users/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", user.appId || CONFIG.appId);
      url.searchParams.set("query", JSON.stringify({did: user.did}));
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const userId of [...STATE.createdUserIds].reverse()) {
    try {
      const url = new URL("/i/users/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("args", JSON.stringify({user_ids: [userId]}));
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }

  for (const appId of [...STATE.createdAppIds].reverse()) {
    try {
      const url = new URL("/i/apps/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("args", JSON.stringify({app_id: appId}));
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
    catch {
      // Ignore cleanup failure.
    }
  }
}

async function cleanupValidatorBlocksByName() {
  try {
    const listUrl = new URL("/o/blocks", CONFIG.baseUrl);
    setAuth(listUrl);
    listUrl.searchParams.set("app_id", CONFIG.appId);
    const listResponse = await performRequest({method: "GET", url: listUrl.toString(), headers: {}});
    const items = Array.isArray(listResponse?.json)
      ? listResponse.json
      : Array.isArray(listResponse?.json?.aaData)
        ? listResponse.json.aaData
        : [];

    for (const item of items) {
      if (!item?._id || typeof item?.name !== "string" || !item.name.startsWith("Docs Validator Block ")) {
        continue;
      }
      const url = new URL("/i/blocks/delete", CONFIG.baseUrl);
      setAuth(url);
      url.searchParams.set("app_id", CONFIG.appId);
      url.searchParams.set("block_id", item._id);
      await performRequest({method: "GET", url: url.toString(), headers: {}});
    }
  }
  catch {
    // Ignore cleanup failure.
  }
}

async function buildRequest(doc) {
  if (doc.endpoint === "/api-key") {
    return {ok: false, reason: "Basic-auth credentials not provided for /api-key"};
  }

  let endpointPath = doc.endpoint;
  endpointPath = endpointPath
    .replaceAll("YOUR_APP_KEY", CONFIG.appKey)
    .replaceAll("YOUR_API_KEY", CONFIG.apiKey)
    .replaceAll("YOUR_AUTH_TOKEN", CONFIG.authToken)
    .replaceAll("YOUR_APP_ID", CONFIG.appId);
  let method = "GET";
  const headers = {};
  const initialUrl = new URL(endpointPath, CONFIG.baseUrl);
  const params = new Map(initialUrl.searchParams.entries());

  for (const param of doc.requestParams) {
    if (params.has(param.name)) {
      continue;
    }

    const alternateParamNames = getAlternateParamNames(param.name);
    if (alternateParamNames.some((name) => params.has(name))) {
      continue;
    }

    const parentParamName = getParentParamName(param.name);
    if (parentParamName && params.has(parentParamName)) {
      continue;
    }

    const required = isRequiredParam(param);
    const resolved = await resolveParamValue(doc, param.name);
    if (resolved !== undefined) {
      params.set(alternateParamNames[0] || param.name, resolved);
      continue;
    }

    if (required && !isEitherAuthParamSatisfied(param.name, params)) {
      if (doc.endpoint === "/i/notes/delete" && param.name === "note_id") {
        return {ok: false, reason: "Seed failure: saved note could not be recovered for delete validation"};
      }
      return {ok: false, reason: `Missing resolver for required parameter: ${param.name}`};
    }
  }

  await applyEndpointSpecificDefaults(doc, params);

  if (!params.has("api_key") && !params.has("auth_token") && !params.has("app_key") && doc.endpoint !== "/api-key") {
    if (CONFIG.apiKey) {
      params.set("api_key", CONFIG.apiKey);
    }
    else if (CONFIG.authToken) {
      params.set("auth_token", CONFIG.authToken);
    }
  }

  if (doc.endpoint === "/o/sdk?method=ab_fetch_variants" && !params.has("device_id")) {
    params.set("device_id", DUMMY.deviceId);
  }

  if (
    (doc.endpoint.startsWith("/i/event_groups/") || doc.endpoint === "/o?method=get_event_groups" || doc.endpoint === "/o?method=get_event_group")
    && !params.has("app_id")
  ) {
    params.set("app_id", CONFIG.appId);
  }

  const placeholderParamNames = ["id", "{id}", "\\{id\\}", "{task_id}", "\\{task_id\\}", "{_id}", "\\{_id\\}"];
  const consumedPathParams = new Set();
  for (const name of placeholderParamNames) {
    if (!params.has(name)) {
      continue;
    }
    const value = params.get(name);
    if (!value) {
      continue;
    }
    const replacedEndpointPath = endpointPath
      .replace("/\\{id\\}", `/${value}`)
      .replace("/{id}", `/${value}`)
      .replace("/\\{_id\\}", `/${value}`)
      .replace("/{_id}", `/${value}`)
      .replace("/\\{task_id\\}", `/${value}`)
      .replace("/{task_id}", `/${value}`);
    if (replacedEndpointPath !== endpointPath) {
      endpointPath = replacedEndpointPath;
      consumedPathParams.add(name);
    }
  }

  const url = new URL(endpointPath, CONFIG.baseUrl);
  url.search = "";

  if (doc.endpoint === "/i/data-manager/import-schema") {
    for (const [key, value] of params.entries()) {
      if (key !== "import_file") {
        url.searchParams.set(key, value);
      }
    }
    return {
      ok: true,
      request: {
        method: "POST",
        url: url.toString(),
        headers: {},
        multipart: [
          {
            name: "import_file",
            filePath: VALIDATOR_SCHEMA_CSV_FILE,
            contentType: "text/csv"
          }
        ]
      }
    };
  }

  if (doc.endpoint === "/i/import") {
    for (const [key, value] of params.entries()) {
      if (key !== "import_file") {
        url.searchParams.set(key, value);
      }
    }
    return {
      ok: true,
      request: {
        method: "POST",
        url: url.toString(),
        headers: {},
        multipart: [
          {
            name: "import_file",
            filePath: CONFIG_TRANSFER_IMPORT_FILE,
            contentType: "application/json"
          }
        ]
      }
    };
  }

  if (doc.endpoint === "/i/crash_symbols/add_symbol" || doc.endpoint === "/i/crash_symbols/upload_symbol") {
    for (const [key, value] of params.entries()) {
      if (key !== "symbols" && key !== "symbols[]") {
        url.searchParams.set(key, value);
      }
    }
    return {
      ok: true,
      request: {
        method: "POST",
        url: url.toString(),
        headers: {},
        multipart: [
          {
            name: "symbols",
            filePath: VALIDATOR_SOURCE_MAP_FILE,
            contentType: "application/json"
          }
        ]
      }
    };
  }

  if (doc.endpoint === "/i/whitelabeling/upload") {
    for (const [key, value] of params.entries()) {
      if (key !== "prelogo" && key !== "stopleftlogo" && key !== "favicon") {
        url.searchParams.set(key, value);
      }
    }
    return {
      ok: true,
      request: {
        method: "POST",
        url: url.toString(),
        headers: {},
        multipart: [
          {
            name: "prelogo",
            filePath: VALIDATOR_UPLOAD_FILE,
            contentType: "image/png"
          }
        ]
      }
    };
  }

  if (doc.endpoint === "/i/feedback/upload" || doc.endpoint === "/i/feedback/logo" || doc.endpoint === "/i/content/asset-upload") {
    for (const [key, value] of params.entries()) {
      url.searchParams.set(key, value);
    }
    const fieldName = doc.endpoint === "/i/content/asset-upload"
      ? "assets"
      : (doc.endpoint === "/i/feedback/logo" ? "logo" : "feedback_logo");
    return {
      ok: true,
      request: {
        method: "POST",
        url: url.toString(),
        headers: {},
        multipart: [
          {
            name: fieldName,
            filePath: VALIDATOR_UPLOAD_FILE,
            contentType: "image/png"
          }
        ]
      }
    };
  }

  const discardBody = doc.endpoint.includes("/o/app_users/download/") || doc.endpoint.includes("/o/export/download/");

  const jsonBodyMode = shouldUseJsonBody(doc);
  for (const [key, value] of params.entries()) {
    if (consumedPathParams.has(key)) {
      continue;
    }
    if (jsonBodyMode && !["api_key", "auth_token", "app_id", "app_key"].includes(key)) {
      continue;
    }
    url.searchParams.set(key, value);
  }

  let body;
  if (jsonBodyMode) {
    method = "POST";
    headers["content-type"] = "application/json";
    body = JSON.stringify(await buildEndpointSpecificJsonBody(doc) ?? buildJsonBodyFromParams(params));
  }
  else if (shouldUseFormBody(doc)) {
    method = "POST";
    headers["content-type"] = "application/x-www-form-urlencoded";
    body = new URLSearchParams([...params.entries()]).toString();
  }

  return {
    ok: true,
    request: {
      method,
      url: url.toString(),
      headers,
      body,
      discardBody
    }
  };
}

function classifyFailureReason(doc, response, pluginName, enabledPlugins) {
  const base = `HTTP ${response.status}`;
  const text = (response?.text || "").toLowerCase();
  const resultText = typeof response?.json?.result === "string" ? response.json.result.toLowerCase() : "";
  const combined = `${text}\n${resultText}`;

  if (response.status === 400 && combined.includes("invalid path")) {
    if (pluginName && enabledPlugins && !enabledPlugins.has(pluginName)) {
      return `Plugin disabled on target instance: ${pluginName}`;
    }
    if (pluginName) {
      return `${base} (route unavailable for plugin/instance configuration)`;
    }
  }

  if (response.status === 400 && combined.includes("you're not an approver")) {
    return `${base} (enabled but member is not configured as approver)`;
  }

  if (combined.includes("no push credentials")) {
    return `${base} (enabled but app push credentials are not configured for requested platform)`;
  }

  if (combined.includes("missing triggers argument")) {
    return `${base} (request requires full trigger definition)`;
  }

  if (response.status === 403 && doc.endpoint === "/i/notes/delete") {
    return `${base} (no deletable note visible for current member context)`;
  }

  return base;
}

async function applyEndpointSpecificDefaults(doc, params) {
  if (doc.endpoint === "/i/users/deleteOwnAccount") {
    const context = await getSelfDeletableDashboardUserDocContext(doc);
    if (context?.api_key) {
      params.set("api_key", context.api_key);
      params.delete("auth_token");
    }
    if (context?.password && !params.has("password")) {
      params.set("password", context.password);
    }
    return;
  }

  if (doc.endpoint === "/i/notes/delete") {
    if (!params.has("note_id")) {
      const context = await getNoteDocContext(doc);
      if (context?.noteId) {
        params.set("note_id", context.noteId);
      }
    }
    return;
  }

  if (doc.endpoint === "/i/surveys/nps/edit") {
    if (!params.has("name")) {
      params.set("name", `NPS ${DUMMY.name} ${Date.now()}`);
    }
    return;
  }

  if (doc.endpoint === "/i/flows/edit") {
    if (!params.has("app_id")) {
      params.set("app_id", CONFIG.appId);
    }
    if (!params.has("name")) {
      params.set("name", `Docs Validator Flow Update ${Date.now()}`);
    }
    if (!params.has("type")) {
      params.set("type", "events");
    }
    if (!params.has("start")) {
      params.set("start", '{"event":"[CLY]_session"}');
    }
    if (!params.has("end")) {
      params.set("end", '{"event":"[CLY]_view"}');
    }
    if (!params.has("exclude")) {
      params.set("exclude", "[]");
    }
    if (!params.has("user_segmentation")) {
      params.set("user_segmentation", "{}");
    }
    if (!params.has("period")) {
      params.set("period", CONFIG.defaultPeriod);
    }
    return;
  }

  if (doc.endpoint === "/i/users/updateHomeSettings") {
    if (!params.has("homeSettings")) {
      params.set("homeSettings", '{"widgets":["sessions","users"]}');
    }
    return;
  }

  if (doc.endpoint === "/o?method=systemlogs" || doc.endpoint === "/o?method=systemlogs_meta") {
    if (!params.has("app_id")) {
      params.set("app_id", CONFIG.appId);
    }
    return;
  }

  if (doc.endpoint === "/i/push/message/create") {
    if (!params.has("demo")) {
      params.set("demo", "true");
    }
    return;
  }

  if (doc.endpoint === "/i/push/message/update") {
    if (!params.has("app_id")) {
      params.set("app_id", CONFIG.appId);
    }
    if (!params.has("app")) {
      params.set("app", CONFIG.appId);
    }
    if (!params.has("platforms")) {
      params.set("platforms", DUMMY.pushPlatforms);
    }
    if (!params.has("filter")) {
      params.set("filter", '{"user":"{\\"la\\":{\\"$in\\":[\\"en\\"]}}"}');
    }
    if (!params.has("triggers")) {
      params.set("triggers", JSON.stringify([{kind: "plain", start: new Date(Date.now() + 3600000).toISOString()}]));
    }
    if (!params.has("contents")) {
      params.set("contents", DUMMY.pushContents);
    }
    if (!params.has("demo")) {
      params.set("demo", "true");
    }
  }
}

function shouldUseJsonBody(doc) {
  return [
    "/i/journey-engine/init",
    "/i/journey-engine/journeys/save",
    "/i/journey-engine/journeys/pause",
    "/i/journey-engine/journeys/publish",
    "/i/journey-engine/journeys/resume",
    "/i/journey-engine/versions/activate",
    "/i/journey-engine/versions/delete",
    "/i/journey-engine/versions/duplicate",
    "/i/journey-engine/versions/rename",
    "/i/journey-engine/versions/save",
    "/o/push/message/estimate",
    "/i/push/message/create",
    "/i/push/message/test",
    "/i/push/message/update",
    "/i/push/message/push",
    "/i/populator/templates/create",
    "/i/populator/templates/edit"
  ].includes(doc.endpoint);
}

async function buildEndpointSpecificJsonBody(doc) {
  if (doc.endpoint.startsWith("/i/journey-engine/")) {
    const context = await getJourneyDocContext(doc);
    switch (doc.endpoint) {
    case "/i/journey-engine/init":
      return {
        data: {
          key: "[CLY]_session",
          app_id: CONFIG.appId
        },
        appUser: {
          uid: "docs-validator-journey-user",
          did: "docs-validator-journey-device"
        }
      };
    case "/i/journey-engine/journeys/save":
      return buildJourneySavePayload(makeDocSlug(doc));
    case "/i/journey-engine/journeys/pause":
    case "/i/journey-engine/journeys/resume":
      return context ? {
        journeyId: context.journeyDefinitionId,
        versionId: context.versionId
      } : {};
    case "/i/journey-engine/journeys/publish":
      return context ? {
        journeyId: context.journeyDefinitionId,
        versionId: context.versionId,
        status: "active"
      } : {};
    case "/i/journey-engine/versions/activate":
      return context ? {
        journeyDefinitionId: context.journeyDefinitionId,
        id: context.versionId
      } : {};
    case "/i/journey-engine/versions/delete":
    case "/i/journey-engine/versions/duplicate":
      return context ? {id: context.versionId} : {};
    case "/i/journey-engine/versions/rename":
      return context ? {
        id: context.versionId,
        name: `Docs Validator Version ${Date.now()}`
      } : {};
    case "/i/journey-engine/versions/save":
      return context ? {
        journeyDefinitionId: context.journeyDefinitionId,
        appId: CONFIG.appId,
        name: `Docs Validator Version ${Date.now()}`,
        blocks: buildJourneyBlocks()
      } : {};
    default:
      break;
    }
  }

  return null;
}

function shouldUseFormBody(doc) {
  return [
    "/i/ab-testing/add-experiment",
    "/i/ab-testing/update-experiment",
    "/i/populator/environment/save"
  ].includes(doc.endpoint);
}

function buildJsonBodyFromParams(params) {
  const body = {};
  for (const [key, value] of params.entries()) {
    body[key] = coerceJsonValue(key, value);
  }
  return body;
}

function coerceJsonValue(key, value) {
  if (["demo", "test", "messages"].includes(key)) {
    return value === "true";
  }
  if (["isDefault", "setEnviromentInformationOnce", "populator"].includes(key)) {
    return value === "true";
  }
  if (["limit", "skip"].includes(key) && /^-?\d+$/.test(value)) {
    return Number(value);
  }
  if (["uniqueUserCount", "iDisplayStart", "iDisplayLength"].includes(key) && /^-?\d+$/.test(value)) {
    return Number(value);
  }
  if (["platforms", "triggers", "contents", "filter", "variables", "userConditions"].includes(key)) {
    try {
      return JSON.parse(value);
    }
    catch {
      return value;
    }
  }
  if (["users", "events", "views", "sequences", "platformType", "behavior"].includes(key)) {
    try {
      return JSON.parse(value);
    }
    catch {
      return value;
    }
  }
  return value;
}

function isRequiredParam(param) {
  const value = param.required.toLowerCase();
  return value.includes("yes");
}

function getParentParamName(paramName) {
  if (paramName.includes(".[")) {
    return paramName.split(".[")[0];
  }
  if (paramName.includes(".")) {
    return paramName.split(".")[0].split("[")[0];
  }
  if (paramName.includes("[")) {
    return paramName.split("[")[0];
  }
  return null;
}

function getAlternateParamNames(paramName) {
  if (!paramName.includes("/")) {
    return [];
  }
  return paramName
    .split("/")
    .map((name) => name.trim())
    .filter(Boolean);
}

function isEitherAuthParamSatisfied(paramName, params) {
  if (paramName !== "api_key" && paramName !== "auth_token") {
    return false;
  }
  return params.has("api_key") || params.has("auth_token") || Boolean(CONFIG.apiKey) || Boolean(CONFIG.authToken);
}

async function resolveParamValue(doc, paramName) {
  switch (paramName) {
  case "api_key":
    return CONFIG.apiKey || undefined;
  case "auth_token":
    return CONFIG.apiKey ? undefined : (CONFIG.authToken || undefined);
  case "app_id":
    return CONFIG.appId || undefined;
  case "app":
    return CONFIG.appId || undefined;
  case "app_key":
    return CONFIG.appKey || undefined;
  case "period":
    if (doc.endpoint === "/o/push/message/stats") {
      return "30days";
    }
    return CONFIG.defaultPeriod;
  case "bucket":
    return "daily";
  case "metric":
    if (doc.endpoint === "/i/calculated_metrics/save") {
      return JSON.stringify(buildFormulaMetricPayload());
    }
    if (doc.endpoint === "/o") {
      return "users";
    }
    return "users";
  case "metrics":
    return '["users"]';
  case "event":
    if (doc.endpoint.startsWith("/i/journey-engine/") || doc.endpoint.startsWith("/o/journey-engine/") || doc.endpoint.startsWith("/o/journey-enginge/")) {
      return await resolveEndpointSpecificValue(doc, paramName);
    }
    if (doc.endpoint.startsWith("/i/data-manager/") || doc.endpoint.startsWith("/o/data-manager/")) {
      return await resolveEndpointSpecificValue(doc, paramName);
    }
    return "[CLY]_session";
  case "event_key":
    return "[CLY]_session";
  case "events":
    if (doc.endpoint === "/i/feedback/input") {
      const widgetId = await getFirstFeedbackWidgetId();
      return JSON.stringify([{
        key: "[CLY]_star_rating",
        count: 1,
        sum: 1,
        segmentation: {
          rating: 5,
          widget_id: widgetId || "507f1f77bcf86cd799439011",
          comment: "Docs validator feedback",
          platform: "iOS",
          app_version: "1.0.0"
        }
      }]);
    }
    if (doc.endpoint === "/i/events/change_visibility") {
      return '["[CLY]_session"]';
    }
    return '["[CLY]_session"]';
  case "device_id":
    return DUMMY.deviceId;
  case "queryObject":
  case "query":
    return await resolveEndpointSpecificValue(doc, paramName) ?? "{}";
  case "query_obj":
    return "{}";
  case "Request body":
    return await resolveEndpointSpecificValue(doc, paramName);
  case "args":
    return await resolveEndpointSpecificValue(doc, paramName) ?? withAppId(DUMMY.args);
  case "requests":
    return JSON.stringify([{
      app_key: CONFIG.appKey,
      device_id: `${DUMMY.deviceId}-bulk`,
      begin_session: 1,
      metrics: {_os: "iOS", _device: "iPhone"}
    }]);
  case "mock_data":
    return JSON.stringify({
      app_id: CONFIG.appId,
      uid: "docs-validator-user",
      event: "/session/start"
    });
  case "enforcement":
    return '{"tracking":true,"crt":true,"eqs":100}';
  case "filter":
    if (doc.endpoint === "/o/push/message/estimate") {
      return undefined;
    }
    if (doc.endpoint === "/i/push/message/push") {
      return '{"user":"{\\"uid\\":{\\"$in\\":[\\"docs-validator-user\\"]}}"}';
    }
    if (doc.endpoint.startsWith("/o/push/") || doc.endpoint.startsWith("/i/push/")) {
      return '{"user":"{\\"la\\":{\\"$in\\":[\\"en\\"]}}"}';
    }
    return doc.endpoint === "/o?method=logs"
      ? (CONFIG.logFilter || '{"_id":"__docs_validator_no_match__"}')
      : "{}";
  case "projection":
  case "project":
    return "{}";
  case "apps":
    return `["${CONFIG.appId}"]`;
  case "configs":
    return '{"frontend":{"session_timeout":15}}';
  case "plugin":
    return '{"drill":true}';
  case "sort":
    return '{"_id":1}';
  case "limit":
    return "1";
  case "skip":
    return "0";
  case "assets":
    return "__multipart_upload__";
  case "prelogo":
  case "stopleftlogo":
  case "favicon":
    if (doc.endpoint === "/i/whitelabeling/upload") {
      return "__multipart_upload__";
    }
    return undefined;
  case "import_file":
    return "__multipart_upload__";
  case "symbols":
  case "symbols[]":
    if (doc.endpoint.startsWith("/i/crash_symbols/")) {
      return "__multipart_upload__";
    }
    return undefined;
  case "type":
    return await resolveEndpointSpecificValue(doc, paramName) ?? (doc.endpoint === "/o/export/db" ? "json" : undefined);
  case "platform":
    if (doc.endpoint.startsWith("/i/crash_symbols/")) {
      return "javascript";
    }
    return undefined;
  case "build":
    if (doc.endpoint.startsWith("/i/crash_symbols/")) {
      return `docs-validator-symbol-${makeDocSlug(doc)}-${Date.now()}`;
    }
    return undefined;
  case "data":
    if (doc.endpoint === "/i/flows/updateDisabled") {
      const context = await getFlowDocContext(doc);
      return context?.flowId ? JSON.stringify({[context.flowId]: false}) : undefined;
    }
    if (doc.endpoint === "/o/export/data") {
      return '[{"event":"Docs Validation","count":1}]';
    }
    return await resolveEndpointSpecificValue(doc, paramName) ?? withAppId(DUMMY.data);
  case "appUser":
    return await resolveEndpointSpecificValue(doc, paramName);
  case "db":
    return doc.endpoint === "/o/export/db" ? "countly" : undefined;
  case "collection":
    return doc.endpoint === "/o/export/db" ? "events" : undefined;
  case "filename":
    return "docs-validator";
  case "get_index":
    return doc.endpoint === "/o/export/db" ? "true" : undefined;
  case "loadFor":
    return "cities";
  case "name":
    if (doc.endpoint.startsWith("/i/journey-engine/") || doc.endpoint.startsWith("/o/journey-engine/") || doc.endpoint.startsWith("/o/journey-enginge/")) {
      return await resolveEndpointSpecificValue(doc, paramName);
    }
    if (doc.endpoint.startsWith("/i/populator/") || doc.endpoint.startsWith("/o/populator/")) {
      return `Docs Validator Template ${Date.now()}`;
    }
    if (doc.endpoint === "/i/content/asset-upload") {
      return `docs-validator-upload-${Date.now()}.png`;
    }
    if (doc.endpoint === "/o/apps/plugins") {
      return "push";
    }
    return DUMMY.name;
  case "share_with":
    return DUMMY.shareWith;
  case "title":
    return DUMMY.title;
  case "description":
  case "desc":
  case "note":
  case "text":
    return DUMMY.description;
  case "message":
    return "Docs validator message";
  case "users":
    return await resolveEndpointSpecificValue(doc, paramName);
  case "messageId":
    return "507f1f77bcf86cd799439011";
  case "rating":
    return "thumbs_up";
  case "origin":
    return "drill";
  case "threadId": {
    const context = await getAiThreadDocContext(doc);
    return context?.threadId || undefined;
  }
  case "user_id": {
    const user = await getCurrentUser();
    return user?._id || undefined;
  }
  case "uid": {
    if (doc.endpoint.includes("method=user_details")) {
      const user = await createSeedAppUser(CONFIG.appId);
      return user?.uid || user?.did || undefined;
    }
    if (doc.endpoint === "/o/push/user") {
      return undefined;
    }
    if (doc.endpoint === "/o/content/debug") {
      const user = await createSeedAppUser(CONFIG.appId);
      return user?.uid || user?.did || undefined;
    }
    const user = await getCurrentUser();
    return user?._id || undefined;
  }
  case "_id":
  case "{_id}":
  case "\\{_id\\}":
    if (doc.endpoint.startsWith("/i/flows/") || doc.endpoint.startsWith("/o/flows")) {
      const context = await getFlowDocContext(doc);
      return context?.flowId || await getFirstFlowId() || undefined;
    }
    if (doc.endpoint.startsWith("/i/cms/") || doc.endpoint.startsWith("/o/cms/")) {
      return await resolveEndpointSpecificValue(doc, "_id");
    }
    if (doc.endpoint === "/i/populator/templates/edit") {
      const context = await getPopulatorTemplateDocContext(doc);
      return context?.templateId || undefined;
    }
    if (doc.endpoint.startsWith("/i/content/") || doc.endpoint.includes("/o/content/by-id")) {
      return await resolveEndpointSpecificValue(doc, "_id");
    }
    if (doc.endpoint === "/o/push/message/mime") {
      return undefined;
    }
    if (doc.endpoint === "/o?method=drill_bookmark") {
      return await getFirstDrillBookmarkId() || undefined;
    }
    if (doc.endpoint === "/i/push/message/toggle") {
      return await getFirstPushToggleMessageId() || undefined;
    }
    if (doc.endpoint.startsWith("/o/push/") || doc.endpoint.startsWith("/i/push/message/") || doc.endpoint === "/i/push/approve") {
      return await getFirstPushMessageId() || undefined;
    }
    return undefined;
  case "did":
    if (doc.endpoint === "/o/push/user") {
      return DUMMY.deviceId;
    }
    return undefined;
  case "resolution":
    if (doc.endpoint === "/o/sdk/content") {
      return '{"l":{"w":1920,"h":1080},"p":{"w":1080,"h":1920}}';
    }
    return await resolveEndpointSpecificValue(doc, paramName);
  case "identifier":
    return "docs_validator_logo";
  case "alertID":
    return await getFirstAlertId() || undefined;
  case "alertId":
    return await getFirstConcurrentAlertId() || undefined;
  case "block_id": {
    const context = await getBlockDocContext(doc);
    return context?._id || undefined;
  }
  case "asset_id": {
    const context = await getContentAssetDocContext(doc);
    return context?._id || undefined;
  }
  case "hookID":
    return await getFirstHookId() || undefined;
  case "status":
    if (doc.endpoint === "/i/hook/status") {
      const id = await getFirstHookId();
      return id ? `{"${id}":false}` : undefined;
    }
    if (doc.endpoint === "/i/concurrent_alert/status") {
      const id = await getFirstConcurrentAlertId();
      return id ? `{"${id}":false}` : undefined;
    }
    if (doc.endpoint === "/i/push/message/create" || doc.endpoint === "/i/push/message/update") {
      return "draft";
    }
    if (doc.endpoint === "/o/push/message/all") {
      return undefined;
    }
    return "true";
  case "platforms":
    return DUMMY.pushPlatforms;
  case "triggers":
    return JSON.stringify([{kind: "plain", start: new Date(Date.now() + 3600000).toISOString()}]);
  case "contents":
    return DUMMY.pushContents;
  case "test":
    return "true";
  case "start":
    return new Date(Date.now() + 60000).toISOString();
  case "variables":
    return DUMMY.pushVariables;
  case "messages":
    if (doc.endpoint === "/o/push/user") {
      return "true";
    }
    return undefined;
  case "active":
    return "false";
  case "approve":
    return "true";
  case "url":
    return "https://raw.githubusercontent.com/github/explore/main/topics/python/python.png";
  case "method":
    if (doc.endpoint === "/o/sdk") {
      return "sc";
    }
    if (doc.endpoint === "/o") {
      return "total_users";
    }
    return undefined;
  case "internalName":
    return DUMMY.name;
  case "bookmark_id":
    if (doc.endpoint.startsWith("/i/drill/") || doc.endpoint === "/o?method=drill_bookmark") {
      const context = await getDrillBookmarkDocContext(doc);
      return context?.bookmarkId || undefined;
    }
    return await getFirstDrillBookmarkId() || undefined;
  case "password":
    if (doc.endpoint === "/i/users/deleteOwnAccount") {
      const context = await getSelfDeletableDashboardUserDocContext(doc);
      return context?.password || undefined;
    }
    return undefined;
  case "note_id":
    if (doc.endpoint === "/i/notes/delete") {
      const context = await getNoteDocContext(doc);
      return context?.noteId || undefined;
    }
    return await getFirstNoteId() || "507f1f77bcf86cd799439011";
  case "by_val":
    return '["sg.p"]';
  case "by_val_text":
    return "Platform";
  case "global":
    return "false";
  case "homeSettings":
    return '{"widgets":["sessions","users"]}';
  case "entries":
    return await resolveEndpointSpecificValue(doc, paramName);
  case "set_visibility":
    return "hide";
  case "whitelisted_segments":
    return '{"[CLY]_session":["platform"]}';
  case "environment_name": {
    const context = await getPopulatorEnvironmentDocContext(doc);
    return context?.environmentName || `Docs Validator Environment ${Date.now()}`;
  }
  case "template_id": {
    const context = doc.endpoint.includes("/environment/")
      ? await getPopulatorEnvironmentDocContext(doc)
      : await getPopulatorTemplateDocContext(doc);
    return context?.templateId || undefined;
  }
  case "environment_id": {
    const context = await getPopulatorEnvironmentDocContext(doc);
    return context?.environmentId || undefined;
  }
  case "uniqueUserCount":
    return "5";
  case "platformType":
    return '["iOS","Android"]';
  case "isDefault":
    return "false";
  case "msg":
    return DUMMY.surveyMsg;
  case "questions":
    return DUMMY.surveyQuestions;
  case "appearance":
    return DUMMY.surveyAppearance;
  case "targeting":
    return DUMMY.surveyTargeting;
  case "widget_type":
    return "analytics";
  case "key":
    if (doc.endpoint.includes("method=ab_")) {
      return await resolveEndpointSpecificValue(doc, paramName);
    }
    return "docs_validator_key";
  case "token": {
    const token = await getOrCreateTempToken();
    return token?.token || undefined;
  }
  case "tokenid": {
    const token = await getOrCreateTempToken();
    return token?.tokenid || undefined;
  }
  case "camp_id":
  case "campaign_id":
    return await getFirstCampaignId() || undefined;
  case "experiment_id":
    if (doc.endpoint.startsWith("/i/ab-testing/") || doc.endpoint.startsWith("/o/ab-testing/")) {
      return await resolveEndpointSpecificValue(doc, paramName);
    }
    return await getFirstAbExperimentId() || "507f1f77bcf86cd799439011";
  case "experiment":
    if (doc.endpoint.startsWith("/i/ab-testing/")) {
      return await resolveEndpointSpecificValue(doc, paramName);
    }
    return undefined;
  case "experiments": {
    if (doc.endpoint.startsWith("/o/ab-testing/")) {
      return await resolveEndpointSpecificValue(doc, paramName);
    }
    const id = await getFirstAbExperimentId();
    return id ? `["${id}"]` : undefined;
  }
  case "variant":
    if (doc.endpoint.includes("method=ab_")) {
      return await resolveEndpointSpecificValue(doc, paramName);
    }
    return "Variant A";
  case "keys":
    if (doc.endpoint.includes("method=ab_") || doc.endpoint === "/o/sdk?method=ab") {
      return await resolveEndpointSpecificValue(doc, paramName);
    }
    return undefined;
  case "task_id":
    if (doc.endpoint.startsWith("/i/tasks/") || doc.endpoint.startsWith("/o/tasks/")) {
      const context = await getTaskDocContext(doc);
      return context?.taskId || await getFirstTaskId() || undefined;
    }
    return await getFirstTaskId() || undefined;
  case "preset_id":
    if (doc.endpoint.startsWith("/i/date_presets/") || doc.endpoint.startsWith("/o/date_presets/")) {
      const context = await getDatePresetDocContext(doc);
      return context?.presetId || await getFirstDatePresetId() || undefined;
    }
    return await getFirstDatePresetId() || undefined;
  case "dashboard_id":
    if (doc.endpoint.includes("/dashboards/") || doc.endpoint.startsWith("/o/dashboards") || doc.endpoint.startsWith("/o/dashboard/")) {
      const context = doc.endpoint.includes("widget") || doc.endpoint === "/o/dashboard/data"
        ? await getDashboardWidgetDocContext(doc)
        : await getDashboardDocContext(doc);
      return context?.dashboardId || undefined;
    }
    if (doc.endpoint === "/i/dashboards/delete") {
      return await createSeedDashboard() || undefined;
    }
    return await getFirstDashboardId() || undefined;
  case "funnel":
    return await getFirstFunnelId() || undefined;
  case "funnel_id":
    if (doc.endpoint.startsWith("/i/funnels/")) {
      const context = await getFunnelDocContext(doc);
      return context?.funnelId || undefined;
    }
    return await getFirstFunnelId() || undefined;
  case "gid":
    if (doc.endpoint === "/i/geolocations/delete") {
      const context = await getGeoLocationDocContext(doc);
      return context?.geoLocationId || await getFirstGeoLocationId() || undefined;
    }
    return await getFirstGeoLocationId() || undefined;
  case "funnels": {
    const id = await getFirstFunnelId();
    return id ? `["${id}"]` : undefined;
  }
  case "cohort":
    if (doc.endpoint === "/i/cohorts/add_users") {
      const context = await getCohortDocContext(doc, "manual");
      return context?.cohortId || undefined;
    }
    if (doc.endpoint === "/i/cohorts/remove_users") {
      const context = await getManualCohortMembershipDocContext(doc);
      return context?.cohortId || undefined;
    }
    return await getFirstCohortId() || undefined;
  case "cohort_id":
    if (doc.endpoint.startsWith("/i/cohorts/")) {
      const context = await getCohortDocContext(doc, "auto");
      return context?.cohortId || undefined;
    }
    return await getFirstCohortId() || undefined;
  case "cohorts": {
    const id = await getFirstCohortId();
    return id ? `["${id}"]` : undefined;
  }
  case "widget_id":
    if (doc.endpoint.includes("/dashboards") || doc.endpoint.startsWith("/o/dashboard/")) {
      const context = await getDashboardWidgetDocContext(doc);
      return context?.widgetId || undefined;
    }
    if (doc.endpoint.includes("/feedback/widgets") || doc.endpoint.includes("/o/feedback/widget")) {
      return await getFirstFeedbackWidgetId() || "507f1f77bcf86cd799439011";
    }
    if (doc.endpoint.includes("/surveys/nps/")) {
      const context = await getSurveyWidgetDocContext(doc, "nps");
      return context?.widgetId || await getFirstNpsWidgetId() || "507f1f77bcf86cd799439011";
    }
    if (doc.endpoint.includes("/surveys/survey/")) {
      const context = await getSurveyWidgetDocContext(doc, "survey");
      return context?.widgetId || await getFirstSurveyWidgetId() || "507f1f77bcf86cd799439011";
    }
    return await getFirstWidgetId() || "507f1f77bcf86cd799439011";
  case "widget_ids": {
    if (doc.endpoint.includes("/surveys/nps/")) {
      const context = await getSurveyWidgetDocContext(doc, "nps");
      const id = context?.widgetId || await getFirstNpsWidgetId();
      return id || "507f1f77bcf86cd799439011";
    }
    if (doc.endpoint.includes("/surveys/survey/")) {
      const context = await getSurveyWidgetDocContext(doc, "survey");
      const id = context?.widgetId || await getFirstSurveyWidgetId();
      return id || "507f1f77bcf86cd799439011";
    }
    const id = await getFirstWidgetId();
    return id || "507f1f77bcf86cd799439011";
  }
  case "widgets": {
    if (doc.endpoint.includes("/feedback")) {
      const id = await getFirstFeedbackWidgetId();
      return `["${id || "507f1f77bcf86cd799439011"}"]`;
    }
    const id = await getFirstWidgetId();
    return `["${id || "507f1f77bcf86cd799439011"}"]`;
  }
  case "view_id":
    if (doc.endpoint.startsWith("/i/views")) {
      const context = await getViewDocContext(doc);
      return context?.viewId || await getFirstViewId() || undefined;
    }
    return await getFirstViewId() || undefined;
  case "view":
    if (doc.endpoint === "/o/render") {
      return "/dashboard?ssr=true";
    }
    return "/home";
  case "route":
    if (doc.endpoint === "/o/render") {
      return "/analytics/sessions/overview";
    }
    return undefined;
  case "omit_list":
    return '["platform"]';
  case "exportid":
    return "f9b35d90be5f2240eafced7c6bfdf130856cd0a7";
  case "id":
  case "{id}":
  case "\\{id\\}":
    if (doc.endpoint === "/i/crash_symbols/remove_symbol") {
      const context = await getCrashSymbolDocContext(doc);
      return context?.symbolId || await getFirstCrashSymbolId() || undefined;
    }
    if (doc.endpoint.startsWith("/i/journey-engine/") || doc.endpoint.startsWith("/o/journey-engine/") || doc.endpoint.startsWith("/o/journey-enginge/")) {
      return await resolveEndpointSpecificValue(doc, paramName);
    }
    if (doc.endpoint.startsWith("/i/data-manager/") || doc.endpoint.startsWith("/o/data-manager/")) {
      return await resolveEndpointSpecificValue(doc, paramName);
    }
    if (doc.endpoint === "/i/calculated_metrics/delete") {
      const context = await getFormulaDocContext(doc);
      return context?.formulaId || await getFirstFormulaId() || undefined;
    }
    if (doc.endpoint.includes("/app_users/deleteExport/") || doc.endpoint.includes("/app_users/download/")) {
      return await getFirstAppUserExportId() || undefined;
    }
    if (doc.endpoint === "/o/users/id") {
      const context = await getDashboardUserDocContext(doc);
      return context?._id || undefined;
    }
    return undefined;
  case "{task_id}":
  case "\\{task_id\\}":
    if (doc.endpoint.includes("/o/export/download/")) {
      const context = await getTaskDocContext(doc);
      return context?.taskId || await getFirstTaskId() || undefined;
    }
    return await getFirstTaskId() || undefined;
  case "condition_id":
    if (doc.endpoint === "/i/remote-config/update-condition") {
      const context = await getRemoteConfigConditionDocContext(doc);
      return context?.conditionId || undefined;
    }
    return await getFirstRemoteConfigConditionId() || undefined;
  case "condition":
    if (doc.endpoint === "/i/remote-config/add-condition") {
      const slug = makeDocSlug(doc);
      const label = makeHumanLabel(slug);
      const now = Date.now();
      return JSON.stringify(buildRemoteConfigConditionPayload(
        `Docs Validator Condition ${label} ${now}`,
        `docs_validator_param_${slug}_${now}`
      ));
    }
    if (doc.endpoint === "/i/remote-config/update-condition") {
      const context = await getRemoteConfigConditionDocContext(doc);
      return context?.updatePayload ? JSON.stringify(context.updatePayload) : undefined;
    }
    return DUMMY.remoteConfigCondition;
  case "parameter_id":
    if (doc.endpoint === "/i/remote-config/update-parameter") {
      const context = await getRemoteConfigParameterDocContext(doc);
      return context?.parameterId || undefined;
    }
    return await getFirstRemoteConfigParameterId() || undefined;
  case "parameter":
    if (doc.endpoint === "/i/remote-config/add-parameter") {
      const slug = makeDocSlug(doc);
      return JSON.stringify(buildRemoteConfigParameterPayload(`docs_validator_param_${slug}_${Date.now()}`, "enabled"));
    }
    if (doc.endpoint === "/i/remote-config/update-parameter") {
      const context = await getRemoteConfigParameterDocContext(doc);
      return context?.updatePayload ? JSON.stringify(context.updatePayload) : undefined;
    }
    return DUMMY.remoteConfigParameter;
  case "config":
    if (doc.endpoint === "/i/remote-config/add-complete-config") {
      const slug = makeDocSlug(doc);
      const label = makeHumanLabel(slug);
      const now = Date.now();
      return JSON.stringify({
        parameters: [{
          parameter_key: `docs_validator_rollout_${slug}_${now}`,
          exp_value: "variant_b",
          default_value: "variant_a",
          description: `Docs validator rollout ${label}`
        }],
        condition: {
          condition_name: `Docs Validator Rollout ${label} ${now}`,
          condition: {"up.nc": {$eq: 1}}
        }
      });
    }
    return DUMMY.remoteConfigConfig;
  case "groups":
    if (doc.endpoint === "/i/cohorts/group") {
      return '{"docs_validator":1}';
    }
    if (doc.endpoint === "/i/funnels/group") {
      return '{"docs_validator":1}';
    }
    return DUMMY.groups;
  case "username":
    if (doc.endpoint === "/o/users/reset_timeban") {
      const context = await getDashboardUserDocContext(doc);
      return context?.username || undefined;
    }
    return undefined;
  case "alert_config":
    return withAppId(DUMMY.alertConfig);
  case "hook_config":
    return withAppId(DUMMY.hookConfig);
  case "widget":
    return withAppId(DUMMY.widget);
  case "tod_type":
    return "[CLY]_session";
  case "report_id":
    return await getFirstCrashReportId() || undefined;
  case "crash_id":
    if (doc.endpoint.startsWith("/i/crash_symbols/") || doc.endpoint.startsWith("/o/crashes/") || doc.endpoint.startsWith("/i/crashes/")) {
      return await getFirstCrashDownloadId() || undefined;
    }
    return undefined;
  case "crashgroup_id":
    if (doc.endpoint.startsWith("/i/crash_symbols/")) {
      return await getFirstCrashGroupId() || undefined;
    }
    return undefined;
  case "symbol_id":
    if (doc.endpoint.startsWith("/i/crash_symbols/") || doc.endpoint === "/o?method=download_symbol") {
      const context = await getCrashSymbolDocContext(doc);
      return context?.symbolId || await getFirstCrashSymbolId() || undefined;
    }
    return await getFirstCrashSymbolId() || undefined;
  case "return_url":
    if (doc.endpoint.startsWith("/i/crash_symbols/") || doc.endpoint.startsWith("/o/symbolication/")) {
      return new URL("/i/crash_symbols/symbolicatation_result", CONFIG.baseUrl).toString();
    }
    return undefined;
  case "jobId":
    if (doc.endpoint === "/i/crash_symbols/symbolicatation_result") {
      return "docs-validator-job";
    }
    return undefined;
  case "symbRes":
    if (doc.endpoint === "/i/crash_symbols/symbolicatation_result") {
      return "Error: Docs validator stacktrace";
    }
    return undefined;
  case "symbolication_test":
    if (doc.endpoint === "/i/crash_symbols/symbolicatation_result") {
      return "1";
    }
    return undefined;
  case "server_url":
    if (doc.endpoint.startsWith("/o/symbolication/")) {
      return "http://127.0.0.1:1";
    }
    return undefined;
  case "symb_key":
    if (doc.endpoint.startsWith("/o/symbolication/")) {
      return "docs-validator-symbolication-key";
    }
    return undefined;
  default:
    return await resolveEndpointSpecificValue(doc, paramName);
  }
}

async function resolveEndpointSpecificValue(doc, paramName) {
  if (doc.endpoint.startsWith("/i/ab-testing/") || doc.endpoint.startsWith("/o/ab-testing/") || doc.endpoint.includes("method=ab_") || doc.endpoint === "/o/sdk?method=ab") {
    if (doc.endpoint === "/i/ab-testing/add-experiment") {
      if (paramName === "experiment") {
        const parameter = await createSeedAbParameter();
        return parameter?.parameterKey
          ? JSON.stringify(buildAbExperimentPayload(parameter.parameterKey, `Docs Validator Experiment ${Date.now()}`))
          : undefined;
      }
    }

    if (doc.endpoint === "/i/ab-testing/update-experiment") {
      const context = await getAbExperimentDocContext(doc);
      if (paramName === "experiment_id") {
        return context?.experimentId || undefined;
      }
      if (paramName === "experiment") {
        return context?.parameterKey
          ? JSON.stringify(buildAbExperimentPayload(context.parameterKey, `Docs Validator Experiment Update ${Date.now()}`))
          : undefined;
      }
    }

    if (["/o/ab-testing/experiment", "/o/ab-testing/experiment-detail", "/i/ab-testing/start-experiment", "/i/ab-testing/remove-experiment"].includes(doc.endpoint)) {
      const context = await getAbExperimentDocContext(doc);
      if (paramName === "experiment_id") {
        return context?.experimentId || undefined;
      }
      if (paramName === "experiments") {
        return context?.experimentId ? `["${context.experimentId}"]` : undefined;
      }
    }

    if (["/i/ab-testing/stop-experiment", "/i/ab-testing/reset-experiment"].includes(doc.endpoint)) {
      const context = await getRunningAbExperimentDocContext(doc);
      if (paramName === "experiment_id") {
        return context?.experimentId || undefined;
      }
    }

    if (doc.endpoint === "/o/sdk?method=ab_fetch_variants") {
      const context = await getRunningAbExperimentDocContext(doc);
      if (paramName === "keys") {
        return context?.parameterKey ? `["${context.parameterKey}"]` : undefined;
      }
    }

    if (doc.endpoint === "/i?method=ab_enroll_variant" || doc.endpoint === "/i/sdk?method=ab_enroll_variant") {
      const context = await getRunningAbExperimentDocContext(doc);
      if (paramName === "key") {
        return context?.parameterKey || undefined;
      }
      if (paramName === "variant") {
        return "Variant A";
      }
    }

    if (doc.endpoint === "/i?method=ab_opt_out" || doc.endpoint === "/i/sdk?method=ab_opt_out") {
      const context = await getRunningAbExperimentDocContext(doc);
      if (paramName === "keys") {
        return context?.parameterKey ? `["${context.parameterKey}"]` : undefined;
      }
    }

    if (doc.endpoint === "/o/sdk?method=ab") {
      if (paramName === "keys") {
        const key = await getFirstRemoteConfigParameterKey();
        return key ? `["${key}"]` : undefined;
      }
    }
  }

  if (doc.endpoint.startsWith("/i/drill/") || doc.endpoint === "/o?method=drill_bookmark") {
    if (["/i/drill/edit_bookmark", "/i/drill/delete_bookmark", "/o?method=drill_bookmark"].includes(doc.endpoint)) {
      const context = await getDrillBookmarkDocContext(doc);
      const bookmarkId = context?.bookmarkId;
      if ((paramName === "bookmark_id" || paramName === "_id") && bookmarkId) {
        return bookmarkId;
      }
    }
    switch (paramName) {
    case "event_key":
      return "[CLY]_session";
    case "query_obj":
      return "{}";
    case "query_text":
      return "All sessions";
    case "by_val":
      return '["sg.p"]';
    case "by_val_text":
      return "Platform";
    case "global":
      return "false";
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/date_presets/") || doc.endpoint.startsWith("/o/date_presets/")) {
    switch (paramName) {
    case "range":
      return JSON.stringify(["7days", "today"]);
    case "share_with":
      return "none";
    case "shared_email_edit":
    case "shared_email_view":
    case "shared_user_groups_edit":
    case "shared_user_groups_view":
      return "[]";
    case "exclude_current_day":
      return "false";
    case "fav":
      return "false";
    case "sort_order":
      return "0";
    default:
      break;
    }
  }

  if (doc.endpoint === "/o/export/request" || doc.endpoint === "/o/export/requestQuery") {
    switch (paramName) {
    case "path":
      return "/o/analytics/events";
    case "data":
      return JSON.stringify({app_id: CONFIG.appId, period: CONFIG.defaultPeriod});
    case "filename":
      return "docs-validator";
    case "type":
      return "json";
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/cms/") || doc.endpoint.startsWith("/o/cms/")) {
    switch (paramName) {
    case "_id":
      return "server-guides";
    case "entries":
      return JSON.stringify([
        {_id: `server-guides_${Date.now()}`, title: "Guide 1", body: "Welcome"}
      ]);
    case "query":
      return '{"title":"Guide 1"}';
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/events/")) {
    switch (paramName) {
    case "set_visibility":
      return "hide";
    case "whitelisted_segments":
      return '{"[CLY]_session":["platform"]}';
    default:
      break;
    }
  }

  if (doc.endpoint === "/o") {
    switch (paramName) {
    case "method":
      return "total_users";
    case "metric":
      return "users";
    default:
      break;
    }
  }

  if (doc.endpoint === "/o/export") {
    if (paramName === "exportData") {
      const dashboardId = await createSeedDashboard();
      return dashboardId
        ? JSON.stringify([{id: "dashboards", name: "Dashboards", children: [{id: dashboardId, name: "Docs Validator Dashboard"}]}])
        : undefined;
    }
  }

  if (doc.endpoint === "/i/app_users/update" && paramName === "update") {
    return '{"$set":{"custom.docs_validator":"true"}}';
  }

  if (doc.endpoint.startsWith("/i/journey-engine/") || doc.endpoint.startsWith("/o/journey-engine/") || doc.endpoint.startsWith("/o/journey-enginge/")) {
    switch (paramName) {
    case "Request body":
      if (doc.endpoint === "/i/journey-engine/init") {
        return JSON.stringify(await buildEndpointSpecificJsonBody(doc));
      }
      return "{}";
    case "appUser":
      return JSON.stringify({
        uid: "docs-validator-journey-user",
        did: "docs-validator-journey-device"
      });
    case "event":
      return JSON.stringify(buildDataManagerEventPayload(`docs_validator_journey_event_${makeDocSlug(doc)}_${Date.now()}`));
    case "id": {
      const context = await getJourneyDocContext(doc);
      return context?.journeyDefinitionId || undefined;
    }
    case "journeyDefinitionId": {
      const context = await getJourneyDocContext(doc);
      return context?.journeyDefinitionId || undefined;
    }
    case "journeyVersionId": {
      const context = await getJourneyDocContext(doc);
      return context?.versionId || undefined;
    }
    case "versionId": {
      const context = await getJourneyDocContext(doc);
      return context?.versionId || undefined;
    }
    case "uidType":
      return "users_entered";
    case "iDisplayStart":
      return "0";
    case "iDisplayLength":
      return "10";
    case "startTime":
      if (doc.endpoint === "/o/journey-engine/debug") {
        return undefined;
      }
      return String(Date.now() - 86400000);
    case "endTime":
      if (doc.endpoint === "/o/journey-engine/debug") {
        return undefined;
      }
      return String(Date.now());
    case "name": {
      if (doc.endpoint === "/o/journey-engine/debug") {
        const context = await getJourneyDocContext(doc);
        return context?.name || DUMMY.name;
      }
      return DUMMY.name;
    }
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/data-manager/") || doc.endpoint.startsWith("/o/data-manager/")) {
    const slug = makeDocSlug(doc);
    switch (paramName) {
    case "event": {
      if (doc.endpoint === "/i/data-manager/event" || doc.endpoint === "/i/data-manager/event/edit") {
        const context = doc.endpoint === "/i/data-manager/event/edit"
          ? await getDataManagerEventDocContext(doc)
          : null;
        const eventKey = context?.eventKey || `docs_validator_event_${slug}_${Date.now()}`;
        const segmentName = context?.segmentName || "docs_validator_segment";
        return JSON.stringify(buildDataManagerEventPayload(eventKey, segmentName));
      }
      return "docs_validator_event";
    }
    case "events": {
      const context = await getDataManagerEventDocContext(doc);
      return context?.eventKey ? JSON.stringify([context.eventKey]) : JSON.stringify(["docs_validator_event"]);
    }
    case "eventKey": {
      const context = await getDataManagerEventDocContext(doc);
      return context?.eventKey || undefined;
    }
    case "segment": {
      const context = await getDataManagerEventDocContext(doc);
      return context?.segmentName ? JSON.stringify({
        name: context.segmentName,
        type: "s",
        status: "approved",
        description: "Updated by docs validator",
        required: false
      }) : undefined;
    }
    case "eventSegments": {
      const context = await getDataManagerEventDocContext(doc);
      return context?.eventKey && context?.segmentName
        ? JSON.stringify([{event: context.eventKey, segment: context.segmentName}])
        : undefined;
    }
    case "categories":
      if (doc.endpoint === "/i/data-manager/category/edit") {
        return JSON.stringify([{name: `Docs Validator Category ${Date.now()}`}]);
      }
      return JSON.stringify([`Docs Validator Category ${Date.now()}`]);
    case "category":
      return "Docs Validator Category";
    case "categoryIds":
      return JSON.stringify(["507f1f77bcf86cd799439011"]);
    case "ops":
      if (doc.endpoint === "/i/data-manager/mask-data") {
        return JSON.stringify([{
          isUserProperty: true,
          event: "custom",
          segment: `docs_validator_mask_${slug}`,
          mask: false
        }]);
      }
      return JSON.stringify({
        [`custom|docs_validator_type_${slug}`]: {
          event: "custom",
          segment: `docs_validator_type_${slug}`,
          newDataType: "s",
          prevDataType: "n"
        }
      });
    case "customProperty":
      return `docs_validator_ttl_${slug}`;
    case "ttl":
      return "SESSION";
    case "disableExpire":
      return undefined;
    case "group":
      return "custom";
    case "property":
      return `docs_validator_property_${slug}`;
    case "user_property":
      return "true";
    case "iDisplayStart":
      return "0";
    case "iDisplayLength":
      return "10";
    case "sEcho":
      return "1";
    case "transformation":
      if (doc.endpoint === "/i/data-manager/transform-history") {
        return JSON.stringify({
          actionType: "PROPERTY_RENAME",
          parentEvent: "CUSTOM_PROPERTY",
          transformTarget: [`docs_validator_prop_${slug}`],
          transformResult: `docs_validator_prop_${slug}_${Date.now()}`,
          transformationProcessTarget: "incoming"
        });
      }
      return JSON.stringify(buildDataManagerTransformationPayload(slug));
    case "id": {
      if (doc.endpoint === "/i/data-manager/user-properties/delete") {
        return `custom|docs_validator_property_${slug}`;
      }
      const context = await getDataManagerTransformationDocContext(doc);
      return context?.transformationId || undefined;
    }
    case "status":
      return "ENABLED";
    case "validationIds":
      return "[]";
    default:
      break;
    }
  }

  if (doc.endpoint.includes("calculated_metrics")) {
    switch (paramName) {
    case "mode":
      return "unsaved";
    case "formula":
      return JSON.stringify(buildFormulaBuilderPayload());
    case "metric_id": {
      const context = await getFormulaDocContext(doc);
      return context?.formulaId || await getFirstFormulaId() || undefined;
    }
    case "format":
      return "float";
    case "dplaces":
      return "2";
    case "metric":
      return JSON.stringify(buildFormulaMetricPayload());
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/geolocations/")) {
    switch (paramName) {
    case "args":
      return JSON.stringify(buildGeoLocationArgs());
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/crashes/")) {
    switch (paramName) {
    case "args": {
      const crashId = ["/i/crashes/delete", "/i/crashes/modify_share"].includes(doc.endpoint)
        ? await createSeedCrashGroup() || await getFirstCrashGroupId()
        : await getFirstCrashGroupId();
      if (!crashId) {
        return undefined;
      }
      if (doc.endpoint === "/i/crashes/add_comment") {
        return JSON.stringify({crash_id: crashId, comment: "Docs validator comment"});
      }
      if (doc.endpoint === "/i/crashes/edit_comment" || doc.endpoint === "/i/crashes/delete_comment") {
        return JSON.stringify({crash_id: crashId, comment_id: "docs-validator-comment", comment: "Docs validator comment"});
      }
      if (doc.endpoint === "/i/crashes/modify_share") {
        return JSON.stringify({
          crash_id: crashId,
          data: {allow_download: false}
        });
      }
      return JSON.stringify({crash_id: crashId, crashes: [crashId]});
    }
    case "crash_id":
      return await getFirstCrashGroupId() || undefined;
      break;
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/flows/") || doc.endpoint.startsWith("/o/flows")) {
    switch (paramName) {
    case "name":
      return `Docs Validator Flow ${Date.now()}`;
    case "type":
      return "events";
    case "start":
      return '{"event":"[CLY]_session"}';
    case "end":
      return '{"event":"[CLY]_view"}';
    case "exclude":
      return "[]";
    case "user_segmentation":
      return "{}";
    case "disabled":
      return "false";
    case "iDisplayStart":
      return "0";
    case "iDisplayLength":
      return "10";
    case "sEcho":
      return "1";
    default:
      break;
    }
  }

  if ((doc.endpoint.includes("/app_users/deleteExport/") || doc.endpoint.includes("/app_users/download/")) && (paramName === "id" || paramName === "{id}" || paramName === "\\{id\\}")) {
    return await getFirstAppUserExportId() || undefined;
  }

  if (doc.endpoint === "/i/funnels/add") {
    switch (paramName) {
    case "funnel_name":
      return `Docs Validator Funnel ${Date.now()}`;
    case "funnel_desc":
      return DUMMY.description;
    case "funnel_type":
      return "session-independent";
    case "steps":
      return DUMMY.funnelSteps;
    case "queries":
      return DUMMY.funnelQueries;
    case "queryTexts":
      return DUMMY.funnelQueryTexts;
    case "stepGroups":
      return DUMMY.funnelStepGroups;
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/funnels/")) {
    switch (paramName) {
    case "funnel_map": {
      const context = await getFunnelDocContext(doc);
      if (!context?.funnelId) {
        return undefined;
      }
      return JSON.stringify({
        [context.funnelId]: {
          funnel_name: `Docs Validator Funnel Update ${Date.now()}`,
          funnel_desc: DUMMY.description,
          funnel_type: "session-independent",
          steps: JSON.parse(DUMMY.funnelSteps),
          queries: JSON.parse(DUMMY.funnelQueries),
          queryTexts: JSON.parse(DUMMY.funnelQueryTexts),
          stepGroups: JSON.parse(DUMMY.funnelStepGroups)
        }
      });
    }
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/cohorts/")) {
    switch (paramName) {
    case "detail_metrics":
      return '["up.cc","up.p"]';
    case "cohort_name":
      return `Docs Validator Cohort ${Date.now()}`;
    case "cohort_desc":
      return DUMMY.description;
    case "type":
      return doc.endpoint === "/i/cohorts/add_users" || doc.endpoint === "/i/cohorts/remove_users" ? "manual" : "auto";
    case "steps":
      return DUMMY.steps;
    case "uids": {
      const context = doc.endpoint === "/i/cohorts/remove_users"
        ? await getManualCohortMembershipDocContext(doc)
        : null;
      if (context?.uid) {
        return JSON.stringify([context.uid]);
      }
      const user = await createSeedAppUser(CONFIG.appId);
      return user?.uid ? JSON.stringify([user.uid]) : undefined;
    }
    case "query":
      return '{"uid":{"$in":["docs-validator-user"]}}';
    case "visibility":
      return "global";
    default:
      break;
    }
  }

  if (doc.endpoint === "/i/dashboards/create") {
    switch (paramName) {
    case "name":
      return `Docs Validator Dashboard ${Date.now()}`;
    case "share_with":
      return DUMMY.shareWith;
    case "theme":
      return DUMMY.theme;
    default:
      break;
    }
  }

  if (doc.endpoint === "/i/dashboards/update") {
    switch (paramName) {
    case "dashboard_id": {
      const context = await getDashboardDocContext(doc);
      return context?.dashboardId || undefined;
    }
    case "share_with":
      return DUMMY.shareWith;
    default:
      break;
    }
  }

  if (doc.endpoint === "/o/dashboard/data" && paramName === "widget_id") {
    const context = await getDashboardWidgetDocContext(doc);
    return context?.widgetId || undefined;
  }

  if (doc.endpoint === "/o/dashboards/widget" && paramName === "widget_id") {
    const context = await getDashboardWidgetDocContext(doc);
    return context?.widgetId || undefined;
  }

  if (doc.endpoint === "/i/dashboards/remove-widget" && paramName === "widget_id") {
    const context = await getDashboardWidgetDocContext(doc);
    return context?.widgetId || undefined;
  }

  if (doc.endpoint === "/i/dashboards/update-widget" && paramName === "widget_id") {
    const context = await getDashboardWidgetDocContext(doc);
    return context?.widgetId || undefined;
  }

  if (doc.endpoint === "/i/surveys/nps/status" && paramName === "data") {
    const context = await getSurveyWidgetDocContext(doc, "nps");
    const id = context?.widgetId || await getFirstNpsWidgetId();
    return id ? `{"${id}":false}` : undefined;
  }

  if (doc.endpoint === "/i/surveys/survey/status" && paramName === "data") {
    const context = await getSurveyWidgetDocContext(doc, "survey");
    const id = context?.widgetId || await getFirstSurveyWidgetId();
    return id ? `{"${id}":false}` : undefined;
  }

  if (doc.endpoint === "/i/surveys/nps/edit" && paramName === "name") {
    return `NPS ${DUMMY.name} ${Date.now()}`;
  }

  if (doc.endpoint === "/i/concurrent_alert/save" && paramName === "alert") {
    return DUMMY.concurrentAlert;
  }

  if (doc.endpoint.startsWith("/i/blocks/")) {
    if (paramName === "blocks") {
      if (doc.endpoint === "/i/blocks/create") {
        return JSON.stringify({
          type: "event",
          key: "docs_validator_never_block",
          name: `Docs Validator Block ${Date.now()}`,
          rule: {"segmentation.__docs_validator_never__": {$in: ["1"]}},
          status: false
        });
      }

      const context = await getBlockDocContext(doc);
      if (!context?._id) {
        return undefined;
      }

      if (doc.endpoint === "/i/blocks/update") {
        return JSON.stringify({
          _id: context._id,
          type: "event",
          key: "docs_validator_never_block",
          name: `Docs Validator Block Updated ${Date.now()}`,
          rule: {"segmentation.__docs_validator_never__": {$in: ["2"]}},
          status: false
        });
      }

      if (doc.endpoint === "/i/blocks/toggle_status") {
        return JSON.stringify({[context._id]: false});
      }
    }
  }

  if (doc.endpoint.startsWith("/i/content/") || doc.endpoint.startsWith("/o/content")) {
    switch (paramName) {
    case "type":
      return "modal";
    case "blocks":
      return JSON.stringify([{
        layout: "modal",
        elements: {
          title: {
            text: "Docs Validator Content"
          }
        }
      }]);
    case "details":
      return JSON.stringify({
        title: `Docs Validator Content ${Date.now()}`,
        creatorId: (await getCurrentUser())?._id || "",
        favorite: false,
        created: 0
      });
    case "content_id": {
      const context = await getContentBlockDocContext(doc);
      return context?._id || undefined;
    }
    case "_id": {
      if (doc.endpoint.includes("/o/content/by-id") || doc.endpoint === "/i/content/delete") {
        const context = await getContentBlockDocContext(doc);
        return context?._id || undefined;
      }
      break;
    }
    case "asset_name":
      return `docs-validator-asset-renamed-${Date.now()}.png`;
    case "asset_tags":
      return '["docs-validator","updated"]';
    case "resolution":
      return '{"l":{"w":1920,"h":1080},"p":{"w":1080,"h":1920}}';
    case "devices":
      return '[{"resolution":{"width":390,"height":844},"position":"center","type":"modal","heightMultiplier":1,"fullScreenOverride":false}]';
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/populator/") || doc.endpoint.startsWith("/o/populator/")) {
    switch (paramName) {
    case "name":
      return `Docs Validator Template ${Date.now()}`;
    case "users":
      if (doc.endpoint === "/i/populator/environment/save") {
        const template = await getPopulatorTemplateDocContext(doc);
        if (!template?.templateId) {
          return undefined;
        }
        const suffix = Date.now();
        return JSON.stringify([{
          appId: CONFIG.appId,
          templateId: template.templateId,
          environmentName: `Docs Validator Environment ${suffix}`,
          userName: `docs_validator_${suffix}`,
          platform: "iOS",
          device: "iPhone 15",
          appVersion: "1.0.0",
          deviceId: `docs-validator-device-${suffix}`,
          custom: {plan: "premium"}
        }]);
      }
      return '[{"plan":["free","premium"]}]';
    case "events":
    case "views":
    case "sequences":
      return "[]";
    case "behavior":
      return "{}";
    case "_id": {
      if (doc.endpoint === "/i/populator/templates/edit") {
        const context = await getPopulatorTemplateDocContext(doc);
        return context?.templateId || undefined;
      }
      break;
    }
    case "generated_on":
      return String(Date.now());
    case "sEcho":
      return "1";
    case "iDisplayStart":
      return "0";
    case "iDisplayLength":
      return "10";
    case "sSearch":
      return "docs_validator";
    default:
      break;
    }
  }

  if (doc.endpoint === "/i/feedback/widgets/status" && paramName === "data.[widgetId]") {
    return undefined;
  }

  if (doc.endpoint === "/i/feedback/widgets/status" && paramName === "data") {
    const id = await getFirstFeedbackWidgetId();
    return id ? `{"${id}":false}` : undefined;
  }

  if (doc.endpoint.startsWith("/i/groups/") || doc.endpoint.startsWith("/o/groups/")) {
    switch (paramName) {
    case "args":
      if (doc.endpoint === "/i/groups/create") {
        return JSON.stringify({
          name: `Docs Validator Group ${Date.now()}`,
          groupID: `docs-validator-group-${Date.now()}`,
          global_admin: false,
          permission: buildGroupPermission()
        });
      }
      if (["/i/groups/delete", "/o/groups/group-details", "/o/groups/group-users"].includes(doc.endpoint)) {
        const context = await getGroupDocContext(doc);
        return context?._id ? JSON.stringify({_id: context._id}) : undefined;
      }
      if (doc.endpoint === "/i/groups/update") {
        const context = await getGroupDocContext(doc);
        return context?._id ? JSON.stringify({
          _id: context._id,
          name: `${context.name} Updated`,
          groupID: `${context.groupID}-updated`,
          global_admin: false,
          permission: buildGroupPermission()
        }) : undefined;
      }
      if (doc.endpoint === "/i/groups/save-user-group") {
        const context = await getGroupDocContext(doc);
        const email = await getAssignableMemberEmail();
        return context?._id && email ? JSON.stringify({email, group_id: [context._id]}) : undefined;
      }
      if (doc.endpoint === "/i/groups/save-many-user-group") {
        const context = await getGroupDocContext(doc);
        const email = await getAssignableMemberEmail();
        return context?._id && email ? JSON.stringify({emails: [email], group_id: context._id}) : undefined;
      }
      if (doc.endpoint === "/i/groups/remove-user-group") {
        const context = await getGroupMembershipDocContext(doc);
        const email = context?.email;
        return context?._id && email ? JSON.stringify({email, group_id: context._id}) : undefined;
      }
      break;
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/users/")) {
    switch (paramName) {
    case "args":
      if (doc.endpoint === "/i/users/create") {
        const suffix = Date.now();
        return JSON.stringify({
          full_name: `Docs Validator User ${suffix}`,
          username: `docs_validator_${suffix}`,
          password: "DocsValidator123!A",
          email: `docs-validator-${suffix}@example.com`,
          global_admin: false
        });
      }
      if (doc.endpoint === "/i/users/update") {
        const context = await getDashboardUserDocContext(doc);
        return context?._id ? JSON.stringify({
          user_id: context._id,
          full_name: `Docs Validator Updated ${Date.now()}`
        }) : undefined;
      }
      if (doc.endpoint === "/i/users/delete") {
        const context = await getDashboardUserDocContext(doc);
        return context?._id ? JSON.stringify({user_ids: [context._id]}) : undefined;
      }
      break;
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/apps/")) {
    switch (paramName) {
    case "args":
      if (doc.endpoint === "/i/apps/create") {
        return JSON.stringify({
          name: `Docs Validator App ${Date.now()}`,
          country: "US",
          timezone: "Etc/UTC",
          category: "6",
          type: "mobile"
        });
      }
      if (doc.endpoint === "/i/apps/update") {
        const context = await getAppDocContext(doc);
        return context?.appId ? JSON.stringify({
          app_id: context.appId,
          timezone: "Europe/Berlin",
          country: "DE"
        }) : undefined;
      }
      if (doc.endpoint === "/i/apps/delete" || doc.endpoint === "/i/apps/reset") {
        const context = await getAppDocContext(doc);
        return context?.appId ? JSON.stringify({
          app_id: context.appId,
          ...(doc.endpoint === "/i/apps/reset" ? {period: "all"} : {})
        }) : undefined;
      }
      break;
    case "app_id":
      if (doc.endpoint === "/i/apps/update") {
        const context = await getAppDocContext(doc);
        return context?.appId || undefined;
      }
      break;
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/app_users/")) {
    switch (paramName) {
    case "data":
      if (doc.endpoint === "/i/app_users/create") {
        return JSON.stringify({
          did: `docs-validator-device-${Date.now()}`,
          name: `Docs Validator App User ${Date.now()}`
        });
      }
      break;
    case "query":
      if (doc.endpoint === "/i/app_users/update" || doc.endpoint === "/i/app_users/delete") {
        const context = await getAppUserDocContext(doc);
        return context?.did ? JSON.stringify({did: context.did}) : undefined;
      }
      break;
    case "update":
      if (doc.endpoint === "/i/app_users/update") {
        return '{"$set":{"custom.docs_validator":"true"}}';
      }
      break;
    default:
      break;
    }
  }

  if (doc.endpoint.startsWith("/i/event_groups/") || doc.endpoint === "/o?method=get_event_groups" || doc.endpoint === "/o?method=get_event_group") {
    switch (paramName) {
    case "_id": {
      if (doc.endpoint === "/o?method=get_event_group") {
        const context = await getEventGroupDocContext(doc);
        return context?._id || undefined;
      }
      break;
    }
    case "args":
      if (doc.endpoint === "/i/event_groups/create") {
        return JSON.stringify({
          app_id: CONFIG.appId,
          name: `Docs Validator Event Group ${Date.now()}`,
          source_events: ["[CLY]_session"],
          display_map: {},
          status: true,
          description: DUMMY.description
        });
      }
      if (doc.endpoint === "/i/event_groups/update") {
        const context = await getEventGroupDocContext(doc);
        return context?._id ? JSON.stringify({
          _id: context._id,
          name: `${context.name} Updated`,
          description: "Updated by docs validator"
        }) : undefined;
      }
      if (doc.endpoint === "/i/event_groups/delete") {
        const context = await getEventGroupDocContext(doc);
        return context?._id ? JSON.stringify([context._id]) : undefined;
      }
      break;
    case "event_order": {
      if (doc.endpoint === "/i/event_groups/update") {
        const context = await getEventGroupDocContext(doc);
        return context?._id ? JSON.stringify([context._id]) : undefined;
      }
      break;
    }
    case "update_status": {
      if (doc.endpoint === "/i/event_groups/update") {
        const context = await getEventGroupDocContext(doc);
        return context?._id ? JSON.stringify([context._id]) : undefined;
      }
      break;
    }
    case "status":
      if (doc.endpoint === "/i/event_groups/update") {
        return "false";
      }
      break;
    default:
      break;
    }
  }

  if (doc.endpoint === "/o/apps/details" && paramName === "app_id") {
    return CONFIG.appId || undefined;
  }

  if (doc.endpoint === "/o/actions") {
    switch (paramName) {
    case "device":
      return '{"minWidth":0,"maxWidth":1920}';
    case "actionType":
      return "click";
    default:
      break;
    }
  }

  if (doc.endpoint === "/i/views?method=rename_views" && paramName === "data") {
    const context = await getViewDocContext(doc);
    return context?.viewId ? JSON.stringify([{key: context.viewId, value: `Docs Validator View ${Date.now()}`}]) : undefined;
  }

  if (doc.endpoint === "/o/users/id" && (paramName === "id" || paramName === "_id")) {
    const user = await getCurrentUser();
    return user?._id || undefined;
  }

  if (doc.endpoint === "/o/app_users/loyalty" && paramName === "uid") {
    return undefined;
  }

  if (doc.endpoint === "/o/campaign" && paramName === "list") {
    return "true";
  }

  if (doc.endpoint === "/o/dashboards" && paramName === "dashboard_id") {
    return await getFirstDashboardId() || undefined;
  }

  if (doc.endpoint === "/o/dashboard/data" && paramName === "dashboard_id") {
    return await getFirstDashboardId() || undefined;
  }

  if (doc.endpoint === "/o/dashboards/widget-layout" && paramName === "dashboard_id") {
    return await getFirstDashboardId() || undefined;
  }

  if (doc.endpoint === "/o/dashboards/widget" && paramName === "dashboard_id") {
    return await getFirstDashboardId() || undefined;
  }

  return undefined;
}

async function performRequest(request) {
  if (CONFIG.interRequestDelayMs > 0) {
    await sleep(CONFIG.interRequestDelayMs);
  }

  let result;
  if (CONFIG.hostOverrideIp || request.multipart) {
    result = performCurlRequest(request);
  }
  else {
  try {
    const response = await fetch(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      signal: AbortSignal.timeout(CONFIG.timeoutMs)
    });

    const text = await response.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    }
    catch {
      json = null;
    }

    result = {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get("content-type"),
      text: trimForReport(text),
      json
    };
  }
  catch {
    if (!CONFIG.useCurlFallback) {
      throw new Error("fetch failed");
    }
    result = performCurlRequest(request);
  }
  }

  if (CONFIG.retryableErrorStatusCodes.has(result.status) && CONFIG.retryableErrorCooldownMs > 0) {
    await sleep(CONFIG.retryableErrorCooldownMs);
  }

  return result;
}

function performCurlRequest(request) {
  const timeoutSeconds = Math.max(1, Math.ceil(CONFIG.timeoutMs / 1000));
  const marker = "__CURL_STATUS__:";
  const contentTypeMarker = "__CURL_CONTENT_TYPE__:";
  const args = ["-sS", "-m", String(timeoutSeconds), "-X", request.method];
  const requestUrl = new URL(request.url);

  if (CONFIG.hostOverrideIp && requestUrl.hostname === BASE_URL.hostname) {
    const port = requestUrl.port || (requestUrl.protocol === "https:" ? "443" : "80");
    args.push("--resolve", `${requestUrl.hostname}:${port}:${CONFIG.hostOverrideIp}`);
  }

  for (const [key, value] of Object.entries(request.headers || {})) {
    args.push("-H", `${key}: ${value}`);
  }

  if (Array.isArray(request.multipart) && request.multipart.length > 0) {
    for (const part of request.multipart) {
      if (!part?.name || !part?.filePath) {
        continue;
      }
      const contentType = part.contentType ? `;type=${part.contentType}` : "";
      args.push("-F", `${part.name}=@${part.filePath}${contentType}`);
    }
  }
  else if (request.body !== undefined) {
    args.push("--data-binary", request.body);
  }

  if (request.discardBody) {
    args.push("-o", "/dev/null");
  }

  args.push("-w", `\n${marker}%{http_code}\n${contentTypeMarker}%{content_type}`, request.url);

  const result = spawnSync("curl", args, {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024
  });

  const combinedOutput = `${result.stdout || ""}${result.stderr || ""}`;
  const statusIndex = combinedOutput.lastIndexOf(`\n${marker}`);
  if (statusIndex === -1) {
    throw new Error((result.stderr || result.stdout || "curl request failed").trim());
  }

  const body = combinedOutput.slice(0, statusIndex);
  const rest = combinedOutput.slice(statusIndex + 1);
  const [statusLine = "", contentTypeLine = ""] = rest.split("\n");
  const status = Number(statusLine.replace(marker, "")) || 0;
  const contentType = contentTypeLine.replace(contentTypeMarker, "") || null;

  let json = null;
  try {
    json = body ? JSON.parse(body) : null;
  }
  catch {
    json = null;
  }

  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: result.status === 0 ? "curl" : `curl exit ${result.status}`,
    contentType,
    text: trimForReport(body),
    json
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function trimForReport(text) {
  if (!text) {
    return "";
  }
  const limit = 500;
  if (text.length <= limit) {
    return text;
  }
  return text.slice(0, limit) + "...";
}

function summarize(results) {
  const summary = {
    total: results.length,
    passed: 0,
    failed: 0,
    skipped: 0
  };

  for (const result of results) {
    if (result.live.status === "passed") {
      summary.passed += 1;
    }
    else if (result.live.status === "failed") {
      summary.failed += 1;
    }
    else {
      summary.skipped += 1;
    }
  }

  return summary;
}

function printResult(result) {
  const liveStatus = result.live.status.toUpperCase();
  const endpoint = result.endpoint || "(overview)";
  const suffix = result.live.reason ? ` - ${result.live.reason}` : "";
  console.log(`${liveStatus.padEnd(7)} ${endpoint} :: ${result.file}${suffix}`);
}

function loadEnv(filePath) {
  const merged = {...process.env};
  if (!fs.existsSync(filePath)) {
    return merged;
  }

  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const index = trimmed.indexOf("=");
    if (index === -1) {
      continue;
    }
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (!(key in merged)) {
      merged[key] = value;
    }
  }
  return merged;
}

function requiredEnv(key) {
  const value = ENV[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}
