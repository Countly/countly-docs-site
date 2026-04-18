---
sidebar_label: "Publish"
keywords:
  - "/i/journey-engine/journeys/publish"
  - "POST /i/journey-engine/journeys/publish"
  - "publish"
  - "journey-engine"
  - "journeys"
---

# Journey Engine - Journeys Publish

## Endpoint

```
/i/journey-engine/journeys/publish
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Publish or unpublish a journey version. Publishing activates a version; unpublishing deactivates it.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Update` on the `journey_engine` feature

## Request Parameters

Request body JSON:

- `journeyId` (required): Journey definition ID
- `versionId` (required): Journey version ID
- `status` (optional): `"active"` or `"draft"` (defaults to active)

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

## Behavior/Processing

- Loads the target version and returns `Version not found` if it does not exist.
- Validates version blocks before publishing. Invalid blocks return a 400 with the validation error message.
- Updates the journey definition status to `active` when `status=active` or omitted; otherwise updates it to `draft`.
- Publishing calls version activation, which sets all versions for the journey definition to `draft`, clears content queue entries for previously active versions, then marks the selected version `active`.
- Unpublishing marks the selected version `draft` and clears its content queue.
- Emits `journey_published` or `journey_unpublished` system log actions.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_definition` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.journey_versions` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

## Related Endpoints

- No related endpoints

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-04-18
