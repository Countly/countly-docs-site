---
sidebar_label: "Dashboard Read"
keywords:
  - "/o/dashboards"
  - "dashboards"
last_update:
  date: "2026-02-17"
---

# Dashboards - Read

## Endpoint

```text
/o/dashboards
```

## Overview

Returns one dashboard with widget data, app summaries, owner info, and access flags. Sharing details are only included for owners and global admins.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

No separate feature permission flag is checked. Access is controlled by dashboard-level sharing rules.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `dashboard_id` | String | Yes | Dashboard ID (24-char ObjectId string). |
| `period` | String | No | Optional period used by widget data loaders. |
| `action` | String | No | Optional action context (for example `refresh`). |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Read one dashboard

```text
/o/dashboards?
  dashboard_id=65e1f3d2a4f41a5f6f6d7701&
  period=30days
```

## Response

### Success Response

```json
{
  "_id": "65e1f3d2a4f41a5f6f6d7701",
  "name": "Executive Overview",
  "owner_id": "65dc6a52a2f7156eb2576f10",
  "owner": {
    "_id": "65dc6a52a2f7156eb2576f10",
    "full_name": "Product Lead",
    "email": "lead@company.com",
    "username": "lead"
  },
  "share_with": "selected-users",
  "is_owner": true,
  "is_editable": true,
  "widgets": [
    {
      "_id": "65e1f5f8a4f41a5f6f6d7703",
      "widget_type": "analytics",
      "apps": ["6991c75b024cb89cdc04efd2"],
      "dashData": {
        "isValid": true,
        "data": {
          "6991c75b024cb89cdc04efd2": {
            "t": 2145
          }
        }
      }
    }
  ],
  "apps": [
    {
      "_id": "6991c75b024cb89cdc04efd2",
      "name": "Production App",
      "has_image": false
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Dashboard ID. |
| `name` | String | Dashboard name. |
| `owner_id` | String | Owner member ID. |
| `owner` | Object | Owner profile details. |
| `is_owner` | Boolean | `true` for owner/global admin. |
| `is_editable` | Boolean | `true` when user has edit access to dashboard. |
| `share_with` | String | Sharing mode (`none`, `selected-users`, `all-users`). |
| `widgets` | Array | Dashboard widget array with computed data. |
| `apps` | Array | App summaries referenced by dashboard widgets. |
| `error` | Boolean | Present in access-denied branch. |
| `dashboard_access_denied` | Boolean | `true` when user cannot view dashboard. |

### Error Responses

- `401`

```json
{
  "result": "Invalid parameter: dashboard_id"
}
```

- `404`

```json
{
  "result": "Dashboard does not exist"
}
```

- `401`

```json
{
  "result": "Error while fetching dashboard widget data."
}
```

- `200` (no access)

```json
{
  "error": true,
  "dashboard_access_denied": true
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Full dashboard read | Dashboard exists and user has view access | Resolves view/edit access flags, fetches owner info, fetches widgets/apps, enriches widget data. | Raw dashboard object |
| Access denied | User fails view access check | Stops before widget data processing. | Raw object with `error` and `dashboard_access_denied` |

### Impact on Other Data

- Read-only endpoint; no writes.

## Operational Considerations

- Widget data loading runs across all dashboard widgets. Dashboards with many heavy widgets can have longer response times.
- Sharing detail fields are hidden for non-owner and non-global-admin users.

## Related Endpoints

- [Dashboards - Read All](o-dashboards-all.md)
- [Dashboards - Read Widget](o-dashboards-widget.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `dashboards.sharing_status` | `true` | Dashboard sharing model | Controls whether dashboards can be shared broadly (`all-users` / selected sharing). This changes who can access a dashboard in read flows. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.dashboards` | Dashboard lookup and access context | Reads one dashboard by `_id`. |
| `countly.widgets` | Widget metadata and processing input | Reads widgets linked to the dashboard. |
| `countly.apps` | App summary enrichment | Reads app metadata referenced by widgets. |
| `countly.members` | Authentication, owner enrichment, and shared-user enrichment | Reads current member context for access checks, owner profile details, and shared user details. |

</details>
