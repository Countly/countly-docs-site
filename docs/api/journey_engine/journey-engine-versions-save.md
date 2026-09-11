---
sidebar_label: "Version Save"
keywords:
  - "/i/journey-engine/versions/save"
  - "POST /i/journey-engine/versions/save"
  - "save"
  - "journey-engine"
  - "versions"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Versions Save

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/versions/save
```

## Overview

Create a new journey version or update blocks for an existing version.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Create` on the `journey_engine` feature

## Request Parameters

Request body JSON:

- `journeyDefinitionId` (required): Journey definition ID
- `appId` (required): Application ID
- `name` (required for create): Version name
- `blocks` (required): Block graph for the version
- `_id` (optional): Version ID for update case

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

## Behavior

- Parses request body JSON and returns `Invalid request` if it is empty.
- If `_id` is provided, updates only `blocks` for that existing version and returns the request body.
- If `_id` is not provided, creates a new version for `journeyDefinitionId`.
- New version number is computed as the current maximum version number for the definition plus one.
- New versions are always created with status `draft`.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_versions` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
