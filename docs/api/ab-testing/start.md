---
sidebar_label: "Start Experiment"
keywords:
  - "/i/ab-testing/start-experiment"
  - "start-experiment"
  - "ab-testing"
last_update:
  date: "2026-02-16"
---

# Start Experiment

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/ab-testing/start-experiment
```

## Overview

Start an experiment and transition it from draft to running status. Creates cohorts for variant-goal tracking.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Update (ab_testing feature)

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication |
| `auth_token` | String | Yes (or use `api_key`) | Auth token for authentication |
| `app_id` | String | Yes | Application identifier |
| `experiment_id` | String | Yes | Experiment ObjectId to start |

## Examples

### Example 1: Start an Experiment

**Request**:
```bash
curl "https://your-server.com/i/ab-testing/start-experiment" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "experiment_id=5f9c8a3b4d1e2a001f3b4567"
```

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `result` | String | Result message |

### Error Responses

- **HTTP 500** - Experiment does not exist:
```json
{
  "result": "The experiment does not exist."
}
```
- **HTTP 400** - Already running:
```json
{
  "result": "The experiment is already running."
}
```
- **HTTP 400** - Already completed:
```json
{
  "result": "The experiment is already complete."
}
```
- **HTTP 500** - Failed to start:
```json
{
  "result": "The experiment could not be started."
}
```

## Behavior

- Creates cohorts for each variant-goal combination.
- Sets `status` to `running` and stores `started_at` timestamp.

## Related Endpoints

- [Stop Experiment](stop.md)
- [Reset Experiment](reset.md)
- [Remove Experiment](remove.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Updates experiment status and start time. |
| `countly.cohorts` | Related: | Creates tracking cohorts for each variant-goal combination. |

</details>
