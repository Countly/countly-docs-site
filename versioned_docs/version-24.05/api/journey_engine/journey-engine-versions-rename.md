---
sidebar_label: "Rename"
keywords:
  - "/i/journey-engine/versions/rename"
  - "POST /i/journey-engine/versions/rename"
  - "rename"
  - "journey-engine"
  - "versions"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Versions Rename

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/versions/rename
```

## Overview

Rename a journey version.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `journey_engine` feature

## Request Parameters

Request body JSON:

- `id` (required): Version ID
- `name` (required): New name

## Examples

```json
POST /i/journey-engine/versions/rename
Content-Type: application/json

{
  "id": "67164f4a1f1bd90d6354430b",
  "name": "v1 (Updated)"
}
```

## Response

### Success Response

```json
{
  "id": "67164f4a1f1bd90d6354430b",
  "name": "v1 (Updated)"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `id` | String | Renamed version ID from the request. |
| `name` | String | New version name from the request. |

### Error Responses

- **500**: Rename error

## Behavior

- Parses request body fields `id` and `name`.
- Updates `journey_versions.name` for the requested version ID.
- Returns the requested ID/name pair after the update call completes.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_versions` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
