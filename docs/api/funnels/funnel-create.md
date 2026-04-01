---
sidebar_label: "Create"
keywords:
  - "/i/funnels/add"
  - "add"
  - "funnels"
---

# Create funnel

## Endpoint

```text
/i/funnels/add
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Creates a new funnel definition.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `funnels` `Create` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `funnel_name` | String | Yes | Funnel display name. |
| `funnel_desc` | String | No | Funnel description. |
| `funnel_type` | String | No | Funnel type. Defaults to `session-independent`. |
| `steps` | JSON String (Array) | Yes | Ordered step events. |
| `queries` | JSON String (Array) | No | Per-step query objects/strings. |
| `queryTexts` | JSON String (Array) | No | Per-step query text labels. |
| `stepGroups` | JSON String (Array) | No | Per-step grouping config. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Success Response

```json
{
  "result": "67f1c22912df5acb8f8d5caaf0f89a31"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Created funnel ID (md5 hash string). |

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

- Parses `steps`, `queries`, `queryTexts`, and `stepGroups` JSON-string parameters.
- For `queries`, object entries are converted to JSON strings before save.
- Rejects duplicate step events except special cases `[CLY]_view` and `[CLY]_session`.
- Sets default `funnel_type` to `session-independent` when omitted.
- Creates funnel document with creator and creation timestamp.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.funnels` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

---

## Examples

```text
/i/funnels/add?
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnel_name=Purchase Funnel&
  funnel_desc=Product view to purchase&
  funnel_type=session-independent&
  steps=["Product View","Add to Cart","Purchase"]&
  queries=["{}","{}","{}"]&
  queryTexts=["All Users","All Users","All Users"]&
  stepGroups=[{"c":"and"},{"c":"and"},{"c":"and"}]
```

```text
/i/funnels/add?
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnel_name=Checkout Funnel (Same Session)&
  funnel_type=same-session&
  steps=["[CLY]_session","Checkout Start","Purchase"]&
  queries=["{}","{\"cc\":\"US\"}","{}"]
```

---

## Related Endpoints

- [Funnels - List](read.md)
- [Funnels - Update](funnel-update.md)
- [Funnels - Delete](funnel-delete.md)
- [Funnels - Analyze](funnel-query-read.md)

---

## Last Updated

2026-02-16
