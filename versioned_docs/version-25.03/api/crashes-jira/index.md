---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-15"
---

# JIRA for Crashes - API Documentation

:::note Enterprise
This feature is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Overview

JIRA for Crashes connects Countly crash groups with Atlassian JIRA issues using OAuth 1.0a. It supports creating issues from crash groups and synchronizing status between Countly and JIRA.

## Quick Links

| Endpoint | Purpose |
|---|---|
| [Login](login.md) | Start OAuth login flow with JIRA |
| [Callback](callback.md) | Complete OAuth callback and store access token |
| [Check Login](check-login.md) | Verify stored JIRA credentials |
| [List](issues.md) | List crashgroup-to-JIRA issue mappings |
| [Create](create.md) | Create JIRA issue for a crash group |
| [Sync](sync.md) | Synchronize Countly and JIRA issue status |

## Configuration & Settings

Global settings (scope: `crashes-jira`):

- `api_url`: JIRA base URL
- `api_consumer_key`: OAuth consumer key
- `client_private_key`: OAuth RSA private key
- `callback_url`: Countly API base URL used for callback
- `login-to-jira`: UI/login helper setting

App settings (under `app.plugins["crashes-jira"]`):

- `project`: JIRA project key for issue creation
- `type`: JIRA issue type
- `todo-states`: JIRA states treated as unresolved
- `doing-states`: JIRA states treated as resolving
- `done-states`: JIRA states treated as resolved

## Workflows

### OAuth setup

1. Open [Login](login.md) to authorize Countly in JIRA.
2. JIRA redirects to [Callback](callback.md).
3. Validate setup with [Check Login](check-login.md).

### Issue lifecycle

1. Create mapping via [Create](create.md).
2. Read mapping via [List](issues.md).
3. Keep statuses aligned via [Sync](sync.md).

## Notes

- Sync logic is also triggered internally when crash resolve/unresolve actions run.
- App lifecycle hooks clear mappings on app delete/reset/clear-all.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.crashes_jira` | Global OAuth token metadata (`_id: "meta"`) |
| `countly.crashes_jira{appId}` | Per-app crashgroup ↔ JIRA issue mappings |
| `countly.app_crashgroups{appId}` | Crash status fields used in sync flow |
| `countly.apps` | App-level crashes-jira settings |

</details>
