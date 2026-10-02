---
sidebar_label: "Delete"
keywords:
  - "/i/blocks/delete"
  - "delete"
  - "blocks"
last_update:
  date: "2026-02-16"
---

# Filtering Rules - Delete

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/blocks/delete
```

## Overview

Deletes a filtering rule by its rule ID.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Filtering Rules: `Delete` permission (or global admin equivalent).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application ID |
| `block_id` | String | Yes | Rule ID to delete |

## Examples

### Example: Delete a rule

```bash
curl "https://your-server.com/i/blocks/delete?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&block_id=rule1"
```

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Operation status |

### Error Responses

- **HTTP 400** - Missing app ID:
```json
{
  "result": "Provide app_id"
}
```

- **HTTP 400** - Missing rule ID:
```json
{
  "result": "No rule id"
}
```

- **HTTP 400** - Delete failure:
```json
{
  "result": "Error deleting rule"
}
```

- **HTTP 400** - Missing auth params:
```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

- **HTTP 401** - Auth/user validation failed:
```json
{
  "result": "User does not exist"
}
```

## Behavior

1. Validates `app_id` and delete permission.
2. Resolves rule in app document.
3. Removes matching rule from app `blocks` array.

## Related Endpoints

- [Filtering Rules - List](list.md)
- [Filtering Rules - Create](create.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |

</details>
