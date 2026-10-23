---
sidebar_label: "API Endpoint Trigger"
keywords:
  - "/o/hooks"
  - "hooks"
  - "api endpoint trigger"
last_update:
  date: "2026-10-23"
---

# Hooks - API Endpoint Trigger

## Endpoint

```text
/o/hooks/{path}
```

## Overview

Runs a hook that uses the API endpoint trigger. `{path}` is the path configured in the hook's trigger. Every query parameter of the request is passed to the hook's effects.

## Authentication

The handler does not check `api_key` or `auth_token`; the hook is selected by `{path}` only. Anyone who knows the path can call it, so treat the path as a secret.

## Permissions

The handler does not validate a permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `{path}` | String | Yes | Path segment after `/o/hooks/`, matching the `path` of the hook's API endpoint trigger. |
| any other query parameter | Any | No | Passed to the hook's effects as request data. |

## Examples

### Trigger a hook

```text
/o/hooks/my-hook-path?user=john
```

## Response

### Success Response

```json
"ok"
```

## Behavior

- The response is `"ok"` whether or not a hook matches `{path}`.
- If no enabled hook uses `{path}`, nothing is run.
- If several hooks use the same path, only the oldest hook is run.

## Related Endpoints

- [Hooks - Save](i-hook-save.md)
- [Hooks - Test](i-hook-test.md)
