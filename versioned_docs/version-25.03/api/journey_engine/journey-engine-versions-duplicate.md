---
sidebar_label: "Duplicate"
keywords:
  - "/i/journey-engine/versions/duplicate"
  - "POST /i/journey-engine/versions/duplicate"
  - "duplicate"
  - "journey-engine"
  - "versions"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Versions Duplicate

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/versions/duplicate
```

## Overview

Create a new draft version by duplicating an existing version.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Create` on the `journey_engine` feature

## Request Parameters

Request body JSON:

- `id` (required): Version ID to duplicate

## Examples

```json
POST /i/journey-engine/versions/duplicate
Content-Type: application/json

{
  "id": "67164f4a1f1bd90d6354430b"
}
```

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

## Behavior

- Loads the source version by `id`.
- Returns `Version not found` when the source version does not exist.
- Creates a new version under the same `journeyDefinitionId`.
- New version number is computed as the current maximum version number for the definition plus one.
- New version name is `<source name> copy`.
- Copies the source `blocks`, uses the same `appId`, and sets status to `draft`.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_versions` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
