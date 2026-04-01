---
sidebar_label: "Campaign Update"
keywords:
  - "/i/campaign/update"
  - "campaign"
  - "update"
---

# /i/campaign/update

## Endpoint

```plaintext
/i/campaign/update
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Updates selected fields of an existing attribution campaign using the JSON object passed in `args`.

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
| `args` | JSON String (Object) | Yes | Update payload. Must include `_id`. |

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

## Behavior/Processing

- Parses `args` from JSON.
- Requires `_id` and updates only provided campaign fields.
- Empty `name`, `type`, or `link` values are discarded.
- Sets `edited_at` to the current Unix timestamp.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.campaigns` | Campaign storage | Updates an existing campaign document. |

---

## Example

```plaintext
/i/campaign/update?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&args={"_id":"campaign-summer-2026","name":"Summer 2026 Retargeting","cost":"0.75"}
```

## Last Updated

2026-04-01
