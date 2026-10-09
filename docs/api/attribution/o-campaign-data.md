---
sidebar_label: "Campaign Data Read"
keywords:
  - "/o?method=campaigndata"
  - "campaigndata"
  - "campaign"
last_update:
  date: "2026-10-09"
---

# Attribution - Campaign Data Read

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```plaintext
/o?method=campaigndata
```

## Overview

Returns time-series data of one campaign for the requested period.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Attribution `Read` permission for the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `campaigndata`. |
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app_id` | String | Yes | Target app ID. |
| `campaign_id` | String | Yes | Campaign ID. The organic campaign ID is accepted as well. |
| `period` | String or Array | No | Period of the returned data. |

## Examples

### Read campaign data for 30 days

```plaintext
/o?method=campaigndata&api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&campaign_id=campaign-summer-2026&period=30days
```

## Response

### Success Response

The time-series data of the campaign is returned as a JSON object, with the number of unique clicks (`clk`) used as the unique metric. If the campaign does not belong to the app, an empty object is returned.

```json
{}
```

## Behavior

- The campaign must belong to the app given in `app_id`; otherwise an empty object is returned.

## Related Endpoints

- [Attribution - Campaign Read](o-campaign.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.campaigns` | Campaign ownership check | Reads the campaign by ID and app. |
| `countly.campaigndata` | Time-series data | Reads campaign metrics. |

</details>
