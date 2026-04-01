---
sidebar_label: "Record Feedback"
keywords:
  - "/i/feedback/input"
  - "GET /i/feedback/input"
  - "input"
  - "feedback"
---

# Star Rating - Record Feedback

## Endpoint

```plaintext
GET /i/feedback/input
```

## Overview

Records a single user feedback (star rating) submission by ingesting a `[CLY]_star_rating` event through the Countly write pipeline. This endpoint is used by client-side feedback widgets and SDKs to submit rating data without requiring a checksum, making it suitable for direct browser/widget calls.

The endpoint accepts the feedback as a specially structured event object, validates it, and proxies the request to the internal `/i` ingestion pipeline with `no_checksum=true`.

## Authentication

Uses SDK-level ingestion authentication via `app_key` and `device_id` query parameters. No API key or auth token is required — this is an SDK-facing endpoint designed for client-side use.

## Permissions

Access is validated by the underlying `/i` ingestion path using `app_key` to identify the application and `device_id` to identify the user/device.

## Request Parameters

### Query String Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_key` | String | Yes | Application key used to identify the target app. Obtain from your Countly dashboard under Management > Applications. |
| `device_id` | String | Yes | Unique device/user identifier. Used to associate the feedback with a specific user profile. |
| `events` | String (JSON Array) | Yes | JSON-encoded array containing **exactly one** event object with key `[CLY]_star_rating`. See [Event Object Structure](#event-object-structure) below. |
| `timestamp` | Number | No | Unix timestamp (in seconds) for when the feedback was submitted. Defaults to server time if omitted. |
| `hour` | Number | No | Hour of the day (0–23) when the feedback was submitted. |
| `dow` | Number | No | Day of the week (0 = Sunday, 6 = Saturday) when the feedback was submitted. |

### Event Object Structure

The `events` parameter must be a JSON-encoded array containing exactly one event object. Sending zero events, multiple events, or an event with a key other than `[CLY]_star_rating` will result in a `400` error.

```json
[
  {
    "key": "[CLY]_star_rating",
    "count": 1,
    "sum": 1,
    "segmentation": {
      "rating": 5,
      "widget_id": "67a3d2f5c1a23b0f4d6c0201",
      "comment": "Great app!",
      "email": "user@example.com",
      "contactMe": true,
      "platform": "iOS",
      "app_version": "2.1.0"
    }
  }
]
```

#### Event Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | String | Yes | Must be exactly `[CLY]_star_rating`. |
| `count` | Number | Yes | Event count. Should be `1` for a single feedback submission. |
| `sum` | Number | No | Event sum value. Typically set to `1`. |

#### Segmentation Fields

The `segmentation` object carries the actual feedback data. These fields are processed during ingestion and stored in drill event records.

| Field | Type | Required | Description |
|---|---|---|---|
| `rating` | Number | Yes | The rating value from **1** (lowest) to **5** (highest). Defaults to `"undefined"` if missing. |
| `widget_id` | String | Yes | The ID of the feedback widget that collected this rating. Must correspond to a widget created via the feedback widget API. Defaults to `"undefined"` if missing. |
| `comment` | String | No | Free-text comment provided by the user. Only present if the widget has comments enabled (`comment_enable: true`). |
| `email` | String | No | Email address provided by the user. Only present if the user opted in to be contacted. Should be a valid email format. |
| `contactMe` | Boolean | No | Set to `true` when the user has opted in to be contacted via email. Present only when `email` is also provided. |
| `platform` | String | No | The platform/OS of the user's device (e.g., `"iOS"`, `"Android"`, `"Web"`). Defaults to `"undefined"` if missing. |
| `app_version` | String | No | The application version string (e.g., `"2.1.0"`). Defaults to `"undefined"` if missing. |

> **Note:** The fields `email`, `comment`, `widget_id`, and `contactMe` are omitted from public event segmentation aggregation (they are listed in `internalOmitSegments`) but are stored in individual drill event records.

### Computed Fields

The following fields are automatically computed by the server during ingestion and should **not** be sent by the client:

| Field | Description |
|---|---|
| `ratingSum` | Numeric cast of `rating` (used for aggregation). |
| `platform_version_rate` | Composite key in the format `{platform}**{app_version}**{rating}**{widget_id}**` used for segmented event aggregation. |

## Response

### Success Response

**Status:** `200 OK`

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Ingestion pipeline result. `"Success"` on successful recording. |

### Error Responses

**Status:** `400 Bad Request` — Invalid or malformed event payload.

```json
{
  "result": "invalid_event_request"
}
```

This error is returned when:
- The `events` parameter is not valid JSON.
- The array does not contain exactly one event.
- The event key is not `[CLY]_star_rating`.

Non-200 responses from the proxied `/i` ingestion request are forwarded back to the client with the original status code and `result` payload.

## Behavior/Processing

1. Parses the `events` query parameter as JSON.
2. Validates that the array contains exactly one event with key `[CLY]_star_rating`.
3. During SDK processing (`/sdk/process_user` hook), the following defaults and computed fields are applied to the event segmentation:
   - `platform` → defaults to `"undefined"`
   - `rating` → defaults to `"undefined"`
   - `ratingSum` → numeric cast of `rating` (or `0`)
   - `widget_id` → defaults to `"undefined"`
   - `app_version` → defaults to `"undefined"`
   - `platform_version_rate` → composite aggregation key
4. Proxies the full request to `/i` with `no_checksum=true` via `requestProcessor.processRequest`.
5. Returns the proxied response status and body to the client.

## Database Collections

This handler does not directly read or write to collections. The proxied `/i` request ultimately writes to:

| Collection | Description |
|---|---|
| `events{app_id_hash}` | Aggregated event data keyed by the `platform_version_rate` segmentation. |
| `drill_events` (in `countly_drill` DB) | Individual event records with full segmentation (including `comment`, `email`, `contactMe`, `widget_id`, `rating`, `platform`, `app_version`). |

## Examples

### Basic rating submission (minimal)

```plaintext
GET /i/feedback/input?app_key=YOUR_APP_KEY&device_id=device_123&events=[{"key":"[CLY]_star_rating","count":1,"segmentation":{"rating":4,"widget_id":"67a3d2f5c1a23b0f4d6c0201"}}]
```

### Full rating with comment and email

```plaintext
GET /i/feedback/input?app_key=YOUR_APP_KEY&device_id=device_123&events=[{"key":"[CLY]_star_rating","count":1,"sum":1,"segmentation":{"rating":5,"widget_id":"67a3d2f5c1a23b0f4d6c0201","comment":"Love this app!","email":"user@example.com","contactMe":true,"platform":"iOS","app_version":"2.1.0"}}]
```

### cURL example

```bash
curl -G "https://your-countly-server.com/i/feedback/input" \
  --data-urlencode "app_key=YOUR_APP_KEY" \
  --data-urlencode "device_id=device_123" \
  --data-urlencode 'events=[{"key":"[CLY]_star_rating","count":1,"sum":1,"segmentation":{"rating":3,"widget_id":"67a3d2f5c1a23b0f4d6c0201","comment":"It is okay","platform":"Android","app_version":"1.5.2"}}]'
```

## Related Endpoints

- [Star Rating - Get Feedback Data](o-feedback-data.md)

## Last Updated

2026-03-31
