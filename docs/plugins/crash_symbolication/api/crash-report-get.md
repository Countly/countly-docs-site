---
sidebar_label: "Get Report"
---

# Get crash report

## Endpoint

```
/o?method=crash_report
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Fetches one crash report record by `report_id`.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
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

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `crashes.*` | Crashes feature defaults | Crash-report lookup behavior and source selection used by this endpoint. | Changes to crashes settings can affect how report details are retrieved and what metadata is available in output. |

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

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.crashdata_{appId}` / crash query backend | Crash report lookup source | Stores crash report documents queried by `report_id` through the crashes data layer. |
| `countly_drill.drill_events` (backend-dependent) | Crash event enrichment source | Provides crash event fields when report data is resolved through drill-based crash query paths. |

---

## Examples

### Example 1: Get report by ID

```text
/o?method=crash_report&app_id=5f9c8a3b4d1e2a001f3b4567&report_id=65c5df182c5f5300121a0019&api_key=YOUR_API_KEY
```

## Related Endpoints

- [Run Symbolication](crash-symbolicate.md)
- [List Jobs](crash-jobs-list.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-02-16
