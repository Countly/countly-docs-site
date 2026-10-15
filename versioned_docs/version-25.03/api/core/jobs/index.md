---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-10-15"
---

# Jobs - API Documentation

## Overview

Jobs endpoints give global administrators access to the scheduled background jobs of the Countly server: list them, see the runs of one job, and suspend or resume a job.

## Quick Links

- [Jobs - Read Jobs](./o-jobs.md) - `/o?method=jobs`
- [Jobs - Suspend Job](./o-suspend-job.md) - `/o?method=suspend_job`

## Data Model

| Collection | Purpose |
|---|---|
| `countly.jobs` | Stores job schedules, status and run history. |

## Behavior Notes

- Both endpoints are available to global administrators only.
- Job status is one of `SCHEDULED`, `RUNNING`, `DONE`, `CANCELLED`, `ABORTED`, `PAUSED`, `WAITING` or `SUSPENDED`.
