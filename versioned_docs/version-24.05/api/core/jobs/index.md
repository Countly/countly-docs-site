---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-10-09"
---

# Jobs - API Documentation

## Overview

Jobs endpoints let global administrators list the scheduled background jobs of the server and suspend or resume a job.

## Endpoint Index

- [Jobs List](./o-jobs.md) - `/o?method=jobs`
- [Suspend Job](./o-suspend-job.md) - `/o?method=suspend_job`

## Access & Permissions

- Both endpoints require a global administrator.
- Both endpoints require the `app_id` parameter, even though jobs are not tied to an app.

## Feature Behavior

- Job statuses are returned as text: `SCHEDULED`, `RUNNING`, `DONE`, `CANCELLED`, `ABORTED`, `PAUSED`, `WAITING` or `SUSPENDED`.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.jobs` | Stores scheduled jobs and their run history. |

</details>
