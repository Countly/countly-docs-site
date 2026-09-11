---
sidebar_label: "Crash Unshare"
keywords:
  - "/i/crashes/unshare"
  - "unshare"
  - "crashes"
last_update:
  date: "2026-03-07"
---

# Crashes - Unshare Crash Group

## Endpoint

```plaintext
/i/crashes/unshare
```

## Overview

Disables public sharing for a crash group by removing share mapping and setting group visibility to private.

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
| `args.crash_id` | String | Yes | Crash group ID to unshare. |

## Examples

```plaintext
/i/crashes/unshare?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&args={"crash_id":"crash_group_1"}
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
| `result` | String | `Success` when operation completes. |

### Error Responses

- `400`

```json
{
  "result": "Please provide args parameter"
}
```

Standard auth/permission errors from update validation can also be returned.

## Behavior

- Computes share record ID as SHA1 hash of `app_id + crash_id`.
- Removes matching record from `crash_share`.
- Sets `is_public=false` on crash group document.
- Emits system log action `crash_unshared`.

## Related Endpoints

- [Crashes - Share Crash Group](./i-crashes-share.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.crash_share` | Public share mapping | Removes share record for app/crash pair. |
| `countly.app_crashgroups{appId}` | Crash group visibility | Updates `is_public=false` for the crash group. |
| `countly.systemlogs` | Audit trail | Receives `crash_unshared` action. |

</details>
