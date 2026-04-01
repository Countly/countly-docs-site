---
sidebar_label: "Campaign Create"
keywords:
  - "/i/campaign/create"
  - "campaign"
  - "create"
---

# /i/campaign/create

## Endpoint

```plaintext
/i/campaign/create
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Creates an attribution campaign from the JSON object passed in `args`.

## Authentication

- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Attribution `Create` permission for the target app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app_id` | String | Yes | Target app ID. |
| `args` | JSON String (Object) | Yes | Campaign definition. |

`args` supports:

- `_id` optional custom campaign ID
- `name` required campaign name
- `link` optional default target URL
- `fingerprint` optional boolean
- `cost` optional numeric string
- `costtype` optional `click`, `install`, or `campaign`
- `links` optional per-platform link map
- `type` optional campaign type
- `typedata` optional type-specific object
- `postbacks` optional array

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
  "result": "Not enough args"
}
```

**Status Code**: `200 OK`

```json
{
  "result": "Duplicate campaign link"
}
```

## Behavior/Processing

- Parses `args` from JSON.
- Generates `_id` automatically when missing.
- Normalizes defaults for `cost`, `costtype`, `links`, `type`, `typedata`, and `postbacks`.
- Initializes summary counters such as `aclk`, `clk`, `ins`, `rev`, and `ses`.
- If `costtype=campaign`, initializes `totalCost` with the campaign cost.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.campaigns` | Campaign storage | Inserts a new campaign document. |

---

## Example

```plaintext
/i/campaign/create?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&args={"name":"Summer 2026","link":"https://example.com/install","cost":"0.5","costtype":"click","links":{"android":"https://play.google.com/store/apps/details?id=com.example"}}
```

## Last Updated

2026-04-01
