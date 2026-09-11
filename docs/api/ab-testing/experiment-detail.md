---
sidebar_label: "Get Experiment Details"
keywords:
  - "/o/ab-testing/experiment-detail"
  - "experiment-detail"
  - "ab-testing"
last_update:
  date: "2026-02-16"
---

# Get Experiment Details

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/ab-testing/experiment-detail
```

## Overview

Retrieve detailed results for a single experiment, including statistical analysis, winner determination, and performance metrics.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Read (ab_testing feature)

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication |
| `auth_token` | String | Yes (or use `api_key`) | Auth token for authentication |
| `app_id` | String | Yes | Application identifier |
| `experiment_id` | String | Yes | Experiment ObjectId |

## Examples

### Example 1: Fetch Experiment Details

**Request**:
```bash
curl "https://your-server.com/o/ab-testing/experiment-detail?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&experiment_id=EXPERIMENT_ID"
```

## Response

### Success Response

```json
{
  "_id": "5d4472152de8f07336f3b352",
  "name": "My test experiment",
  "target_users": {
    "percentage": "11",
    "condition": "{}"
  },
  "goals": [
    {
      "user_segmentation": "{\"query\":{\"custom.Facebook Login\":{\"$in\":[\"false\"]}},\"queryText\":\"Facebook Login = false\"}"
    }
  ],
  "variants": [
    {
      "name": "Control group",
      "parameters": [
        {
          "name": "button_text",
          "value": "q",
          "description": ""
        }
      ],
      "cohorts": {
        "0": "848bfe0549f0f380c38997ddefc7b8ad"
      }
    },
    {
      "name": "Variant A",
      "parameters": [
        {
          "name": "button_text",
          "value": "w",
          "description": ""
        }
      ],
      "cohorts": {
        "0": "120f0bf72d9cec66c8d928e8472daa6f"
      }
    }
  ],
  "type": "remote-config",
  "status": "completed",
  "created_at": 1561310891903,
  "id": 2,
  "started_at": 1561310891903,
  "results": "{\"total_users\":0,\"improvement_data\":[{\"0\":[],\"index\":0,\"label\":\"Control group\",\"total_variant_users\":0},{\"0\":[],\"index\":1,\"label\":\"Variant A\",\"total_variant_users\":0}],\"performance_data\":{\"0\":[]},\"winner\":{\"winner\":null,\"variant_index\":null,\"winner_status\":\"winner_not_found\"}}",
  "completed_at": 1564769133960,
  "defaults": {
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
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `_id` | String | Experiment ObjectId |
| `name` | String | Experiment name |
| `status` | String | Experiment status (`drafts`, `running`, `completed`) |
| `results` | String (JSON) | Serialized results payload |
| `defaults.performance_metrics` | Array | Available performance metrics |

### Error Responses

If the experiment is not found, the response is an empty object:

```json
{}
```

## Behavior

- Fetches experiment by `experiment_id`.
- Removes `size` and `position` fields from response.
- Adds `defaults.performance_metrics`.
- For running experiments, computes live results before responding.
- Returns `{}` when the experiment does not exist.

## Related Endpoints

- [Get Specific Experiments](experiment-read.md)
- [List All Experiments](read.md)
- [Check Bayesian Models](check-models.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Stores experiment definitions and results. |

</details>
