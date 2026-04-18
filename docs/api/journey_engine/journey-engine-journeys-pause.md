---
sidebar_label: "Pause"
keywords:
  - "/i/journey-engine/journeys/pause"
  - "POST /i/journey-engine/journeys/pause"
  - "pause"
  - "journey-engine"
  - "journeys"
---

# Journey Engine - Journeys Pause

## Endpoint

```
/i/journey-engine/journeys/pause
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Pause an active journey version and set it to paused status. Pauses running instances.

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

## Response

### Success Response

```json
{
  "journeyDefinitionId": "67164f4a1f1bd90d6354430a",
  "id": "67164f4a1f1bd90d6354430b",
  "status": "paused"
}
```


### Response Fields

| Field | Type | Description |
|---|---|---|
| `journeyDefinitionId` | String | Journey definition ID from the request. |
| `id` | String | Journey version ID from the request. |
| `status` | String | `paused` when the version was paused. |

### Error Responses

- **400**: Invalid request
- **500**: Pause error

## Examples

```json
POST /i/journey-engine/journeys/pause
Content-Type: application/json

{
  "journeyId": "67164f4a1f1bd90d6354430a",
  "versionId": "67164f4a1f1bd90d6354430b"
}
```

## Behavior/Processing

- Requires `journeyId` and `versionId` in the request body; missing values return `Invalid request`.
- Marks the selected journey version as `paused`.
- Marks the journey definition as `draft`.
- Clears content queue entries for the paused journey.
- Pauses running journey instances and related pending journey events.
- Emits `journey_paused` system log action.

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
