---
sidebar_label: "Positioning - Calculate"
keywords:
  - "/o/content/iframeDim"
  - "iframeDim"
  - "content"
---

# Calculate widget positioning

## Endpoint

```
/o/content/iframeDim
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Calculates widget geometry for one or more device inputs.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the `content` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| devices | String | Yes | JSON stringified array of device definitions |

`devices` object format before stringifying:

```json
[
  {
    "resolution": {
      "width": 1920,
      "height": 1080
    },
    "position": "bRight",
    "type": "modal",
    "heightMultiplier": 0.8,
    "fullScreenOverride": false
  }
]
```

## Response

### Success Response

```json
[
  {
    "x": 100,
    "y": 200,
    "ww": 800,
    "wh": 400,
    "maxAllowedHeight": 600,
    "baseHeight": 400
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| x | Number | X coordinate |
| y | Number | Y coordinate |
| ww | Number | Widget width |
| wh | Number | Widget height |
| maxAllowedHeight | Number | Max allowed height for layout |
| baseHeight | Number | Base height used in sizing |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `"Missing devices array object parameter"` |
| 400 | `"Missing resolution parameter"` |
| 400 | `"Missing position parameter"` |
| 400 | `"Missing type parameter"` |
| 400 | `"Invalid pos request"` or underlying error message |

## Behavior/Processing

1. Parses `devices` JSON payload.
2. Validates each device has `resolution`, `position`, and `type`.
3. Computes geometry for each item and returns output array in matching order.

---

## Database Collections

This endpoint does not read or write database collections.

---

## Examples

### Example 1: Single Device Calculation

```text
/o/content/iframeDim?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&devices=<JSON_STRING>
```

`devices` object before stringifying:

```json
[
  {
    "resolution": {
      "width": 390,
      "height": 844
    },
    "position": "center",
    "type": "modal",
    "heightMultiplier": 1,
    "fullScreenOverride": false
  }
]
```

### Example 2: Multi-Device Preview Calculation

```text
/o/content/iframeDim?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&devices=<JSON_STRING>
```

`devices` object before stringifying:

```json
[
  {
    "resolution": {
      "width": 390,
      "height": 844
    },
    "position": "center",
    "type": "modal"
  },
  {
    "resolution": {
      "width": 1280,
      "height": 800
    },
    "position": "bRight",
    "type": "banner",
    "heightMultiplier": 0.8
  }
]
```

## Related Endpoints

- [Content Blocks - Create](blocks-create.md): Create content with placement settings
- [Content Blocks - Update](blocks-update.md): Update content with placement settings

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
