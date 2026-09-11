---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-17"
---

# Logger - API Documentation

## Overview

The Logger feature records incoming SDK/API request snapshots per app for troubleshooting and operational diagnostics.

## Quick Links

- [Logger - Logs Read](o-logs.md)
- [Logger - Collection Info Read](o-collection-info.md)

## Configuration & Settings

| Setting | Default | Purpose |
|---|---|---|
| `logger.state` | `automatic` | Controls request logging mode (`on`, `off`, `automatic`). |
| `logger.limit` | `1000` | Request-volume threshold used by automatic mode to switch logging behavior. |

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.logs{appId}` | Stores per-app request-log documents used for debugging and request inspection. |
| `countly.members` | Used for API authentication and permission checks for logger endpoints. |
| `countly.apps` | Used to validate requested app context during logger endpoint access. |

</details>
