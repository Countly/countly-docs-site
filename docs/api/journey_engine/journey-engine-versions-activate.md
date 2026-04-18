---
sidebar_label: "Activate"
keywords:
  - "/i/journey-engine/versions/activate"
  - "POST /i/journey-engine/versions/activate"
  - "activate"
  - "journey-engine"
  - "versions"
---

# Journey Engine - Versions Activate

## Endpoint

```
/i/journey-engine/versions/activate
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Activate a journey version for a given journey definition.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Update` on the `journey_engine` feature

## Request Parameters

Request body JSON:

- `journeyDefinitionId` (required): Journey definition ID
- `id` (required): Version ID to activate

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

## Examples

```json
POST /i/journey-engine/versions/activate
Content-Type: application/json

{
  "journeyDefinitionId": "67164f4a1f1bd90d6354430a",
  "id": "67164f4a1f1bd90d6354430b"
}
```

## Behavior/Processing

- Marks all versions for the journey definition as `draft`.
- Clears content queue entries for the journey before activating the selected version.
- Marks the selected version as `active`.
- Returns `Failed to activate version` if no document is modified.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
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
