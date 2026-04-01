---
sidebar_position: 2
sidebar_label: "Data Ingestion"
keywords:
  - "/i"
  - "i"
---

# /i

## Endpoint

```plaintext
/i
```

## Overview

Primary SDK ingestion endpoint for sessions, events, metrics, and user updates.

## Authentication

- Uses SDK app authentication (`app_key`).
- Dashboard `api_key` / `auth_token` is not used for this endpoint.

## Permissions

- Access is controlled by valid app write access (`app_key`).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_key` | String | Yes | App key for ingestion authorization. |
| `device_id` | String | Yes | Stable device identifier. |
| `old_device_id` | String | No | Previous device ID to merge into the current `device_id`. When different from `device_id`, ingestion triggers app-user merge before continuing. |
| `timestamp` | Number | No | Event/request timestamp. |
| `hour` | Number | No | User local hour (`0-23`). Used by some time-bucketed features and can be overridden per event item. |
| `dow` | Number | No | User local day of week (`0-6`, Sunday = `0`). Used by some time-bucketed features and can be overridden per event item. |
| `begin_session` | Number or Boolean | No | Starts a session for this request. |
| `end_session` | Number or Boolean | No | Ends current session for this request. |
| `session_duration` | Number | No | Session duration (seconds). |
| `events` | Array or JSON String (Array) | No | Event list for this request. |
| `metrics` | Object or JSON String (Object) | No | Device/session metrics payload. |
| `user_details` | Object or JSON String (Object) | No | User profile update payload. |
| `crash` | Object or JSON String (Object) | No | Crash payload when crash reporting is sent. |
| `consent` | Object or JSON String (Object) | No | Consent payload when consent updates are sent. |
| `location` | String | No | GPS coordinates as `lat,lng`. On `begin_session`, an empty string indicates location tracking opt-out. |
| `ip_address` | String | No | IP override for geo resolution. |
| `country_code` | String | No | Country override for geo resolution. |
| `region` | String | No | Region override for geo resolution. |
| `city` | String | No | City override for geo resolution. |
| `token_session` | Number or Boolean | No | Indicates this request carries push-token registration data. |
| `ios_token` | String | No | iOS push token used with `token_session`. |
| `android_token` | String | No | Android push token used with `token_session`. |
| `test_mode` | Number | No | Push token environment selector. Current push code uses `0`, `1`, or `2`. |
| `token_provider` | String | No | Optional push provider selector for Android, such as `FCM`, `HMS`, or `HPK`. |

### `events` Array Structure

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | String | Yes | Event key. |
| `count` | Number | No | Event count increment (default `1` if omitted by sender logic). |
| `sum` | Number | No | Optional sum value. |
| `dur` | Number | No | Optional duration value. |
| `segmentation` | Object | No | Optional segmentation map. |
| `timestamp` | Number | No | Optional per-event timestamp override. |
| `hour` | Number | No | Optional per-event local hour override. |
| `dow` | Number | No | Optional per-event local day-of-week override. |

Example event item:

```json
{
  "key": "Purchase",
  "count": 1,
  "sum": 19.99,
  "segmentation": {
    "plan": "pro",
    "currency": "USD"
  }
}
```

## Plugin-Specific Payloads

The main `/i` endpoint also processes several internal event structures and auxiliary objects added by Countly plugins. These are accepted either directly in the request or are converted into internal events during ingestion.

### Views: `[CLY]_view`

The Views plugin consumes `[CLY]_view` events from the `events` array.

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | String | Yes | Must be `[CLY]_view`. |
| `count` | Number | No | Usually `1`. |
| `dur` | Number | No | View duration increment in seconds. Can also be provided as `segmentation.dur`; ingestion moves it to event-level `dur`. |
| `segmentation.name` | String | Yes | View name. Copied to internal event `name`. |
| `segmentation.visit` | Number or Boolean | No | Marks a view start. |
| `segmentation.start` | Number or Boolean | No | Marks the first event for the current view visit. |
| `segmentation.exit` | Number or Boolean | No | Marks the view as exited. |
| `segmentation.bounce` | Number or Boolean | No | Marks the view as bounced. |
| `segmentation._idv` | String | No | View-instance identifier used to correlate repeated updates for the same started view. |
| `segmentation.*` | Any | No | Additional view segments such as `platform`, `segment`, or `domain`. |

Example:

```json
{
  "key": "[CLY]_view",
  "count": 1,
  "segmentation": {
    "name": "Pricing",
    "visit": 1,
    "start": 1,
    "domain": "docs.count.ly"
  }
}
```

Notes:

- A later `[CLY]_view` event with the same `segmentation.name` in the same request can contribute `dur` and additional segments to the started view.
- `segmentation.dur` is normalized into top-level `dur`.
- `[CLY]_action` events related to web scroll tracking are also processed by the Views plugin, but they are separate from `[CLY]_view`.

### Crashes: `crash` object and generated `[CLY]_crash`

Crash reports are sent through the top-level `crash` parameter, not directly as a user-supplied event. When valid, ingestion converts the object into an internal `[CLY]_crash` event and appends it to `events`.

Minimum required crash fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `crash._error` | String | Yes | Stack trace or crash body. |
| `crash._app_version` | String | Yes | App version for grouping and segmentation. |
| `crash._os` | String | Yes | OS name. |

Common supported crash fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `crash._os_version` | String | No | OS version. |
| `crash._manufacture` | String | No | Device manufacturer. |
| `crash._device` | String | No | Device model. |
| `crash._resolution` | String | No | Screen resolution. |
| `crash._cpu` | String | No | CPU architecture or type. |
| `crash._opengl` | String | No | OpenGL version. |
| `crash._view` | String | No | Screen/view/page where the crash occurred. |
| `crash._browser` | String | No | Browser name when applicable. |
| `crash._ram_current` | Number | No | Current RAM usage. |
| `crash._ram_total` | Number | No | Total RAM. |
| `crash._disk_current` | Number | No | Current free/used disk value reported by SDK. |
| `crash._disk_total` | Number | No | Total disk size. |
| `crash._bat` / `crash._bat_current` | Number | No | Battery level. |
| `crash._orientation` | String | No | Device orientation. |
| `crash._root` | Boolean | No | Rooted/jailbroken state. |
| `crash._online` | Boolean | No | Connectivity state. |
| `crash._muted` | Boolean | No | Device muted state. |
| `crash._signal` | Boolean | No | Cellular signal present. |
| `crash._background` | Boolean | No | Whether app was in background. |
| `crash._name` | String | No | Crash name. Defaults to first line of `_error`. |
| `crash._type` | String | No | Error type. |
| `crash._nonfatal` | Boolean | No | `true` for handled exceptions. |
| `crash._logs` | String or Array | No | Supplemental logs. |
| `crash._run` | Number | No | Seconds since app start. |
| `crash._custom` | Object | No | Custom crash key-values. Nested keys are flattened and sanitized. |

Example:

```json
{
  "_error": "TypeError: Cannot read properties of undefined\n    at main.js:42:13",
  "_app_version": "2.4.0",
  "_os": "Android",
  "_os_version": "14",
  "_device": "Pixel 8",
  "_manufacture": "Google",
  "_nonfatal": true,
  "_view": "Checkout",
  "_custom": {
    "order_id": "A-1042",
    "step": "payment"
  }
}
```

Notes:

- Valid crash payloads are converted to a generated `[CLY]_crash` event with `count: 1`.
- The generated event `name` is the computed crash group hash, and `segmentation` contains normalized crash data.
- Custom fields are flattened into `custom_<key>` style segment keys after sanitization.

### Star Rating: `[CLY]_star_rating`

Star rating submissions are ingested as `[CLY]_star_rating` events, either directly through `/i` or via the convenience wrapper [`/i/feedback/input`](../../star-rating/i-feedback-input.md).

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | String | Yes | Must be `[CLY]_star_rating`. |
| `count` | Number | Yes | Usually `1`. |
| `sum` | Number | No | Commonly `1`. |
| `segmentation.rating` | Number | Yes | Rating value. |
| `segmentation.widget_id` | String | Yes | Feedback widget ID. |
| `segmentation.comment` | String | No | Optional free-text comment. |
| `segmentation.email` | String | No | Optional contact email. |
| `segmentation.contactMe` | Boolean | No | Contact opt-in flag. |
| `segmentation.platform` | String | No | Platform name. Defaults to `undefined`. |
| `segmentation.app_version` | String | No | App version. Defaults to `undefined`. |

Server-computed fields:

| Field | Description |
|---|---|
| `segmentation.ratingSum` | Numeric cast of `rating`. |
| `segmentation.platform_version_rate` | Composite key `{platform}**{app_version}**{rating}**{widget_id}**`. |
| `name` | Set to `widget_id`. |

### NPS: `[CLY]_nps`

NPS submissions are ingested as `[CLY]_nps` events, either directly through `/i` or via the wrapper endpoint `/i/feedback/inputs`.

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | String | Yes | Must be `[CLY]_nps`. |
| `count` | Number | No | Usually `1`. |
| `sum` | Number | No | Usually `1` for answered submissions. |
| `segmentation.widget_id` | String | Yes | NPS widget ID. |
| `segmentation.platform` | String | No | Platform name. Defaults to `undefined`. |
| `segmentation.app_version` | String | No | App version. Dots are normalized to `:` during ingestion. |
| `segmentation.shown` | Number or Boolean | No | Marks the widget as shown. |
| `segmentation.closed` | Number or Boolean | No | Marks the widget as closed without answer. |
| `segmentation.rating` | Number | No | NPS score. Required for an answered submission. |
| `segmentation.comment` | String | No | Optional respondent comment. |

Server-computed fields:

| Field | Description |
|---|---|
| `name` | Set to `widget_id`. |
| `segmentation.type` | Derived from `rating`: `detractor`, `passive`, or `promoter`. |
| `segmentation.answered` | Set to `"true"` for answered submissions; set to `false` for pure `shown` events before drill storage. |
| Event key rewrite | When only `shown` is present, the event is rewritten to `[CLY]_nps_shown`. |

Example:

```json
{
  "key": "[CLY]_nps",
  "count": 1,
  "sum": 1,
  "segmentation": {
    "widget_id": "67a3d2f5c1a23b0f4d6c0201",
    "rating": 9,
    "comment": "Very easy to use",
    "platform": "Android",
    "app_version": "1.22"
  }
}
```

### Surveys: `[CLY]_survey`

Survey responses are ingested as `[CLY]_survey` events, either directly through `/i` or via `/i/feedback/inputs`.

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | String | Yes | Must be `[CLY]_survey`. |
| `count` | Number | No | Usually `1`. |
| `sum` | Number | No | Usually `1` for answered submissions. |
| `segmentation.widget_id` | String | Yes | Survey widget ID. |
| `segmentation.platform` | String | No | Platform name. Defaults to `undefined`. |
| `segmentation.app_version` | String | No | App version. Dots are normalized to `:` during ingestion. |
| `segmentation.shown` | Number or Boolean | No | Marks the survey as shown. |
| `segmentation.closed` | Number or Boolean | No | Marks the survey as closed. |
| `segmentation.answ-<question_id>` | String or Number | No | Answer value for a question. The exact type depends on question type. |

Server-computed fields:

| Field | Description |
|---|---|
| `name` | Set to `widget_id`. |
| `segmentation.answered` | Set to `"true"` when at least one answer field is present and the survey is not closed. |
| Event key rewrite | When only `shown` is present, the event is rewritten to `[CLY]_survey_shown`. |

Example:

```json
{
  "key": "[CLY]_survey",
  "count": 1,
  "sum": 1,
  "segmentation": {
    "widget_id": "67a3d2f5c1a23b0f4d6c0202",
    "shown": 1,
    "platform": "Android",
    "app_version": "1.24",
    "answ-67a3d2f5c1a23b0f4d6c1001": "Answer0",
    "answ-67a3d2f5c1a23b0f4d6c1002": 5,
    "answ-67a3d2f5c1a23b0f4d6c1003": "choice_a"
  }
}
```

### Push: `[CLY]_push_action` and `[CLY]_push_sent`

The Push plugin uses internal events for message delivery and interaction tracking.

#### `[CLY]_push_action`

This event can be ingested through `/i` and is validated by the Push ingestor.

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | String | Yes | Must start with `[CLY]_push_action`. |
| `count` | Number | Yes | Must be `1` for validated action tracking. |
| `segmentation.i` | String | Yes | Push message ID. Must be a 24-character object ID string. |
| `segmentation.b` | Number | No | Push button/action index, commonly `0`, `1`, or `2`. |
| `segmentation.p` | String | No | Platform key such as `a`, `i`, or `h`. May be inferred from `User-Agent`. |

Server-enriched fields:

| Field | Description |
|---|---|
| `segmentation.a` | Boolean indicating an automatic trigger (`cohort` or `event`). |
| `segmentation.t` | Boolean indicating an API trigger. |
| `segmentation.ap` | Composite of `a` + platform. |
| `segmentation.tp` | Composite of `t` + platform. |

Example:

```json
{
  "key": "[CLY]_push_action",
  "count": 1,
  "segmentation": {
    "i": "67a3d2f5c1a23b0f4d6c0203",
    "b": 1,
    "p": "a"
  }
}
```

#### `[CLY]_push_sent`

This event is normally generated internally by Countly when push delivery results are processed. It is included here because it is part of the same ingestion event model.

| Field | Type | Description |
|---|---|---|
| `key` | String | `[CLY]_push_sent` |
| `count` | Number | Number of successful sends in the batch being recorded. |
| `segmentation.i` | String | Push message ID. |
| `segmentation.a` | Boolean | Automatic trigger flag. |
| `segmentation.t` | Boolean | API trigger flag. |
| `segmentation.p` | String | Platform key. |
| `segmentation.ap` | String | Composite of `a` + platform. |
| `segmentation.tp` | String | Composite of `t` + platform. |

### Consent: `consent` object and generated `[CLY]_consent`

Consent updates are sent through the top-level `consent` parameter. When values change, ingestion generates a `[CLY]_consent` event and appends it to `events`.

The `consent` object is a key-value map where each key is a consent group and each value is a boolean.

Example request object:

```json
{
  "sessions": true,
  "events": true,
  "push": false
}
```

Generated event behavior:

| Generated segmentation field | Description |
|---|---|
| `<consent_key>` | Current value as string (`"true"` or `"false"`). |
| `<consent_key>_bf` | Previous value before the update, or `null` if none existed. |
| `_type` | `"i"` for opt-in, `"o"` for opt-out, or `["i","o"]` when both happen in the same update. |

Notes:

- A `[CLY]_consent` event is only generated when at least one consent value actually changes.
- The generated event is stored as a drill event even though the source request uses the top-level `consent` object.

## Parameter Semantics

- `events` string parsing failures do not fail the request; events are treated as empty.
- `device_id` and `app_key` are required to process ingestion.
- Request payload may include multiple ingestion actions in one call (for example `begin_session` + `events`).
- `old_device_id` triggers user merge behavior when it differs from the current `device_id`.
- `session_duration` is capped by the server-side `api.session_duration_limit` configuration when the provided value exceeds the configured maximum.
- `hour` and `dow` can be supplied at request level and overridden per event item.
- `location=lat,lng` is accepted for explicit GPS coordinates; `location=""` on `begin_session` is treated as location-tracking opt-out.
- Feedback convenience endpoints [`/i/feedback/input`](../../star-rating/i-feedback-input.md) and `/i/feedback/inputs` both proxy into the main `/i` ingestion flow.

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.trim_trailing_ending_spaces` | `false` | Request normalization | When enabled, trims leading/trailing spaces from incoming values. |
| `api.prevent_duplicate_requests` | `false` | Duplicate suppression | Duplicate payloads can be ignored when enabled. |

