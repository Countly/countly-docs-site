---
sidebar_label: "Crash Hide"
keywords:
  - "/i/crashes/hide"
  - "hide"
  - "crashes"
last_update:
  date: "2026-03-07"
---

# Crashes - Hide Crash Groups

## Endpoint

```plaintext
/i/crashes/hide
```

## Overview

Marks one or more crash groups as hidden.

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
| `args.crash_id` | String | No | Single crash group ID. |
| `args.crashes` | Array of Strings | No | List of crash group IDs. |

Provide `args.crashes` or `args.crash_id`.

## Examples

```plaintext
/i/crashes/hide?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&args={"crashes":["crash_group_1","crash_group_2"]}
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

- Resolves crash IDs from `args.crashes` or `[args.crash_id]`.
- Updates matching crash groups with `is_hidden=true`.
- Emits one `crash_hidden` system log action per crash ID.

## Related Endpoints

- [Crashes - Show Crash Groups](./i-crashes-show.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_crashgroups{appId}` | Crash group visibility | Updates `is_hidden=true` for selected groups. |
| `countly.systemlogs` | Audit trail | Receives `crash_hidden` action(s). |

</details>
