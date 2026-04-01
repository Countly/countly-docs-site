---
sidebar_label: "Journey Delete"
keywords:
  - "/i/journey-engine/delete"
  - "delete"
  - "journey-engine"
---

# Delete Journey

## Endpoint

```
/i/journey-engine/delete
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Soft-deletes a journey definition and marks its versions as deleted.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Create` on the `journey_engine` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | Application identifier |
| `id` | String | Yes | Journey definition ID |

## Response

### Success Response

```json
{
  "_id": "67164f4a1f1bd90d6354430a",
  "name": "Onboarding Journey",
  "status": "deleted",
  "appId": "64afe321d5f9b2f77cb2c8ed"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Journey definition ID |
| `status` | String | Journey status after soft-delete |
| `name` | String | Journey definition name |
| `appId` | String | Application ID |

### Error Responses

| HTTP Status | Response |
|---|---|
| 500 | `{ "result": "Failed to delete a journey" }` |
| 500 | `{ "result": "Failed to delete an journey" }` |

## Behavior/Processing

1. Reads `id` from query parameters.
2. Updates all related records in `journey_versions` to `deleted`.
3. Updates journey definition status in `journey_definition` to `deleted`.
4. Returns the deleted journey definition document.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_versions` | Endpoint data source | ** - Marks related versions as `deleted` |
| `countly.journey_definition` | Endpoint data source | ** - Marks journey definition as `deleted` |

---

## Examples

```text
https://your-server.com/i/journey-engine/delete?api_key=YOUR_API_KEY&app_id=64afe321d5f9b2f77cb2c8ed&id=67164f4a1f1bd90d6354430a
```

---

## Related Endpoints

- [Journey Engine - List Journeys](journey-engine-list.md)
- [Journey Engine - Read Journey](journey-engine-journey-read.md)

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
