---
sidebar_label: "Alert List"
keywords:
  - "/o/alert/list"
  - "list"
  - "alert"
last_update:
  date: "2026-02-17"
---

# Alerts - List

## Endpoint

```text
/o/alert/list
```

## Overview

Returns alert configurations visible to the current user together with aggregated alert-count metrics.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `alerts` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Conditional | Required for non-global-admin users during read validation. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### List alerts

```text
/o/alert/list?
  api_key=YOUR_API_KEY&
  app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
{
  "alertsList": [
    {
      "_id": "65f0cbf8bca6b8e8fbf7f901",
      "alertName": "Crash Spike",
      "alertDataType": "crashes",
      "alertDataSubType": "critical",
      "selectedApps": ["6991c75b024cb89cdc04efd2"],
      "enabled": true,
      "createdBy": "65d0cbf8bca6b8e8fbf70011",
      "createdByUser": "Product Lead"
    }
  ],
  "count": {
    "t": 24,
    "today": 3,
    "r": 1
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `alertsList` | Array | Alert documents visible to current user. |
| `alertsList[].createdByUser` | String | Creator full name resolved from members collection. |
| `count` | Object | Alert count object from alerts data plus runtime enabled count. |
| `count.t` | Number | Historical total alert-trigger count for scope (`meta` or member email key). |
| `count.today` | Number | Today's alert-trigger count for scope. |
| `count.r` | Number | Number of enabled alerts in `alertsList`. |

### Error Responses

- `400`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

- `401`

```json
{
  "result": "No app_id provided"
}
```

- `401`

```json
{
  "result": "User does not exist"
}
```

- `401`

```json
{
  "result": "User does not have right"
}
```

- `500`

```json
{
  "result": "Failed to get alert listMongoServerError: query timeout"
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Global-admin list | `member.global_admin=true` | Reads all alerts; uses count scope `_id=meta`. | Raw object with `alertsList` and `count` |
| Member-scoped list | Non-global-admin member | Reads alerts created by current member; uses count scope `_id=email:member.com`. | Raw object with `alertsList` and `count` |

### Impact on Other Data

- Read-only endpoint.

## Related Endpoints

- [Alerts - Save](i-alert-save.md)
- [Alerts - Delete](i-alert-delete.md)
- [Alerts - Update Status](i-alert-status.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission checks | Reads member account for read validation and creator-name enrichment in response. |
| `countly.apps` | App validation/context loading | Validates `app_id` for non-global-admin read access. |
| `countly.alerts` | Alert rule listing | Reads alert documents (all or by `createdBy`). |
| `countly.alerts_data` | Alert count metrics | Reads scoped total/today counters for the alerts list response. |

</details>
