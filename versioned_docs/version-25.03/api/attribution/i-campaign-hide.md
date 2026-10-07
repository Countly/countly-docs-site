---
sidebar_label: "Campaign Hide"
keywords:
  - "/i/campaign/hide"
  - "campaign"
  - "hide"
last_update:
  date: "2026-04-01"
---

# /i/campaign/hide

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```plaintext
/i/campaign/hide
```

## Overview

Marks a campaign as hidden by setting `is_hidden: true`.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Attribution `Update` permission for the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app_id` | String | Yes | Target app ID. |
| `args` | JSON String (Object) | Yes | Must include `campaign_id`. |

## Example

```plaintext
/i/campaign/hide?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&args={"campaign_id":"campaign-summer-2026"}
```

## Response

```json
{
  "result": "Success"
}
```

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.campaigns` | Campaign storage | Sets `is_hidden` to `true` for the target campaign. |

</details>
