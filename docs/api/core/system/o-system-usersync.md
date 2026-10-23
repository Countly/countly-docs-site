---
sidebar_label: "User Sync History"
keywords:
  - "/o/system/usersync"
  - "usersync"
  - "system"
last_update:
  date: "2026-10-23"
---

# System - User Sync History Read

## Endpoint

```plaintext
/o/system/usersync
```

## Overview

Returns the recent user sync history of an app, or of all apps together. Each record shows how long the user sync lagged at one run, and how many users it processed.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../../index.md#authentication).

## Permissions

- Requires authenticated dashboard user access to management-read endpoints.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app` | String | No | App id. Defaults to `all`, which returns the records of all apps combined. |

## Examples

### Read the combined history of all apps

```plaintext
/o/system/usersync?api_key=YOUR_API_KEY
```

### Read the history of one app

```plaintext
/o/system/usersync?api_key=YOUR_API_KEY&app=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
{
  "data": [
    {
      "a": "all",
      "ts": 1771326000000,
      "avg": 12.5,
      "max": 40,
      "median": 10,
      "u": 1500
    }
  ],
  "app": "all"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `data` | Array | History records of the requested app. |
| `data[].a` | String | App id, or `all` for the combined record. |
| `data[].ts` | Number or Date | Time of the sync run. |
| `data[].lag` | Number or Null | Sync lag of the run. Present in app records. |
| `data[].avg` | Number or Null | Average lag across apps. Present in `all` records. |
| `data[].max` | Number or Null | Maximum lag across apps. Present in `all` records. |
| `data[].median` | Number or Null | Median lag across apps. Present in `all` records. |
| `data[].u` | Number | Number of users processed in the run. |
| `app` | String | The requested app id, or `all`. |

## Behavior

- `data` is empty when no records exist for the requested `app`.
- Records are removed automatically after 24 hours.

## Related Endpoints

- [Kafka Status Read](./o-system-kafka.md)
- [Aggregator Status Read](./o-system-aggregator.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users_sync_history` | Source for user sync history records. | Reads records of the requested app. |

</details>
