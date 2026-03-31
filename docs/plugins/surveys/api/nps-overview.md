---
sidebar_label: "Overview NPS"
---

# Surveys - NPS Overview Metrics

## Endpoint

```text
/o/surveys/nps/overview
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns summary metrics for one NPS widget (`widget_id`) or aggregated metrics for all NPS widgets.

## Authentication

**Authentication methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Surveys: `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `widget_id` | String | No | Widget-specific overview |
| `status` | Boolean/String | No | Status filter for aggregated overview |
| `calculate_totals` | Boolean/String | No | Includes `totals-calculated` for widget mode |

## Response

### Success Response

```json
{
  "_id": "67b9db56f67aab0012cd8899",
  "name": "NPS Q1",
  "responded": 120,
  "shown": 340,
  "scores": {
    "promoter": 58,
    "passive": 24,
    "detractor": 18
  },
  "nps": 40
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Widget ID (single-widget mode) |
| `responded` | Number | Number of responses |
| `shown` | Number | Number of impressions |
| `scores` | Object | NPS score components |
| `nps` | Number | NPS value (promoter - detractor) |

### Error Responses

- **HTTP 404** - Widget not found:
```json
{
  "result": "Widget not found."
}
```

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.members` | Member/account enrichment | Stores member profile fields (for example names/IDs) used to resolve actor metadata. |

---

## Examples

```text
/o/surveys/nps/overview?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899
```

## Related Endpoints

- [Surveys - NPS Widgets](nps-widgets.md)
- [Surveys - NPS Data](nps-data.md)

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

---

## Last Updated

2026-02-16
