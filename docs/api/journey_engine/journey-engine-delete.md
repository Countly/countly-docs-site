---
sidebar_label: "Journey Delete"
keywords:
  - "/i/journey-engine/delete"
  - "delete"
  - "journey-engine"
last_update:
  date: "2026-02-16"
---

# Delete Journey

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/delete
```

## Overview

Soft-deletes a journey definition and marks its versions as deleted.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Create` on the `journey_engine` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application identifier |
| `id` | String | Yes | Journey definition ID |

## Examples

```text
https://your-server.com/i/journey-engine/delete?api_key=YOUR_API_KEY&app_id=64afe321d5f9b2f77cb2c8ed&id=67164f4a1f1bd90d6354430a
```

## Response

### Success Response

```json
{
  "_id": "67164f4a1f1bd90d6354430a",
  "name": "Onboarding Journey",
  "status": "deleted",
  "appId": "64afe321d5f9b2f77cb2c8ed"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Journey definition ID |
| `status` | String | Journey status after soft-delete |
| `name` | String | Journey definition name |
| `appId` | String | Application ID |

### Error Responses

| HTTP Status | Response |
|---|---|
| 500 | `{ "result": "Failed to delete a journey" }` |
| 500 | `{ "result": "Failed to delete an journey" }` |

## Behavior

1. Reads `id` from query parameters.
2. Updates all related records in `journey_versions` to `deleted`.
3. Updates journey definition status in `journey_definition` to `deleted`.
4. Returns the deleted journey definition document.

## Related Endpoints

- [Journey Engine - List Journeys](journey-engine-list.md)
- [Journey Engine - Read Journey](journey-engine-journey-read.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_versions` | Endpoint data source | ** - Marks related versions as `deleted` |
| `countly.journey_definition` | Endpoint data source | ** - Marks journey definition as `deleted` |

</details>
