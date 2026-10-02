---
sidebar_label: "Publish"
keywords:
  - "/i/journey-engine/journeys/publish"
  - "POST /i/journey-engine/journeys/publish"
  - "publish"
  - "journey-engine"
  - "journeys"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Journeys Publish

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/journeys/publish
```

## Overview

Publish or unpublish a journey version. Publishing activates a version; unpublishing deactivates it.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `journey_engine` feature

## Request Parameters

Request body JSON:

- `journeyId` (required): Journey definition ID
- `versionId` (required): Journey version ID
- `status` (optional): `"active"` or `"draft"` (defaults to active)

## Examples

### Publish a version
```json
POST /i/journey-engine/journeys/publish
Content-Type: application/json

{
  "journeyId": "67164f4a1f1bd90d6354430a",
  "versionId": "67164f4a1f1bd90d6354430b",
  "status": "active"
}
```

### Unpublish a version (set to draft)
```json
POST /i/journey-engine/journeys/publish
Content-Type: application/json

{
  "journeyId": "67164f4a1f1bd90d6354430a",
  "versionId": "67164f4a1f1bd90d6354430b",
  "status": "draft"
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
| `id` | String | Journey version ID from the request. |
| `status` | String | `active` when publishing, `draft` when unpublishing. |

### Error Responses

- **400**: Invalid blocks or request
- **404**: Version not found
- **500**: Publish error

## Behavior

- Loads the target version and returns `Version not found` if it does not exist.
- Validates version blocks before publishing. Invalid blocks return a 400 with the validation error message.
- Updates the journey definition status to `active` when `status=active` or omitted; otherwise updates it to `draft`.
- Publishing calls version activation, which sets all versions for the journey definition to `draft`, clears content queue entries for previously active versions, then marks the selected version `active`.
- Unpublishing marks the selected version `draft` and clears its content queue.
- Emits `journey_published` or `journey_unpublished` system log actions.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_definition` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.journey_versions` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
