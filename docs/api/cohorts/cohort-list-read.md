---
sidebar_label: "Read List"
last_update:
  date: "2026-02-16"
---

# Get Specialized Cohort List

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

`/o?method=get_cohort_list`

## Overview

Retrieves a filtered list of cohorts with advanced options for pagination, sorting, searching, and custom field projection. Provides efficient cohort discovery across large numbers of cohorts.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Read` on the `cohorts` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| type | String | No | Optional cohort type filter (`manual` or `auto`) |

## Examples

### Example 1: Get a filtered cohort list

**Request**:
```bash
curl -X GET "https://your-server.com/o?method=get_cohort_list" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "type=manual"
```

## Response

### Success Response

```json
{
  "a60e8cc976840453894a590575712351": "DocAuditTemp"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `<cohort_id>` | String | Cohort name keyed by cohort ID |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{"result": "Insufficient permissions"}` | User lacks Read permission |

## Behavior

- Validates read permission for `cohorts` feature.
- Queries `cohorts` by `app_id` (and optional `type`).
- Applies visibility filter and excludes names starting with `[CLY]_`.
- Returns map object keyed by cohort ID with cohort name values.

## Limitations

- Returns only `_id -> name` mapping, not full cohort documents.

## Related Endpoints

- [Get all cohorts](read.md) - GET /o?method=get_cohorts
- [Get single cohort](cohort-single-read.md) - GET /o?method=get_cohort

## Use Cases

1. **UI list display**: Populate cohort selection dropdown with search
2. **Admin dashboard**: Show paginated cohort list with sorting
3. **Bulk export**: Export multiple cohorts with specific fields
4. **Cohort discovery**: Find cohorts matching search criteria
5. **Analytics**: Compare cohorts ranked by member count

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Collection: | Source of cohort list |
| `countly.cohortdata` | Optional Collection: | Source of metrics if requested |

**Database Collections**

- `countly.cohorts` - Stores cohort definitions and metadata

</details>
