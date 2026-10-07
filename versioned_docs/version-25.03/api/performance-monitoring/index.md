---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-10-07"
---

# Performance Monitoring - API Documentation

:::note Enterprise
This feature is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Overview

Performance Monitoring collects network and device traces from SDKs and lets you manage the issue settings of each trace. The endpoints below change the issue threshold (in seconds) and the issue status of a trace.

## Quick Links

| Endpoint | Purpose |
|---|---|
| [Edit](i-apm-edit.md) | Change the threshold of a trace |
| [Change Status](i-apm-change-status.md) | Mute or reopen the issue of a trace |

## Operational Notes

- Trace types are `network` and `device`.
- Both endpoints record an `apm_edited` system log entry.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.apm` | Stores trace property documents (`<app_id>_<type>_<name>_props`) holding `threshold` and `status`. |

</details>
