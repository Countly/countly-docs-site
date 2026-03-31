---
sidebar_label: "Stop Experiment"
---

# Stop Experiment

## Endpoint

```
/i/ab-testing/stop-experiment
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Stop a running experiment and finalize results. Transitions the experiment to completed status.

## Authentication

**Authentication Methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- Update (ab_testing feature)

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication |
| `auth_token` | String | Yes (or use `api_key`) | Auth token for authentication |
| `app_id` | String | Yes | Application identifier |
| `experiment_id` | String | Yes | Experiment ObjectId to stop |

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

## Behavior/Processing

- Recalculates results before stopping the experiment.
- Sets `status` to `completed` and stores `completed_at` timestamp.
- Stores final results in the experiment document.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Updates status, timestamps, and results. |

## Examples

### Example 1: Stop a Running Experiment

**Request**:
```bash
curl "https://your-server.com/i/ab-testing/stop-experiment" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "experiment_id=5f9c8a3b4d1e2a001f3b4567"
```

## Related Endpoints

- [Start Experiment](start.md)
- [Reset Experiment](reset.md)
- [Remove Experiment](remove.md)

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
