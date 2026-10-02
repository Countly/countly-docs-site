---
sidebar_label: "Init"
keywords:
  - "/i/journey-engine/init"
  - "init"
  - "journey-engine"
last_update:
  date: "2026-02-16"
---

# Initialize Journey Engine

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/init
```

## Overview

Initializes journey processing with provided runtime data and app user context. This endpoint is intended for system-level initialization flows.

## Authentication

- No dashboard authentication check is applied at this endpoint.

## Permissions

- No dashboard permission check is applied at this endpoint.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| Request body | Object | Yes | JSON payload consumed directly by the initializer |
| `data` | Object | Yes | Initialization payload passed to engine |
| `appUser` | Object | Yes | App user context object |

## Examples

```json
{
  "data": {
    "key": "[CLY]_session",
    "appId": "123456789",
    "timestamp": 1739239212000
  },
  "appUser": {
    "uid": "user_123",
    "did": "device_456"
  }
}
```

## Response

### Success Response

```json
{
  "result": "Journey engine initialized"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Operation status |

### Error Responses

| HTTP Status | Response |
|---|---|
| 500 | Runtime/parsing error if body is not valid JSON |

## Behavior

1. Parses JSON body.
2. Reads `data` and `appUser`.
3. Calls `journey.initialize(data, appUser)`.
4. Returns success message.

## Related Endpoints

- [Journey Engine - Save Journey](journey-engine-journeys-save.md)
- [Journey Engine - Create Custom Event](journey-engine-event-create.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
