---
sidebar_label: "Reset Experiment"
keywords:
  - "/i/ab-testing/reset-experiment"
  - "reset-experiment"
  - "ab-testing"
---

# Reset Experiment

## Endpoint

```
/i/ab-testing/reset-experiment
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Reset an experiment to draft status. Removes user variant assignments, resets cohort data, and clears stored results.

## Authentication

**Authentication Methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- Delete (ab_testing feature)

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication |
| `auth_token` | String | Yes (or use `api_key`) | Auth token for authentication |
| `app_id` | String | Yes | Application identifier |
| `experiment_id` | String | Yes | Experiment ObjectId to reset |

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

## Behavior/Processing

- Removes experiment assignments from `countly.app_users{appId}`.
- Rebuilds cohort data for experiment variants.
- Sets experiment status to `drafts` and clears results timestamps.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Updates experiment status and clears results. |
| `countly.app_users{appId}` | Related: | Removes experiment assignments. |
| `countly.cohorts` | Related: | Rebuilds cohort data for variants. |

## Examples

### Example 1: Reset an Experiment

**Request**:
```bash
curl "https://your-server.com/i/ab-testing/reset-experiment" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "experiment_id=5f9c8a3b4d1e2a001f3b4567"
```

## Related Endpoints

- [Start Experiment](start.md)
- [Stop Experiment](stop.md)
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
