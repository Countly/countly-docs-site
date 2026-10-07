---
sidebar_label: "Inspector Start"
keywords:
  - "/i/inspector/start"
  - "start"
  - "inspector"
last_update:
  date: "2026-03-07"
---

# System Utility - Start Inspector

## Endpoint

```plaintext
/i/inspector/start
```

## Overview

Starts Node inspector mode (master process) with auto-stop timeout.

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
/i/inspector/start?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
{
  "result": {
    "ports": [9229]
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Object | Inspector startup response payload. |
| `result.ports` | Array of Number | Inspector port list exposed by the running process set. |

### Error Responses

```json
{
  "result": "Error: Already started"
}
```

## Behavior

- Starts inspector and sets a 2-hour auto-stop timer.
- If already running, returns `500` with error text.

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.masterInspectorPort` | `9229` | Inspector connection info | Returned `ports` array uses this configured port value. |

**Database Collections**

This endpoint does not read or write database collections.

</details>
