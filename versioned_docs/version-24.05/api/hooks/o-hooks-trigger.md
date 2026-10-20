---
sidebar_label: "Hooks API Trigger"
keywords:
  - "/o/hooks"
  - "hooks"
  - "api endpoint trigger"
last_update:
  date: "2026-10-17"
---

# Hooks - API Endpoint Trigger

## Endpoint

```text
/o/hooks
```

## Overview

Runs the hook whose trigger is an **API endpoint** trigger. The hook is called by sending a request to `/o/hooks/<path>`, where `<path>` is the path set in the configuration of its `APIEndPointTrigger`.

## Authentication

This endpoint does not check `api_key`, `auth_token` or `countly-token`. Anyone who knows the path of the hook can call it, so use a hard-to-guess path.

## Permissions

None. No user or app permission is checked.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `<path>` | String | Yes | Last part of the URL, after `/o/hooks/`. Must be the path of an enabled hook with an API endpoint trigger. |
| any query parameter | Any | No | All query parameters of the request are passed to the hook as its input data. |

## Parameter Semantics

- The path of a hook is global and must be unique across all hooks. When two hooks share a path, the one created first is the one that runs.
- The path is read from the position right after `/o/hooks/`.

## Examples

### Example: Call a hook

```bash
curl "https://your-server.com/o/hooks/ede612bd-f82f-452b-bae0-efde0b7a7caa?order_id=1234"
```

## Response

### Success Response

```json
"ok"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | String | Always `ok`. |

## Behavior

- The response is `ok` whether or not a hook with that path exists. It only means the request was received; the effects of the hook run afterwards.
- When a matching enabled hook is found, its effects run with the query parameters of the request as input.
- Requests with a path that matches no enabled API endpoint hook do nothing.

## Related Endpoints

- [Hooks - Save](./i-hook-save.md)
- [Hooks - Update Status](./i-hook-status.md)
- [Hooks - Test](./i-hook-test.md)
- [Hooks - Read List](./o-hook-list.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.hooks` | Hook rules | Enabled hook rules with an API endpoint trigger are loaded and matched by path. |

</details>
