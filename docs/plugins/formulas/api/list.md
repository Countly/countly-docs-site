---
sidebar_label: "List"
---

# List formulas

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/o/calculated_metrics/metrics
```

## Overview

Returns formulas available to the current user in the app.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `formulas` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `for_widgets` | Boolean/String | No | If provided, returns only `_id` and `title`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Response

### Success Response

```json
[
  {
    "_id": "67bd31c92e7f0b0012ab4567",
    "title": "Revenue per Session",
    "description": "Revenue divided by sessions",
    "key": "revenue_per_session",
    "visibility": "global",
    "format": "float",
    "dplaces": 2,
    "unit": "USD",
    "formula": "[...]",
    "shared_email_edit": [],
    "app": "64f5c0d8f4f7ac0012ab3456",
    "formula_hash": "8e49d217047eafee994c3c8a4a1efcbb",
    "owner_id": "64f5c0d8f4f7ac0012ab9999"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[]` | Array | Formulas visible to current user in this app. |
| `[]._id` | String | Formula ID. |
| `[].title` | String | Formula title. |
| `[].visibility` | String | `global` or `private`. |
| `[].formula` | String | Stringified builder formula payload. |

### Error Responses

No explicit error response is returned by this handler; on DB failure, an empty array may be returned.

## Visibility Filtering

- Global formulas.
- Formulas owned by current user.
- Private formulas shared with current user's email.

## Behavior/Processing

- Uses visibility filter for non-global admins.
- Excludes `expression` field from response.
- When `for_widgets` is provided, response contains only `_id` and `title`.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.calculated_metrics` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

```text
/o/calculated_metrics/metrics?
  app_id=64f5c0d8f4f7ac0012ab3456
```

```text
/o/calculated_metrics/metrics?
  app_id=64f5c0d8f4f7ac0012ab3456&
  for_widgets=true
```

---

## Related Endpoints

- [Formulas - Execute](execute.md)
- [Formulas - Read](get-single.md)
- [Formulas - Save](save.md)

---

## Last Updated

2026-02-16
