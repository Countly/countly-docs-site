---
sidebar_label: "Get Experiment Details"
---

# Get Experiment Details

## Endpoint

```
/o/ab-testing/experiment-detail
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Retrieve detailed results for a single experiment, including statistical analysis, winner determination, and performance metrics.

## Authentication

**Authentication Methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- Read (ab_testing feature)

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication |
| `auth_token` | String | Yes (or use `api_key`) | Auth token for authentication |
| `app_id` | String | Yes | Application identifier |
| `experiment_id` | String | Yes | Experiment ObjectId |

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

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Stores experiment definitions and results. |

## Behavior/Processing

- Fetches experiment by `experiment_id`.
- Removes `size` and `position` fields from response.
- Adds `defaults.performance_metrics`.
- For running experiments, computes live results before responding.
- Returns `{}` when the experiment does not exist.

## Examples

### Example 1: Fetch Experiment Details

**Request**:
```bash
curl "https://your-server.com/o/ab-testing/experiment-detail?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&experiment_id=EXPERIMENT_ID"
```

## Related Endpoints

- [Get Specific Experiments](experiment-read.md)
- [List All Experiments](read.md)
- [Check Bayesian Models](check-models.md)

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
