---
sidebar_label: "List"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-02-16"
---

# List Geo Locations

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o?method=get_locations
```

## Overview

Returns geo locations for an app, ordered by title, followed by global locations.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `geo` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application ID used for scope and ordering |

## Examples

### Example: List Locations for an App

```text
https://your-server.com/o?method=get_locations&api_key=YOUR_API_KEY&app_id=609bd78d90d7a416d4dfb984
```

## Response

### Success Response

```json
[
  {
    "_id": "62616692a9ddc55457bad406",
    "title": "Location test",
    "radius": 172,
    "unit": "ml",
    "geo": {
      "type": "Point",
      "coordinates": [21.16, 42.6534]
    },
    "app": "609bd78d90d7a416d4dfb984",
    "address": "Berlin, Germany"
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Geolocation ID |
| `title` | String | Location title |
| `radius` | Number | Radius value |
| `unit` | String | Unit label |
| `geo` | Object | Location point (`type`, `coordinates`) |
| `app` | String | App ID (present for app-specific locations) |
| `address` | String | Reverse-geocoded address (if available) |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `{"result":"Missing parameter \"app_id\""}` |
| 400 | Generic read error returned by validation/database path |
| 200 | `{"result":"No location found"}` (fallback path when no locations object is available) |

## Behavior

1. Loads non-deleted locations for the requested app and global scope.
2. Adds app-specific locations first and sorts them by `title`.
3. Appends global locations afterward.
4. Returns a root JSON array of location objects.

## Related Endpoints

- [Geo - Create Geo Location](create.md)
- [Geo - Delete Geo Location](delete.md)
- [Geo - Lookup IP Address](lookup.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.geos` | Endpoint data source | ** - Source of app-specific and global geolocations |

</details>
