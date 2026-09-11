---
sidebar_label: "Consent Current"
keywords:
  - "/o/consent/current"
  - "current"
  - "consent"
last_update:
  date: "2026-02-17"
---

# Compliance Hub - Consent Current

## Endpoint

```text
/o/consent/current
```

## Overview

Returns the current consent object for one app user matched by query.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `compliance_hub` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `query` | JSON String (Object) | No | JSON-stringified user lookup filter against `app_users{app_id}`. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `query` Object Structure

Decoded example:

```json
{
  "did": "device_123"
}
```

## Examples

### Read current consent by device ID

```text
/o/consent/current?
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2&
  query={"did":"device_123"}
```

## Response

### Success Response

```json
{
  "sessions": true,
  "events": true,
  "crashes": false
}
```

No consent found:

```json
{}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root object)` | Object | Consent key-value object for matched user. |

### Error Responses

- `400`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

- `400`

```json
{
  "result": "Missing parameter \"app_id\""
}
```

- `401`

```json
{
  "result": "User does not have right"
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Consent found | User document matched and contains `consent` | Returns matched user's `consent` object. | Raw consent object |
| No consent/user | No match or no `consent` field | Returns empty object. | Raw `{}` |

### Impact on Other Data

- Read-only endpoint.

## Related Endpoints

- [Compliance Hub - Consent Search](o-consent-search.md)
- [Compliance Hub - App Users Consents](o-app-users-consents.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission checks | Reads member account and feature access for read validation. |
| `countly.apps` | App validation/context loading | Validates `app_id` and app context for lookup scope. |
| `countly.app_users{appId}` | Current consent lookup | Reads one app user document and extracts `consent` field. |

</details>
