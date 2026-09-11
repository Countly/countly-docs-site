---
sidebar_label: "Profiler Stop"
keywords:
  - "/i/profiler/stop"
  - "stop"
  - "profiler"
last_update:
  date: "2026-03-07"
---

# System Utility - Stop Profiler

## Endpoint

```plaintext
/i/profiler/stop
```

## Overview

Stops profiler mode and finalizes profile files.

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
/i/profiler/stop?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
{
  "result": "Stoping profiler for all processes"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Success message when profiler is stopped. |

### Error Responses

```json
{
  "result": "Error: Profiler needs to be started"
}
```

## Behavior

- Stops profiler and writes profiler artifacts under log profile directory.

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
