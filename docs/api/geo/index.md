---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-15"
---

# Location Targeting - API Documentation

:::note Enterprise
This feature is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

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

## Behavior Notes

- `get_locations` returns app-specific locations first (sorted by title), then global locations.
- Global (non-app-specific) locations can be created and deleted only by global admins.
- The feature includes an internal `/drill/preprocess_query` hook that expands geo filters for drill queries.

## Limitations

- There is no implemented public update handler in current `geo` API code; use delete + create when a location must be changed.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.geos` | Stores geolocation documents (`title`, `radius`, `unit`, `geo`, `address`, `app`, `deleted`) |
| `countly.apps` | App existence and admin access checks during create |

</details>
