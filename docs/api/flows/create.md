---
sidebar_label: "Create"
keywords:
  - "/i/flows/create"
  - "create"
  - "flows"
---

# Create flow

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```text
/i/flows/create
```

## Overview

Creates a flow schema definition.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `flows` `Create` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `name` | String | Yes | Flow name. |
| `type` | String | No | `events` or `views`. Default: `events`. |
| `start` | JSON String (Object) | No | Start node object. |
| `end` | JSON String (Object) | No | End node object. |
| `exclude` | JSON String (Array) | No | Excluded path items. |
| `user_segmentation` | JSON String (Object) | No | User filter object. |
| `period` | String or JSON String (Array/Object) | No | Default `30days`. |
| `disabled` | Boolean/String | No | Disabled flag. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

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
| `result` | String | `Success` when flow schema is inserted. |

### Error Responses

- `400`

```json
{
  "result": "Missing request parameter:app_id"
}
```

- `400`

```json
{
  "result": "Missing request parameter:name"
}
```

- `400`

```json
{
  "result": "type must be one of: events, views"
}
```

- `400`

```json
{
  "result": "Bad request parameter: period"
}
```

- `400`

```json
{
  "result": "data base error. Please check logs."
}
```

## Behavior/Processing

- Parses JSON inputs: `start`, `end`, `exclude`, `user_segmentation`, optional period payload.
- Defaults to `start.event = [CLY]_session` if both start/end events are missing.
- Removes `vid` unless event is `[CLY]_view`.
- Removes `cid` unless event is `[CLY]_crash`.
- Creates schema with `_id = <app_id>_<ObjectId>`, `status = new`, and creator metadata.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.flow_schemas` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.systemlogs` | Audit trail | Contains system action records used by this endpoint for audit output or audit writes. |

---

## Examples

```text
/i/flows/create?
  app_id=64f5c0d8f4f7ac0012ab3456&
  name=Signup to Purchase&
  type=events&
  start={"event":"signup"}&
  end={"event":"purchase"}&
  exclude=[]&
  user_segmentation={"cc":"US"}&
  period=30days
```

---

## Related Endpoints

- [Flows - Edit](edit.md)
- [Flows - Calculate](calculate.md)

---

## Use Cases

1. Conversion path flow
Tracks users from signup to purchase.

```text
/i/flows/create?
  app_id=64f5c0d8f4f7ac0012ab3456&
  name=Signup to Purchase&
  type=events&
  start={"event":"signup"}&
  end={"event":"purchase"}&
  period=30days
```

2. Onboarding navigation flow
Tracks screen progression for view-based onboarding.

```text
/i/flows/create?
  app_id=64f5c0d8f4f7ac0012ab3456&
  name=Onboarding Views&
  type=views&
  start={"event":"[CLY]_view","vid":"welcome_screen"}&
  end={"event":"[CLY]_view","vid":"home_screen"}&
  period=7days
```

3. Crash-ending flow
Tracks paths that end in a specific crash group.

```text
/i/flows/create?
  app_id=64f5c0d8f4f7ac0012ab3456&
  name=Checkout to Crash&
  type=events&
  start={"event":"checkout_start"}&
  end={"event":"[CLY]_crash","cid":"67aef9ad7c2f4c0012ab33aa"}&
  period=30days
```

4. Region-specific flow
Creates the same journey for a filtered audience.

```text
/i/flows/create?
  app_id=64f5c0d8f4f7ac0012ab3456&
  name=US Signup to Purchase&
  type=events&
  start={"event":"signup"}&
  end={"event":"purchase"}&
  user_segmentation={"cc":"US"}&
  period=30days
```

---

## Last Updated

2026-02-16
