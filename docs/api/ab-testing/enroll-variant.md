---
sidebar_label: "Enroll User in Variant"
keywords:
  - "/i/sdk"
  - "sdk"
---

# Enroll User in Variant

## Endpoint

```
/i/sdk?method=ab_enroll_variant
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Manually enroll a user into a specific variant for the experiment that contains the given parameter key. This overrides percentage-based assignment for that user and experiment.

## Authentication

**Authentication Methods**:
- App Key (parameter): `app_key=YOUR_APP_KEY`


## Permissions

- No additional permissions required

## Request Parameters

**Content-Type**: `application/x-www-form-urlencoded`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `app_key` | String | Yes | Application key |
| `device_id` | String | Yes | Device ID for the target user |
| `key` | String | Yes | Experiment parameter key to locate the experiment |
| `variant` | String | Yes | Variant name to enroll the user into |

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

- Missing key:
```json
{
  "result": "Invalid request, key is missing"
}
```
- Variant not found:
```json
{
  "result": "Variant not found"
}
```

## Examples

### Example 1: Enroll User into Variant

**Request**:
```bash
curl "https://your-server.com/i/sdk?method=ab_enroll_variant" \
  -d "app_key=YOUR_APP_KEY" \
  -d "device_id=DEVICE_ID" \
  -d "key=button_color" \
  -d "variant=Red Button"
```

**Response**:
```json
{
  "result": "Success"
}
```

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{appId}` | Primary: | Updates the `ab` field for the enrolled user. |

## Related Endpoints

- [Opt Out from Experiments](opt-out.md)
- [Fetch Available Variants](fetch-variants.md)
- [Fetch Active Experiments](fetch-experiments.md)

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
