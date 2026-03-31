---
sidebar_label: "Start Experiment"
---

# Start Experiment

## Endpoint

```
/i/ab-testing/start-experiment
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Start an experiment and transition it from draft to running status. Creates cohorts for variant-goal tracking.

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
| `experiment_id` | String | Yes | Experiment ObjectId to start |

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

- **HTTP 500** - Experiment doesn't exist:
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

## Behavior/Processing

- Creates cohorts for each variant-goal combination.
- Sets `status` to `running` and stores `started_at` timestamp.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Updates experiment status and start time. |
| `countly.cohorts` | Related: | Creates tracking cohorts for each variant-goal combination. |

## Examples

### Example 1: Start an Experiment

**Request**:
```bash
curl "https://your-server.com/i/ab-testing/start-experiment" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "experiment_id=5f9c8a3b4d1e2a001f3b4567"
```

## Related Endpoints

- [Stop Experiment](stop.md)
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
