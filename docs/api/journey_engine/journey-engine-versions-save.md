---
sidebar_label: "Version Save"
keywords:
  - "/i/journey-engine/versions/save"
  - "POST /i/journey-engine/versions/save"
  - "save"
  - "journey-engine"
  - "versions"
---

# Journey Engine - Versions Save

## Endpoint

```
/i/journey-engine/versions/save
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Create a new journey version or update blocks for an existing version.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Create` on the `journey_engine` feature

## Request Parameters

Request body JSON:

- `journeyDefinitionId` (required): Journey definition ID
- `appId` (required): Application ID
- `name` (required for create): Version name
- `blocks` (required): Block graph for the version
- `_id` (optional): Version ID for update case

## Response

### Success Response

```json
{
  "_id": "67164f4a1f1bd90d6354430b",
  "journeyDefinitionId": "67164f4a1f1bd90d6354430a",
  "version": 2,
  "name": "v2",
  "status": "draft",
  "appId": "64afe321d5f9b2f77cb2c8ed",
  "blocks": [
    {
      "id": "block_1",
      "subType": "incoming-data"
    }
  ]
}
```


### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Journey version ID |
| `journeyDefinitionId` | String | Journey definition ID |
| `version` | Number | Version number |
| `name` | String | Version name |
| `status` | String | Version status |
| `appId` | String | Application ID |
| `blocks` | Array | Version block graph |
### Error Responses

- **HTTP 400**
```json
{
  "result": "Invalid request"
}
```
- **HTTP 500**
```json
{
  "result": "Failed to update journey version"
}
```
- **HTTP 500**
```json
{
  "result": "Failed to create journey version"
}
```

## Examples

### Create new version
```json
POST /i/journey-engine/versions/save
Content-Type: application/json

{
  "journeyDefinitionId": "67164f4a1f1bd90d6354430a",
  "appId": "64afe321d5f9b2f77cb2c8ed",
  "name": "v2",
  "blocks": [{"id": "block_1", "subType": "incoming-data"}]
}
```

### Update version blocks
```json
POST /i/journey-engine/versions/save
Content-Type: application/json

{
  "_id": "67164f4a1f1bd90d6354430b",
  "blocks": [{"id": "block_1", "subType": "incoming-data"}]
}
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
