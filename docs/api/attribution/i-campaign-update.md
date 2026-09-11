---
sidebar_label: "Campaign Update"
keywords:
  - "/i/campaign/update"
  - "campaign"
  - "update"
last_update:
  date: "2026-04-01"
---

# /i/campaign/update

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```plaintext
/i/campaign/update
```

## Overview

Updates selected fields of an existing attribution campaign using the JSON object passed in `args`.

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
| `args` | JSON String (Object) | Yes | Update payload. Must include `_id`. |

## Example

```plaintext
/i/campaign/update?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&args={"_id":"campaign-summer-2026","name":"Summer 2026 Retargeting","cost":"0.75"}
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
  "result": "Campaign not found"
}
```

## Behavior

- Parses `args` from JSON.
- Requires `_id` and updates only provided campaign fields.
- Empty `name`, `type`, or `link` values are discarded.
- Sets `edited_at` to the current Unix timestamp.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.campaigns` | Campaign storage | Updates an existing campaign document. |

</details>
