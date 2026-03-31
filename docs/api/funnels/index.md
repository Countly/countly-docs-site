---
sidebar_label: "Overview"
sidebar_position: 1
---

# Funnels - API Documentation

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Funnels helps you track user progression through ordered events and measure conversion drop-off between steps.

## Key Features

- Define reusable funnels with step-level query filters.
- Support both `session-independent` and `same-session` funnel types.
- Analyze conversion performance and fetch user IDs for specific step transitions.
- Store/reuse funnel grouping flags (including favorites).
- Power dashboard widgets and periodic overview data.

## Funnel Types

| Type | Description |
|---|---|
| `session-independent` | Step completion is evaluated across sessions in period scope. |
| `same-session` | Step completion is constrained to matching session context. |

## Quick Links

### Read Endpoints
- [Funnels - List](read.md)
- [Funnels - Read](funnel-single-read.md)
- [Funnels - Analyze](funnel-query-read.md)
- [Funnels - Read Data](funnel-data-read.md)
- [Funnels - Read User](user-funnels-read.md)

### Write Endpoints
- [Funnels - Create](funnel-create.md)
- [Funnels - Update](funnel-update.md)
- [Funnels - Update Group](funnel-group-update.md)
- [Funnels - Delete](funnel-delete.md)

## Data Sources

- `countly.funnels`: Funnel definitions and group flags.
- `countly.funneldata`: Daily summarized funnel data.
- `countly_drill.drill_events`: Event stream used during funnel calculations.
- `countly_drill.drill_bookmarks`: Saved filters used through `filter_id`.
- `countly.app_users{appId}`: User pre-filtering and cohort checks.
- `countly.long_tasks`: Async funnel calculation task state/results.
- `countly_fs.funnels_cache`: Cached funnel result blobs.

## Configuration Settings

| Setting | Default | What it controls |
|---|---|---|
| `funnel_step_limit` | `8` | Intended max step count for funnel definitions. |
| `funnel_caching` | `true` | Enables funnel cache read/write behavior. |
| `funnel_caching_period` | `30` | Number of days used by background cache generation jobs. |

## Workflow

1. Create a funnel with [Funnels - Create](funnel-create.md).
2. Optionally update structure or ordering with [Funnels - Update](funnel-update.md).
3. Run analysis using [Funnels - Analyze](funnel-query-read.md).
4. Use [Funnels - Read Data](funnel-data-read.md) for daily summaries/widgets.
5. Remove obsolete funnels with [Funnels - Delete](funnel-delete.md).

## Performance Considerations

- Larger periods and more steps increase query cost.
- `same-session` funnels add session grouping work and can be heavier.
- As data grows, calculations may run asynchronously and return `task_id`.
- Cache behavior (`funnel_caching`) can reduce repeated query latency.

## Related Features

- Drill
- Dashboard
- Report Manager

---

_Last Updated: 2026-02-15_
