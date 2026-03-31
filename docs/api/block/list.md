---
sidebar_label: "List"
---

# Filtering Rules - List

## Endpoint

```text
/o/blocks
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Lists filtering rules configured for the selected application.

## Authentication

**Authentication Methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Filtering Rules: `Read` permission (or global admin equivalent).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application ID |

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

## Behavior/Processing

1. Validates read permission.
2. Loads app `blocks` array.
3. Returns `[]` when no rules exist.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |

---

## Examples

### Example: List rules

```bash
curl "https://your-server.com/o/blocks?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID"
```

## Related Endpoints

- [Filtering Rules - Create](create.md)
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
