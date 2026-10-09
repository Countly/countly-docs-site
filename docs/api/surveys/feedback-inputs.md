---
sidebar_label: "Submit Response"
keywords:
  - "/i/feedback/inputs"
  - "inputs"
  - "feedback"
  - "surveys"
last_update:
  date: "2026-10-09"
---

# Surveys - Submit Response

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/feedback/inputs
```

## Overview

Records a Survey or NPS event (shown, closed or answered) sent by a client-side widget. The request is checked and then passed on to the regular `/i` data ingestion, without a checksum.

## Authentication

This is an SDK-facing endpoint. Identify the app with `app_key` (or `app_id`) and the user with `device_id`. No `api_key` or `auth_token` is required.

## Permissions

No dashboard permission is checked. The app is identified by `app_key` or `app_id`.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `events` | JSON String (Array) | Yes | JSON-stringified array with exactly one event whose `key` is `[CLY]_nps` or `[CLY]_survey`. |
| `app_key` | String | Conditional | Application key. Required if `app_id` is not provided. |
| `app_id` | String | Conditional | Application ID. Required if `app_key` is not provided. |
| `device_id` | String | Yes | Device ID of the user. |
| `app_version` | String | No | Application version, passed on to ingestion. |
| `sdk_name` | String | No | SDK name, passed on to ingestion. |
| `sdk_version` | String | No | SDK version, passed on to ingestion. |
| `dow` | Number | No | Day of week, passed on to ingestion. |
| `hour` | Number | No | Hour of day, passed on to ingestion. |

Only the parameters listed above are passed on to ingestion; any others are dropped.

### `events` Object Structure

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | String | Yes | `[CLY]_nps` or `[CLY]_survey`. |
| `segmentation.widget_id` | String | Yes | ID of the widget the event belongs to. |
| `segmentation.rating` | Number | Conditional | NPS rating of an answer (`[CLY]_nps`). |
| `segmentation.journeyInstanceId` | String | No | Journey instance ID, for surveys shown by a journey. |
| `segmentation.blockId` | String | No | Journey block ID, for surveys shown by a journey. |

Survey answers are sent as `segmentation` keys that start with `answ`.

## Examples

### Submit an NPS rating

```text
/i/feedback/inputs?
  app_key=YOUR_APP_KEY&
  device_id=device_123&
  events=[{"key":"[CLY]_nps","count":1,"segmentation":{"widget_id":"65f0cbf8bca6b8e8fbf7f901","rating":9}}]
```

## Response

### Success Response

The response is produced by the regular `/i` data ingestion.

```json
{
  "result": "Success"
}
```

### Error Responses

- `400`

```json
{
  "result": "invalid_event_request"
}
```

- `400`

```json
{
  "result": "Invalid nps/survey events"
}
```

- `400`

```json
{
  "result": "Missing parameter \"app_id\" or \"app_key\""
}
```

- `400`

```json
{
  "result": "Cannot resubmit nps/survey"
}
```

## Behavior

### Behavior Modes

| Mode | Condition | Result |
|---|---|---|
| Accepted | Event is allowed for this user and widget. | Event is passed on to `/i` ingestion and its response is returned. |
| Resubmission blocked | The user has already completed the widget (or closed it, when the widget is set to show until closed) and the event is a rating or an answer. | Returns `400` with `Cannot resubmit nps/survey`. |
| Always show | The widget's appearance is set to always show. | Resubmission is allowed. |
| Journey-driven survey | The event refers to a running survey block of the same user and widget. | Resubmission check is skipped. |

### Impact on Other Data

- Accepted events are recorded through the regular `/i` ingestion.

## Related Endpoints

- [Surveys - Survey Data](survey-data.md)
- [Surveys - NPS Data](nps-data.md)
