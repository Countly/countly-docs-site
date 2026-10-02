---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-17"
---

# Server Stats - API Documentation

## Overview

The Server Stats feature tracks aggregated datapoint volume (sessions/events and internal-event categories) and exposes operational monitoring endpoints for totals, hourly distribution, and current top apps by datapoints.

## Quick Links

- [Server Stats - Data Points Read](o-server-stats-data-points.md)
- [Server Stats - Punch Card Read](o-server-stats-punch-card.md)
- [Server Stats - Top Read](o-server-stats-top.md)

## Configuration & Settings

Server Stats read endpoints use core period parsing and authentication flow. No dedicated runtime setting is required to call these endpoints.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.server_stats_data_points` | Stores monthly documents with day/hour metric buckets used by all Server Stats read endpoints. |
| `countly.members` | Used to authenticate dashboard users for Server Stats endpoints. |

</details>
