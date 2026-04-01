---
sidebar_label: "Version List"
keywords:
  - "/o/journey-engine/versions/list"
  - "GET /o/journey-engine/versions/list"
  - "list"
  - "journey-engine"
  - "versions"
---

# Journey Engine - Versions List

## Endpoint

```
/o/journey-engine/versions/list
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

List all versions for a journey definition.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `journeyDefinitionId` (required): Journey definition ID

## Response

### Success Response

```json
[
  {
    "_id": "67164f4a1f1bd90d6354430b",
    "journeyDefinitionId": "67164f4a1f1bd90d6354430a",
    "version": 1,
    "name": "v1",
    "status": "draft",
    "blocks": [{"id": "block_1", "subType": "incoming-data"}],
    "appId": "64afe321d5f9b2f77cb2c8ed"
  }
]
```


### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | Object or Array | Response payload returned by this endpoint. |
### Error Responses

- **400**: Invalid request
- **500**: Query error

## Examples

```
GET /o/journey-engine/versions/list?journeyDefinitionId=67164f4a1f1bd90d6354430a
```

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

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

2026-02-16
