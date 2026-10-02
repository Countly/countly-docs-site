---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-17"
---

# Alerts - API Documentation

## Overview

The Alerts feature stores alert rules and evaluates them through alert-processing jobs. API endpoints let you create/update rules, remove rules, toggle enabled state, and list configured alerts.

## Quick Links

- [Alerts - Save](i-alert-save.md)
- [Alerts - Delete](i-alert-delete.md)
- [Alerts - Update Status](i-alert-status.md)
- [Alerts - List](o-alert-list.md)

## Operational Notes

- Alert create/update/delete/status changes invalidate alerts cache so processor jobs pick up latest rules.
- Rule ownership is enforced for non-global-admin users in update/delete/status/list operations.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.alerts` | Stores alert configuration documents and ownership metadata. |
| `countly.alerts_data` | Stores alert counter aggregates (`t`, date buckets) used in list/count responses. |
| `countly.members` | Used to resolve alert creator names in list responses. |

</details>
