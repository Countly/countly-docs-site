---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-10-07"
---

# Performance Monitoring

:::note Enterprise
This feature is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Feature Metadata

| Field | Value |
|---|---|
| Feature | Performance Monitoring |
| Type | Application performance monitoring (APM) traces |
| Documented endpoint count | 2 |
| Last updated | 2026-10-07 |

## Overview

Performance Monitoring tracks network and device traces reported by the SDKs. The endpoints documented here let you change the settings of an existing trace.

## Quick Links

| Endpoint | Path |
|---|---|
| [Performance Monitoring - Edit](i-apm-edit.md) | `/i/apm/edit` |
| [Performance Monitoring - Change Status](i-apm-change-status.md) | `/i/apm/change-status` |

## Configuration & Usage

### Trace identifiers

Both endpoints take the trace `id` as returned in the `id` field of the traces listed by the Performance Monitoring read endpoints (`/o/apm/...`), together with the trace `type` (`network` or `device`).

## Limitations & Troubleshooting

**`Unacceptable trace type`**
- `type` must be `network` or `device`.

**`APM id not provided`**
- Send the `id` of the trace as returned by the read endpoints.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.apm` | Stores trace properties such as threshold and status |

</details>
