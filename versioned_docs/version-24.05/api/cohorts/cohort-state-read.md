---
sidebar_label: "Read State"
last_update:
  date: "2026-02-16"
---

# Get Cohort Processing State

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

`/o?method=cohortstate`

## Overview

Retrieves the current processing state and status of a cohort. Shows whether cohort is actively recalculating, completed, or has errors. Useful for monitoring long-running cohort calculations.

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
| cohort | String | No | Optional; not used by current handler branch |

## Examples

### Example 1: Check cohort calculation state

**Request**:
```bash
curl -X GET "https://your-server.com/o?method=cohortstate" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID"
```

## Response

### Success Response

```json
{
  "hashes": {
    "a4f...": {
      "data": {},
      "cid": ["cohort123"]
    }
  },
  "cohorts": {
    "cohort123": {
      "_id": "cohort123",
      "name": "High Value Users"
    }
  },
  "ts": 1739630000
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `hashes` | Object | Step/signature map used for cohort membership evaluation. |
| `cohorts` | Object | Cohort definitions map keyed by cohort ID. |
| `ts` | Number | Cached snapshot timestamp (unix seconds). |

### Error Responses

No explicit `returnMessage(...)` path in this branch.

## Behavior

- Validates read permission for `cohorts` feature.
- Returns the current cached cohort configuration from `cohorts.getCurrentCohortConfig(...)`.
- Output contains hash maps used by cohort processors plus cache timestamp metadata.

### Notes

- This endpoint returns configuration/cache state, not a single cohort progress percentage.

## Limitations

- Does not show per-cohort progress percentage.
- Returns snapshot-style config/cache state.

## Related Endpoints

- [Get single cohort](cohort-single-read.md) - GET /o?method=get_cohort
- [Recalculate cohort](cohort-recalculate.md) - POST /i/cohorts/recalculate

## Use Cases

1. **Progress monitoring**: Check if cohort is done recalculating
2. **Error checking**: Identify why cohort calculation failed
3. **Scheduling**: Determine when to fetch updated cohort data
4. **UI status**: Show cohort state (loading/ready) in interface
5. **Health check**: Verify cohort is in healthy state

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `cohorts.*` | Cohort feature defaults | Cohort query/evaluation behavior used by this endpoint. | Changes to cohort settings can affect result scope, calculation behavior, or filtering outcomes. |
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Collection: | Source of state information |

**Database Collections**

- `countly.cohorts` - Stores cohort processing state and status

</details>
