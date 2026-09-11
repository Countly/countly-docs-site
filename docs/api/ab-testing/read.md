---
sidebar_label: "List All Experiments"
keywords:
  - "/o"
  - "o"
last_update:
  date: "2026-02-16"
---

# List All Experiments

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o?method=ab-testing
```

## Overview

List AB testing experiments for an app. For running experiments, this endpoint recalculates performance metrics unless `skipCalculation=true`.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Read (ab_testing feature)

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication |
| `auth_token` | String | Yes (or use `api_key`) | Auth token for authentication |
| `app_id` | String | Yes | Application ID |
| `skipCalculation` | String | No | Set to `true` to skip live performance recalculation |

## Examples

### Example 1: List experiments with recalculation

**Request**:
```bash
curl "https://your-server.com/o?method=ab-testing&app_id=YOUR_APP_ID&api_key=YOUR_API_KEY"
```

**Response**:
```json
{
	"experiments": [],
	"performance_metrics": [
		{"value": "improvement"},
		{"value": "conversion_rate"},
		{"value": "probability_beat_baseline"},
		{"value": "conversion_number"}
	]
}
```

### Example 2: List experiments without recalculation

**Request**:
```bash
curl "https://your-server.com/o?method=ab-testing&app_id=YOUR_APP_ID&skipCalculation=true&api_key=YOUR_API_KEY"
```

**Response**:
```json
{
	"experiments": [],
	"performance_metrics": [
		{"value": "improvement"},
		{"value": "conversion_rate"},
		{"value": "probability_beat_baseline"},
		{"value": "conversion_number"}
	]
}
```

## Response

### Success Response

```json
{
	"experiments": [],
	"performance_metrics": [
		{
			"value": "improvement"
		},
		{
			"value": "conversion_rate"
		},
		{
			"value": "probability_beat_baseline"
		},
		{
			"value": "conversion_number"
		}
	]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `experiments` | Array | Experiment documents for the app |
| `performance_metrics` | Array | Supported metric keys (`improvement`, `conversion_rate`, etc.) |

### Error Responses

Authentication/permission failures are returned by the common rights layer.

## Behavior

- Fetches experiments from `countly_out.ab_testing_experiments{appId}`.
- For running experiments, recalculates results unless `skipCalculation=true`.
- Updates stored results when recalculation runs.

## Related Endpoints

- [Get Experiment Details](experiment-detail.md)
- [Get Specific Experiments](experiment-read.md)

## Limitations

- Use `skipCalculation=true` for dashboard lists that do not need fresh metrics.
- Recalculation can be expensive for large datasets.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Experiment definitions and results. |

</details>
