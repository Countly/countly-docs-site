---
sidebar_label: "Campaign Delete"
keywords:
  - "/i/campaign/delete"
  - "campaign"
  - "delete"
---

# /i/campaign/delete

## Endpoint

```plaintext
/i/campaign/delete
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Deletes a campaign and removes associated attribution records.

## Authentication

- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Attribution `Delete` permission for the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app_id` | String | Yes | Target app ID. |
| `args` | JSON String (Object) | Yes | Must include campaign `_id`. |

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Error Responses

**Status Code**: `200 OK`

```json
{
  "result": "Error deleting campaign"
}
```

## Behavior/Processing

- Removes the campaign from `countly.campaigns`.
- Removes campaign click records from `countly.attribution`.
- Removes matching campaign-user records from every `campaign_users{appId}` collection found across apps.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.campaigns` | Campaign storage | Deletes the campaign document. |
| `countly.attribution` | Click attribution storage | Deletes rows with the campaign id. |
| `countly.campaign_users{appId}` | Per-app campaign-user tracking | Deletes matching campaign-user rows across apps. |

---

## Example

```plaintext
/i/campaign/delete?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&args={"_id":"campaign-summer-2026"}
```

## Last Updated

2026-04-01
