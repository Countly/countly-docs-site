---
sidebar_label: "Overview"
sidebar_position: 1
---

# Flows - API Documentation

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Flows helps you analyze user journeys across events, views, and crash groups. You can define flow schemas, calculate path data, and manage which flows are enabled.

## Key Features

- Build reusable flow schemas for common user journeys.
- Analyze both event-based and view-based paths.
- Filter flows with user segmentation and excluded events.
- Start calculations on demand and review calculated path graphs.
- Enable or disable flows in bulk without deleting definitions.
- Use crash-group and view catalogs to build more precise paths.

## Flow Types

| Flow Type | Purpose | Typical Start/End Inputs |
|---|---|---|
| `events` | Track movement across custom and system events. | `start.event` / `end.event` (for crash paths, use `[CLY]_crash` with `cid`). |
| `views` | Track navigation across app screens or web pages. | `start.event` / `end.event` as `[CLY]_view` with `vid`. |

## Quick Links

### Read Endpoints
- [Flows - List](list.md)
- [Flows - Info](info.md)
- [Flows - Data](data.md)
- [Flows - Events](events.md)
- [Flows - Views](views.md)
- [Flows - Crashes](crashes.md)

### Write Endpoints
- [Flows - Create](create.md)
- [Flows - Edit](edit.md)
- [Flows - Calculate](calculate.md)
- [Flows - Delete](delete.md)
- [Flows - Update Status](update-status.md)

## Data Sources

- `countly.flow_schemas`: Flow definitions and status.
- `countly.flow_data`: Calculated flow graph/path data.
- `countly.events`: App event list for flow event pickers.
- `countly.app_viewsmeta`: App views for view-based flow pickers.
- `countly.app_crashgroups{appId}`: App crash groups for crash-based flow pickers.
- `countly.members`: Flow creator details in info endpoint.

## Configuration Settings

| Setting | Default | What it controls |
|---|---|---|
| `regenerateInterval` | `3600` | Minimum interval for automatic flow regeneration jobs. |
| `nodesCn` | `10` | Maximum number of nodes calculated per step in flow results. |
| `maxDepth` | `20` | Maximum number of steps calculated for a flow. |
| `skipAutoFlows` | `false` | When enabled, automatic creation of default "Basic Events flow" and "Basic Views flow" is skipped. |

## Performance Considerations

- Higher `maxDepth` increases path length and can significantly increase calculation time.
- Higher `nodesCn` increases branch width per step and may increase memory usage during calculations.
- Longer periods (for example `90days` or custom wide ranges) process more events and can take longer.
- Using broad flows without exclusions can increase dataset size; excluding noisy events usually improves performance.
- User segmentation can reduce processed data size and improve calculation speed when filters are targeted.
- Flow calculation runs asynchronously; large flows may remain in calculating/error states longer before results are available.

## Workflow

1. Create a flow with [Flows - Create](create.md).
2. Run calculation with [Flows - Calculate](calculate.md).
3. Read schema and result data with [Flows - Info](info.md) and [Flows - Data](data.md).
4. Edit, disable, or delete as needed.

---

_Last Updated: 2026-02-15_
