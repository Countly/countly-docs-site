---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-17"
---

# Date Presets

## Overview

Date Presets endpoints manage reusable date-range definitions with ownership, sharing rules, favorites, and ordering.

## Endpoint Index

### Create
- [Date Presets - Preset Create](i-date-presets-create.md) - `/i/date_presets/create`

### Read
- [Date Presets - Preset Read All](o-date-presets-getall.md) - `/o/date_presets/getAll`
- [Date Presets - Preset Read by ID](o-date-presets-getbyid.md) - `/o/date_presets/getById`

### Update
- [Date Presets - Preset Update](i-date-presets-update.md) - `/i/date_presets/update`

### Delete
- [Date Presets - Preset Delete](i-date-presets-delete.md) - `/i/date_presets/delete`

## Operational Notes

- Preset visibility is controlled by owner, share mode, shared emails, and shared groups.
- Preset order is maintained through `sort_order` shifting when presets are created, reordered, or deleted.
- Create/update handlers copy additional non-control request fields into stored preset documents.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.date_presets` | Stores preset definitions, sharing controls, favorites, owner, and sort order metadata. |
| `countly.members` | Provides owner/member context for access filtering and owner-name enrichment. |

</details>
