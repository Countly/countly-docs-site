---
sidebar_label: "Receive"
keywords:
  - "/i/appsflyer"
  - "appsflyer"
last_update:
  date: "2026-10-01"
---

# AppsFlyer - Receive Callback

<!-- REVIEW: the code does not say whether AppsFlyer is an Enterprise-only feature. The note below is copied from the Adjust pages; confirm it applies. -->
:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/appsflyer
```

## Overview

Receives AppsFlyer Push API payloads and attempts to attribute them to users by `appsflyer_id`.

If a user with a matching `custom.appsflyer_id` exists, attribution is applied immediately.  
If no matching user exists, the payload is stored for deferred attribution.

## Authentication

**Authentication Methods**:
- App key parameter: `app_key`

## Permissions

- No admin/API-key permission is required.
- Request is accepted only when the app is valid and not paused.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_key` | String | Yes | Application key used to resolve the target app. Matches the app's main key or any of its additional keys. |
| `appsflyer_id` | String | Yes | AppsFlyer device identifier used for user matching. Must not be empty. |
| `event_name` | String | Yes (one of three) | AppsFlyer event name. `event_type` or `event` are accepted instead. |
| `event_type` | String | Yes (one of three) | Used when `event_name` is not provided. |
| `event` | String | Yes (one of three) | Used when neither `event_name` nor `event_type` is provided. |
| `media_source` | String | No | Media source from the payload. |
| `campaign` | String | No | Campaign name from the payload. |
| Other AppsFlyer fields | String | No | Any other field in the request (for example `af_ad`, `af_adset`, `af_c_id`, `install_time`, `is_retargeting`) is stored and attributed as sent. |

## Examples

### Example 1: Install callback

```bash
curl "https://your-server.com/i/appsflyer?app_key=YOUR_APP_KEY&appsflyer_id=1700000000000-1234567&event_name=install&media_source=Meta&campaign=Spring_Campaign"
```

## Response

### Success Response

Immediate attribution example:

```json
{
  "result": "Success",
  "status": "attributed"
}
```

Deferred attribution storage example:

```json
{
  "result": "Success",
  "Records inserted": 1,
  "document": {
    "appsflyer_id": "1700000000000-1234567",
    "event_name": "install",
    "media_source": "Meta",
    "campaign": "Spring_Campaign",
    "app_id": "6991c75b024cb89cdc04efd2",
    "cd": "2026-10-01T12:00:00.000Z",
    "_id": "6a1f0c2e9b1d4a0012ab3456"
  },
  "user": null
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Result message (`Success` on successful processing). |
| `status` | String | Attribution status (present on the immediate attribution path). |
| `Records inserted` | Number | Number of inserted records in the deferred path. |
| `document` | Object | Stored callback payload in the deferred path: all request parameters except `app_key`, plus `app_id` and the receive time `cd`. |
| `user` | Object or null | Deferred path only. `null` when no user has this `appsflyer_id`, or the matched user object when that user has no device ID (`did`). |

### Error Responses

- **HTTP 400** - Missing app key:

```json
{
  "result": "Missing parameter \"app_key\""
}
```

- **HTTP 400** - App not found:

```json
{
  "result": "App does not exist"
}
```

- **HTTP 400** - App paused:

```json
{
  "result": "App is currently not accepting data"
}
```

- **HTTP 400** - Missing AppsFlyer ID:

```json
{
  "result": "Missing required parameter \"appsflyer_id\""
}
```

- **HTTP 400** - Missing event name:

```json
{
  "result": "Missing required parameter: one of \"event_name\", \"event_type\", or \"event\""
}
```

- **HTTP 400** - User lookup failure:

```json
{
  "result": "Error finding user: <error>"
}
```

- **HTTP 400** - Deferred save failure:

```json
{
  "result": "Error saving data: <error> <payload>"
}
```

## Behavior

1. Validates `app_key` and resolves the app.
2. Rejects paused apps.
3. Validates that `appsflyer_id` and an event name are present.
4. Tries to find a user by `custom.appsflyer_id`.
5. If a matching user with a device ID is found, attributes immediately and returns `status: attributed`.
6. Otherwise (no user, or a user without a device ID), stores the payload in `countly.appsflyer` and returns insert details.

When attribution succeeds, the event is recorded as `appsflyer_<event name>` and the fields are written to the user's custom properties (with `first_<field>` copies where missing).

## Limitations

- `app_key` is mandatory.
- `appsflyer_id` and one of `event_name`, `event_type` or `event` are mandatory.
- Paused apps reject ingestion.

## Related Endpoints

- [AppsFlyer - Overview](index.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Resolves the app by `app_key` and checks whether it is paused. |
| `countly.app_users{appId}` | Per-app user profiles | Looks up users by `custom.appsflyer_id`. |
| `countly.appsflyer` | Deferred attribution payloads | Stores unmatched payloads. |

</details>
