---
sidebar_label: "Positioning - Calculate"
keywords:
  - "/o/content/iframeDim"
  - "iframeDim"
  - "content"
last_update:
  date: "2026-02-16"
---

# Calculate widget positioning

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/content/iframeDim
```

## Overview

Calculates widget geometry for one or more device inputs.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

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

## Behavior

1. Parses `devices` JSON payload.
2. Validates each device has `resolution`, `position`, and `type`.
3. Computes geometry for each item and returns output array in matching order.

## Related Endpoints

- [Content Blocks - Create](blocks-create.md): Create content with placement settings
- [Content Blocks - Update](blocks-update.md): Update content with placement settings

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
