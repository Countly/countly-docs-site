---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-10-01"
---

# AppsFlyer

:::note Enterprise
This feature is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Feature Metadata

| Field | Value |
|---|---|
| Feature | AppsFlyer |
| Type | Attribution callback ingestion |
| Public endpoint count | 1 |
| Primary endpoint | `/i/appsflyer` |
| Last updated | 2026-10-01 |

## Overview

The AppsFlyer feature ingests AppsFlyer Push API payloads and links them to Countly users using `appsflyer_id`.

Two attribution paths are supported:
- **Immediate attribution**: if a user with a matching `custom.appsflyer_id` already exists, attribution data is applied right away.
- **Deferred attribution**: if no user matches yet, the payload is stored and applied later when a user profile arrives with the same `custom.appsflyer_id`.

## Quick Links

| Page | Description |
|---|---|
| [AppsFlyer - Receive](receive.md) | Receive and process AppsFlyer payloads |

## How It Works

### Callback Intake

1. Configure the AppsFlyer Push API endpoint as `https://YOUR_COUNTLY_SERVER/i/appsflyer?app_key=YOUR_APP_KEY`.
2. AppsFlyer appends the fields you selected to each request.
3. Countly resolves the app from `app_key` and checks that the app exists and is not paused.

### Attribution Logic

- **Match found**: the payload is attributed to the user as an `appsflyer_<event>` event and the user's custom properties are updated.
- **No match found**: the payload is stored for later matching.

### Deferred Attribution Trigger

When user properties arrive with `custom.appsflyer_id`, stored AppsFlyer records for that ID are attributed to the user.

## Related Endpoints

- [AppsFlyer - Receive](receive.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.apps` | Resolves app by `app_key` and checks app state (exists/paused) |
| `countly.appsflyer` | Stores unmatched payloads for deferred attribution |
| `countly.app_users{appId}` | User matching via `custom.appsflyer_id` |

</details>
