---
sidebar_label: "Remove Experiment"
---

# Remove Experiment

## Endpoint

```
/i/ab-testing/remove-experiment
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Delete an experiment and its associated data, including variant cohorts.

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
| `experiment_id` | String | Yes | Experiment ObjectId to remove |

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

- **HTTP 400** - Missing app_id:
```json
{
  "result": "Missing app_id"
}
```
- **HTTP 400** - Missing experiment_id:
```json
{
  "result": "Missing experiment_id"
}
```
- **HTTP 500** - Experiment doesn't exist:
```json
{
  "result": "The experiment does not exist."
}
```
- **HTTP 500** - Failed to remove:
```json
{
  "result": "Failed to remove experiment"
}
```

## Behavior/Processing

- Deletes the experiment document from `countly_out.ab_testing_experiments{appId}`.
- Deletes cohorts created for variants and removes cohort data.
- Attempts to remove experiment assignments from `countly.app_users{appId}`.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Removes experiment document. |
| `countly.cohorts` | Related: | Deletes all cohorts associated with experiment variants. |
| `countly.cohortdata` | Related: | Removes cohort membership data. |
| `countly.app_users{appId}` | Related: | Removes experiment assignments from user documents. |

## Examples

### Example 1: Remove an Experiment

**Request**:
```bash
curl "https://your-server.com/i/ab-testing/remove-experiment" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "experiment_id=5f9c8a3b4d1e2a001f3b4567"
```

## Related Endpoints

- [Start Experiment](start.md)
- [Stop Experiment](stop.md)
- [Reset Experiment](reset.md)

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
