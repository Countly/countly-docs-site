---
sidebar_label: "Duplicate"
keywords:
  - "/i/journey-engine/versions/duplicate"
  - "POST /i/journey-engine/versions/duplicate"
  - "duplicate"
  - "journey-engine"
  - "versions"
---

# Journey Engine - Versions Duplicate

## Endpoint

```
/i/journey-engine/versions/duplicate
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Create a new draft version by duplicating an existing version.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Create` on the `journey_engine` feature

## Request Parameters

Request body JSON:

- `id` (required): Version ID to duplicate

## Response

### Success Response

```json
{
  "_id": "67164f4a1f1bd90d6354430c",
  "journeyDefinitionId": "67164f4a1f1bd90d6354430a",
  "version": 3,
  "name": "v2 copy",
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
| `_id` | String | New journey version ID |
| `journeyDefinitionId` | String | Journey definition ID |
| `version` | Number | New version number |
| `name` | String | Duplicated version name (`<original> copy`) |
| `status` | String | Always `draft` for duplicated version |
| `appId` | String | Application ID |
| `blocks` | Array | Copied block graph |
### Error Responses

- **HTTP 404**
```json
{
  "result": "Version not found"
}
```
- **HTTP 500**
```json
{
  "result": "Failed to duplicate version"
}
```

## Examples

```json
POST /i/journey-engine/versions/duplicate
Content-Type: application/json

{
  "id": "67164f4a1f1bd90d6354430b"
}
```

## Behavior/Processing

- Loads the source version by `id`.
- Returns `Version not found` when the source version does not exist.
- Creates a new version under the same `journeyDefinitionId`.
- New version number is computed as the current maximum version number for the definition plus one.
- New version name is `<source name> copy`.
- Copies the source `blocks`, uses the same `appId`, and sets status to `draft`.

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
