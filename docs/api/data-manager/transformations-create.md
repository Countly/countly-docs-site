---
sidebar_label: "Transformation Create"
keywords:
  - "/i/data-manager/transformation"
  - "transformation"
  - "data-manager"
---

# Data Transformations - Create Rule

## Endpoint

```text
/i/data-manager/transformation
```

> Ⓔ **Enterprise Only**
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Creates a transformation rule. Depending on `transformation.transformationProcessTarget`, it either:

- applies to incoming data only and returns immediate success, or
- starts a long task for historical processing and returns a task reference.

## Authentication

Countly API supports three authentication methods:

1. API key query parameter: `api_key=YOUR_API_KEY`
2. Auth token query parameter: `auth_token=YOUR_AUTH_TOKEN`
3. Auth token header: `countly-token: YOUR_AUTH_TOKEN`


## Permissions

Requires `data_manager_transformations` `Create` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `transformation` | JSON String (Object) | Yes | JSON-stringified transformation definition. Example (decoded): `{"actionType":"rename","parentEvent":"Playback Started","transformTarget":["state"],"transformResult":"playback_state","transformationProcessTarget":"incoming"}` |
| `rerun` | Boolean String | No | System-use flag for background execution callbacks. Do not send this in normal API usage. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

### `transformation` Object Structure

| Field | Type | Required | Description |
|---|---|---|---|
| `actionType` | String | Yes | Operation type: `rename`, `merge`, `change-value`, `copy-to-user-custom`. Behavior depends on `parentEvent`: event merge (`parentEvent=""`), segment-level actions (`parentEvent="event_key"`), or custom-property actions (`parentEvent="CUSTOM_PROPERTY"`). Invalid combinations return `500 Error`. |
| `transformTarget` | Array | Yes | Source key(s) or event(s) to transform. For `merge`, provide multiple source values. For `rename`/`change-value`/`copy-to-user-custom`, typically one source key. |
| `transformResult` | String | Yes | Target key/name/value after transformation (for example target event name, segment name, property name, or replacement value). |
| `transformationProcessTarget` | String | No | Processing scope: `incoming` (default), `existing`, or `both`. `incoming` returns immediate `"Success"`; `existing` and `both` start async historical processing and return `result.task_id`. |
| `parentEvent` | String | Conditional | Domain selector. Use event key for segment-level actions, `CUSTOM_PROPERTY` for custom user property actions, and empty string for event-level merge. |
| `targetRegex` | String | Conditional | Required for `change-value`; also used when regex-based rename/merge is enabled. |
| `isRegex` | Boolean/String | No | Enables regex-based rename matching. |
| `isRegexMerge` | Boolean/String | No | Enables regex-based merge matching. |
| `sourceEventDelete` | Boolean/String | No | Optional source cleanup flag used by merge workflows. |
| `isExistingEvent` | Boolean/String | No | Optional merge behavior flag for existing event handling. |
| `status` | String | No | Initial rule status. Defaults to `ENABLED` when omitted. |

Decoded example:

```json
{
  "actionType": "merge",
  "parentEvent": "",
  "transformTarget": ["Playback Started", "Playback Resumed"],
  "transformResult": "Playback Unified",
  "transformationProcessTarget": "existing"
}
```

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `COUNTLY_CONFIG_PROTOCOL` | `http` | Long-task callback URL construction for historical processing (`existing` / `both`) | If this is incorrect for your deployment, historical transformation runs may fail and return runtime errors instead of completing. |
| `COUNTLY_CONFIG_HOSTNAME` | `localhost` | Long-task callback URL construction for historical processing (`existing` / `both`) | If this host is not reachable by the server itself, historical transformation runs may fail and return runtime errors. |

## Response

### Success Response

Incoming-only mode (`transformationProcessTarget=incoming`):

```json
"Success"
```

Historical mode (`transformationProcessTarget=existing` or `both`):

