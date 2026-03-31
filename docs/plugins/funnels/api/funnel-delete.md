---
sidebar_label: "Delete"
---

# Delete funnel

## Endpoint

```text
/i/funnels/delete
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Deletes a funnel definition.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `funnels` `Delete` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `funnel_id` | String | Yes | Funnel ID to delete. |
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
| `result` | String | Deletion result. |

### Error Responses

- `400`

```json
{
  "result": "Not enough args"
}
```

- `404`

```json
{
  "result": "Funnel does not exist"
}
```

## Behavior/Processing

- Validates required `app_id` and `funnel_id`.
- Verifies funnel existence before deletion.
- Deletes matching funnel document from `funnels`.
- Triggers dashboard widget cleanup for deleted funnel references.
- Writes `funnel_deleted` system log entry.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.funnels` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |
| `countly.widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/i/funnels/delete?
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnel_id=67f1c22912df5acb8f8d5caaf0f89a31
```

---

## Related Endpoints

- [Funnels - List](read.md)
- [Funnels - Read](funnel-single-read.md)
- [Funnels - Create](funnel-create.md)
- [Funnels - Update](funnel-update.md)

---

## Last Updated

2026-02-16
