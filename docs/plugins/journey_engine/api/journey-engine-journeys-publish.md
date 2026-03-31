---
sidebar_label: "Publish"
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
| `(root value)` | Object or Array | Response payload returned by this endpoint. |
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

Blocks are validated before publishing. Invalid blocks return a 400 with a validation error message.

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

2026-02-16
