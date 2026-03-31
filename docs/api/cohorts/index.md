---
sidebar_position: 1
sidebar_label: "Overview"
---

# Cohorts API Documentation

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The Cohorts feature provides behavior-based and property-based user segmentation. It supports:

- Auto cohorts (generated from steps and/or user segmentation rules)
- Manual cohorts (profile groups managed by explicit add/remove operations)

Cohorts are used for analytics segmentation, targeting workflows, and cohort comparison widgets.

## Quick Links

### Read Endpoints (`/o`)

| Endpoint | Purpose |
|----------|---------|
| [get_cohorts](read.md) | List cohorts with filtering, pagination, and visibility controls |
| [get_cohort](cohort-single-read.md) | Read one cohort with creator/group metadata |
| [cohortstate](cohort-state-read.md) | Read current cohort processing state |
| [cohortdata](cohort-data-read.md) | Read cohort time-series/user data |
| [get_cohort_list](cohort-list-read.md) | Read compact cohort name map |
| [get_cohort_metrics](cohort-metrics-read.md) | Read calculated cohort metrics |

### Write Endpoints (`/i/cohorts`)

| Endpoint | Purpose |
|----------|---------|
| [add](cohort-create.md) | Create cohort or profile group |
| [edit](cohort-edit.md) | Update cohort fields |
| [delete](cohort-delete.md) | Delete one or multiple cohorts |
| [add_users](cohort-add-users.md) | Add users to manual cohort |
| [remove_users](cohort-remove-users.md) | Remove users from manual cohort |
| [group](cohort-group.md) | Update cohort grouping metadata |
| [recalculate](cohort-recalculate.md) | Trigger recalculation for a cohort |
| [detail_metrics](cohort-detail-metrics.md) | Update detail metrics fields |
| [resetRealTimeData](cohort-reset-realtime.md) | Reset real-time cohort data |
| [cleanup](cohort-cleanup.md) | Cleanup cohort-related data |
| [fixuid](cohort-fixuid.md) | Fix missing `u_id` references |

## Configuration & Behavior

Feature config scope: `cohorts`

- `regenerate_interval` (default `3600`): periodic regeneration interval in seconds
- `realtime_cohorts` (default `true`): controls real-time update behavior

Behavior summary:

- `realtime_cohorts=true`: non-manual cohorts are kept in real-time update flow.
- `realtime_cohorts=false`: non-manual cohorts are recalculated by regeneration/scheduled flow and manual recalculation triggers.

## Workflow Examples

### Dynamic Cohort Lifecycle

1. Create cohort with steps or user segmentation via [add](cohort-create.md).
2. Check processing state with [cohortstate](cohort-state-read.md).
3. Read list/detail/data via [get_cohorts](read.md), [get_cohort](cohort-single-read.md), and [cohortdata](cohort-data-read.md).
4. Edit logic with [edit](cohort-edit.md) and recalculate if needed via [recalculate](cohort-recalculate.md).

### Manual Profile Group Lifecycle

1. Create with `type=manual` via [add](cohort-create.md).
2. Add users via [add_users](cohort-add-users.md) from query/uids/file/text.
3. Remove users via [remove_users](cohort-remove-users.md).
4. Group/organize or delete when no longer needed.

## Database Collections

- `countly.cohorts`: cohort definitions, ownership, visibility, grouping, configuration
- `countly.cohortUsers`: cohort membership records (especially manual/profile groups)
- `countly.cohortdata`: cohort data metrics used by cohort data reads
- `countly.profile_groups_imports`: async import jobs for add-users operations
- `countly.app_users{app_id}`: user-level cohort hash/state updates
- `countly.members`: creator lookup for detailed cohort reads
- `countly.systemlogs`: audit records for edit/delete and user add/remove actions
- `countly_drill.cohort_meta`: drill-side cohort meta used by real-time/reset flows
- `countly_drill.drill_meta{app_id}` and `countly_drill.drill_meta`: drill metadata touched during reset/cleanup paths

## Related Features

- Drill (cohort queries and drill metadata)
- Users / App Users (membership and user profile resolution)
- Dashboards (cohort widget data and cleanup)
- Tasks / Long-running jobs (bulk add/remove and heavy recalculations)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

---

_Last Updated: 2026-02-15_
