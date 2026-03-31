---
sidebar_label: "Update"
---

# Filtering Rules - Update

## Endpoint

```text
/i/blocks/update
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Updates an existing filtering rule.

## Authentication

**Authentication Methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Filtering Rules: `Update` permission (or global admin equivalent).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application ID |
| `blocks` | String | Yes | Stringified JSON rule object including `_id` |

## Block Object Structure

`blocks` must be a JSON-stringified object with this structure:

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | String | Yes | Existing rule ID to update |
| `type` | String | Yes | Rule scope: `all`, `session`, or `event` |
| `key` | String | Yes | Target key/event key (`*` for all) |
| `name` | String | No | Human-readable rule name |
| `rule` | Object | Yes | Rule definition object |
| `status` | Boolean | Yes | Rule enabled state |
| `is_arbitrary_input` | Boolean | No | Enables arbitrary event string matching behavior |

Decoded object example (before stringifying into `blocks`):

```json
{
  "_id": "rule1",
  "type": "event",
  "key": "*",
  "name": "Block CA events",
  "rule": {
    "up.cc": {
      "$in": [
        "CA"
      ]
    }
  },
  "status": true,
  "is_arbitrary_input": false
}
```

`rule` supports nested conditions and operators used by Filtering Rules, including:
- user/event fields such as `up.*`, `sg.*`
- logical operators such as `$or`, `$and`, `$nor`
- matching operators such as `$in`, `$nin`, `$regex`, `$not`, `$exists`, `$type`, `$size`, `$all`, `$elemMatch`
- helper operators such as `rgxcn`, `rgxbw`, `rgxntc`

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

- **HTTP 400** - Missing update object:
```json
{
  "result": "Provide blocks update object"
}
```

- **HTTP 400** - Duplicate rule:
```json
{
  "result": "The rule already exists"
}
```

- **HTTP 400** - No effective changes:
```json
{
  "result": "Updated the same rule whith no changes"
}
```

- **HTTP 400** - Update failed:
```json
{
  "result": "Error updating rule"
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

## Behavior/Processing

1. Validates `app_id` and update permission.
2. Parses `blocks` JSON payload.
3. Converts `rule` to stringified JSON.
4. Replaces matching block by `_id`.
5. Sets `_onReq` for eligible request-level rules.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |

---

## Examples

### Example: Update a rule

```bash
curl "https://your-server.com/i/blocks/update?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&blocks=%7B%22_id%22%3A%22rule1%22%2C%22type%22%3A%22session%22%2C%22key%22%3A%22*%22%2C%22name%22%3A%22Block%20sessions%20from%20CA%22%2C%22rule%22%3A%7B%22up.cc%22%3A%7B%22%24in%22%3A%5B%22CA%22%5D%7D%7D%2C%22status%22%3Atrue%7D"
```

## Related Endpoints

- [Filtering Rules - List](list.md)
- [Filtering Rules - Create](create.md)

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

## Last Updated

2026-02-15
---

## Last Updated

2026-02-16
