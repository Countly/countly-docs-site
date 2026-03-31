---
sidebar_position: 1
sidebar_label: "Overview"
---

# Journeys - API Documentation

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Journey Engine lets you build automated journeys that react to user events, profile changes, and engagement actions. A journey definition can have multiple versions, with a single active version at a time. Journeys create instances per user, track block execution, and compute performance metrics.

## Database Collections

| Collection | Purpose |
|---|---|
| `countly.journey_definition` | Stores journey definitions (name, status, app, creator) |
| `countly.journey_versions` | Stores journey versions and block graphs |
| `countly.journey_instances` | Stores per-user journey execution instances |
| `countly.journey_logs` | Stores journey instance status logs |
| `countly.journey_block_logs` | Stores per-block execution logs |
| `countly.journey_stats` | Stores aggregated journey performance stats (daily) |
| `countly.events` | Stores app event metadata (created via journey event API) |
| `countly_drill.drill_meta` | Stores drill event metadata for custom events |
| `countly.members` | Journey creator lookups |
| `countly.apps` | App metadata for journey lookups |
| `countly.app_users{appId}` | User profiles for instance lookups |
| `countly.plugins` | Stores plugin config (including `journey_engine.cooldown` migration data) |

## Configuration & Settings

The feature uses config stored in the `plugins` document:

- `journey_engine.cooldown` (hours, default: 24)
  - Used to throttle content delivery between journeys
  - If missing, the setting is migrated from `content.cooldown`

## Quick Links

### Journeys
- [Save Journey](journey-engine-journeys-save.md) - `/i/journey-engine/journeys/save`
- [List Journeys](journey-engine-list.md) - `/o/journey-engine/list`
- [Get Journey](journey-engine-journey-read.md) - `/o/journey-engine/journey`
- [Delete Journey](journey-engine-delete.md) - `/i/journey-engine/delete`
- [Publish Journey](journey-engine-journeys-publish.md) - `/i/journey-engine/journeys/publish`
- [Pause Journey](journey-engine-journeys-pause.md) - `/i/journey-engine/journeys/pause`
- [Resume Journey](journey-engine-journeys-resume.md) - `/i/journey-engine/journeys/resume`

### Versions
- [List Versions](journey-engine-versions-list.md) - `/o/journey-engine/versions/list`
- [Save Version](journey-engine-versions-save.md) - `/i/journey-engine/versions/save`
- [Rename Version](journey-engine-versions-rename.md) - `/i/journey-engine/versions/rename`
- [Duplicate Version](journey-engine-versions-duplicate.md) - `/i/journey-engine/versions/duplicate`
- [Activate Version](journey-engine-versions-activate.md) - `/i/journey-engine/versions/activate`
- [Delete Version](journey-engine-versions-delete.md) - `/i/journey-engine/versions/delete`

### Stats
- [Journey Results Table](journey-engine-stats-table.md) - `/o/journey-engine/stats/table`
- [Summary Metrics](journey-engine-stats-summary.md) - `/o/journey-engine/stats/summary`
- [UIDs by Metric](journey-engine-stats-uids.md) - `/o/journey-engine/stats/uids`
- [Performance Over Time](journey-engine-stats-performance.md) - `/o/journey-engine/stats/performance`
- [Active Users](journey-engine-stats-active-users.md) - `/o/journey-engine/stats/active-users`
- [Active Users Detail](journey-engine-stats-active-users-detail.md) - `/o/journey-engine/stats/active-users/detail`

### Logs & Instances
- [Journey Instances](journey-engine-journey-instances-list.md) - `/o/journey-engine/journey-instances/list`
- [Journey Logs](journey-engine-journey-logs-list.md) - `/o/journey-enginge/journey-logs/list`
- [Journey Block Logs](journey-engine-journey-block-logs-list.md) - `/o/journey-engine/journey-block-logs/list`

### Utilities
- [Create Custom Event](journey-engine-event-create.md) - `/i/journey-engine/event`
- [Init Engine (Internal)](journey-engine-init.md) - `/i/journey-engine/init`
- [Debug Journey (Admin)](journey-engine-debug.md) - `/o/journey-engine/debug`

## Permissions & Access

Most endpoints require the `journey_engine` feature permission. Some endpoints are restricted to global admins (see endpoint docs).

## Related Features

- **Content**: Journey blocks can trigger content delivery
- **Drill**: Journey filters and events use Drill data
- **Surveys**: Survey events can advance journeys

---

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
