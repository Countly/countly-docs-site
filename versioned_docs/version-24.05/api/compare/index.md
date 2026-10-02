---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-17"
---

# Compare - API Documentation

## Overview

The Compare feature provides side-by-side analytics across events or apps, helping teams evaluate relative performance over the same period.

## Quick Links

- [Compare - Apps](o-compare-apps.md)
- [Compare - Events](o-compare-events.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.apps` | Resolves app metadata for app-comparison responses. |
| `countly.users` and event metric collections | Source metrics for app and event comparison calculations. |

</details>
