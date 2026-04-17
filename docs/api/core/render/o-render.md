---
sidebar_label: "Screenshot Create"
keywords:
  - "/o/render"
  - "render"
---

# Render - Screenshot Create

## Endpoint

```plaintext
/o/render
```

## Overview

Renders a dashboard view and returns the saved screenshot path.

## Authentication

- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Requires dashboard read access.
- `app_id` is required for non-global-admin users by read-access validation.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `app_id` | String | Conditionally | Required for non-global-admin read validation. |
| `view` | String | No | View route prefix used to build render target (`view#route`). For dashboard screenshots, use `/dashboard?ssr=true` so the server-side rendering path is enabled. |
| `route` | String | No | Route fragment appended after `#`. Dashboard routes should use the same hash path as the UI, for example `/analytics/sessions/overview`. |
| `id` | String | No | Element ID to capture. When provided, target selector becomes `#id`. |

## Response

### Success Response

```json
{
  "path": "/images/screenshots/screenshot_55f16fc8ae8458f30ffd1ad9fbc4032a.png"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `path` | String | Relative path of generated screenshot image. |

### Error Responses

**Status Code**: `400 Bad Request`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

**Status Code**: `401 Unauthorized`

```json
{
  "result": "No app_id provided"
}
```

**Status Code**: `400 Bad Request`

```json
{
  "result": "Error creating token: failed_to_create_token"
}
```

**Status Code**: `400 Bad Request`

```json
{
  "result": "Error creating screenshot: Browser context closed"
}
```

**Status Code**: `400 Bad Request`

```json
{
  "result": "Error creating screenshot. Please check logs for more information."
}
```

## Behavior/Processing

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Full-view capture | `id` omitted | Renders `view#route` and captures full view screenshot. | Raw object with `path`. |
| Element capture | `id` provided | Renders `view#route` and captures specific `#id` element. | Raw object with `path`. |

### Render Target Construction

The endpoint concatenates `view` and `route` into the browser navigation target. A dashboard screenshot request should therefore pass:

- `view=/dashboard?ssr=true`
- `route=/analytics/sessions/overview`

This produces a target equivalent to `/dashboard?ssr=true#/analytics/sessions/overview`.

### Impact on Other Data

- Creates short-lived login token for render flow.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication source | Resolves requesting member. |
| `countly.apps` | Read-access validation source | Validates app access where required. |
| `countly.auth_tokens` | Temporary render token storage | Inserts `LoginAuthToken` used for headless view rendering. |

---

## Examples

### Example 1: Capture full view

```plaintext
/o/render?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&view=%2Fdashboard%3Fssr%3Dtrue&route=%2Fanalytics%2Fsessions%2Foverview
```

### Example 2: Capture specific element

```plaintext
/o/render?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&view=%2Fdashboard%3Fssr%3Dtrue&route=%2Fanalytics%2Fsessions%2Foverview&id=d-chart-time
```

---

## Operational Considerations

- Requires working server-side headless browser runtime.
- Requires the render process to reach the configured Countly dashboard host from inside the API container.
- If Puppeteer/Chrome or the internal dashboard route is unavailable, the route returns a generic screenshot creation error and the server logs contain the concrete browser error.
- Rendering is synchronous for request lifecycle and can take longer for heavy pages.

## Limitations

- Output is an image path reference; file storage retention depends on server operations.
- The route is configuration-dependent and may fail on instances where server-side rendering is not installed or not allowed to access the dashboard URL.

## Related Endpoints

- [Token Create](../token/i-token-create.md)

## Last Updated

2026-04-13
