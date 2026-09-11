---
sidebar_label: "Version Delete"
keywords:
  - "/i/journey-engine/versions/delete"
  - "POST /i/journey-engine/versions/delete"
  - "delete"
  - "journey-engine"
  - "versions"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Versions Delete

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/versions/delete
```

## Overview

Delete (soft-delete) a journey version. Active versions or versions with running instances cannot be deleted.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `journey_engine` feature

## Request Parameters

Request body JSON:

- `id` (required): Version ID

## Examples

```json
POST /i/journey-engine/versions/delete
Content-Type: application/json

{
  "id": "67164f4a1f1bd90d6354430b"
}
```

## Response

### Success Response

```json
{
  "id": "67164f4a1f1bd90d6354430b"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `id` | String | Deleted version ID from the request. |

### Error Responses

- **400**: Cannot delete active version or version with running instances
- **404**: Version not found
- **500**: Delete error

## Behavior

- Loads the target version first and returns `Version not found` if it does not exist.
- Rejects deletion when the version status is `active`.
- Rejects deletion when a running journey instance references the version.
- Soft-deletes by setting the version status to `deleted`.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_versions` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
