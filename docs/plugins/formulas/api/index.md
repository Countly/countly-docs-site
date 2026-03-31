---
sidebar_position: 1
sidebar_label: "Overview"
---

# Formulas - API Documentation

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The Formulas feature lets you define calculated metrics using Countly formula builder. Formulas can be saved, shared, executed on demand, and reused in widgets and report workflows.

## Key Features

- Build custom metrics by combining multiple event/query sources.
- Save reusable formulas with metadata (`title`, `key`, `unit`, formatting).
- Control access with `global` and `private` visibility plus shared editor emails.
- Execute formulas ad hoc (`unsaved`, `snapshot`) or by saved formula ID (`saved`).
- Use long-task/report execution mode for heavier calculations and dashboard integrations.

## Quick Links

### Execute
- [Formulas - Execute](execute.md)

### Read
- [Formulas - Read](get-single.md)
- [Formulas - List](list.md)

### Write
- [Formulas - Save](save.md)
- [Formulas - Delete](delete.md)

## Database Collections

| Collection | Purpose |
|---|---|
| `countly.calculated_metrics` | Stores saved formulas and metadata. |
| `countly.long_tasks` | Stores long-running formula/report tasks and subtask data. |
| `countly.widgets` | Stores widget documents that can reference formulas. |
| `countly.systemlogs` | Stores formula create/edit/delete audit logs. |

## Configuration & Settings

There are no formulas-specific plugin configuration keys in `plugins/formulas/api/api.js`. Runtime behavior is primarily controlled by request parameters, permissions, visibility rules, and long-task/report execution options.

## Permissions & Visibility

- `global`: Visible to all users in the app.
- `private`: Visible to owner and users listed in `shared_email_edit`.
- Non-global admins access formulas via visibility rules (global, owner, shared email).

## Execution Modes

| Mode | Input | Use case |
|---|---|---|
| `saved` | `metric_id` | Execute an existing saved formula. |
| `unsaved` | `formula` payload | Execute an ad-hoc formula without saving it. |
| `snapshot` | `formula` payload | Execute ad-hoc formula in snapshot/report-style flow. |

## Workflow

1. Save a formula using [Formulas - Save](save.md).
2. Run it with [Formulas - Execute](execute.md) for selected buckets/periods.
3. Retrieve formula details or usage via [Formulas - Read](get-single.md).
4. Use [Formulas - List](list.md) for dropdowns and catalog views.
5. Delete obsolete formulas with [Formulas - Delete](delete.md).

## Performance Considerations

- More buckets and wider periods increase query cost and execution time.
- Enabling previous-period output increases processing and payload size.
- Complex formulas with multiple data dependencies can benefit from long-task mode.
- Long-task/report execution is recommended for heavy formulas used in dashboards.

## Related Features

- Drill
- Dashboard
- Report Manager

---

_Last Updated: 2026-02-15_
