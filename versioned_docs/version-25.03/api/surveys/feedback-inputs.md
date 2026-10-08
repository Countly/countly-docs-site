---
sidebar_label: "Record Survey or NPS Input"
keywords:
  - "/i/feedback/inputs"
  - "inputs"
  - "surveys"
  - "nps"
last_update:
  date: "2026-10-08"
---

# Surveys - Record Survey or NPS Input

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/feedback/inputs
```

## Overview

Receives a survey or NPS widget event (a display, a close, or a submission) from a client-side widget and passes it to the Countly write pipeline. A submission is refused when the same user has already submitted or closed the widget and the widget's display setting does not allow another one.

## Authentication

Uses SDK-level ingestion authentication through `app_key` and `device_id`. No API key or auth token is required.

## Permissions

- None beyond the app and device identification of the underlying `/i` write pipeline.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_key` | String | Yes | Application key identifying the target app. |
| `device_id` | String | Yes | Device ID of the user the event belongs to. |
| `events` | String (JSON Array) | Yes | JSON array containing exactly one event whose key is `[CLY]_nps` or `[CLY]_survey`. The event's `segmentation.widget_id` identifies the widget. |
| `app_id` | String | No | App ID. Used to look up the user's earlier submissions for the resubmission check. |
| `sdk_name` | String | No | SDK name, passed on to the write pipeline. |
| `sdk_version` | String | No | SDK version, passed on to the write pipeline. |
| `app_version` | String | No | App version, passed on to the write pipeline. |
| `hour` | Number | No | Hour of the day of the event. |
| `dow` | Number | No | Day of the week of the event. |

Only the parameters listed above are passed on to the write pipeline; others are ignored. Values that are not strings, numbers or booleans are dropped.

## Examples

### Example 1: Submit an NPS rating

```text
/i/feedback/inputs?app_key=YOUR_APP_KEY&device_id=device_123&events=[{"key":"[CLY]_nps","count":1,"segmentation":{"widget_id":"67b9db56f67aab0012cd8899","rating":9,"platform":"Web","app_version":"1.0"}}]
```

## Response

### Success Response

The response of the write pipeline is returned unchanged, for example:

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

Returned when `events` is not valid JSON.

- `400`

```json
{
  "result": "Invalid nps/survey events"
}
```

Returned when `events` does not contain exactly one event, or its key is not `[CLY]_nps` or `[CLY]_survey`.

- `400`

```json
{
  "result": "Cannot resubmit nps/survey"
}
```

Returned when the event is a submission (an NPS event with a `rating`, or a survey event with `answ...` segmentation keys) and the user is not allowed to submit again.

Non-200 responses from the write pipeline are returned with their original status code and message.

## Behavior

1. Parses `events` and checks that it holds exactly one `[CLY]_nps` or `[CLY]_survey` event.
2. Finds the user from the request's app user, or from `device_id`.
3. Checks the user's earlier activity on the widget. A submission is refused when the user has already submitted the widget, or has closed it and the widget's display setting is "until closed". A widget whose display setting is "always" accepts any number of submissions. Events that are not submissions (for example a display or a close) are always passed on.
4. Passes the event to the `/i` write pipeline without a checksum and returns its response.

## Related Endpoints

- [Surveys - NPS Data](nps-data.md)
- [Surveys - Survey Data](survey-data.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{appId}` | User lookup | Reads the user by `device_id`. |
| `countly.completed_surveys{appId}` | Submission history | Reads the user's earlier submissions and closes. |
| `countly.feedback_widgets` | Widget settings | Reads the widget's display setting. |

The passed-on event is written by the `/i` pipeline to the NPS and survey event collections.

</details>
