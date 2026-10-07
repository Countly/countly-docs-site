---
sidebar_label: "Receive"
keywords:
  - "/i/adjust"
  - "adjust"
last_update:
  date: "2026-02-16"
---

# Adjust - Receive Callback

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/adjust
```

## Overview

Receives Adjust callback payloads and attempts to attribute them to users by `adjust_id`.

If a matching user exists, attribution is applied immediately.  
If no matching user exists, payload is stored for deferred attribution.

## Authentication

**Authentication Methods**:
- App key parameter: `app_key`

## Permissions

- No admin/API-key permission is required.
- Request is accepted only when app is valid and not paused.
- App lock rejection applies to populator requests.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_key` | String | Yes | Application key used to resolve target app |
| `adjust_id` | String | No | Adjust device identifier used for user matching (strongly recommended) |
| `event` | String | No | Adjust event name; used to build attributed event key (`adjust_<event>`) |
| `tracker_name` | String | No | Tracker name from callback payload |
| `last_tracker_name` | String | No | Last tracker name |
| `first_tracker_name` | String | No | First tracker name |
| `outdated_tracker_name` | String | No | Outdated tracker name |
| `adgroup_name` | String | No | Ad group name |
| `network_name` | String | No | Network name |
| `campaign_name` | String | No | Campaign name |
| `creative_name` | String | No | Creative name |
| `installed_at` | String | No | Install timestamp from callback |
| `click_time` | String | No | Click timestamp from callback |
| Other callback fields | String | No | Additional Adjust fields are accepted and stored/attributed |

## Examples

### Example 1: Install callback with attribution ID

```bash
curl "https://your-server.com/i/adjust?app_key=YOUR_APP_KEY&adjust_id=abc123&event=install&campaign_name=Spring_Campaign"
```

### Example 2: Callback with tracker fields

```bash
curl "https://your-server.com/i/adjust?app_key=YOUR_APP_KEY&adjust_id=abc123&event=click&tracker_name=paid_social&network_name=Meta"
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
    "event": "install",
    "campaign_name": "Spring Campaign"
  },
  "user": null
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Result message (`Success` on successful processing) |
| `status` | String | Attribution status (present on immediate attribution path) |
| `Records inserted` | Number | Number of inserted rows in deferred path |
| `document` | Object | Stored callback payload in deferred path |
| `user` | Object or null | Matched user object, if available |

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

- **HTTP 403** - App locked (populator flow):

```json
{
  "result": "App is locked"
}
```

## Behavior

1. Validates `app_key` and resolves app.
2. Rejects paused apps.
3. Rejects locked apps only for populator traffic.
4. Tries to find user by `custom.adjust_id`.
5. If matched, attributes immediately and returns `status: attributed`.
6. If unmatched, stores payload in `countly.adjust` and returns insert details.

## Limitations

- `app_key` is mandatory.
- If `adjust_id` is omitted, reliable user matching is not guaranteed.
- Paused apps reject ingestion.
- Locked app rejection is specific to populator requests.

## Related Endpoints

- [Adjust - Overview](index.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |
| `countly.adjust` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
