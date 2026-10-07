---
sidebar_label: "Info"
keywords:
  - "/o/flows"
  - "flows"
last_update:
  date: "2026-02-16"
---

# Get flow info

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/flows?method=info
```

## Overview

Returns full schema details for a single flow.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `flows` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `info`. |
| `app_id` | String | Yes | Target app ID. |
| `_id` | String | Yes | Flow ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```text
/o/flows?
  method=info&
  app_id=64f5c0d8f4f7ac0012ab3456&
  _id=64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4567
```

## Response

### Success Response

```json
{
  "_id": "64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4567",
  "name": "Signup to Purchase",
  "type": "events",
  "status": "new",
  "memberData": {
    "full_name": "Jane Doe"
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root object)` | Object | Flow schema plus creator name subset. |
| `memberData.full_name` | String | Creator display name when available. |

### Error Responses

- `400`

```json
{
  "result": "Flow not found"
}
```

## Behavior

- Reads flow by `_id` + `app_id`.
- Joins creator info from `members`.
- Parses `user_segmentation` JSON string.
- Cleans quoted `period` strings.

## Related Endpoints

- [Flows - List](list.md)
- [Flows - Data](data.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.flow_schemas` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.members` | Member/account enrichment | Stores member profile fields (for example names/IDs) used to resolve actor metadata. |

</details>
