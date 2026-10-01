---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-10-01"
---

# Performance Monitoring

<!-- REVIEW: the code does not say whether Performance Monitoring is an Enterprise-only feature. The note below follows the other feature folders; confirm it applies. -->
:::note Enterprise
This feature is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Feature Metadata

| Field | Value |
|---|---|
| Feature | Performance Monitoring |
| Type | Trace issue management |
| Documented endpoint count | 2 |
| Last updated | 2026-10-01 |

## Overview

Performance Monitoring tracks network and device traces. These endpoints change the issue settings of a trace: its threshold and whether it is muted.

## Quick Links

| Page | Description |
|---|---|
| [Edit Trace Threshold](edit.md) | `/i/apm/edit` - set the issue threshold of a trace |
| [Change Trace Status](change-status.md) | `/i/apm/change-status` - mute or reopen a trace |

## Notes

- Both endpoints require Update permission on the `performance_monitoring` feature.
- `type` must be `network` or `device`.
- Trace IDs come from the Performance Monitoring read endpoints, which are not yet documented here.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.apm` | Stores trace properties (`threshold`, `status`) per app, type and trace name |

</details>
