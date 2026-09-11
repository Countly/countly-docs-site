---
sidebar_label: "Inspector Stop"
keywords:
  - "/i/inspector/stop"
  - "stop"
  - "inspector"
last_update:
  date: "2026-03-07"
---

# System Utility - Stop Inspector

## Endpoint

```plaintext
/i/inspector/stop
```

## Overview

Stops inspector mode.

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
/i/inspector/stop?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
{
  "result": "Stoping inspector for all processes"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Success message when inspector is stopped. |

### Error Responses

```json
{
  "result": "Error: Inspector needs to be started"
}
```

## Behavior

- Stops inspector and clears running timeout state.

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
