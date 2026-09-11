---
sidebar_label: "Version List"
keywords:
  - "/o/journey-engine/versions/list"
  - "GET /o/journey-engine/versions/list"
  - "list"
  - "journey-engine"
  - "versions"
last_update:
  date: "2026-04-18"
---

# Journey Engine - Versions List

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/journey-engine/versions/list
```

## Overview

List all versions for a journey definition.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `journeyDefinitionId` (required): Journey definition ID

## Examples

```
GET /o/journey-engine/versions/list?journeyDefinitionId=67164f4a1f1bd90d6354430a
```

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
| `(root value)` | Array | Journey version documents for the requested journey definition. |
| `_id` | String | Journey version ID. |
| `journeyDefinitionId` | String | Parent journey definition ID. |
| `version` | Number | Version number. |
| `name` | String | Version name, when stored. |
| `blocks` | Array | Journey block definitions for this version. |
| `status` | String | Version status such as `draft`, `active`, `paused`, or `deleted`. |
| `appId` | String | App ID. |
| `skip_threshold` | Number or Null | Optional user completion threshold for this version. |

### Error Responses

- **400**: Invalid request
- **500**: Query error

## Behavior

- Requires `journeyDefinitionId`; missing value returns `Invalid request`.
- Reads all matching documents from `journey_versions` with no status filter, so deleted versions can be returned.
- Does not sort explicitly; MongoDB natural order applies unless the stored collection/index order changes.

## Related Endpoints

- No related endpoints

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_versions` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
