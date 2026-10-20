---
sidebar_label: "Domains"
keywords:
  - "/o/heatmaps/domains"
  - "domains"
  - "heatmaps"
last_update:
  date: "2026-10-17"
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

Returns the view segments of an app and the domains seen in its action events.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Requires `Read` permission for the Heatmaps feature (`heatmaps`) in the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | ID of the app. |

## Examples

### Example: Read segments and domains

```bash
curl "https://your-server.com/o/heatmaps/domains?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID"
```

## Response

### Success Response

```json
{
  "segments": {
    "platform": ["Web", "Mobile"]
  },
  "domains": ["example.com"]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `segments` | Object | View segments of the app. Each key is a segment name and its value is the list of segment values. Empty when the app has none. |
| `domains` | Array | Domains seen in action events. Empty when none are known or when Drill is not available. |

## Related Endpoints

- [Heatmaps - Views](o-heatmaps-views.md)
- [Heatmaps - Metrics](o-heatmaps-metrics.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.views` | View configuration | Reads the segments of the app. |
| `countly_drill.drill_meta` | Drill metadata | Reads the known domains of action events. |

</details>
