---
sidebar_label: "License History"
keywords:
  - "/o/license-history"
  - "license"
  - "history"
last_update:
  date: "2026-10-16"
---

# License - History

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o/license-history
```

## Overview

Returns every license that has been uploaded to this server, newest activation first.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `Read` permission on the `license` feature.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Conditional | Required for users who are not global admins. |

## Examples

### Read the license history

```text
/o/license-history?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
[
  {
    "name": "Example Client",
    "rule": "dp_monthly",
    "start": 1740000000,
    "end": 1771536000,
    "license_stage": "Production",
    "license_hosting": "Self-Hosted",
    "activated_at": 1740000000000,
    "previousTier": null
  }
]
```

### Response Fields

The response is an array with one entry for each stored license. Each entry holds the fields stored in the signed license file (see the [License overview](index.md#license-file-fields)), except the license `_id` and the issue time, plus:

| Field | Type | Description |
|---|---|---|
| `activated_at` | Number | When the license was activated on this server. |
| `previousTier` | String | Tier that was active before this license was uploaded, if recorded. |

### Error Responses

- `500`

```json
{
  "result": "Error in fetching license history"
}
```

- `500`

```json
{
  "result": "Error in returning license history"
}
```

## Behavior

- Read-only. Nothing is modified.
- Returns an empty object `{}` instead of the list when the server is a Countly Flex deployment.

## Related Endpoints

- [Upload License](upload.md)
- [License - MAU Metrics](o-license-metrics-mau.md)
- [License - Data Point Metrics](o-license-metrics-dp.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission check | Reads the member and permissions. |
| `countly.licenses` | License history | Reads all stored licenses. |

</details>
