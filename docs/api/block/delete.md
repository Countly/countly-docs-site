---
sidebar_label: "Delete"
keywords:
  - "/i/blocks/delete"
  - "delete"
  - "blocks"
---

# Filtering Rules - Delete

## Endpoint

```text
/i/blocks/delete
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Deletes a filtering rule by its rule ID.

## Authentication

**Authentication Methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Filtering Rules: `Delete` permission (or global admin equivalent).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application ID |
| `block_id` | String | Yes | Rule ID to delete |

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

## Behavior/Processing

1. Validates `app_id` and delete permission.
2. Resolves rule in app document.
3. Removes matching rule from app `blocks` array.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |

---

## Examples

### Example: Delete a rule

```bash
curl "https://your-server.com/i/blocks/delete?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&block_id=rule1"
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
