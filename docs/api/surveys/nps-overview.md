---
sidebar_label: "Overview NPS"
keywords:
  - "/o/surveys/nps/overview"
  - "overview"
  - "surveys"
  - "nps"
last_update:
  date: "2026-04-18"
---

# Surveys - NPS Overview Metrics

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/surveys/nps/overview
```

## Overview

Returns summary metrics for one NPS widget (`widget_id`) or aggregated metrics for all NPS widgets.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

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

## Examples

```text
/o/surveys/nps/overview?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899
```

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

## Behavior

- With `widget_id`, loads one widget, joins creator details from `members`, and returns the widget document.
- With `calculate_totals`, additionally calculates period totals for `shown` and `responded` from the NPS aggregate model and stores them in `totals-calculated`.
- Without `widget_id`, aggregates all matching NPS widgets for the app and optional `status`.
- For NPS widgets with responses, converts promoter/detractor/passive counts to percentages and calculates `nps` as promoter percentage minus detractor percentage.
- Aggregated overview returns widget status totals plus summed `responded`, `shown`, and NPS score fields.

## Related Endpoints

- [Surveys - NPS Widgets](nps-widgets.md)
- [Surveys - NPS Data](nps-data.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.members` | Member/account enrichment | Stores member profile fields (for example names/IDs) used to resolve actor metadata. |

</details>
