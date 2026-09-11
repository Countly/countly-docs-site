---
sidebar_label: "Campaign Delete"
keywords:
  - "/i/campaign/delete"
  - "campaign"
  - "delete"
last_update:
  date: "2026-04-01"
---

# /i/campaign/delete

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```plaintext
/i/campaign/delete
```

## Overview

Deletes a campaign and removes associated attribution records.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Attribution `Delete` permission for the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app_id` | String | Yes | Target app ID. |
| `args` | JSON String (Object) | Yes | Must include campaign `_id`. |

## Example

```plaintext
/i/campaign/delete?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&args={"_id":"campaign-summer-2026"}
```

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

## Behavior

- Removes the campaign from `countly.campaigns`.
- Removes campaign click records from `countly.attribution`.
- Removes matching campaign-user records from every `campaign_users{appId}` collection found across apps.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.campaigns` | Campaign storage | Deletes the campaign document. |
| `countly.attribution` | Click attribution storage | Deletes rows with the campaign id. |
| `countly.campaign_users{appId}` | Per-app campaign-user tracking | Deletes matching campaign-user rows across apps. |

</details>
