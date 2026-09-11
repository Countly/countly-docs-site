---
sidebar_label: "Stop Experiment"
keywords:
  - "/i/ab-testing/stop-experiment"
  - "stop-experiment"
  - "ab-testing"
last_update:
  date: "2026-02-16"
---

# Stop Experiment

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/ab-testing/stop-experiment
```

## Overview

Stop a running experiment and finalize results. Transitions the experiment to completed status.

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
| `experiment_id` | String | Yes | Experiment ObjectId to stop |

## Examples

### Example 1: Stop a Running Experiment

**Request**:
```bash
curl "https://your-server.com/i/ab-testing/stop-experiment" \
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

- **HTTP 500** - Failed to stop:
```json
{
  "result": "Failed to stop experiment"
}
```
- **HTTP 400** - Not running yet:
```json
{
  "result": "The experiment is not running yet."
}
```
- **HTTP 400** - Already completed:
```json
{
  "result": "The experiment is already complete."
}
```

## Behavior

- Recalculates results before stopping the experiment.
- Sets `status` to `completed` and stores `completed_at` timestamp.
- Stores final results in the experiment document.

## Related Endpoints

- [Start Experiment](start.md)
- [Reset Experiment](reset.md)
- [Remove Experiment](remove.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Updates status, timestamps, and results. |

</details>
