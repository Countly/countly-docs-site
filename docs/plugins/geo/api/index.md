---
sidebar_position: 1
sidebar_label: "Overview"
---

# Location Targeting - API Documentation

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Location Targeting lets you define reusable geographic areas (center point + radius) and use them in Countly segmentation and filtering workflows.

## Quick Links

- [Create Geo Location](create.md)
- [List Geo Locations](list.md)
- [Lookup IP Address](lookup.md)
- [Delete Geo Location](delete.md)

## Feature Metadata

| Item | Details |
|---|---|
| Feature key | `geo` |
| Primary use | Define named geolocations for filtering and targeting |
| Public API surface | Geolocation create/list/delete and IP lookup |
| Visibility model | App-specific locations and global locations |

## Database Collections

| Collection | Purpose |
|---|---|
| `countly.geos` | Stores geolocation documents (`title`, `radius`, `unit`, `geo`, `address`, `app`, `deleted`) |
| `countly.apps` | App existence and admin access checks during create |

## Behavior Notes

- `get_locations` returns app-specific locations first (sorted by title), then global locations.
- Global (non-app-specific) locations can be created and deleted only by global admins.
- The feature includes an internal `/drill/preprocess_query` hook that expands geo filters for drill queries.

## Limitations

- There is no implemented public update handler in current `geo` API code; use delete + create when a location must be changed.

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

_Last Updated: 2026-02-15_
