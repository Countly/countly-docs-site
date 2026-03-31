---
sidebar_label: "Read List"
---

# Get Specialized Cohort List

## Endpoint

`/o?method=get_cohort_list`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Retrieves a filtered list of cohorts with advanced options for pagination, sorting, searching, and custom field projection. Provides efficient cohort discovery across large numbers of cohorts.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the `cohorts` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| type | String | No | Optional cohort type filter (`manual` or `auto`) |

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

---

## Behavior/Processing

- Validates read permission for `cohorts` feature.
- Queries `cohorts` by `app_id` (and optional `type`).
- Applies visibility filter and excludes names starting with `[CLY]_`.
- Returns map object keyed by cohort ID with cohort name values.

---

## Examples

### Example 1: Get a filtered cohort list

**Request**:
```bash
curl -X GET "https://your-server.com/o?method=get_cohort_list" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "type=manual"
```

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Collection: | Source of cohort list |
| `countly.cohortdata` | Optional Collection: | Source of metrics if requested |

---

## Limitations

- Returns only `_id -> name` mapping, not full cohort documents.

---

## Database Collections

- `countly.cohorts` - Stores cohort definitions and metadata

## Related Endpoints

- [Get all cohorts](read.md) - GET /o?method=get_cohorts
- [Get single cohort](cohort-single-read.md) - GET /o?method=get_cohort

---

## Use Cases

1. **UI list display**: Populate cohort selection dropdown with search
2. **Admin dashboard**: Show paginated cohort list with sorting
3. **Bulk export**: Export multiple cohorts with specific fields
4. **Cohort discovery**: Find cohorts matching search criteria
5. **Analytics**: Compare cohorts ranked by member count


---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-02-16
