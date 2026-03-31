---
sidebar_position: 1
sidebar_label: "Overview"
---

# Filtering Rules

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Feature Metadata

| Field | Value |
|---|---|
| Feature | Filtering Rules |
| Type | Ingestion-time request filtering |
| Public endpoint count | 5 |
| Last updated | 2026-02-15 |

## Overview

Filtering Rules lets you block or filter incoming SDK data at app level.  
Rules can target:

- All requests (`all`)
- Session data (`session`)
- Event data (`event`)

Rules are stored on the app document and can be created, updated, enabled/disabled, listed, and deleted through API endpoints.

## Quick Links

| Endpoint | Path |
|---|---|
| [Filtering Rules - Create](create.md) | `/i/blocks/create` |
| [Filtering Rules - Update](update.md) | `/i/blocks/update` |
| [Filtering Rules - Toggle Status](toggle-status.md) | `/i/blocks/toggle_status` |
| [Filtering Rules - Delete](delete.md) | `/i/blocks/delete` |
| [Filtering Rules - List](list.md) | `/o/blocks` |

## Returned Data Fields

The `list` endpoint returns an array of rule objects. Common fields:

| Field | Type | Description |
|---|---|---|
| `_id` | String | Rule ID |
| `type` | String | Rule type: `all`, `session`, or `event` |
| `key` | String | Target key (event key or `*`) |
| `name` | String | Rule display/description text |
| `rule` | String | Stringified rule definition |
| `status` | Boolean | Whether rule is active |
| `is_arbitrary_input` | Boolean | Whether event key is matched by input string behavior |
| `_onReq` | Boolean | Rule can be evaluated early at request stage |
| `last_triggered` | Number | Last trigger Unix timestamp (seconds) |

## Database Collections

| Collection | Purpose |
|---|---|
| `countly.apps` | Stores filtering rules in app `blocks` array |
| `countly.blocked_users{appId}` | Stores temporary blocked-user data used in filtering flows |

## Configuration & Usage

### Rule Lifecycle

1. Create a rule (`create`).
2. Validate behavior in incoming data.
3. Enable/disable rule quickly (`toggle_status`).
4. Update conditions (`update`) as needed.
5. Remove obsolete rules (`delete`).

### Rule Scope

- `all`: applies to request-level filtering.
- `session`: removes session-related payloads when matched.
- `event`: removes matching events (or specific event types) when matched.

## Use Cases

### 1. Block unwanted traffic patterns

Block requests from known test devices, hosts, or IP patterns.

### 2. Exclude noisy session traffic

Filter out session payloads from unwanted cohorts while keeping other data.

### 3. Exclude specific event streams

Block noisy or non-production events by key or rule conditions.

### 4. Temporary rollout controls

Disable problematic rules quickly without deleting configuration.

## Limitations & Troubleshooting

### Limitations

- Rules are app-scoped and require `app_id`.
- Rule definitions are passed as JSON string payload in `blocks`.
- Duplicate rules (same type/key/name/rule) are rejected.

### Common Issues

**`Provide app_id`**
- Include `app_id` in request.

**`Provide block object` or `Provide blocks update object`**
- Ensure `blocks` parameter exists and contains valid JSON.

**`The rule already exists`**
- Update existing rule instead of creating a duplicate.

**No visible effect after change**
- Confirm rule status is enabled (`status: true`).
- Verify rule scope (`all` / `session` / `event`) matches incoming payload type.

## Related Features

- [Drill - API Documentation](../../drill/api/index.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

**Last Updated**: 2026-02-15
