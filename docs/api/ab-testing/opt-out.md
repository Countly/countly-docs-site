---
sidebar_label: "Opt Out from Experiments"
keywords:
  - "/i"
  - "ab_opt_out"
last_update:
  date: "2026-04-18"
---

# Opt Out from Experiments

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i?method=ab_opt_out
```

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

## Examples

### Example 1: Opt Out of All Experiments

**Request**:
```bash
curl "https://your-server.com/i?method=ab_opt_out" \
  -d "app_key=YOUR_APP_KEY" \
  -d "device_id=DEVICE_ID"
```

### Example 2: Opt Out of Specific Parameter Keys

**Request**:
```bash
curl "https://your-server.com/i?method=ab_opt_out" \
  -d "app_key=YOUR_APP_KEY" \
  -d "device_id=DEVICE_ID" \
  -d 'keys=["button_text","header_text"]'
```

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

## Behavior

- Dispatches from `/i` to the SDK ingestion handler when `method=ab_opt_out`.
- Requires the SDK request context to resolve an app user with `uid`; otherwise returns `No uid`.
- If `keys` is a valid JSON array, fetches running experiments and finds experiments whose variants contain any parameter name from `keys`.
- For matched experiments, removes matching `{experiment_id}` entries from `app_users{appId}.ab`. Duplicate experiment IDs are de-duplicated before updates.
- If `keys` is missing, invalid JSON, or not an array, the endpoint opts the user out of all experiments by unsetting the whole `ab` field.
- Filtering only considers experiments with `status=running`.

## Related Endpoints

- [Fetch Active Experiments](fetch-experiments.md)
- [Fetch Available Variants](fetch-variants.md)
- [Enroll User in Variant](enroll-variant.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.app_users{appId}` | Primary: | Stores user experiment assignments. |
| `countly_out.ab_testing_experiments{appId}` | Related: | Used to resolve experiments when filtering by keys. |

</details>
