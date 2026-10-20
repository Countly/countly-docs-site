---
sidebar_label: "Domains"
keywords:
  - "/o/heatmaps/domains"
  - "heatmaps"
  - "domains"
last_update:
  date: "2026-10-16"
---

# Heatmaps - Domains

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/heatmaps/domains
```

## Overview

Returns the view segments of an app and the domains that heatmap interaction events were recorded on.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `Read` permission on the `heatmaps` feature.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App ID. |

## Examples

### Read segments and domains

```text
/o/heatmaps/domains?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
{
  "segments": {
    "platform": ["Desktop", "Mobile"]
  },
  "domains": ["example.com", "shop.example.com"]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `segments` | Object | View segments of the app. Each key is a segment name and its value is the list of that segment's values. Empty when the app has none. |
| `domains` | Array | Domains seen in `[CLY]_action` events of the app. Empty when none were recorded or Drill data is not available. |

### Error Responses

- `400`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

- `401`

```json
{
  "result": "User does not have right"
}
```

## Behavior

- Read-only. Nothing is modified.

## Related Endpoints

- [Heatmaps - Views](o-heatmaps-views.md)
- [Heatmaps - Metrics](o-heatmaps-metrics.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission check | Reads the member and permissions. |
| `countly.views` | Segments | Reads the segment map of the app. |
| `countly_drill.drill_events{hash}` and `countly_drill.drill_meta` | Domains | Reads the `domain` segment values of the `[CLY]_action` event. |

</details>
