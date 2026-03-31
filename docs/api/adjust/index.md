---
sidebar_position: 1
sidebar_label: "Overview"
---

# Adjust

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Feature Metadata

| Field | Value |
|---|---|
| Feature | Adjust |
| Type | Attribution callback ingestion |
| Public endpoint count | 1 |
| Primary endpoint | `/i/adjust` |
| Last updated | 2026-02-15 |

## Overview

The Adjust feature ingests attribution callbacks and links them to Countly users using `adjust_id`.

Two attribution paths are supported:
- **Immediate attribution**: if a matching user already exists, attribution data is applied right away.
- **Deferred attribution**: if no user matches yet, payload is stored and later applied when the user appears with the same `adjust_id`.

## Quick Links

| Page | Description |
|---|---|
| [Adjust - Receive](receive.md) | Receive and process Adjust callback payloads |

## How It Works

### Callback Intake

1. Adjust sends callback data to `/i/adjust` with `app_key`.
2. Countly resolves the app from `app_key`.
3. If app is valid and active, payload continues to attribution logic.

### Attribution Logic

- **Match found** (`custom.adjust_id` already exists on a user):
  - Attribution event is recorded as `adjust_<event>`.
  - User custom properties are updated (including first-touch values like `first_<field>` when missing).
- **No match found**:
  - Payload is stored for later matching.

### Deferred Attribution Trigger

When a user profile is later updated with `custom.adjust_id`, pending Adjust records for that ID are attributed automatically.

## Returned Data Fields (Receive Endpoint)

The `/i/adjust` response can return different success shapes depending on attribution path:

| Field | Type | Description |
|---|---|---|
| `result` | String | Operation result (`Success` on successful processing) |
| `status` | String | Attribution state (for example: `attributed`) |
| `Records inserted` | Number | Number of records saved for deferred attribution |
| `document` | Object | Stored callback payload (deferred path) |
| `user` | Object or null | Matched user object when available |

## Database Collections

| Collection | Purpose |
|---|---|
| `countly.apps` | Resolves app by `app_key` and checks app state (exists/paused/locked) |
| `countly.adjust` | Stores unmatched callback payloads for deferred attribution |
| `countly.app_users{appId}` | User matching and custom property updates via `custom.adjust_id` |

## Configuration & Usage Notes

- The ingest endpoint uses `app_key` (not `app_id`) in request parameters.
- `adjust_id` is strongly recommended for reliable matching.
- App pauses block ingestion (`App is currently not accepting data`).
- App lock check applies to populator requests.

## Use Cases

### 1. Install Attribution

Capture install callback data and immediately attach campaign context when user already exists.

### 2. Deferred Attribution

Accept callback data before user profile arrives, then attribute once user is identified by `adjust_id`.

### 3. Campaign Analysis Enrichment

Attach campaign, tracker, network, and adgroup fields to user context and attribution events.

## Troubleshooting

### Missing `app_key`
- Ensure callback includes `app_key`.

### App does not exist
- Validate `app_key` is from the target app in Countly.

### App is paused
- Resume app ingestion before retrying callbacks.

### Data not attributed immediately
- Confirm `adjust_id` is present in callback and user profile.
- Check whether payload is stored in deferred flow, then retry after user update.

## Related Endpoints

- [Adjust - Receive](receive.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

**Last Updated**: 2026-02-15
