---
sidebar_label: "Read Data"
---

# Get Cohort Member Data

## Endpoint

`/o?method=cohortdata`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Retrieves member data for one or more specified cohorts. Returns detailed user-level information for users in selected cohorts, including engagement metrics and demographics.

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
| cohorts | JSON Array String | Yes | JSON array string of cohort IDs: `["cohort1","cohort2"]` |
| iDisplayStart | Number | No | Pagination offset (default 0) |
| iDisplayLength | Number | No | Number of records per page (default 50) |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `cohorts.*` | Cohort feature defaults | Cohort query/evaluation behavior used by this endpoint. | Changes to cohort settings can affect result scope, calculation behavior, or filtering outcomes. |
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |

## Response

### Success Response

```json
[
  {
    "_id": "cohort123",
    "data": {
      "aaData": [{"uid": "user1", "name": "User One"}],
      "iTotalRecords": 1050,
      "iTotalDisplayRecords": 50
    }
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[]` | Array | One item per requested cohort ID. |
| `_id` | String | Cohort ID in each array item. |
| `data` | Object | Cohort member data payload in each array item from `fetch.getTimeObj('cohortdata', ...)`. |

### Error Responses

No explicit `returnMessage(...)` path in this branch. On lookup/parse issues, it returns an empty array.

---

## Behavior/Processing

- Validates read permission for `cohorts` feature.
- Parses `cohorts` JSON array and loads matching cohort documents.
- Normalizes `period` in special cases (`yesterday`, `prevMonth`, custom ranges).
- Runs `fetch.getTimeObj('cohortdata', ...)` per cohort and returns mapped results.

### Available Projections

- `uid` - User ID
- `sessions` - Total session count
- `events` - Total event count
- `last_seen` - Last activity timestamp
- `devices` - Number of devices
- `location` - Geographic location
- `revenue` - Total revenue (if enabled)
- `created_at` - Account creation date
- `demographics` - Age, gender (if available)

---

## Examples

### Example 1: Read members for specific cohorts

**Request**:
```bash
curl -X GET "https://your-server.com/o?method=cohortdata" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d 'cohorts=["cohort123","cohort456"]' \
  -d "iDisplayLength=100"
```

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.cohortUsers` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.app_users{app_id}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |

## Related Endpoints

- [Get cohort list](cohort-list-read.md) - GET /o?method=get_cohort_list
- [Get single cohort](cohort-single-read.md) - GET /o?method=get_cohort

---

## Use Cases

1. **Member export**: Export cohort members for external use
2. **Correlation analysis**: Analyze engagement patterns across cohorts
3. **Audience sampling**: Get sample of cohort members
4. **Data validation**: Verify members in cohort
5. **Segmented reporting**: Generate reports per-cohort


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
