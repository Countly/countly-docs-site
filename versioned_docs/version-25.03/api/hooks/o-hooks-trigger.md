---
sidebar_label: "API Endpoint Trigger"
keywords:
  - "/o/hooks"
  - "hooks"
  - "trigger"
  - "api endpoint trigger"
last_update:
  date: "2026-10-16"
---

# Hooks - API Endpoint Trigger

## Endpoint

```text
/o/hooks/{path}
```

## Overview

Fires a hook whose trigger type is **API Endpoint**. The `{path}` segment is the unique path configured in the hook's trigger. When a request arrives, the query parameters are passed to the hook as its input and the hook's effects run.

## Authentication

This endpoint does not check `api_key` or `auth_token`. Anyone who knows the path can call it, so treat the path as a secret.

## Permissions

None.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `{path}` | String | Yes | Last segment of the URL. Must match the `path` set in the hook's API Endpoint trigger. |
| any other query parameter | String | No | Passed to the hook as input data, available to its effects. |

## Examples

### Fire a hook

```text
/o/hooks/ede612bd-f82f-452b-bae0-efde0b7a7caa?order_id=1234&status=paid
```

## Response

### Success Response

```json
"ok"
```

The response is the same whether or not a hook matched the path or is enabled.

## Behavior

- Only enabled hooks with an API Endpoint trigger are matched.
- Only the segment directly after `/o/hooks/` is used for matching.
- If no hook matches the path, nothing runs and the response is still `"ok"`.
- A matched hook is handed to the hook pipeline and its effects run after the response is sent.
- The hook's last-triggered time is updated.
- A path can belong to only one hook. Saving a hook with a path that is already in use is rejected with `This endpoint path is already in use. Choose another path.`

## Related Endpoints

- [Hooks - Save](i-hook-save.md)
- [Hooks - Update Status](i-hook-status.md)
- [Hooks - Read List](o-hook-list.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.hooks` | Hook rule lookup | Hook rules are loaded and refreshed periodically; the trigger time of the matched rule is updated. |

</details>
