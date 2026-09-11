---
sidebar_label: "Alert Delete"
keywords:
  - "/i/alert/delete"
  - "delete"
  - "alert"
last_update:
  date: "2026-02-17"
---

# Alerts - Delete

## Endpoint

```text
/i/alert/delete
```

## Overview

Deletes an alert by ID. Non-global-admin users can delete only alerts they created.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `alerts` `Update` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `alertID` | String | Yes | Alert ID to remove. |
| `app_id` | String | Conditional | Required for non-global-admin users during update validation. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Delete alert

```text
/i/alert/delete?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  alertID=65f0cbf8bca6b8e8fbf7f901
```

## Response

### Success Response

```json
{
  "result": "Deleted an alert"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Deletion result message. |

### Error Responses

- `400`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

- `400`

```json
{
  "result": "Alert to delete not found. Make sure alert exists and you have rights to delete it."
}
```

- `401`

```json
{
  "result": "No app_id provided"
}
```

- `401`

```json
{
  "result": "User does not exist"
}
```

- `401`

```json
{
  "result": "User does not have right"
}
```

- `500`

```json
{
  "result": "Failed to delete an alert"
}
```

- `500`

```json
{
  "result": "Failed to delete an alertMongoServerError: write conflict"
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Delete success | Matching alert found and removed | Removes alert document and invalidates alert processor cache. | Wrapped success message |
| Not found / no rights | No matching alert for query | Returns not-found-or-no-rights message. | Wrapped error message |

### Impact on Other Data

- Invalidates alerts cache so removed alert is not processed in future runs.

## Limitations

- For non-global-admin users, delete query includes `createdBy=current_user`, so IDs for alerts owned by other users are reported as not found.

## Related Endpoints

- [Alerts - Save](i-alert-save.md)
- [Alerts - Update Status](i-alert-status.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission checks | Reads member account and access rights for update validation. |
| `countly.apps` | App validation/context loading | Validates `app_id` for non-global-admin update access. |
| `countly.alerts` | Alert rule persistence | Removes matching alert document by `_id` (+ `createdBy` filter for non-admin users). |

</details>
