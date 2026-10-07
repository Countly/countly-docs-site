---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-03-05"
---

# Times Of Day

## Overview

Times Of Day provides a 7x24 activity heatmap by weekday and hour for sessions and events.

## Endpoints

- [Times Of Day - Query](o-times-of-day.md) - `/o?method=times-of-day`

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.times_of_day` | Stores monthly day/hour count documents for sessions and events. |
| `countly.events` | Provides event allow-list used during ingestion when event limit applies. |

</details>
