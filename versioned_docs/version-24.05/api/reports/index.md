---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-03-05"
---

# Reports

## Overview

Reports feature manages scheduled report definitions and manual report actions (create/update/delete/send/preview/pdf/status).

## Endpoints

- [Reports - Reports Read](o-reports-all.md) - `/o/reports/all`
- [Reports - Create](i-reports-create.md) - `/i/reports/create`
- [Reports - Update](i-reports-update.md) - `/i/reports/update`
- [Reports - Delete](i-reports-delete.md) - `/i/reports/delete`
- [Reports - Send](i-reports-send.md) - `/i/reports/send`
- [Reports - Preview](i-reports-preview.md) - `/i/reports/preview`
- [Reports - Status](i-reports-status.md) - `/i/reports/status`

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.reports` | Stores report definitions and schedule settings. |

</details>
