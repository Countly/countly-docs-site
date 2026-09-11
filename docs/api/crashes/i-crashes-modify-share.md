---
sidebar_label: "Share Modify"
keywords:
  - "/i/crashes/modify_share"
  - "modify_share"
  - "crashes"
last_update:
  date: "2026-03-07"
---

# Crashes - Modify Share Data

## Endpoint

```plaintext
/i/crashes/modify_share
```

## Overview

Updates custom share payload stored on a crash group.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `crashes` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | Target app ID. |
| `args` | JSON String (Object) | Yes | Action payload. |
| `args.crash_id` | String | Yes | Crash group ID. |
| `args.data` | Object | Yes | Share payload stored to crash group `share` field. |

## Examples

```plaintext
/i/crashes/modify_share?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&args={"crash_id":"crash_group_1","data":{"allow_download":true}}
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
| `result` | String | `Success` when share payload is accepted and update path runs. |

### Error Responses

- `400`

```json
{
  "result": "Please provide args parameter"
}
```

- `400`

```json
{
  "result": "No data to save"
}
```

Standard auth/permission errors from update validation can also be returned.

## Behavior

- Updates `share` field in `app_crashgroups{appId}` for the target crash group.
- Emits `crash_modify_share` system log action with submitted share payload.

## Related Endpoints

- [Crashes - Share Crash Group](./i-crashes-share.md)
- [Crashes - Unshare Crash Group](./i-crashes-unshare.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_crashgroups{appId}` | Crash group share data | Updates `share` object for target crash group. |
| `countly.systemlogs` | Audit trail | Receives `crash_modify_share` action. |

</details>
