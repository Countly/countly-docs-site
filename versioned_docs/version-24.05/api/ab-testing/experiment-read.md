---
sidebar_label: "Get Specific Experiments"
keywords:
  - "/o/ab-testing/experiment"
  - "experiment"
  - "ab-testing"
last_update:
  date: "2026-02-16"
---

# Get Specific Experiments

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/ab-testing/experiment
```

## Overview

Retrieve multiple experiment definitions by their ObjectIds.

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
| `experiments` | String (JSON) | Yes | JSON array of experiment IDs |

## Examples

### Example 1: Read two experiments

**Request**:
```bash
curl "https://your-server.com/o/ab-testing/experiment?app_id=YOUR_APP_ID&experiments=[\"EXPERIMENT_ID_1\",\"EXPERIMENT_ID_2\"]&api_key=YOUR_API_KEY"
```

**Response**:
```json
[
  {
    "_id": "6991caa6024cb89cdc04eff5",
    "name": "Pricing1",
    "status": "running"
  }
]
```

## Response

### Success Response
```json
[
  {
    "_id": "6991caa6024cb89cdc04eff5",
    "name": "Pricing1",
    "description": "TestPricing",
    "target_users": {
      "percentage": 100,
      "condition": "{}"
    },
    "variants": [
      {
        "name": "Control group",
        "parameters": [
          {
            "name": "Pricing1",
            "value": "5000/month"
          }
        ]
      },
      {
        "name": "Variant A",
        "parameters": [
          {
            "name": "Pricing1",
            "value": "10000/month"
          }
        ]
      }
    ],
    "status": "running"
  }
]
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `[]` | Array | Experiment documents matching the requested IDs |
| `[].name` | String | Experiment name |
| `[].variants` | Array | Variant definitions with parameter values |
| `[].status` | String | Experiment status |

### Error Responses

- If parsing `experiments` fails, the handler continues with an empty ID list and returns `[]`.
- If no matching IDs are found, returns `[]`.

## Behavior

- Parses `experiments` as JSON and converts each ID to an ObjectID.
- Fetches experiment documents from `countly_out.ab_testing_experiments{appId}`.
- Returns an empty array if none are found.

## Limitations

- `experiments` must be valid JSON. Invalid JSON returns an empty result.
- Batch experiment IDs to reduce network overhead.

## Related Endpoints

- [List All Experiments](read.md)
- [Get Experiment Details](experiment-detail.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

</details>
