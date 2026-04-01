---
sidebar_label: "Create"
keywords:
  - "/i/blocks/create"
  - "create"
  - "blocks"
---

# Filtering Rules - Create

## Endpoint

```text
/i/blocks/create
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Creates a new filtering rule for an application.

## Authentication

**Authentication Methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Filtering Rules: `Create` permission (or global admin equivalent).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application ID |
| `blocks` | String | Yes | Stringified JSON rule object |

## Block Object Structure

`blocks` must be a JSON-stringified object with this structure:

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | String | No | Rule ID. Auto-generated when omitted |
| `type` | String | Yes | Rule scope: `all`, `session`, or `event` |
| `key` | String | Yes | Target key/event key (`*` for all) |
| `name` | String | No | Human-readable rule name |
| `rule` | Object | Yes | Rule definition object |
| `status` | Boolean | Yes | Rule enabled state |
| `is_arbitrary_input` | Boolean | No | Enables arbitrary event string matching behavior |

Decoded object example (before stringifying into `blocks`):

```json
{
  "type": "event",
  "key": "*",
  "name": "Block DE events",
  "rule": {
    "up.cc": {
      "$in": [
        "DE"
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

- **HTTP 400** - Invalid/missing rule object:
```json
{
  "result": "Provide block object"
}
```

- **HTTP 400** - Duplicate rule:
```json
{
  "result": "The rule already exists"
}
```

- **HTTP 400** - Empty payload:
```json
{
  "result": "No rule to add"
}
```

- **HTTP 400** - Create failure:
```json
{
  "result": "Error adding rule"
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

1. Validates `app_id` and create permission.
2. Parses `blocks` JSON payload.
3. Generates `_id` when missing.
4. Stores `rule` as stringified JSON.
5. Rejects duplicate rule by `type`, `key`, `name`, and `rule`.
6. Sets `_onReq` for eligible request-level rules.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |

---

## Examples

### Example 1: Block all requests

Endpoint:
```text
/i/blocks/create?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&blocks=<JSON_STRING>
```

`blocks` object before stringifying:
```json
{
  "type": "all",
  "key": "*",
  "name": "Block all requests",
  "rule": {},
  "status": true
}
```

### Example 2: Block a specific user

Endpoint:
```text
/i/blocks/create?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&blocks=<JSON_STRING>
```

`blocks` object before stringifying:
```json
{
  "type": "all",
  "key": "*",
  "name": "Block device A1234567890",
  "rule": {
    "did": {
      "$in": [
        "A1234567890"
      ]
    }
  },
  "status": true
}
```

### Example 3: Block a specific event

Endpoint:
```text
/i/blocks/create?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&blocks=<JSON_STRING>
```

`blocks` object before stringifying:
```json
{
  "type": "event",
  "key": "purchase",
  "name": "Block purchase event",
  "rule": {},
  "status": true
}
```

### Example 4: Block a specific event for a specific user

Endpoint:
```text
/i/blocks/create?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&blocks=<JSON_STRING>
```

`blocks` object before stringifying:
```json
{
  "type": "event",
  "key": "purchase",
  "name": "Block purchase for device A1234567890",
  "rule": {
    "did": {
      "$in": [
        "A1234567890"
      ]
    }
  },
  "status": true
}
```

## Related Endpoints

- [Filtering Rules - List](list.md)
- [Filtering Rules - Update](update.md)

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
