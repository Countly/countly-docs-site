---
sidebar_label: "Fetch Available Variants"
keywords:
  - "/o/sdk"
  - "sdk"
---

# Fetch Available Variants

## Endpoint

```
/o/sdk?method=ab_fetch_variants
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Fetch available variant names and values for active experiments (documents with `status` missing or `status="running"`), optionally filtered by parameter keys.

## Authentication

**Authentication Methods**:
- App Key (parameter): `app_key=YOUR_APP_KEY`


## Permissions

- No additional permissions required

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `app_key` | String | Yes | Application key |
| `device_id` | String | Yes | Device identifier used by the SDK request context; required by the live handler. |
| `keys` | String | No | JSON array of parameter names to filter by (empty array returns all) |

## Response

### Success Response

```json
{
  "button_text": [
    {
      "name": "Control group",
      "value": "q"
    },
    {
      "name": "Variant A",
      "value": "w"
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `*` | Object | Parameter name to variants array mapping |
| `*.name` | String | Variant name |
| `*.value` | Any | Parameter value for that variant |

### Error Responses

- Query error payload:
```json
{
  "result": "Error while fetching ab-testing variants."
}
```

## Behavior/Processing

- Validates authentication, permissions, and request payloads before processing.
- Executes the endpoint-specific operation described in this document and returns the response shape listed above.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Experiment definitions and variants. |

## Examples

### Example 1: Fetch Variants for All Parameters

**Request**:
```bash
curl "https://your-server.com/o/sdk?method=ab_fetch_variants" \
  -d "app_key=YOUR_APP_KEY" \
  -d "device_id=DEVICE_ID"
```

### Example 2: Fetch Variants for Specific Parameters

**Request**:
```bash
curl "https://your-server.com/o/sdk?method=ab_fetch_variants" \
  -d "app_key=YOUR_APP_KEY" \
  -d "device_id=DEVICE_ID" \
  -d 'keys=["button_text","header_text"]'
```

## Limitations

- The live handler requires `device_id` even though this endpoint is read-only.
- `keys` must be a valid JSON array string.
- This endpoint uses the first parameter in the first variant as the grouping key for each experiment.

## Related Endpoints

- [Fetch Active Experiments](fetch-experiments.md)
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

2026-04-08
