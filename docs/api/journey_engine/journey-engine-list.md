---
sidebar_label: "Journey List"
---

# Journey Engine - List

## Endpoint

```
/o/journey-engine/list
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

List all journey definitions for an app, including versions and instance counts.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the `journey_engine` feature

## Request Parameters

- `app_id` (required): Application ID
- `withDeletedJourneys` (optional): When true, returns `{active, deleted}` lists

## Response

### Success Response

```json
[
  {
    "_id": "67164f4a1f1bd90d6354430a",
    "name": "Onboarding Journey",
    "appId": "64afe321d5f9b2f77cb2c8ed",
    "status": "draft",
    "created": 1727101524294,
    "createdBy": "John Admin",
    "usersEntered": 1200,
    "flowsCompleted": 450,
    "versions": [
      {"_id": "67164f4a1f1bd90d6354430b", "version": 1, "created": 1727101524294}
    ]
  }
]
```

When `withDeletedJourneys=true`, the response is an object:

```json
{
  "active": [
    {
      "_id": "67164f4a1f1bd90d6354430a",
      "name": "Onboarding Journey"
    }
  ],
  "deleted": [
    {
      "_id": "67164f4a1f1bd90d6354431f",
      "name": "Old Journey"
    }
  ]
}
```


### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | Object or Array | Response payload returned by this endpoint. |
### Error Responses

- **500**: Query error

## Examples

### List active journeys
```
GET /o/journey-engine/list?app_id=64afe321d5f9b2f77cb2c8ed
```

### Include deleted journeys
```
GET /o/journey-engine/list?app_id=64afe321d5f9b2f77cb2c8ed&withDeletedJourneys=true
```

## Behavior/Processing

Counts are stored in `journey_definition` documents and not aggregated at query time for performance reasons.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_definition` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.journey_versions` | Endpoint data source | Stores endpoint-related records this endpoint reads or modifies. |
| `countly.members` | Member/account enrichment | Stores member profile fields (for example names/IDs) used to resolve actor metadata. |

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

2026-02-16
