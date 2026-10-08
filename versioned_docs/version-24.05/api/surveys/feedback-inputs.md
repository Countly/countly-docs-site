---
sidebar_label: "Submit Survey or NPS Response"
keywords:
  - "/i/feedback/inputs"
  - "inputs"
  - "feedback"
  - "surveys"
  - "nps"
last_update:
  date: "2026-10-08"
---

# Surveys - Submit Survey or NPS Response

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/feedback/inputs
```

## Overview

Records a survey or NPS widget event (shown, closed or answered) sent by a client-side widget. The request is checked against the user's earlier submissions for the widget and then passed on to the regular `/i` data ingestion.

## Authentication

- No API key or token is required. This endpoint is called by survey and NPS widgets running in an app or web page. The app is identified by `app_key` and the user by `device_id`.

## Permissions

- None. Access is decided by the `/i` ingestion the request is passed on to.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_key` | String | Yes | App key, used by the `/i` ingestion to find the app. |
| `app_id` | String | Yes | App ID, used to look up the widget and the user's earlier submissions. |
| `device_id` | String | Yes | Device ID of the user. |
| `events` | String (JSON Array) | Yes | JSON array with exactly one event, with key `[CLY]_survey` or `[CLY]_nps`. Its `segmentation.widget_id` identifies the widget. |
| `sdk_name` | String | No | SDK name, passed on to `/i`. |
| `sdk_version` | String | No | SDK version, passed on to `/i`. |
| `app_version` | String | No | App version, passed on to `/i`. |
| `hour` | Number | No | Hour of the day, passed on to `/i`. |
| `dow` | Number | No | Day of the week, passed on to `/i`. |

Only the parameters listed above are passed on to `/i`; any other parameter is dropped. Parameters whose value is not a string, number or boolean are dropped too.

### Event Object Structure

```json
[
  {
    "key": "[CLY]_nps",
    "count": 1,
    "segmentation": {
      "widget_id": "67b9db56f67aab0012cd8899",
      "rating": 9,
      "comment": "Great product"
    }
  }
]
```

For `[CLY]_nps`, a `rating` in the segmentation marks a submission. For `[CLY]_survey`, any segmentation key starting with `answ` marks a submission.

## Examples

### Example 1: Submit an NPS rating

```plaintext
/i/feedback/inputs?app_key=YOUR_APP_KEY&app_id=YOUR_APP_ID&device_id=device_123&events=[{"key":"[CLY]_nps","count":1,"segmentation":{"widget_id":"67b9db56f67aab0012cd8899","rating":9}}]
```

## Response

### Success Response

The response of the `/i` ingestion is returned unchanged.

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Result of the `/i` ingestion. |

### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "result": "invalid_event_request"
}
```

Returned when `events` is not valid JSON.

**Status Code**: `400 Bad Request`
```json
{
  "result": "Invalid nps/survey events"
}
```

Returned when `events` does not hold exactly one event, or its key is not `[CLY]_nps` or `[CLY]_survey`.

**Status Code**: `400 Bad Request`
```json
{
  "result": "Cannot resubmit nps/survey"
}
```

Returned when the user cannot submit the widget again (see Behavior).

Other non-200 responses from the `/i` ingestion are returned with their original status code and message.

## Behavior

- Looks up the user by `device_id` and the widget by `segmentation.widget_id` in the app, and reads the user's earlier submissions for the widget.
- If the user has already submitted the widget, a new submission is refused with `Cannot resubmit nps/survey`, unless the widget's `appearance.show` is `uAlways`. If the user has closed the widget and `appearance.show` is `uClose`, a new submission is refused too.
- Events that are not submissions (for example the widget being shown or closed) are always passed on.
- Passes the event on to `/i` as a request without checksum verification, with only the parameters listed above.

## Related Endpoints

- [Surveys - Survey Widget](survey-widget.md)
- [Surveys - NPS Widget](nps-widget.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{appId}` | User lookup | Reads the user by device ID. |
| `countly.completed_surveys{appId}` | Earlier submissions | Reads which widgets the user has completed or closed. |
| `countly.feedback_widgets` | Widget storage | Reads the widget's appearance. |

The forwarded `/i` request also writes the event data.

</details>
