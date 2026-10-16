---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-10-16"
---

# Heatmaps - API Documentation

:::note Enterprise
This feature is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Overview

Heatmaps shows where users click and how far they scroll on the pages of a web app. These endpoints list the tracked views and domains and return summary totals for them. The interaction points of a single view are read with [Views - Actions/Heatmap Read](../views/o-actions.md).

## Endpoints

- [Heatmaps - Views](o-heatmaps-views.md) - `/o/heatmaps/views`
- [Heatmaps - Domains](o-heatmaps-domains.md) - `/o/heatmaps/domains`
- [Heatmaps - Metrics](o-heatmaps-metrics.md) - `/o/heatmaps/metrics`

## Permissions & Access

All endpoints require `Read` permission on the `heatmaps` feature.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.app_viewdata{sha1(segment+appId)}` | Aggregated view metrics (visits and scroll values). |
| `countly.app_viewsmeta{appId}` | Per-view metadata (name, display name, URL). |
| `countly.views` | Segment map of the app. |
| `countly_drill.drill_events` and `countly_drill.drill_meta` | Domain values of `[CLY]_action` events. |

</details>
