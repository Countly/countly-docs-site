---
sidebar_label: "Browser Read"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-02-17"
---

# Browser - Read

## Endpoint

```text
/o?method=browser
```

## Overview

Returns browser analytics time-series data for the selected app and period.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `browser` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `browser`. |
| `app_id` | String | Yes | App ID to query. |
| `period` | String | Yes | Standard Countly period (for example `hour`, `yesterday`, `7days`, `30days`, `month`, or custom range). |
| `timezone` | String | No | Optional timezone override for period interpretation. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read browser metrics for last 7 days

```text
/o?
  api_key=YOUR_API_KEY&
  method=browser&
  app_id=6991c75b024cb89cdc04efd2&
  period=7days
```

### Read browser metrics for custom range

```text
/o?
  api_key=YOUR_API_KEY&
  method=browser&
  app_id=6991c75b024cb89cdc04efd2&
  period=[1738368000000,1738972800000]
```

## Response

### Success Response

```json
{
  "2026": {
    "2": {
      "17": {
        "0": {
          "brw": 128
        },
        "1": {
          "brw": 143
        }
      }
    }
  },
  "meta": {
    "browser": ["Chrome", "Safari", "Firefox"],
    "browser_version": ["121.0", "17.3", "122.0"]
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root object)` | Object | Time-bucketed browser metrics object. |
| `meta` | Object | Browser and browser-version metadata arrays. |

### Error Responses

`400 Bad Request`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

`401 Unauthorized`

```json
{
  "result": "User does not have right"
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Browser metrics read | `method=browser` | Validates read rights, fetches browser time object, returns time-series payload. | Raw browser metrics object |

### Impact on Other Data

- Read-only endpoint.

## Related Endpoints

- [Browser - Overview](index.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission validation | Reads member record by `api_key` or `auth_token` to verify read access. |
| `countly.apps` | App context validation | Reads app record for the requested `app_id` during access validation. |
| `countly.browser` | Browser metric source | Reads browser and browser-version metric documents for requested app/period. |

</details>
