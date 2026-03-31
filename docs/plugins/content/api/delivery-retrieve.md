---
sidebar_label: "SDK Read - Content Delivery"
---

# SDK Read - Content Delivery

## Endpoint

```
/o/sdk/content
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns the next eligible content item for an SDK user and calculated placement geometry.

## Authentication

- **Authentication method**: SDK authentication via `app_key`
- **Validation path**: handled by SDK route (`/o/sdk`) before content handler logic

## Permissions

- No dashboard feature permission checks are applied in this endpoint flow.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| app_key | String | Yes | Application key |
| device_id | String | Yes | Device identifier used by SDK auth and user resolution |
| resolution | String | Yes | JSON stringified orientation object |
| la | String | No | Requested language code |
| cly_ws | String | No | Web SDK identifier |
| cly_origin | String | No | Forwarded web origin |

Supported `resolution` formats before stringifying:

```json
{
  "l": {
    "w": 1920,
    "h": 1080
  },
  "p": {
    "w": 1080,
    "h": 1920
  }
}
```

```json
{
  "landscape": {
    "width": 1920,
    "height": 1080
  },
  "portrait": {
    "width": 1080,
    "height": 1920
  }
}
```

## Response

### Success Response

When content exists:

```json
{
  "html": "https://your-server.com/_external/content?app_id=5be987d7b93798516eb5289a&app_user_id=65b0f4a2c91d4f0012e3a001&id=65d1a3a8f7e7a700128b0042&uid=user_12345",
  "geo": {
    "l": {
      "x": 120,
      "y": 90,
      "w": 1080,
      "h": 640
    },
    "p": {
      "x": 50,
      "y": 120,
      "w": 980,
      "h": 700
    }
  }
}
```

When no content is eligible:

```json
{
  "result": "No content block found!"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| html | String | Render URL for content HTML/survey page |
| geo | Object | Placement geometry by orientation |
| geo.l | Object | Landscape geometry |
| geo.l.x | Number | X coordinate |
| geo.l.y | Number | Y coordinate |
| geo.l.w | Number | Width |
| geo.l.h | Number | Height |
| geo.p | Object | Portrait geometry |
| geo.p.x | Number | X coordinate |
| geo.p.y | Number | Y coordinate |
| geo.p.w | Number | Width |
| geo.p.h | Number | Height |
| result | String | Returned when no content is available |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `"Invalid resolution format"` |
| 400 | `"Invalid content block"` |
| 500 | `"Invalid app user"` |
| 500 | `"App user not found"` |
| 500 | `"Content block does not exist for this contentId"` |
| 500 | `"Invalid device id"` (survey flow) |
| 500 | `"Invalid app key"` (survey flow) |

## Behavior/Processing

1. Parses and validates `resolution`.
2. Builds engagement queue context for current app user.
3. Uses queue **peek** for next eligible content (does not remove queue item).
4. Loads content definition from `content_blocks` or `feedback_widgets` (survey type).
5. Calculates landscape/portrait geometry and returns `html` + `geo`.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.content_queue` | Endpoint data source | ** - Queue lookup |
| `countly.content_blocks` | Endpoint data source | ** - Standard content definitions |
| `countly.feedback_widgets` | Endpoint data source | ** - Survey definitions |
| `countly.app_users{app_id}` | Endpoint data source | ** - User lookup/state initialization for queue context |
| `countly.apps` | Endpoint data source | ** - App-level cooldown config lookup |

---

## Examples

### Example 1: Standard SDK Request

```text
/o/sdk/content?app_key=YOUR_APP_KEY&device_id=device_abc_123&resolution=<JSON_STRING>&la=en
```

`resolution` object before stringifying:

```json
{
  "l": {
    "w": 1170,
    "h": 2532
  },
  "p": {
    "w": 1170,
    "h": 2532
  }
}
```

### Example 2: Alternative Resolution Format

```text
/o/sdk/content?app_key=YOUR_APP_KEY&device_id=device_abc_123&resolution=<JSON_STRING>
```

`resolution` object before stringifying:

```json
{
  "landscape": {
    "width": 1920,
    "height": 1080
  },
  "portrait": {
    "width": 1080,
    "height": 1920
  }
}
```

## Related Endpoints

- [Queue - Debug](queue-debug.md): Debug queue state
- [Positioning - Calculate](positioning-calculate.md): Geometry preview calculation

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-02-16
