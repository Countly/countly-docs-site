---
sidebar_label: "Get Report"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-04-18"
---

# Get crash report

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o?method=crash_report
```

## Overview

Fetches one crash report record by `report_id`.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `crash_report` |
| `app_id` | String | Yes | Application identifier |
| `report_id` | String | Yes | Crash report identifier |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Examples

### Example 1: Get report by ID

```text
/o?method=crash_report&app_id=5f9c8a3b4d1e2a001f3b4567&report_id=65c5df182c5f5300121a0019&api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
{
  "_id": "65c5df182c5f5300121a0019",
  "uid": "user_12345",
  "group": "65c5dd952c5f5300121a0009",
  "error": "TypeError: Cannot read properties of undefined",
  "os": "Android",
  "app_version": "1.4.2",
  "ts": 1739625012
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Crash report ID |
| `uid` | String | User identifier |
| `group` | String | Crash group ID |
| `error` | String | Crash stack/error body |
| `ts` | Number | Event timestamp |
| `os` | String | OS name |
| `app_version` | String | App version |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `{ "result": "Missing parameter \"report_id\"" }` |
| 400 | `{ "result": "Report <id> not found" }` |
| 500 | `{ "result": "Error fetching crash report <id>" }` |

## Behavior

- Requires `Read` permission on the `crashes` feature.
- Requires `report_id`; missing values return `Missing parameter "report_id"`.
- Looks up a single crash report through the crashes data layer with query `{_id: report_id}` and `limit=1`.
- Returns the report document exactly as returned by the crashes table helper. The available fields depend on the crash backend and stored crash payload.
- If no report matches the ID, returns `Report <id> not found`.
- Query failures are logged and returned as `Error fetching crash report <id>`.

## Related Endpoints

- [Run Symbolication](crash-symbolicate.md)
- [List Jobs](crash-jobs-list.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `crashes.*` | Crashes feature defaults | Crash-report lookup behavior and source selection used by this endpoint. | Changes to crashes settings can affect how report details are retrieved and what metadata is available in output. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.crashdata_{appId}` / crash query backend | Crash report lookup source | Stores crash report documents queried by `report_id` through the crashes data layer. |
| `countly_drill.drill_events` (backend-dependent) | Crash event enrichment source | Provides crash event fields when report data is resolved through drill-based crash query paths. |

</details>
