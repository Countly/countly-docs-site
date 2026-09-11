---
sidebar_label: "Callback"
keywords:
  - "/i/crash_symbols/symbolicatation_result"
  - "symbolicatation_result"
  - "crash_symbols"
last_update:
  date: "2026-02-16"
---

# Symbolication result callback

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/crash_symbols/symbolicatation_result
```

## Overview

Receives symbolicated stack trace payload from symbolication server and updates crash group/job state.

## Authentication

- No dashboard member auth validation is applied in this route.
- Access should be restricted by using a controlled callback URL and symbolication server key configuration.

## Permissions

- No feature permission check is applied.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `jobId` | String | Yes (normal callback) | External symbolication job ID |
| `symbRes` | String | Yes (normal callback) | Symbolicated stack trace text |
| `symbolication_test` | Boolean/String | No | If present, returns test payload and exits |

## Examples

### Example 1: Callback from symbolication server

```text
/i/crash_symbols/symbolicatation_result?jobId=external-job-123&symbRes=TypeError:+...stacktrace...
```

### Example 2: Return-connection test callback

```text
/i/crash_symbols/symbolicatation_result?symbolication_test=1
```

## Response

### Success Response

Test mode:

```json
{
  "msg": "priviet"
}
```

Normal callback success:

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `msg` | String | Test-mode marker string |
| `result` | String | Callback processing result |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `{ "result": "Missing parameters" }` |
| 400 | `{ "result": "Cannot find job with provided id" }` |
| 400 | `{ "result": "Could not save result" }` |
| 400 | `{ "result": "Please set symbolication server url" }` |
| 400 | `{ "result": "Please provide symbolication server's api key" }` |

## Behavior

1. Validates callback payload (`jobId`, `symbRes`) unless test mode is used.
2. Updates crash group error body as symbolicated and clears in-process fields.
3. Marks job status and sends ack request to symbolication server.

## Related Endpoints

- [Run Symbolication](crash-symbolicate.md)
- [Test](symbolication-test.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.symbolication_jobs` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.app_crashgroups{app_id}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