## Response

### Success Response

Standard success:

```json
{
  "result": "Success"
}
```

Ignored request success (for example duplicate/validation-cancelled request path):

```json
{
  "result": "Success",
  "info": "Request ignored: Duplicate request"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | `"Success"` when request is accepted or intentionally ignored. |
| `info` | String | Present only in ignored/redirected success paths; explains why request was skipped. |

### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "result": "Missing parameter \"app_key\" or \"device_id\""
}
```

**Status Code**: `400 Bad Request`
```json
{
  "result": "App does not exist"
}
```

**Status Code**: `400 Bad Request`
```json
{
  "result": "App is currently not accepting data"
}
```

**Status Code**: `403 Forbidden`
```json
{
  "result": "App is locked"
}
```

## Behavior/Processing

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Valid ingestion mode | Required identifiers and app validation pass | Processes session/events/metrics/user payload through standard ingestion flow. | Wrapped success string (optionally with `info`) |
| Ignored/redirected mode | Request is intentionally skipped by ingestion guards | Returns success plus informational `info` reason. | Wrapped object `{ "result": "Success", "info": "..." }` |
| Validation failure mode | Missing required identifiers or app restrictions | Fails early with validation/authorization error. | Wrapped string error |

### Impact on Other Data

- Updates ingestion-backed aggregates and user state depending on payload content.

