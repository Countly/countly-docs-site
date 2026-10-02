---
sidebar_label: "Update Metrics"
last_update:
  date: "2026-02-16"
---

# Update Cohort Detail Metrics

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

`/i/cohorts/detail_metrics`

## Overview

Recalculates and refreshes detailed metrics for a cohort, including member count, growth trends, demographics, and behavior patterns. Provides deep-dive analytics about cohort composition and engagement characteristics.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `cohorts` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| cohort_id | String | Yes | ID of cohort to update metrics for |
| detail_metrics | Array (JSON) | Yes | Detail metrics array, passed as JSON string in query/body text |

## Examples

### Example 1: Update detail metrics list

**Request**:
```bash
curl -X GET "https://your-server.com/i/cohorts/detail_metrics" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "cohort_id=COHORT_ID" \
  -d 'detail_metrics=["up.cc","up.p"]'
```

## Response

### Success Response

```json
{
  "result": true
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| result | Boolean | `true` when detail metrics were updated |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{"result": "Not enough args"}` | Missing args |
| 404 | `{"result": "Cohort not found"}` | Invalid cohort_id |
| 400 | `{"result": "Insufficient permissions"}` | User lacks Update permission |
| 400 | `{"result": "Cannot save data"}` | Update failure |

## Behavior

- Validates update permission for `cohorts`.
- Parses `detail_metrics` JSON when passed as string.
- Updates `detail_metrics` field on the cohort document.
- Returns `{"result": true}` on success.
- Writes `cohort_edited` systemlog entry.

## Limitations

- Only updates stored `detail_metrics` configuration on cohort document.
- Does not return computed analytics payload.

## Related Endpoints

- [Get cohort metrics](cohort-metrics-read.md) - GET /o?method=get_cohort_metrics
- [Get cohort details](cohort-single-read.md) - GET /o?method=get_cohort

## Use Cases

1. **Dashboard refresh**: Recalculate metrics for dashboard display
2. **Trend analysis**: Calculate retention and growth over specific time period
3. **Cohort comparison**: Gather metrics for comparing multiple cohorts
4. **Performance reporting**: Generate cohort performance reports
5. **Anomaly detection**: Calculate metrics to identify unusual cohort behavior

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Collection: | Updates metrics timestamp |
| `countly.cohortdata` | Collection: | Stores detailed metric calculations |
| `countly.app_users{app_id}` | Collection: | Source data for user metrics |

**Database Collections**

- `countly.cohorts` - Stores detail metrics configuration for cohorts

</details>
