---
sidebar_label: "Create"
keywords:
  - "/i/cohorts/add"
  - "add"
  - "cohorts"
---

# Create New Cohort

## Endpoint

```text
/i/cohorts/add
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Creates a new cohort for the app. Supports:

- Auto cohorts (`type` omitted or `type=auto`) with `steps` and/or `user_segmentation`
- Manual cohorts (`type=manual`) used as profile groups

## Authentication

- API key parameter: `api_key`
- Auth token parameter: `auth_token`
- Auth token header: `countly-token`
## Permissions

- Required permission: `Create` on `cohorts`
- If `type=manual`, required permission is `Create` on `profile groups`

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | Authentication credential |
| `auth_token` | String | Yes (or `api_key`) | Authentication credential |
| `app_id` | String | Yes | App identifier |
| `cohort_name` | String | Yes | Cohort name |
| `cohort_desc` | String | No | Cohort description |
| `type` | String | No | `auto` (default) or `manual` |
| `steps` | Array | No | Step definitions. If sent in query/body text, pass as JSON string |
| `user_segmentation` | Object | No | User segmentation object. If sent in query/body text, pass as JSON string |
| `visibility` | String | No | `global` (default) or `private` |
| `shared_email_edit` | Array | No | Shared edit users. If sent in query/body text, pass as JSON string |

`steps` item requirements (when provided):

- `event` is required
- `type` is required
- `period` is required

## Response

### Success Response

```json
{
  "result": "5f9c8a3b4d1e2a001f3b4567",
  "duplicate": false
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Created cohort ID |
| `duplicate` | Boolean | `true` if equivalent cohort already existed |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| `400` | `{"result":"Not enough args"}` | Required input missing |
| `400` | `{"result":"Invalid visibility"}` | `visibility` is not `global`/`private` |
| `400` | `{"result":"All steps must contain event"}` | Step missing `event` |
| `400` | `{"result":"All steps must contain type"}` | Step missing `type` |
| `400` | `{"result":"All steps must contain period"}` | Step missing `period` |

Notes:

- Auth/permission failures are handled by authentication and permission validation.

## Behavior/Processing

- Parses `steps`, `user_segmentation`, and `shared_email_edit` when passed as JSON strings.
- Defaults `visibility` to `global` when not provided.
- Converts nested `query`/`times` objects inside steps and `user_segmentation` into JSON strings before persistence.
- Generates cohort ID from steps + app id + current time.
- Returns created/existing cohort ID with duplicate flag.
- For non-manual cohorts:
  - with `realtime_cohorts=false`, starts calculation flow
  - with `realtime_cohorts=true`, prepares initial real-time state

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

---

## Examples

### Example 1: Active Users (Last 7 Days)

```text
https://your-server.com/i/cohorts/add
?api_key=API_KEY
&app_id=APP_ID
&cohort_name=Active Users - Last 7 Days
&cohort_desc=Users who opened the app in the last week
&steps=[{"event":"[CLY]_session","type":"did","period":"7days"}]
```

Decoded payload:

```json
{
  "cohort_name": "Active Users - Last 7 Days",
  "cohort_desc": "Users who opened the app in the last week",
  "steps": [
    {
      "event": "[CLY]_session",
      "type": "did",
      "period": "7days"
    }
  ]
}
```

### Example 2: Purchase Drop-offs (Viewed but Not Purchased)

```text
https://your-server.com/i/cohorts/add
?api_key=API_KEY
&app_id=APP_ID
&cohort_name=Purchase Drop-offs
&cohort_desc=Viewed product but did not purchase in 30 days
&steps=[{"event":"Product View","type":"did","period":"30days"},{"event":"Purchase","type":"didnot","period":"30days"}]
```

Decoded payload:

```json
{
  "cohort_name": "Purchase Drop-offs",
  "cohort_desc": "Viewed product but did not purchase in 30 days",
  "steps": [
    {
      "event": "Product View",
      "type": "did",
      "period": "30days"
    },
    {
      "event": "Purchase",
      "type": "didnot",
      "period": "30days"
    }
  ]
}
```

### Example 3: Recently Crashed Users

```text
https://your-server.com/i/cohorts/add
?api_key=API_KEY
&app_id=APP_ID
&cohort_name=Crash Risk - Last 14 Days
&cohort_desc=Users with at least one crash in the last 14 days
&steps=[{"event":"[CLY]_crash","type":"did","period":"14days"}]
```

### Example 4: Premium Users in US (Property-based)

```text
https://your-server.com/i/cohorts/add
?api_key=API_KEY
&app_id=APP_ID
&cohort_name=Premium US Users
&cohort_desc=Paid US users for retention tracking
&user_segmentation={"query":{"up.country":"US","up.plan":"premium"},"queryText":{"country":"US","plan":"premium"}}
```

Decoded payload:

```json
{
  "cohort_name": "Premium US Users",
  "cohort_desc": "Paid US users for retention tracking",
  "user_segmentation": {
    "query": {
      "up.country": "US",
      "up.plan": "premium"
    },
    "queryText": {
      "country": "US",
      "plan": "premium"
    }
  }
}
```

### Example 5: Manual VIP Group (Private + Shared Editors)

```text
https://your-server.com/i/cohorts/add
?api_key=API_KEY
&app_id=APP_ID
&cohort_name=VIP Accounts
&type=manual
&visibility=private
&shared_email_edit=["analyst@company.com","manager@company.com"]
```

## Limitations

- `cohort_name` is required.
- `visibility` supports only `global` and `private`.
- Each provided step must include `event`, `type`, and `period`.
- JSON-string parameters must be valid JSON.
- `type=manual` uses `profile groups` permission model.

## Configuration

Feature config scope: `cohorts`

| Setting | Default | Effect on Create |
|---|---|---|
| `realtime_cohorts` | `true` | For non-manual cohorts, create initializes real-time setup flow (`loadingFirst`) instead of immediate full calculation. |
| `regenerate_interval` | `3600` | Used by periodic regeneration when real-time mode is disabled; affects how frequently created non-manual cohorts are refreshed over time. |

## Performance Considerations

- Complex multi-step cohorts can be expensive to compute initially.
- For non-manual cohorts with `realtime_cohorts=false`, create triggers calculation logic during create flow.
- For non-manual cohorts with `realtime_cohorts=true`, initial setup is lighter at request time, then data is populated through real-time processing.
- Cohorts with broad conditions can produce large matching sets and slower downstream reads.

## Best Practices

- Use clear business names (`Active Users - Last 7 Days`, `Purchase Drop-offs`).
- Keep step logic as simple as possible before adding extra conditions.
- Prefer manual cohorts (`type=manual`) for curated campaign audiences.
- Use `visibility=private` for sensitive/internal cohorts and share edit access explicitly.
- Validate segmentation JSON before sending to avoid parse failures.

---

## Related Endpoints

- [Cohorts - Read List](read.md)
- [Cohorts - Read One](cohort-single-read.md)
- [Cohorts - Update](cohort-edit.md)
- [Cohorts - Delete](cohort-delete.md)
- [Cohorts - Add Users](cohort-add-users.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

---

## Last Updated

2026-02-16
