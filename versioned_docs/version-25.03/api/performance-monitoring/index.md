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
| [Overview Read](o-apm-overview.md) | Read network and device traces with an overview |
| [Network Trace Read](o-apm-network.md) | Read one network trace |
| [Device Trace Read](o-apm-device.md) | Read one device trace |
| [Issues Read](o-apm-issues.md) | List traces that exceed their threshold |
| [Metric Read](o-apm-metric.md) | Read one metric of a trace |
| [Samples Read](o-apm-samples.md) | Read samples of a metric of a trace |
| [User Samples Read](o-apm-user-samples.md) | Read samples of one user |
| [Network Latency Breakdown Read](o-apm-network-latency-breakdown.md) | Read network latency by country |
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
