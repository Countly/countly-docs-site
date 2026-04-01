---
sidebar_label: "Update"
keywords:
  - "/i/funnels/edit"
  - "edit"
  - "funnels"
---

# Update funnel

## Endpoint

```text
/i/funnels/edit
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Updates existing funnel definitions using `funnel_map`.

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
| `funnel_map` | JSON String (Object) | Yes | Map of `funnel_id -> update payload`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `funnel_map` Payload

| Field | Type | Required | Description |
|---|---|---|---|
| `funnel_name` | String | Conditional | Funnel name to update. |
| `funnel_desc` | String | Conditional | Funnel description to update. |
| `funnel_type` | String | Conditional | Funnel type (`session-independent` or `same-session`). |
| `steps` | JSON String (Array) | Conditional | Updated step events. |
| `queries` | JSON String (Array) | Conditional | Updated per-step query definitions. |
| `queryTexts` | JSON String (Array) | Conditional | Updated per-step query text labels. |
| `stepGroups` | JSON String (Array) | Conditional | Updated per-step grouping config. |
| `order` | Number | Conditional | Funnel order update (when only ordering is changed). |

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
| `result` | String | Update result message. |

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
  "result": "Duplicate events in steps are not allowed"
}
```

## Behavior/Processing

- Parses `funnel_map` and nested JSON-string values (`steps`, `queries`, `queryTexts`, `stepGroups`).
- For `queries`, object entries are converted to JSON strings before save.
- Updates each mapped funnel by `_id` and `app_id`.
- Supports two update styles: full funnel data update or order-only update.
- Writes `funnel_updated` system log entries.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.funnels` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

---

## Examples

```text
/i/funnels/edit?
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnel_map={
    "67f1c22912df5acb8f8d5caaf0f89a31": {
      "funnel_name": "Purchase Funnel v2",
      "funnel_desc": "Added checkout step",
      "funnel_type": "session-independent",
      "steps": "[\"Product View\",\"Add to Cart\",\"Checkout\",\"Purchase\"]",
      "queries": "[\"{}\",\"{}\",\"{}\",\"{}\"]",
      "queryTexts": "[\"All Users\",\"All Users\",\"All Users\",\"All Users\"]",
      "stepGroups": "[{\"c\":\"and\"},{\"c\":\"and\"},{\"c\":\"and\"},{\"c\":\"and\"}]"
    }
  }
```

```text
/i/funnels/edit?
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnel_map={
    "67f1c22912df5acb8f8d5caaf0f89a31": {
      "order": 1
    }
  }
```

---

## Related Endpoints

- [Funnels - List](read.md)
- [Funnels - Create](funnel-create.md)
- [Funnels - Update Group](funnel-group-update.md)
- [Funnels - Delete](funnel-delete.md)

---

## Last Updated

2026-02-16
