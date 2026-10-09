---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-03-05"
---

# SDK

## Overview

SDK feature manages runtime SDK configuration, enforcement overrides, and SDK metrics.

## Endpoints

### Core

- [SDK Fetch Read](o-sdk.md) - `/o/sdk`
- [SDK Fetch Write](i-sdk.md) - `/i/sdk`

### SDK Logs & Connection Test

- [SDK - SDK Logs Start](i-sdk-logs-start.md) - `/i/sdk_logs/start`
- [SDK - SDK Logs Stop](i-sdk-logs-stop.md) - `/i/sdk_logs/stop`
- [SDK - SDK Logs Delete](i-sdk-logs-delete.md) - `/i/sdk_logs/delete`
- [SDK - Connection Test Arm/Disarm](i-sdk-test.md) - `/i/sdk-test`

### Configuration & Enforcement

- [SDK - SDK Config Read](o-sdk-config.md) - `/o/sdk?method=sc`
- [SDK - Config Read](o-sdk-config-read.md) - `/o?method=sdk-config`
- [SDK - Config Upload](o-config-upload.md) - `/o?method=config-upload`
- [SDK - Enforcement Read](o-sdk-enforcement.md) - `/o?method=sdk-enforcement`
- [SDK - Config Parameter Update](i-sdk-config-parameter.md) - `/i/sdk-config/update-parameter`
- [SDK - Enforcement Update](i-sdk-config-enforcement.md) - `/i/sdk-config/update-enforcement`
- [SDK - SDK Metrics Read](o-sdk-metrics.md) - `/o?method=sdks`

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.apps` | Resolves app by `app_key`, app settings, and checksum salt fields. |
| `countly.app_users{appId}` | Loads app-user context for current `device_id` hash. |
| `countly_out.sdk_configs` | Stores per-app SDK configuration object. |
| `countly_out.sdk_enforcement` | Stores per-app enforcement overrides. |
| `countly.sdks` | Stores SDK analytics metrics. |

</details>
