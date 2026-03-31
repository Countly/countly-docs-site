---
sidebar_label: "Create"
---

# Create Geo Location

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```
/i/geolocations/create
```

## Overview

Creates a geolocation entry with a center point and radius.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Create` on the `geo` feature
- **Additional rule**: creating a global (non-app-specific) location is allowed only for global admins

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application context for permission validation |
| `args` | Object (JSON string) | Yes | Stringified location object |

### `args` Object Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | String | Yes | Location title |
| `radius` | Number | Yes | Radius around the center point |
| `unit` | String | Yes | Unit label stored with the location |
| `geo` | Object | Yes | GeoJSON-like point object |
| `geo.type` | String | Yes | Must be `Point` |
| `geo.coordinates` | Array | Yes | `[longitude, latitude]` |
| `app` | String | No | App ID to make the location app-specific |

## Response

### Success Response

```json
{
  "_id": "62616692a9ddc55457bad406",
  "title": "Berlin Store",
  "radius": 5,
  "unit": "km",
  "geo": {
    "type": "Point",
    "coordinates": [13.405, 52.52]
  },
  "app": "609bd78d90d7a416d4dfb984",
  "created": "2022-04-21T14:13:38.174Z",
  "address": "Berlin, Germany"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Geolocation ID |
| `title` | String | Location title |
| `radius` | Number | Stored radius value |
| `unit` | String | Stored unit label |
| `geo` | Object | Location point (`type`, `coordinates`) |
| `app` | String | App ID for app-specific locations (omitted for global locations) |
| `created` | String | Creation timestamp |
| `address` | String | Reverse-geocoded address if available |

### Error Responses

| HTTP Status | Response |
|---|---|
| 200 | `{"error":"Not enough args"}` |
| 200 | `{"error":"Bad location geo object"}` |
| 200 | `{"error":"Only global admin is allowed to create non-app-specific geolocations"}` |
| 200 | `{"error":"Couldn't find the app"}` |
| 200 | `{"error":"Not an admin of the app"}` |
| 200 | `{"error":"Server db Error"}` |
| 400 | Validation error from auth/permission layer (for example missing required request params) |

## Behavior/Processing

1. Parses `args` from a JSON string.
2. Validates required fields and point structure (`geo.type`, `geo.coordinates`).
3. Resolves app authorization rules.
4. Reverse-geocodes coordinates into `address`.
5. Inserts document into `countly.geos`.
6. Returns the created location document.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.geos` | Endpoint data source | ** - Stores geolocation documents |
| `countly.apps` | Endpoint data source | ** - App lookup and admin permission checks |

---

## Examples

### Example 1: Create App-Specific Location

Endpoint form:

```text
https://your-server.com/i/geolocations/create?api_key=YOUR_API_KEY&app_id=609bd78d90d7a416d4dfb984&args={"title":"Berlin Store","radius":5,"unit":"km","geo":{"type":"Point","coordinates":[13.405,52.52]},"app":"609bd78d90d7a416d4dfb984"}
```

Decoded `args` object:

```json
{
  "title": "Berlin Store",
  "radius": 5,
  "unit": "km",
  "geo": {
    "type": "Point",
    "coordinates": [13.405, 52.52]
  },
  "app": "609bd78d90d7a416d4dfb984"
}
```

### Example 2: Create Global Location (Global Admin Only)

Endpoint form:

```text
https://your-server.com/i/geolocations/create?api_key=YOUR_GLOBAL_ADMIN_API_KEY&app_id=609bd78d90d7a416d4dfb984&args={"title":"Global HQ Radius","radius":3,"unit":"km","geo":{"type":"Point","coordinates":[-0.1276,51.5072]}}
```

Decoded `args` object:

```json
{
  "title": "Global HQ Radius",
  "radius": 3,
  "unit": "km",
  "geo": {
    "type": "Point",
    "coordinates": [-0.1276, 51.5072]
  }
}
```

## Limitations

- `geo.type` must be `Point`.
- `geo.coordinates` must contain exactly two values: `[longitude, latitude]`.
- `unit` is stored as metadata; geo filtering logic uses radius as kilometer-based spherical distance.

## Related Endpoints

- [Geo - List Geo Locations](list.md)
- [Geo - Delete Geo Location](delete.md)

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