```json
{
  "result": {
    "task_id": "03ccb0c8ac773298f62f8bdb5d0f8869cb78f788"
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | Root string value for incoming-only mode (`"Success"`). |
| `result.task_id` | String | Long-task ID for historical processing modes. |

### Error Responses

- `400`

```json
{
  "result": "Long task runtime error"
}
```

- `500`

```json
{
  "result": "Error"
}
```

- `400` (auth validation)

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

## Behavior/Processing

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Incoming-only | `transformationProcessTarget=incoming` (or omitted/default) | Saves transformation rule and applies it to new incoming data only. | Raw root string: `"Success"` |
| Historical | `transformationProcessTarget=existing` or `both` | Saves transformation rule, schedules asynchronous historical processing, and starts background execution. | Wrapped object with `result.task_id` |

### Impact on Other Data

- Creates transformation rule records in `countly.datamanager_transforms`.
- Schedules background long-task execution for historical modes (`existing` / `both`).
- Updates historical datasets affected by the selected transformation target.
- Refreshes Data Manager transformation cache for the app.

## Audit & System Logs

| Action | Trigger | Payload |
|---|---|---|
| `dm-transformation` | After successful transformation rule creation | `{"transform":"json_string","id":"rule_id"}` |

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.datamanager_transforms` | Stores transformation rule definitions | Inserts new transformation documents (for example `actionType`, `parentEvent`, `transformTarget`, `transformResult`, `transformationProcessTarget`, `status`, `app`). |
| `countly.long_tasks` | Tracks background processing for historical runs | Creates long-task records for `existing`/`both` processing, including task metadata, status, and execution request details. |
| `countly.systemlogs` | Audit trail | Writes `dm-transformation` audit entries with transformation payload and created rule ID. |

---

## Examples

### Incoming-only segment rename

```text
/i/data-manager/transformation?
  app_id=6991c75b024cb89cdc04efd2&
  transformation={
    "parentEvent":"Playback Started",
    "transformTarget":["state"],
    "transformResult":"playback_state",
    "actionType":"rename",
    "transformationProcessTarget":"incoming"
  }
```

### Historical event merge

```text
/i/data-manager/transformation?
  app_id=6991c75b024cb89cdc04efd2&
  transformation={
    "parentEvent":"",
    "transformTarget":["Playback Started","Playback Resumed"],
    "transformResult":"Playback Unified",
    "actionType":"merge",
    "transformationProcessTarget":"existing"
  }
```

### Incoming-only segment-to-user copy

```text
/i/data-manager/transformation?
  app_id=6991c75b024cb89cdc04efd2&
  transformation={
    "parentEvent":"Playback Started",
    "transformTarget":["Content Type"],
    "transformResult":"last_content_type",
    "actionType":"copy-to-user-custom",
    "transformationProcessTarget":"incoming"
  }
```

### Historical custom property rename

```text
/i/data-manager/transformation?
  app_id=6991c75b024cb89cdc04efd2&
  transformation={
    "parentEvent":"CUSTOM_PROPERTY",
    "transformTarget":["legacy_plan"],
    "transformResult":"plan_tier",
    "actionType":"rename",
    "transformationProcessTarget":"existing"
  }
```

### Historical custom property value normalization

```text
/i/data-manager/transformation?
  app_id=6991c75b024cb89cdc04efd2&
  transformation={
    "parentEvent":"CUSTOM_PROPERTY",
    "transformTarget":["plan_tier"],
    "transformResult":"premium",
    "actionType":"change-value",
    "targetRegex":"/gold|platinum/",
    "transformationProcessTarget":"existing"
  }
```

### Historical + incoming segment value normalization (`both`)

```text
/i/data-manager/transformation?
  app_id=6991c75b024cb89cdc04efd2&
  transformation={
    "parentEvent":"Playback Started",
    "transformTarget":["state"],
    "transformResult":"started",
    "actionType":"change-value",
    "targetRegex":"/^.*$/",
    "transformationProcessTarget":"both"
  }
```

## Operational Considerations

- Historical modes are asynchronous and return `result.task_id` immediately.
- Use long-task monitoring flows to track completion and diagnose failures.
- Incoming mode is synchronous and returns immediate success without historical backfill.

## Limitations

- `transformation` must be valid JSON string; malformed payload returns generic `500 Error`.
- Unsupported or invalid action/field combinations return generic `500 Error`.
- `change-value` execution paths expect `targetRegex`; missing/invalid regex can fail during transformation processing.
- `rerun` is reserved for system background callbacks and should not be used directly by API clients.

---

## Related Endpoints

- [Data Transformations - Read](transformations-read.md)
- [Data Transformations - Update Rule](transformation-rules-update.md)
- [Data Transformations - Toggle Status](transformation-status-update.md)

---

## Last Updated

2026-02-16
