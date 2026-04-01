---
sidebar_label: "Create Experiment"
keywords:
  - "/i/ab-testing/add-experiment"
  - "add-experiment"
  - "ab-testing"
---

# Create Experiment

## Endpoint

```
/i/ab-testing/add-experiment
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Create a new AB testing experiment in `drafts` status. Drafts can be updated until the experiment is started.

## Authentication

**Authentication Methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- Create (ab_testing feature)

## Request Parameters

**Content-Type**: `application/x-www-form-urlencoded`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication |
| `auth_token` | String | Yes (or use `api_key`) | Auth token for authentication |
| `app_id` | String | Yes | Application identifier |
| `experiment` | String (JSON) | Yes | JSON-stringified object describing the experiment |

### `experiment` Object

- `name` (String, required): Experiment name.
- `description` (String, optional): Experiment description.
- `variants` (Array, required): Two or more variants. Each variant includes:
  - `name` (String): Variant name.
  - `parameters` (Array): Parameter objects with `name`, `value`, `description`.
- `target_users` (Object, required):
  - `percentage` (String): 0-100 percentage of users to include.
  - `condition` (Object or JSON String): Drill filter for segmentation.
- `goals` (Array, required): Each goal includes:
  - `steps` (Array or JSON String): Event sequence to track.
  - `user_segmentation` (Object or JSON String): Additional goal filter.
- `improvement` (Boolean, optional): Enable improvement tracking.
- `improvementRate` (Number, optional): 0-100 baseline improvement percentage.
- `days` (Number, optional): 1-3650 duration in days.

## Response

### Success Response

```json
"5f9c8a3b4d1e2a001f3b4567"
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `(root value)` | String | Created experiment ID |

### Error Responses

- **HTTP 400** - Invalid parameters:
```json
{
  "result": "Invalid parameter: improvementRate"
}
```
- **HTTP 400** - Invalid parameters:
```json
{
  "result": "Invalid parameter: days"
}
```
- **HTTP 400** - Incomplete request:
```json
{
  "result": "Incomplete request"
}
```
- **HTTP 400** - Invalid goals:
```json
{
  "result": "Invalid data: goals"
}
```
- **HTTP 500** - Parameter name conflict:
```json
{
  "result": "The parameter has been added to drafts or running experiments."
}
```
- **HTTP 500** - Variant validation failed:
```json
{
  "result": "Invalid variant: missing name"
}
```
- **HTTP 500** - Referenced remote-config parameter does not exist:
```json
{
  "result": "The parameter does not exists"
}
```
- **HTTP 500** - Experiment limit reached (max 100):
```json
{
  "result": "Experiment limit reached"
}
```
- **HTTP 500** - Creation failed:
```json
{
  "result": "Failed to add experiment"
}
```

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Stores experiment configurations, variants, targets, goals, and status. |

## Behavior/Processing

- Validates experiment payload (limits, goals, variant schema, and parameter existence).
- Inserts experiment as `drafts` and returns created experiment ID.

## Examples

### Example 1: Create Button Color Test Experiment

**Request**:
```bash
curl "https://your-server.com/i/ab-testing/add-experiment" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d 'experiment={"name":"Button Color Test","description":"Testing CTA button colors for conversion optimization","variants":[{"name":"Control","parameters":[{"name":"button_color","value":"blue","description":"Original blue button"}]},{"name":"Red Button","parameters":[{"name":"button_color","value":"red","description":"Test red button variant"}]}],"target_users":{"percentage":"50","condition":"{}"},"goals":[{"steps":[{"type":"did","event":"click_button"}],"user_segmentation":"{}"}],"improvement":true,"improvementRate":10,"days":30}'
```

**Response**:
```json
"5f9c8a3b4d1e2a001f3b4567"
```

### Example 2: Create Pricing Page Test with Segmentation

**Request**:
```bash
curl "https://your-server.com/i/ab-testing/add-experiment" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d 'experiment={"name":"Pricing Page Layout","description":"Testing different pricing page layouts","variants":[{"name":"Current Layout","parameters":[{"name":"layout_type","value":"standard","description":""}]},{"name":"Simplified Layout","parameters":[{"name":"layout_type","value":"minimal","description":""}]}],"target_users":{"percentage":"100","condition":"{\"query\":{\"up.country\":{\"$in\":[\"US\",\"CA\"]}}}"},"goals":[{"steps":[{"type":"did","event":"purchase"}],"user_segmentation":"{}"}],"days":60}'
```

**Response**:
```json
"5f9c8a3b4d1e2a001f3b4568"
```

## Limitations

- Minimum 2 variants, maximum 8 variants.
- Variant parameter count must be the same across all variants.
- Maximum 8 parameters per variant.
- Maximum 3 goals per experiment.

## Related Endpoints

- [Update Experiment](update.md)
- [Start Experiment](start.md)
- [Remove Experiment](remove.md)
- [List All Experiments](read.md)

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
