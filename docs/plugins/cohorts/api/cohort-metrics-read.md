---
sidebar_label: "Read Metrics"
---

# Get Cohort Analytics and Metrics

## Endpoint

`/o?method=get_cohort_metrics`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Retrieves aggregated value counts for requested user property metrics within a cohort.

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
| cohort_id | String | Yes | ID of the cohort to get metrics for |
| metrics | JSON Array String | Yes | Metric fields array, for example `["up.cc","up.p"]` |

## Response

### Success Response

```json
{
  "in_cohort": 1050,
  "metrics": {
    "up.cc": {
      "US": 700,
      "DE": 200
    },
    "up.p": {
      "iPhone": 600,
      "Android": 450
    }
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `in_cohort` | Number | Count of users currently in the cohort. |
| `metrics` | Object | Metric-keyed distribution map for requested metric names. |
| `metrics.<metricName>` | Object | Top values for metric with counts. |

### Error Responses

No explicit `returnMessage(...)` path in this branch. Missing/invalid `metrics` input can fail during JSON parse before callback.

---

## Behavior/Processing

- Validates read permission for `cohorts` feature.
- Parses `metrics` JSON array from request.
- Aggregates cohort users from `app_users{appId}` where `chr.<cohortId>.in = "true"`.
- Returns:
  - `in_cohort`: matched user count
  - `metrics`: top 3 values per requested metric with counts

---

## Examples

### Example 1: Read cohort metrics

**Request**:
```bash
curl -X GET "https://your-server.com/o?method=get_cohort_metrics" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "cohort_id=COHORT_ID" \
  -d 'metrics=["up.cc","up.p"]'
```

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{app_id}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

## Related Endpoints

- [Get single cohort](cohort-single-read.md) - GET /o?method=get_cohort
- [Update metrics](cohort-detail-metrics.md) - POST /i/cohorts/detail_metrics

---

## Use Cases

1. **Dashboard display**: Show cohort performance metrics
2. **Trend analysis**: Analyze cohort growth and engagement over time
3. **Retention comparison**: Compare retention curves across cohorts
4. **Revenue reporting**: Track monetization performance by cohort
5. **Anomaly detection**: Identify unusual patterns in cohort metrics
6. **Benchmarking**: Compare metrics against cohort targets


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
