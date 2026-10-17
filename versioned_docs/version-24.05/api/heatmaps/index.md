---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-10-17"
---

# Heatmaps

:::note Enterprise
This feature is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Overview

Heatmaps builds on the view data collected by the Views feature. The endpoints documented here list the views that can be shown as a heatmap, the domains and segments available for them, and the overall totals.

## Quick Links

| Endpoint | Path |
|---|---|
| [Heatmaps - Views](o-heatmaps-views.md) | `/o/heatmaps/views` |
| [Heatmaps - Domains](o-heatmaps-domains.md) | `/o/heatmaps/domains` |
| [Heatmaps - Metrics](o-heatmaps-metrics.md) | `/o/heatmaps/metrics` |
| [Heatmaps - Export](o-heatmaps-export.md) | `/o/heatmaps/export` |

## Configuration & Settings

Access is controlled with the `heatmaps` feature permission. There are no feature-specific settings.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.app_viewdata{sha1(segment+appId)}` | Aggregated view metrics |
| `countly.app_viewsmeta{appId}` | Per-view metadata (`view`, `display`, `url`) |
| `countly.views` | Segments of the views of the app |
| `countly_drill.drill_meta` | Domains seen in action events |

</details>
