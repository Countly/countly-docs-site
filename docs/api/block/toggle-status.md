---
sidebar_label: "Toggle Status"
keywords:
  - "/i/blocks/toggle_status"
  - "toggle_status"
  - "blocks"
---

# Filtering Rules - Toggle Status

## Endpoint

```text
/i/blocks/toggle_status
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Enables or disables one or more existing filtering rules.

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
| `blocks` | String | Yes | Stringified JSON object in `{ "ruleId": true/false }` form |

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

- **HTTP 400** - Missing/invalid block object:
```json
{
  "result": "Provide block object"
}
```

- **HTTP 400** - Toggle failure:
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

1. Validates `app_id` and update permission.
2. Parses `blocks` map.
3. Updates status for each provided rule ID.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |

---

## Examples

### Example: Enable one rule and disable another

```bash
curl "https://your-server.com/i/blocks/toggle_status?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&blocks=%7B%22rule1%22%3Atrue%2C%22rule2%22%3Afalse%7D"
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
