---
sidebar_label: "Update Experiment"
keywords:
  - "/i/ab-testing/update-experiment"
  - "update-experiment"
  - "ab-testing"
last_update:
  date: "2026-02-16"
---

# Update Experiment

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/ab-testing/update-experiment
```

## Overview

Update experiment configuration while in draft status. Running or completed experiments cannot be updated.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Update (ab_testing feature)

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication |
| `auth_token` | String | Yes (or use `api_key`) | Auth token for authentication |
| `app_id` | String | Yes | Application identifier |
| `experiment_id` | String | Yes | Experiment ObjectId to update |
| `experiment` | String (JSON) | Yes | Updated experiment configuration (same structure as add-experiment) |

## Examples

### Example 1: Update Experiment Name and Description

**Request**:
```bash
curl "https://your-server.com/i/ab-testing/update-experiment" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "experiment_id=5f9c8a3b4d1e2a001f3b4567" \
  -d 'experiment={"name":"Updated Button Test","description":"Updated description","variants":[{"name":"Control","parameters":[{"name":"button_color","value":"blue"}]},{"name":"Variant","parameters":[{"name":"button_color","value":"red"}]}],"target_users":{"percentage":"50","condition":"{}"},"goals":[{"steps":[{"type":"did","event":"click_button"}],"user_segmentation":"{}"}]}'
```

**Response**:
```json
{}
```

## Response

### Success Response
```json
{}
```

### Response Fields

This endpoint returns an empty JSON object on success.

### Error Responses
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
- **HTTP 400** - Invalid variant payload:
```json
{
  "result": "Invalid parameter in variant Control group"
}
```
- **HTTP 400** - Referenced remote-config parameter does not exist:
```json
{
  "result": "The parameter does not exists"
}
```
- **HTTP 400** - Can only update drafts:
```json
{
  "result": "Only experiment with draft status can be updated"
}
```
- **HTTP 400** - Generic update failure:
```json
{
  "result": "Failed to update experiment"
}
```

## Behavior

- Validates experiment structure, variants, and goals.
- Updates experiment document only when status is `drafts`.

## Related Endpoints

- [Start Experiment](start.md)
- [Remove Experiment](remove.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Updates experiment configuration for draft experiments. |

</details>
