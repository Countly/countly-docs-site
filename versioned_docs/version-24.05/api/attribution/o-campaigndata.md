---
sidebar_label: "Campaign Data"
keywords:
  - "/o?method=campaigndata"
  - "campaigndata"
  - "attribution"
last_update:
  date: "2026-10-09"
---

# Campaign Data

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=campaigndata
```

## Overview

Returns the time-series data of one campaign for a period.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires `Read` permission for the Attribution feature in the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | ID of the app the campaign belongs to. |
| `method` | String | Yes | Must be `campaigndata`. |
| `campaign_id` | String | Yes | Campaign ID. Use `[CLY]_organic` for organic traffic of the app. |
| `period` | String | No | Standard Countly period value, for example `30days`. |

## Examples

### Example 1: Read campaign data

```text
/o?method=campaigndata&
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  campaign_id=campaign-summer-2026&
  period=30days
```

### Example 2: Read organic data

```text
/o?method=campaigndata&
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  campaign_id=[CLY]_organic&
  period=30days
```

## Response

### Success Response

The response is the campaign's time-series object for the period, with the click counts of the campaign by date and its segment breakdowns.

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root object)` | Object | Time-series data of the campaign. An empty object when the campaign does not exist in the app. |

## Behavior

- A campaign that does not belong to the app in `app_id` returns an empty object.
- The organic campaign (`[CLY]_organic`) is always read for the app in `app_id`.

## Related Endpoints

- [Campaign Read](o-campaign.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.campaigns` | Campaign definitions | Checks that the campaign belongs to the app. |
| `countly.campaigndata` | Time-series campaign metrics | Source of the returned data. |

</details>
