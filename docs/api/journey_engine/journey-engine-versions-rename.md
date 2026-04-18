---
sidebar_label: "Rename"
keywords:
  - "/i/journey-engine/versions/rename"
  - "POST /i/journey-engine/versions/rename"
  - "rename"
  - "journey-engine"
  - "versions"
---

# Journey Engine - Versions Rename

## Endpoint

```
/i/journey-engine/versions/rename
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Rename a journey version.

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
- `name` (required): New name

## Response

### Success Response

```json
{
  "id": "67164f4a1f1bd90d6354430b",
  "name": "v1 (Updated)"
}
```


### Response Fields

| Field | Type | Description |
|---|---|---|
| `id` | String | Renamed version ID from the request. |
| `name` | String | New version name from the request. |

### Error Responses

- **500**: Rename error

## Examples

```json
POST /i/journey-engine/versions/rename
Content-Type: application/json

{
  "id": "67164f4a1f1bd90d6354430b",
  "name": "v1 (Updated)"
}
```

## Behavior/Processing

- Parses request body fields `id` and `name`.
- Updates `journey_versions.name` for the requested version ID.
- Returns the requested ID/name pair after the update call completes.

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
