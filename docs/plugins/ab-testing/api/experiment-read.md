---
sidebar_label: "Get Specific Experiments"
---

# Get Specific Experiments

## Endpoint

```
/o/ab-testing/experiment
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Retrieve multiple experiment definitions by their ObjectIds.

## Authentication

**Authentication Methods**:
- **API Key** (parameter): `api_key=YOUR_API_KEY`
- **Auth Token** (parameter): `auth_token=YOUR_AUTH_TOKEN`
- **Auth Token** (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- Read (ab_testing feature)

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication |
| `auth_token` | String | Yes (or use `api_key`) | Auth token for authentication |
| `app_id` | String | Yes | Application ID |
| `experiments` | String (JSON) | Yes | JSON array of experiment IDs |

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

## Behavior/Processing

- Parses `experiments` as JSON and converts each ID to an ObjectID.
- Fetches experiment documents from `countly_out.ab_testing_experiments{appId}`.
- Returns an empty array if none are found.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

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

## Limitations

- `experiments` must be valid JSON. Invalid JSON returns an empty result.
- Batch experiment IDs to reduce network overhead.

## Related Endpoints

- [List All Experiments](read.md)
- [Get Experiment Details](experiment-detail.md)

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
