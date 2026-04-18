---
sidebar_label: "Enroll User in Variant"
keywords:
  - "/i"
  - "ab_enroll_variant"
---

# Enroll User in Variant

## Endpoint

```
/i?method=ab_enroll_variant
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
curl "https://your-server.com/i?method=ab_enroll_variant" \
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

- Dispatches from `/i` to the SDK ingestion handler when `method=ab_enroll_variant`.
- Requires `key`; the handler converts it to `keys=["<key>"]` and fetches running experiments that contain that parameter.
- Looks for a variant whose `name` matches `variant` and whose parameters include the requested `key`.
- If a match is found, removes any existing assignment for that experiment from `app_users{appId}.ab`, then adds `{experiment_id, variant_index}` for the selected variant.
- If no running experiment is found for the key, returns `No experiments found`. If the experiment exists but no matching variant/key pair exists, returns `Variant not found`.
- Variant matching is exact after converting the requested `variant` to a string.

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

2026-04-18
