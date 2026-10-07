---
sidebar_label: "List"
keywords:
  - "/o/blocks"
  - "blocks"
last_update:
  date: "2026-02-16"
---

# Filtering Rules - List

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/blocks
```

## Overview

Lists filtering rules configured for the selected application.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Filtering Rules: `Read` permission (or global admin equivalent).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application ID |

## Examples

### Example: List rules

```bash
curl "https://your-server.com/o/blocks?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID"
```

## Response

### Success Response

```json
[
  {
    "_id": "rule1",
    "is_arbitrary_input": false,
    "key": "*",
    "name": "Rule 1",
    "rule": "{\"up.cc\":{\"$in\":[\"DE\"]}}",
    "status": true,
    "type": "session"
  }
]
```

### Response Fields

Each array item is a rule object:

| Field | Type | Description |
|---|---|---|
| `_id` | String | Rule ID |
| `is_arbitrary_input` | Boolean | Arbitrary input matching flag |
| `key` | String | Rule key/event key (`*` for all) |
| `name` | String | Rule display text |
| `rule` | String | Stringified rule definition |
| `status` | Boolean | Rule active state |
| `type` | String | Rule type (`all`, `session`, `event`) |
| `_onReq` | Boolean | Early request-stage evaluation flag (when present) |
| `last_triggered` | Number | Last trigger Unix timestamp (seconds, when present) |

### Error Responses

- **HTTP 400** - Missing app ID:
```json
{
  "result": "Provide app_id"
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

1. Validates read permission.
2. Loads app `blocks` array.
3. Returns `[]` when no rules exist.

## Related Endpoints

- [Filtering Rules - Create](create.md)
- [Filtering Rules - Update](update.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |

</details>
