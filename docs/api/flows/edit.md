---
sidebar_label: "Edit"
---

# Edit flow

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/flows/edit
```

## Overview

Updates an existing flow schema.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `flows` `Create` permission for this endpoint.

## Request Parameters

Same schema fields as [Flows - Create](create.md), plus:

| Parameter | Type | Required | Description |
|---|---|---|---|
| `_id` | String | Yes | Existing flow ID. |

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
| `result` | String | `Success` when flow schema update is applied. |

### Error Responses

- `400`

```json
{
  "result": "Missing request parameter: _id"
}
```

- `400`

```json
{
  "result": "Flow not found for update."
}
```

- `400`

```json
{
  "result": "data base error. Please check logs."
}
```

## Behavior/Processing

- Parses and normalizes same fields as create.
- Sets `status = edited` and updates `status_changed` timestamp.
- Updates by `_id` and `app_id`.
- Logs `flows_edited` on success.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.flow_schemas` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

---

## Examples

```text
/i/flows/edit?
  app_id=64f5c0d8f4f7ac0012ab3456&
  _id=64f5c0d8f4f7ac0012ab3456_67bd31c92e7f0b0012ab4567&
  name=Signup to Purchase (Updated)&
  type=events&
  start={"event":"signup"}&
  end={"event":"purchase"}&
  period=30days
```

---

## Related Endpoints

- [Flows - Create](create.md)
- [Flows - Calculate](calculate.md)

---

## Last Updated

2026-02-16
