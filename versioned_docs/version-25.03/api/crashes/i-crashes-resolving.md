---
sidebar_label: "Resolving Update"
keywords:
  - "/i/crashes/resolving"
  - "resolving"
  - "crashes"
last_update:
  date: "2026-03-07"
---

# Crashes - Mark Resolving

## Endpoint

```plaintext
/i/crashes/resolving
```

## Overview

Marks crash groups as actively being resolved (`is_resolving=true`).

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
| `args.crashes` | Array of Strings | No | Crash group IDs. |
| `args.crash_id` | String | No | Single crash group ID. |

Provide `args.crashes` or `args.crash_id`.

## Examples

```plaintext
/i/crashes/resolving?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&args={"crashes":["crash_group_1","crash_group_2"]}
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
| `result` | String | `Success` when resolving flag update path runs. |

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
- Sets `is_resolving=true` for matched groups.
- Emits `crash_resolving` system log action for each processed crash entry.

## Related Endpoints

- [Crashes - Resolve Crash Groups](./i-crashes-resolve.md)
- [Crashes - Unresolve Crash Groups](./i-crashes-unresolve.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_crashgroups{appId}` | Crash status | Updates `is_resolving=true`. |
| `countly.systemlogs` | Audit trail | Receives `crash_resolving` action(s). |

</details>
