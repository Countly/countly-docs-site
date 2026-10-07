---
sidebar_label: "Run"
keywords:
  - "/i/crash_symbols/symbolicate"
  - "symbolicate"
  - "crash_symbols"
last_update:
  date: "2026-02-16"
---

# Run symbolication

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/crash_symbols/symbolicate
```

## Overview

Starts symbolication for a crash group using a selected symbol document.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `crashes` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application identifier |
| `crashgroup_id` | String | Yes | Crash group ID |
| `symbol_id` | String | Yes | Symbol document ID |
| `return_url` | String | Yes | Callback URL for external symbolication server flow |
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |

## Examples

### Example 1: Start symbolication for a crash group

```text
/i/crash_symbols/symbolicate?api_key=YOUR_API_KEY&app_id=5f9c8a3b4d1e2a001f3b4567&crashgroup_id=65c5dd952c5f5300121a0009&symbol_id=65c5e0732c5f5300121a0020&return_url=https://your-server.com/i/crash_symbols/symbolicatation_result
```

## Response

### Success Response

Success message depends on symbolication path:

```json
{
  "result": "Symbolication success"
}
```

```json
{
  "result": "Success"
}
```

```json
{
  "result": "Data sent to symbolication server"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Status/result message |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `{ "result": "Missing report id" }` |
| 400 | `{ "result": "Missing symbol id" }` |
| 400 | `{ "result": "Missing return url" }` |
| 400 | `{ "result": "Could not find symbol file" }` |
| 400 | `{ "result": "Could not find crashgroup" }` |
| 400 | `{ "result": "Could not create job" }` or `{ "result": "Could not create job: ..." }` |
| 400 | `{ "result": "Symbolication file is not found..." }` |
| 400 | `{ "result": "Could not save result, please see symbolication log for more details" }` |
| 400 | `{ "result": "Please set symbolication server url" }` |
| 400 | `{ "result": "Please provide symbolication server's api key" }` |
| 500 | `{ "result": "Crash plugin is not enabled or is older version" }` |
| 500 | `{ "result": "No original binary available" }` |
| 500 | `{ "result": "Error loading JS source map file" }` |

## Behavior

- Creates a job record in `symbolication_jobs` and updates crash group status fields.
- Uses one of three paths:
  - Android native (`minidump_stackwalk` local processing)
  - JavaScript (local source map deobfuscation)
  - External symbolication server (`symbolication_server` + `symbolication_key`)
- External-server path is asynchronous and returns after submitting job data.

## Related Endpoints

- [List Jobs](crash-jobs-list.md)
- [Get Report](crash-report-get.md)
- [Symbolication Result Callback](crash-symbolicate-result.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_crashsymbols{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.app_crashgroups{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.symbolication_jobs` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly_fs.crash_symbols` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
