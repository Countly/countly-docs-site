---
sidebar_label: "Reset Experiment"
keywords:
  - "/i/ab-testing/reset-experiment"
  - "reset-experiment"
  - "ab-testing"
last_update:
  date: "2026-02-16"
---

# Reset Experiment

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/ab-testing/reset-experiment
```

## Overview

Reset an experiment to draft status. Removes user variant assignments, resets cohort data, and clears stored results.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Delete (ab_testing feature)

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication |
| `auth_token` | String | Yes (or use `api_key`) | Auth token for authentication |
| `app_id` | String | Yes | Application identifier |
| `experiment_id` | String | Yes | Experiment ObjectId to reset |

## Examples

### Example 1: Reset an Experiment

**Request**:
```bash
curl "https://your-server.com/i/ab-testing/reset-experiment" \
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

## Behavior

- Removes experiment assignments from `countly.app_users{appId}`.
- Rebuilds cohort data for experiment variants.
- Sets experiment status to `drafts` and clears results timestamps.

## Related Endpoints

- [Start Experiment](start.md)
- [Stop Experiment](stop.md)
- [Remove Experiment](remove.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Updates experiment status and clears results. |
| `countly.app_users{appId}` | Related: | Removes experiment assignments. |
| `countly.cohorts` | Related: | Rebuilds cohort data for variants. |

</details>
