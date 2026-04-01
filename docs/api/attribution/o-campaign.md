---
sidebar_label: "Campaign Read"
keywords:
  - "/o/campaign"
  - "campaign"
---

# /o/campaign

## Endpoint

```plaintext
/o/campaign
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Reads attribution campaigns and campaign performance data. The response shape changes based on whether the request asks for one campaign, a campaign name list, time-series data for selected campaign IDs, or a table-style campaign list.

## Authentication

- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Attribution `Read` permission for the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app_id` | String | Yes | Target app ID. |
| `camp_id` | String | No | Returns one campaign object and attaches time-series data under `data`. |
| `list` | Boolean | No | Returns only campaign `_id` and `name` pairs for the app. |
| `data` | JSON String (Array) | No | Array of campaign IDs to fetch time-series data for. Supports the organic campaign ID too. |
| `getTable` | Boolean | No | Returns paginated table data for campaigns. |
| `filter` | String | No | Table filter. Currently `campaign-hidden` selects hidden campaigns; other values default to visible campaigns. |
| `sSearch` | String | No | Search text applied to campaign `name` in table mode. |
| `iDisplayStart` | Number | No | Offset for table mode. |
| `iDisplayLength` | Number | No | Row limit for table mode. |
| `iSortCol_0` | Number | No | Table sort column index. |
| `sSortDir_0` | String | No | Table sort direction: `asc` or `desc`. |
| `period` | String or Array | No | Period for attached campaign metric data. |

## Response

### Success Response

Single campaign mode (`camp_id`):

```json
{
  "_id": "campaign-summer-2026",
  "name": "Summer 2026",
  "app_id": "6991c75b024cb89cdc04efd2",
  "cost": 0.5,
  "costtype": "click",
  "aclk": 120,
  "clk": 88,
  "ins": 31,
  "rev": 42.4,
  "ses": 65,
  "data": {
    "2026.3.30": {
      "aclk": 10,
      "clk": 8
    }
  }
}
```

List mode (`list=true`):

```json
[
  {
    "_id": "campaign-summer-2026",
    "name": "Summer 2026"
  }
]
```

### Error Responses

**Status Code**: `200 OK`

```json
{}
```

Returned for missing campaign reads in `camp_id` mode.

## Behavior/Processing

### Behavior Modes

| Mode | Trigger | Response Shape |
|---|---|---|
| Single campaign mode | `camp_id` is provided | One campaign document with attached `data` time series. |
| Name list mode | `list` is truthy | Array of `{ _id, name }` objects. |
| Multi-data mode | `data` is provided | Array of `{ _id, data }` objects for the requested campaign IDs. |
| Table mode | `getTable` is truthy | Data-table style campaign list with search, sort, and pagination behavior. |

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.campaigns` | Campaign source data | Reads campaign definitions and table/list rows. |
| `countly.campaigndata` | Campaign metric source | Reads period-based click/install/revenue/session metrics. |

---

## Examples

### Example 1: Read one campaign with metric data

```plaintext
/o/campaign?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&camp_id=campaign-summer-2026&period=30days
```

### Example 2: List campaign names

```plaintext
/o/campaign?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&list=true
```

### Example 3: Fetch data for several campaigns

```plaintext
/o/campaign?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&data=["campaign-summer-2026","[CLY]_organic"]&period=30days
```

### Example 4: Read campaign table rows

```plaintext
/o/campaign?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&getTable=true&iDisplayStart=0&iDisplayLength=20&sSearch=summer
```

## Related Endpoints

- [Campaign Create](i-campaign-create.md)
- [Campaign Update](i-campaign-update.md)
- [Campaign Hide](i-campaign-hide.md)

## Last Updated

2026-04-01
