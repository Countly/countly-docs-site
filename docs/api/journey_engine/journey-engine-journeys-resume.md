---
sidebar_label: "Resume"
keywords:
  - "/i/journey-engine/journeys/resume"
  - "POST /i/journey-engine/journeys/resume"
  - "resume"
  - "journey-engine"
  - "journeys"
---

# Journey Engine - Journeys Resume

## Endpoint

```
/i/journey-engine/journeys/resume
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Resume a paused journey version and set it back to active status.

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
  "status": "active"
}
```


### Response Fields

| Field | Type | Description |
|---|---|---|
| `journeyDefinitionId` | String | Journey definition ID from the request. |
| `id` | String | Journey version ID from the request. |
| `status` | String | `active` when the version was resumed. |

### Error Responses

- **400**: Invalid request
- **500**: Resume error

## Examples

```json
POST /i/journey-engine/journeys/resume
Content-Type: application/json

{
  "journeyId": "67164f4a1f1bd90d6354430a",
  "versionId": "67164f4a1f1bd90d6354430b"
}
```

## Behavior/Processing

- Requires `journeyId` and `versionId` in the request body; missing values return `Invalid request`.
- Marks the selected journey version as `active`.
- Marks the journey definition as `active`.
- Resumes paused journey instances and recalculates pending wait-event execution times.
- Emits `journey_resumed` system log action.

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
