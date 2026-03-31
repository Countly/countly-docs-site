---
sidebar_label: "Cleanup"
---

# Clean Up Unused Cohort Data

## Endpoint

`/i/cohorts/cleanup`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Removes orphaned or unreferenced cohort data from the system. Performs maintenance on cohort metadata, user membership records, and aggregated data. Helps maintain database efficiency and removes traces of deleted cohorts.

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
{"result": "Started rechecking 1 apps"}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| result | String | Async start message with app count |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{"result": "Insufficient permissions"}` | User lacks Delete permission |

---

## Behavior/Processing

- Validates admin or manager authorization.
- Starts asynchronous cleanup per matched app:
  - `cleanupConditionalHashes`
  - `cleanupData`
- Immediate response is start message; detailed cleanup runs in background.

### Cleanup Scope

Operates only on specified `app_id`:
- Does not affect other applications
- Can be run multiple times safely

---

## Examples

### Example 1: Clean up orphaned cohort data

**Request**:
```bash
curl -X POST "https://your-server.com/i/cohorts/cleanup" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID"
```

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohortUsers` | Collection: | Removes orphaned membership records |
| `countly.cohortdata` | Collection: | Removes data for non-existent cohorts |
| `countly.cohort_groups` | Collection: | Removes empty group definitions |

---

## Limitations

- Cleanup runs asynchronously in background after initial response.
- Scope is app-specific when `app_id` is provided.

---

## Database Collections

- `countly.cohorts` - Loads cohort definitions for cleanup logic
- `countly.cohortUsers` - Cleans up cohort membership records

## Related Endpoints

- [Reset real-time data](cohort-reset-realtime.md) - POST /i/cohorts/resetRealTimeData

---

## Use Cases

1. **Maintenance routine**: Regular cleanup after deleting many cohorts
2. **Performance optimization**: Speed up queries by removing orphaned data
3. **Cache refresh**: Clear stale cache after system issues
4. **Data integrity**: Fix inconsistencies in cohort-user relationships
5. **Storage management**: Reduce database size by removing unused data


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
