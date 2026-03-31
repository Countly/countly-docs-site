---
sidebar_label: "Delete"
---

# Delete Geo Location

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Endpoint

```
/i/geolocations/delete
```

## Overview

Soft-deletes a geolocation by setting its `deleted` flag.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Delete` on the `geo` feature
- **Additional rules**:
  - Only global admins can delete global (non-app-specific) locations.
  - App admins can delete only locations in apps they administer.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application context for permission checks |
| `gid` | String | Yes | Geolocation ID (24-char ObjectID) |

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
  "address": "Berlin, Germany",
  "deleted": true
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Deleted geolocation ID |
| `title` | String | Location title |
| `radius` | Number | Radius value |
| `unit` | String | Unit label |
| `geo` | Object | Location point |
| `app` | String | App ID (if app-specific) |
| `address` | String | Stored address |
| `deleted` | Boolean | Always `true` after successful deletion |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `{"result":"Not enough args"}` |
| 404 | `{"result":"Location not found"}` |
| 403 | `{"result":"Only global admin can delete non-app-specific geolocations"}` |
| 403 | `{"result":"Only admin of app can can delete geolocations"}` |

---

## Behavior/Processing

1. Validates `gid` format and permissions.
2. Loads the geolocation scoped to the request app.
3. Marks the record as deleted (`deleted: true`).
4. Returns the updated location object.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.geos` | Endpoint data source | ** - Finds and soft-deletes geolocation records |

---

## Examples

### Example: Delete a Geolocation

```text
https://your-server.com/i/geolocations/delete?api_key=YOUR_API_KEY&app_id=609bd78d90d7a416d4dfb984&gid=62616692a9ddc55457bad406
```

## Related Endpoints

- [Geo - Create Geo Location](create.md)
- [Geo - List Geo Locations](list.md)

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