## Audit & System Logs

- No `/systemlogs` action is emitted by this endpoint itself.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App-key validation and app-state checks | Reads app configuration and lock/acceptance flags during ingestion validation. |
| `countly.app_users{appId}` | User profile/session state | Creates/updates app user state and profile fields. |
| `countly.users{appId}` | Session/user aggregates | Updates aggregate counters and time-based usage metrics. |
| `countly.device_details{appId}` | Device/platform aggregates | Updates OS/version/device/resolution metrics. |
| `countly.events_data` | Event aggregates | Updates event counts/sums/durations and segment aggregates. |
| `countly.metric_changes{appId}` | Metric change tracking | Tracks historical metric transitions used by corrections. |
| `countly_drill.drill_events` | Drill/raw event pipeline | Writes or forwards detailed event-level records. |

---

## Examples

### Example 1: Begin session with metrics

```plaintext
/i?
  app_key=YOUR_APP_KEY&
  device_id=device-123&
  begin_session=1&
  metrics={"_os":"iOS","_device":"iPhone","_app_version":"2.1.0"}
```

### Example 2: Send events

```plaintext
/i?
  app_key=YOUR_APP_KEY&
  device_id=device-123&
  events=[{"key":"Purchase","count":1,"sum":19.99,"segmentation":{"plan":"pro"}}]
```

### Example 3: End session

```plaintext
/i?
  app_key=YOUR_APP_KEY&
  device_id=device-123&
  end_session=1&
  session_duration=245
```

### Example 4: Register push token

```plaintext
/i?
  app_key=YOUR_APP_KEY&
  device_id=device-123&
  token_session=1&
  test_mode=0&
  android_token=YOUR_PUSH_TOKEN
```

### Example 5: Merge device IDs

```plaintext
/i?
  app_key=YOUR_APP_KEY&
  device_id=user-authenticated&
  old_device_id=user-anonymous
```

## Operational Considerations

- Keep payloads minimal and valid to reduce ingestion overhead.
- High-frequency clients should use `/i/bulk` where batching is appropriate.

## Limitations

- Per-request payload validation can skip/ignore data paths that fail validation checks.
- Success response does not include per-field ingestion processing details.

---

## Related Endpoints

- [Data Ingestion - Bulk Ingestion](./i-bulk.md)

## Last Updated

2026-04-01
