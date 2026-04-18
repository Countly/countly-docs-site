---
sidebar_label: "Journey Save"
keywords:
  - "/i/journey-engine/journeys/save"
  - "POST /i/journey-engine/journeys/save"
  - "save"
  - "journey-engine"
  - "journeys"
---

# Journey Engine - Journeys Save

## Endpoint

```
/i/journey-engine/journeys/save
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Create a new journey definition and its first version, or update an existing journey and version blocks.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Create` on the `journey_engine` feature

## Request Parameters

Request body is JSON:

- `app_id` (required): Application ID
- `name` (required): Journey name (unique per app)
- `version` (required): Version object
  - `blocks` (required): Array of journey blocks
  - `_id` (optional): Version ID for update case
- `_id` (optional): Journey definition ID for update case
- `skip_threshold` (optional): Maximum instances per user for the version (0 or null disables)

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
  "versions": [
    {
      "_id": "67164f4a1f1bd90d6354430b",
      "version": 1,
      "status": "draft",
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
| `_id` | String | Journey definition ID |
| `name` | String | Journey definition name |
| `appId` | String | Application ID |
| `status` | String | Journey definition status |
| `versions` | Array | Journey versions linked to the definition |
| `versions[]._id` | String | Journey version ID |
| `versions[].version` | Number | Version number |
| `versions[].status` | String | Version status |
| `versions[].blocks` | Array | Version block graph |
### Error Responses

- **HTTP 400**
```json
{
  "result": "Invalid request"
}
```
- **HTTP 400**
```json
{
  "result": "Journey definition with the same name already exists"
}
```
- **HTTP 500**
```json
{
  "result": "Failed to create journey definition or version"
}
```
- **HTTP 500**
```json
{
  "result": "Failed to update journey definition or version"
}
```

## Examples

### Create new journey
```json
POST /i/journey-engine/journeys/save
Content-Type: application/json

{
  "app_id": "64afe321d5f9b2f77cb2c8ed",
  "name": "Onboarding Journey",
  "version": {
    "blocks": [
      {
        "id": "block_1",
        "subType": "incoming-data",
        "blockType": "trigger",
        "filters": [
          {"key": "[CLY]_session", "conditions": {"up.av": {"$in": ["1.0"]}}}
        ]
      }
    ]
  }
}
```

### Update journey and version blocks
```json
POST /i/journey-engine/journeys/save
Content-Type: application/json

{
  "_id": "67164f4a1f1bd90d6354430a",
  "app_id": "64afe321d5f9b2f77cb2c8ed",
  "name": "Onboarding Journey",
  "skip_threshold": 3,
  "version": {
    "_id": "67164f4a1f1bd90d6354430b",
    "blocks": [
      {
        "id": "block_1",
        "subType": "incoming-data",
        "blockType": "trigger",
        "filters": [
          {"key": "[CLY]_session", "conditions": {"up.av": {"$in": ["1.1"]}}}
        ]
      }
    ]
  }
}
```

---

## Behavior/Processing

- Requires request body JSON with `name` and `version`.
- Create flow rejects duplicate non-deleted journey names within the same app.
- Create flow inserts a `journey_definition` document with `draft` status, then inserts version `1` named `v1` with `draft` status.
- Update flow requires `_id` and updates only the journey definition name/timestamp plus the selected version blocks.
- Update flow rejects duplicate non-deleted journey names in the same app, excluding the current journey definition.
- `skip_threshold` is normalized for version storage: `0`, `null`, or omitted means no threshold; other values are stored as numbers.
- Emits `journey_created` or `journey_edited` system log actions.
- Returns the enriched journey definition from the same lookup path used by `GET /o/journey-engine/journey`.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_definition` | Journey definition storage | Creates or updates journey definition records (for example name, app association, status, timestamps). |
| `countly.journey_versions` | Journey version graph storage | Creates or updates version documents containing block graph, version metadata, and version status. |
| `countly.members` | Actor attribution | Resolves/records member identity information used in created/updated journey metadata. |

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
