---
sidebar_label: "Activate"
keywords:
  - "/i/journey-engine/versions/activate"
  - "POST /i/journey-engine/versions/activate"
  - "activate"
  - "journey-engine"
  - "versions"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Versions Activate

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/versions/activate
```

## Overview

Activate a journey version for a given journey definition.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `journey_engine` feature

## Request Parameters

Request body JSON:

- `journeyDefinitionId` (required): Journey definition ID
- `id` (required): Version ID to activate

## Examples

```json
POST /i/journey-engine/versions/activate
Content-Type: application/json

{
  "journeyDefinitionId": "67164f4a1f1bd90d6354430a",
  "id": "67164f4a1f1bd90d6354430b"
}
```

## Response

### Success Response

```json
{
  "journeyDefinitionId": "67164f4a1f1bd90d6354430a",
  "id": "67164f4a1f1bd90d6354430b",
  "status": "active"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `journeyDefinitionId` | String | Journey definition ID from the request. |
| `id` | String | Activated version ID from the request. |
| `status` | String | `active` when activation succeeds. |

### Error Responses

- **500**: Activation error

## Behavior

- Marks all versions for the journey definition as `draft`.
- Clears content queue entries for the journey before activating the selected version.
- Marks the selected version as `active`.
- Returns `Failed to activate version` if no document is modified.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_versions` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
