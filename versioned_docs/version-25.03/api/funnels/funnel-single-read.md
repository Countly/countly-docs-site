---
sidebar_label: "Read"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-02-16"
---

# Read funnel

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/o?method=get_funnel
```

## Overview

Returns a single funnel definition by ID, including creator display data.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `funnels` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `method` | String | Yes | Must be `get_funnel`. |
| `app_id` | String | Yes | Target app ID. |
| `funnel` | String | Yes | Funnel ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```text
/o?
  method=get_funnel&
  app_id=64f5c0d8f4f7ac0012ab3456&
  funnel=67f1c22912df5acb8f8d5caaf0f89a31
```

## Response

### Success Response

```json
{
  "_id": "67f1c22912df5acb8f8d5caaf0f89a31",
  "app_id": "64f5c0d8f4f7ac0012ab3456",
  "name": "Purchase Funnel",
  "description": "Product view to purchase",
  "type": "session-independent",
  "steps": ["Product View", "Add to Cart", "Purchase"],
  "queries": ["{}", "{}", "{}"],
  "queryTexts": ["All Users", "All Users", "All Users"],
  "stepGroups": [{"c": "and"}, {"c": "and"}, {"c": "and"}],
  "memberData": {
    "_id": "64f5c0d8f4f7ac0012ab9999",
    "full_name": "Jane Doe"
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Funnel ID. |
| `steps` | Array | Ordered step events. |
| `queries` | Array | Per-step query definitions. |
| `queryTexts` | Array | Per-step query labels. |
| `stepGroups` | Array | Per-step group logic metadata. |
| `memberData` | Object | Matched creator member info when available. |

### Error Responses

- `400`

```json
{
  "result": "Missing request parameter: funnel"
}
```

When funnel is not found, the endpoint returns an empty object:

```json
{}
```

## Behavior

- Reads funnel by `_id` and `app_id`.
- Performs member lookup to include creator details.
- Returns first matched funnel document.

## Related Endpoints

- [Funnels - List](read.md)
- [Funnels - Analyze](funnel-query-read.md)
- [Funnels - Update](funnel-update.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.funnels` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.members` | Member/account enrichment | Stores member profile fields (for example names/IDs) used to resolve actor metadata. |

</details>
