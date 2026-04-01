---
sidebar_label: "Campaign Hide"
keywords:
  - "/i/campaign/hide"
  - "campaign"
  - "hide"
---

# /i/campaign/hide

## Endpoint

```plaintext
/i/campaign/hide
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Marks a campaign as hidden by setting `is_hidden: true`.

## Authentication

- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Attribution `Update` permission for the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app_id` | String | Yes | Target app ID. |
| `args` | JSON String (Object) | Yes | Must include `campaign_id`. |

## Response

```json
{
  "result": "Success"
}
```

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.campaigns` | Campaign storage | Sets `is_hidden` to `true` for the target campaign. |

---

## Example

```plaintext
/i/campaign/hide?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&args={"campaign_id":"campaign-summer-2026"}
```

## Last Updated

2026-04-01
