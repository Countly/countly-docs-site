---
sidebar_label: "Reports Read"
keywords:
  - "/o/reports/all"
  - "all"
  - "reports"
last_update:
  date: "2026-03-05"
---

# Reports - Reports Read

## Endpoint

```plaintext
/o/reports/all
```

## Overview

Returns reports visible to the authenticated user.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `reports` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication. |
| `auth_token` | String | No | Auth token as query parameter or `countly-token` header. |
| `app_id` | String | Yes | App id used by permission validation. |

## Examples

### Read reports for current user

```plaintext
/o/reports/all?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
[
  {
    "_id": "6262742dbf7392a8bfd8c1f6",
    "title": "Monthly Analytics Report",
    "report_type": "core",
    "apps": [
      "615f0c4120543a8ed03a89b8"
    ],
    "emails": [
      "analytics@company.com"
    ],
    "frequency": "monthly",
    "timezone": "America/New_York",
    "user": "60afbaa84723f369db477fee",
    "isValid": true
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[]` | Array | Report records visible to requester. |
| `[].isValid` | Boolean | Core reports are always `true`; non-core reports are validated via `/report/verify` hook. |

### Error Responses

Standard authentication/authorization errors from read validation.

## Behavior

- Non-global admins only receive reports they own or where their email appears in `emails`.
- Global admins receive all reports.
- Missing `report_type` defaults to `core` in output.

## Related Endpoints

- [Reports - Create](i-reports-create.md)
- [Reports - Send](i-reports-send.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.reports` | Reports source | Reads report definitions. |

</details>
