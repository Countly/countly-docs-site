---
sidebar_label: "Check Bayesian Models"
keywords:
  - "/o/ab-testing/check-models"
  - "check-models"
  - "ab-testing"
---

# Check Bayesian Models

## Endpoint

```
/o/ab-testing/check-models
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Checks whether the AB testing model directory contains 7 `.stan` model files.

## Authentication

Countly API supports the following authentication methods:

1. **API Key** (parameter): `api_key=YOUR_API_KEY`
2. **Auth Token** (parameter): `auth_token=YOUR_AUTH_TOKEN`
3. **Auth Token** (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- No feature permission required (authenticated user)

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication |
| `auth_token` | String | Yes (or use `api_key`) | Auth token for authentication |

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

## Behavior/Processing

- Validates authenticated user access.
- Checks the local AB testing model directory and counts `.stan` files.
- Returns `{"result":"Success"}` when exactly 7 model files are present, otherwise `{"result":"Not Built"}`.

## Database Collections

- This endpoint does not read or write database collections.

## Examples

### Example 1: Check Bayesian Models

**Request**:
```bash
curl "https://your-server.com/o/ab-testing/check-models?api_key=YOUR_API_KEY"
```

## Related Endpoints

- [Get Experiment Details](experiment-detail.md)
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
