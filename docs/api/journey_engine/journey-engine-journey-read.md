---
sidebar_label: "Journey Read"
---

# Journey Engine - Journey Read

## Endpoint

```
/o/journey-engine/journey
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Retrieve one journey definition by ID, including version graph data and computed journey counters.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | API key authentication method. |
| `auth_token` | String | Yes (or use `api_key`) | Auth token authentication method. |
| `app_id` | String | Yes | Application ID used to scope the journey definition query. |
| `id` | String | Yes | Journey definition ID. Must be a valid MongoDB ObjectID string. |

## Response

### Success Response

```json
{
  "_id": "67164f4a1f1bd90d6354430a",
  "name": "Onboarding Journey",
  "appId": "64afe321d5f9b2f77cb2c8ed",
  "status": "draft",
  "created": 1727101524294,
  "updated": 1727101525000,
  "createdBy": "John Admin",
  "appKey": "app_key_123",
  "usersEntered": 1200,
  "flowsCompleted": 450,
  "versions": [
    {
      "_id": "67164f4a1f1bd90d6354430b",
      "version": 1,
      "created": 1727101524294,
      "status": "draft",
      "skip_threshold": 5,
      "blocks": [
        {
          "id": "block_1",
          "subType": "incoming-data"
        }
      ]
    }
  ]
}
```


### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Journey definition ID. |
| `name` | String | Journey name. |
| `appId` | String | App ID associated with the journey. |
| `status` | String | Journey definition status (deleted definitions are filtered out). |
| `created` | Number | Definition creation timestamp (ms). |
| `updated` | Number | Definition update timestamp (ms). |
| `createdBy` | String | Creator full name resolved from `countly.members`. |
| `appKey` | String | App key resolved from `countly.apps`. |
| `usersEntered` | Number | Computed count of journey instances for this journey definition. |
| `flowsCompleted` | Number | Computed count of completed journey instances for this journey definition. |
| `versions` | Array | Journey versions for this definition, excluding deleted versions. |
| `versions._id` | String | Journey version ID. |
| `versions.version` | Number | Version number. |
| `versions.created` | Number | Version creation timestamp (ms). |
| `versions.status` | String | Version status. |
| `versions.blocks` | Array | Journey block graph for this version. |
| `versions.skip_threshold` | Number or Null | Version skip threshold configuration. |

### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "result": "Journey definition ID is required"
}
```

**Status Code**: `400 Bad Request`
```json
{
  "result": "Application ID is required"
}
```

**Status Code**: `404 Not Found`
```json
{
  "result": "Journey definition not found"
}
```

**Status Code**: `500 Internal Server Error`
```json
{
  "result": "Failed to get journey definition"
}
```

## Behavior/Processing

1. Validates read permission.
2. Requires both `id` and `app_id`; missing values return `400`.
3. Loads journey definition from `countly.journey_definition`, excluding soft-deleted definitions (`status != deleted`).
4. Joins non-deleted versions from `countly.journey_versions`.
5. Orders versions with active first, then draft, then others; then newest first within each group.
6. Resolves `createdBy` and `appKey` via lookups to `countly.members` and `countly.apps`.
7. Recomputes `usersEntered` and `flowsCompleted` from `countly.journey_instances` counts before returning.

## Examples

### Example 1: Read Journey Definition

```plaintext
/o/journey-engine/journey?app_id=64afe321d5f9b2f77cb2c8ed&id=67164f4a1f1bd90d6354430a
```

```json
{
  "_id": "67164f4a1f1bd90d6354430a",
  "name": "Onboarding Journey",
  "status": "draft",
  "usersEntered": 1200,
  "flowsCompleted": 450,
  "versions": [
    {
      "_id": "67164f4a1f1bd90d6354430b",
      "version": 1,
      "status": "active"
    }
  ]
}
```

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_definition` | Base journey definition lookup by app and definition ID, excluding deleted definitions. | `_id`, `appId`, `status`, `name`, `created`, `updated` |
| `countly.journey_versions` | Version graph joined into `versions` array, excluding deleted versions. | `journeyDefinitionId`, `status`, `version`, `blocks`, `skip_threshold`, `created` |
| `countly.members` | Resolves creator full name for `createdBy`. | `_id`, `full_name` |
| `countly.apps` | Resolves app key for `appKey`. | `_id`, `key` |
| `countly.journey_instances` | Recomputes `usersEntered` and `flowsCompleted` counters at read time. | `journeyDefinitionId`, `status` |

---

## Limitations

- `id` must be a valid MongoDB ObjectID string. Invalid formats can trigger `500 Failed to get journey definition`.
- This endpoint excludes soft-deleted journey definitions and soft-deleted journey versions.
- `usersEntered` and `flowsCompleted` are recomputed from `journey_instances` on each request, so response latency depends on instance collection size.

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
