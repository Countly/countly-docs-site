---
sidebar_label: "Enforcement Update"
keywords:
  - "/i/sdk-config/update-enforcement"
  - "update-enforcement"
  - "sdk-config"
last_update:
  date: "2026-03-05"
---

# SDK - Enforcement Update

## Endpoint

```plaintext
/i/sdk-config/update-enforcement
```

## Overview

Updates SDK enforcement overrides for an app.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `sdk` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication. |
| `auth_token` | String | No | Auth token as query parameter or `countly-token` header. |
| `app_id` | String | Yes | App id. |
| `enforcement` | String (JSON Object) or Object | Yes | Enforcement object to save. |

## Examples

### Update enforcement overrides

```plaintext
/i/sdk-config/update-enforcement?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&enforcement={"tracking":false,"crt":false,"eqs":100}
```

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | `Success` when enforcement is saved. |

### Error Responses

- `400`

```json
{
  "result": "Missing parameter \"app_id\""
}
```

- `400`

```json
{
  "result": "Error parsing enforcement"
}
```

- `400`

```json
{
  "result": "Wrong enforcement format"
}
```

- `500`

```json
{
  "result": "Error saving enforcement to database"
}
```

## Behavior

- Parses `enforcement` when provided as JSON string.
- Removes unknown keys and persists only valid SDK option keys.

## Related Endpoints

- [SDK - Enforcement Read](o-sdk-enforcement.md)
- [SDK - SDK Config Read](o-sdk-config.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.sdk_enforcement` | Enforcement storage | Upserts app enforcement as `{ _id: app_id, enforcement: ... }`. |

</details>
