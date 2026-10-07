---
sidebar_label: "Check Bayesian Models"
keywords:
  - "/o/ab-testing/check-models"
  - "check-models"
  - "ab-testing"
last_update:
  date: "2026-02-16"
---

# Check Bayesian Models

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/o/ab-testing/check-models
```

## Overview

Checks whether the AB testing model directory contains 7 `.stan` model files.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- No feature permission required (authenticated user)

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication |
| `auth_token` | String | Yes (or use `api_key`) | Auth token for authentication |

## Examples

### Example 1: Check Bayesian Models

**Request**:
```bash
curl "https://your-server.com/o/ab-testing/check-models?api_key=YOUR_API_KEY"
```

## Response

### Success Response
```json
{
  "result": "Success"
}
```

### Not Built Response
```json
{
  "result": "Not Built"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `result` | String | Check outcome: `Success`, `Not Built`, or `Error` |

### Error Responses
```json
{
  "result": "Error"
}
```

## Behavior

- Validates authenticated user access.
- Checks the local AB testing model directory and counts `.stan` files.
- Returns `{"result":"Success"}` when exactly 7 model files are present, otherwise `{"result":"Not Built"}`.

## Related Endpoints

- [Get Experiment Details](experiment-detail.md)
- [List All Experiments](read.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

- This endpoint does not read or write database collections.

</details>
