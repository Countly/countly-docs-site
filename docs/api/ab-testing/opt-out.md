---
sidebar_label: "Opt Out from Experiments"
keywords:
  - "/i/sdk"
  - "sdk"
---

# Opt Out from Experiments

## Endpoint

```
/i/sdk?method=ab_opt_out
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Opt a user out of specific running experiments or all running experiments. When opting out of specific experiments, the API removes the user from experiments that contain any of the provided parameter keys.

## Authentication

**Authentication Methods**:
- App Key (parameter): `app_key=YOUR_APP_KEY`


## Permissions

- No additional permissions required

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `app_key` | String | Yes | Application key |
| `device_id` | String | Yes | Device identifier for the user |
| `keys` | String | No | JSON array of parameter keys to opt out from specific experiments |

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

- Missing user:
```json
{
  "result": "No uid"
}
```

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{appId}` | Primary: | Stores user experiment assignments. |
| `countly_out.ab_testing_experiments{appId}` | Related: | Used to resolve experiments when filtering by keys. |

## Examples

### Example 1: Opt Out of All Experiments

**Request**:
```bash
curl "https://your-server.com/i/sdk?method=ab_opt_out" \
  -d "app_key=YOUR_APP_KEY" \
  -d "device_id=DEVICE_ID"
```

### Example 2: Opt Out of Specific Parameter Keys

**Request**:
```bash
curl "https://your-server.com/i/sdk?method=ab_opt_out" \
  -d "app_key=YOUR_APP_KEY" \
  -d "device_id=DEVICE_ID" \
  -d 'keys=["button_text","header_text"]'
```

## Related Endpoints

- [Fetch Active Experiments](fetch-experiments.md)
- [Fetch Available Variants](fetch-variants.md)
- [Enroll User in Variant](enroll-variant.md)

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
