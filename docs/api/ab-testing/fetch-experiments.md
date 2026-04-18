---
sidebar_label: "Fetch Active Experiments"
keywords:
  - "/o/sdk"
  - "sdk"
---

# Fetch Active Experiments

## Endpoint

```
/o/sdk?method=ab_fetch_experiments
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Fetch active experiments (documents with `status` missing or `status="running"`) with variant parameters. If the request context includes `params.app_user.ab`, the response includes `currentVariant` for matching experiments.

## Authentication

**Authentication Methods**:
- App Key (parameter): `app_key=YOUR_APP_KEY`


## Permissions

- No additional permissions required

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `app_key` | String | Yes | Application key |
| `device_id` | String | No | Device identifier used by SDK context to resolve current user |

## Response

### Success Response

```json
[
  {
    "id": "5d4472152de8f07336f3b352",
    "name": "My test experiment",
    "description": "Experiment description",
    "currentVariant": "Control group",
    "variants": {
      "Control group": {
        "button_text": "q"
      },
      "Variant A": {
        "button_text": "w"
      }
    }
  }
]
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Experiment ObjectId |
| `name` | String | Experiment name |
| `description` | String | Experiment description |
| `currentVariant` | String or null | User's assigned variant name, if available |
| `variants` | Object | Variant name to parameter/value map |

### Error Responses

- Query error payload:
```json
{
  "result": "Error while fetching ab-testing variants."
}
```

## Behavior/Processing

- Handles `/o/sdk?method=ab_fetch_experiments` and reads experiments from `countly_out.ab_testing_experiments{appId}`.
- Includes experiments whose `status` is missing or exactly `running`; draft and completed experiments are not returned.
- Converts each experiment into an SDK-facing object with `id`, `name`, `description`, `currentVariant`, and a `variants` object.
- `variants` is keyed by variant name. Each variant value is an object mapping every parameter name in that variant to its configured value.
- If the SDK request resolved an app user and `params.app_user.ab` contains an assignment for the experiment, `currentVariant` is set from that assigned `variant_index`; otherwise it is `null`.
- On database errors, returns `Error while fetching ab-testing variants.`.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_out.ab_testing_experiments{appId}` | Primary: | Experiment definitions and variants. |
| `params.app_user.ab` | Related request context | Current variant is resolved from SDK user assignments when available. |

## Examples

### Example 1: Fetch Active Experiments

**Request**:
```bash
curl "https://your-server.com/o/sdk?method=ab_fetch_experiments" \
  -d "app_key=YOUR_APP_KEY" \
  -d "device_id=DEVICE_ID"
```

## Related Endpoints

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

2026-04-18
