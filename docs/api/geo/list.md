---
sidebar_label: "List"
keywords:
  - "/o"
  - "o"
---

# List Geo Locations

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```
/o?method=get_locations
```

## Overview

Returns geo locations for an app, ordered by title, followed by global locations.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the `geo` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application ID used for scope and ordering |

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

## Behavior/Processing

1. Loads non-deleted locations for the requested app and global scope.
2. Adds app-specific locations first and sorts them by `title`.
3. Appends global locations afterward.
4. Returns a root JSON array of location objects.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.geos` | Endpoint data source | ** - Source of app-specific and global geolocations |

---

## Examples

### Example: List Locations for an App

```text
https://your-server.com/o?method=get_locations&api_key=YOUR_API_KEY&app_id=609bd78d90d7a416d4dfb984
```

## Related Endpoints

- [Geo - Create Geo Location](create.md)
- [Geo - Delete Geo Location](delete.md)
- [Geo - Lookup IP Address](lookup.md)

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
