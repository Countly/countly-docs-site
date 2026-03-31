---
sidebar_label: "Update Group"
---

# Update funnel groups

## Endpoint

```text
/i/funnels/group
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Updates funnel group flags (including favorite group flags) for a funnel.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `funnels` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `funnel_id` | String | Yes | Funnel ID to update groups for. |
| `groups` | JSON String (Object) | Yes | Group map where truthy values are set and falsy values are unset. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

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
| `result` | String | Group update result. |

### Error Responses

- `400`

```json
{
  "result": "Not enough args"
}
```

- `400`

```json
{
  "result": "Cannot save data"
}
```

- `404`

```json
{
  "result": "Funnel not found"
}
```

## Behavior/Processing

- Parses `groups` JSON object.
- For each key, truthy values are written to `groups.<key> = 1`, falsy values are removed via `$unset`.
- Requires existing funnel match by `_id` and `app_id`.
- Writes `funnel_edited` system log entry with before/update payload.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.funnels` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

---

## Examples

```text
/i/funnels/group?
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnel_id=67f1c22912df5acb8f8d5caaf0f89a31&
  groups={"fav_64f5c0d8f4f7ac0012ab9999":true,"marketing":true}
```

```text
/i/funnels/group?
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnel_id=67f1c22912df5acb8f8d5caaf0f89a31&
  groups={"marketing":false}
```

---

## Related Endpoints

- [Funnels - Update](funnel-update.md)
- [Funnels - List](read.md)

---

## Last Updated

2026-02-16
