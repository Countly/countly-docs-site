---
sidebar_label: "Version Delete"
keywords:
  - "/i/journey-engine/versions/delete"
  - "POST /i/journey-engine/versions/delete"
  - "delete"
  - "journey-engine"
  - "versions"
---

# Journey Engine - Versions Delete

## Endpoint

```
/i/journey-engine/versions/delete
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Delete (soft-delete) a journey version. Active versions or versions with running instances cannot be deleted.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Update` on the `journey_engine` feature

## Request Parameters

Request body JSON:

- `id` (required): Version ID

## Response

### Success Response

```json
{
  "id": "67164f4a1f1bd90d6354430b"
}
```


### Response Fields

| Field | Type | Description |
|---|---|---|
| `id` | String | Deleted version ID from the request. |

### Error Responses

- **400**: Cannot delete active version or version with running instances
- **404**: Version not found
- **500**: Delete error

## Examples

```json
POST /i/journey-engine/versions/delete
Content-Type: application/json

{
  "id": "67164f4a1f1bd90d6354430b"
}
```

## Behavior/Processing

- Loads the target version first and returns `Version not found` if it does not exist.
- Rejects deletion when the version status is `active`.
- Rejects deletion when a running journey instance references the version.
- Soft-deletes by setting the version status to `deleted`.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_versions` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |

## Related Endpoints

- No related endpoints

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
