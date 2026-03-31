---
sidebar_label: "Reset Real-time"
---

# Reset Real-time Cohort Data

## Endpoint

`/i/cohorts/resetRealTimeData`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Clears accumulated real-time data and resets real-time tracking state for all cohorts in an application. Used when disabling real-time mode or cleaning up after system issues. Allows transition from real-time to batch processing mode.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Update` on the `cohorts` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |

## Response

### Success Response

```json
{"result": "Success"}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| result | String | Status message |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{"result": "Insufficient permissions"}` | User lacks Update permission |
| 400 | `{"result": "<error>"}` | Error returned by resetRealTimeData callback |

---

## Behavior/Processing

- Calls `cohorts.resetRealTimeData({force:true, app_id})`.
- Returns `{"result":"Success"}` when callback has no error.

### When to Use

- **Configuration change**: When switching `realtime_cohorts` from `true` to `false`
- **System recovery**: After system crashes or data corruption
- **Performance issue**: When real-time processing gets stuck
- **Data maintenance**: When accumulated real-time data becomes inconsistent

---

## Examples

### Example 1: Reset real-time cohort data

**Request**:
```bash
curl -X POST "https://your-server.com/i/cohorts/resetRealTimeData" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID"
```

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Collection: | Resets state fields for all cohorts |
| `countly.cohortdata` | Collection: | Optionally clears calculation cache |

---

## Limitations

- Requires admin/manager permissions
- Affects all cohorts in the app (not selective)
- Real-time data is lost after reset (cannot be recovered)
- Cohorts will be recalculated on next cycle (may take time)

---

## Database Collections

- `countly.cohortUsers` - Stores real-time cohort membership data
- `countly.cohorts` - Stores cohort state for real-time recalculation
- `countly.apps` - Enumerates apps for cleanup
- `countly_drill.cohort_meta` - Clears cohort metadata in drill database

## Related Endpoints

- [Recalculate cohort](cohort-recalculate.md) - POST /i/cohorts/recalculate
- [Clean up data](cohort-cleanup.md) - POST /i/cohorts/cleanup

---

## Use Cases

1. **Mode transition**: Reset before changing `realtime_cohorts` configuration
2. **Error recovery**: Clear stuck state after real-time processor errors
3. **Fresh start**: Reset after major system maintenance or upgrades
4. **Configuration sync**: Ensure all cohorts consistent after config changes
5. **Performance tuning**: Reset accumulated data before optimization cycle


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
