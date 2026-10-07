---
sidebar_label: "Overview Survey"
keywords:
  - "/o/surveys/survey/overview"
  - "overview"
  - "surveys"
  - "survey"
last_update:
  date: "2026-04-18"
---

# Surveys - Survey Overview Metrics

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/surveys/survey/overview
```

## Overview

Returns summary metrics for one Survey widget (`widget_id`) or aggregated metrics for all Survey widgets.

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
/o/surveys/survey/overview?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&widget_id=67b9db56f67aab0012cd8899
```

## Response

### Success Response

```json
{
  "_id": "67b9db56f67aab0012cd8899",
  "name": "Product Feedback",
  "responded": 120,
  "shown": 340,
  "status": true
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Widget ID (single-widget mode) |
| `responded` | Number | Number of responses |
| `shown` | Number | Number of impressions |
| `status` | Boolean/Object | Widget status or status aggregate object |

### Error Responses

- **HTTP 404** - Widget not found:
```json
{
  "result": "Widget not found."
}
```

## Behavior

- With `widget_id`, loads one widget, joins creator details from `members`, and returns the widget document.
- With `calculate_totals`, additionally calculates period totals for `shown` and `responded` from the Survey aggregate model and stores them in `totals-calculated`.
- Without `widget_id`, aggregates all matching Survey widgets for the app and optional `status`.
- Aggregated overview returns total widgets by status plus summed `responded` and `shown` counts.
- Survey aggregate overview removes NPS-only fields such as `scores`, `nps`, and `valued`.

## Related Endpoints

- [Surveys - Survey Widgets](survey-widgets.md)
- [Surveys - Survey Data](survey-data.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.feedback_widgets` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.members` | Member/account enrichment | Stores member profile fields (for example names/IDs) used to resolve actor metadata. |

</details>
