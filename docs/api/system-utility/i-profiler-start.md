---
sidebar_label: "Profiler Start"
keywords:
  - "/i/profiler/start"
  - "start"
  - "profiler"
last_update:
  date: "2026-03-07"
---

# System Utility - Start Profiler

## Endpoint

```plaintext
/i/profiler/start
```

## Overview

Starts profiler mode (CPU, heap sampling, precise coverage) with auto-stop timeout.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires Global Admin access.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```plaintext
/i/profiler/start?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
{
  "result": "Starting profiler for all processes"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Success message when profiler starts. |

### Error Responses

```json
{
  "result": "Error: Already started"
}
```

## Behavior

- Starts profiler and sets a 2-hour auto-stop timer.
- If profiler is already running, returns `500`.

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
