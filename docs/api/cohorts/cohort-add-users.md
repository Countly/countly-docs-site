---
sidebar_label: "Add Members"
---

# Add Users to Cohort

## Endpoint

`/i/cohorts/add_users`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Adds users to a manual cohort (profile group) using four flexible input methods: Drill query, direct UID array, file upload, or inline text. Supports bulk operations with asynchronous processing for large imports. Used for building and maintaining static user groups for targeted engagement and segmentation.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Update` on the `profile groups` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| cohort | String | Yes | ID of the target manual cohort (profile group) |
| query | Object (JSON) | One of: query, uids, import_file, or text | Drill query to target users matching criteria (e.g., `{"country": "US"}`) |
| uids | Array (JSON) | One of: query, uids, import_file, or text | JSON array of user UIDs to add: `["uid1", "uid2", "uid3"]` |
| import_file | File | One of: query, uids, import_file, or text | File upload (JSON, CSV, or TXT) containing user IDs |
| text | String | One of: query, uids, import_file, or text | Line-separated text with device IDs or UIDs |

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| result | String | Long-task output status (`Success` or `Failed`) |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{"result": "Cohort id is missing"}` | Missing cohort parameter |
| 400 | `{"result": "App id is missing"}` | Missing app_id parameter |
| 400 | `{"result": "There is no data passed to process"}` | No query, uids, import_file, or text provided |
| 400 | `{"result": "Data base failure..."}` | Database error during import initialization |
| 400 | `{"result": "Insufficient permissions"}` | User lacks Update permission on profile groups |
| 400 | `{"result": "Failed"}` | Long-task output on processing failure |

---

## Behavior/Processing

Adds one or more users to a manual cohort using one of four input methods:

### Input Methods

1. **Drill Query** (`query` parameter)
   - Pass a Drill query object to target users matching specific criteria
   - Example: `{"country": "US", "subscription": "premium"}`
   - Converted internally to MongoDB query format

2. **Direct UID Array** (`uids` parameter)
   - Pass JSON array of user IDs to add directly
   - Converted to query: `{"uid": {"$in": [uid1, uid2, ...]}}`
   - Example: `["user123", "user456"]`

3. **File Import** (`import_file` parameter)
   - Upload file containing user IDs
   - Supported formats:
     - **JSON**: File containing `{"uids": [...]}` or `{"dids": [...]}`
     - **CSV/TXT**: Line-separated device IDs or UIDs
   - Processed asynchronously as long-task

4. **Direct Text** (`text` parameter)
   - Pass line-separated device IDs or UIDs directly
   - Equivalent to file import but inline
   - Processed asynchronously as long-task

### Processing Flow

- Validates Update permission for `profile groups` feature
- Creates import record in `profile_groups_imports` collection with status `running`
- Processes asynchronously (long-task):
  - For each matched user:
    - Resolves user ID or creates new user if not exists
    - Adds cohort membership record to `countly.cohortUsers` collection
    - Updates app_user document with cohort reference in `chr.{cohort_id}` field
- Updates import record with final status (finished/failed) and counts
- Writes systemlogs entry for audit trail

### User Resolution

- `query`: used directly to match target users.
- `uids`: converted to `{"uid":{"$in":[...]}}`.
- `import_file` / `text`:
  - JSON with `uids` or `dids` is parsed and converted to query.
  - Plain line-based content is treated as device IDs (`did` list).

### Impact on Other Data

- Creates and updates import progress rows in `countly.profile_groups_imports`.
- Updates membership state via cohort processing (not only endpoint output), including:
  - cohort membership storage (`countly.cohortUsers`)
  - cohort hash fields in user profiles (`countly.app_users{app_id}` under `chr.<cohort_id>`)
- Writes audit/system log entries for add success/failure.

## Examples

### Example 1: Add users by UID array

**Request**:
```bash
curl -X GET "https://your-server.com/i/cohorts/add_users" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "cohort=COHORT_ID" \
  -d 'uids=["user_123","user_456","user_789"]'
```

### Example 2: Add users using Drill query

**Request**:
```bash
curl -X GET "https://your-server.com/i/cohorts/add_users" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "cohort=COHORT_ID" \
  -d 'query={"country": "US", "subscription": "premium"}'
```

### Example 3: Add users from file upload (JSON format)

**Request**:
```bash
curl -X POST "https://your-server.com/i/cohorts/add_users" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "cohort=COHORT_ID" \
  -F "import_file=@users.json"
```

**File contents (users.json)**:
```json
{
  "uids": ["user_123", "user_456", "user_789"]
}
```

### Example 4: Add users from text (line-separated IDs)

**Request**:
```bash
curl -X GET "https://your-server.com/i/cohorts/add_users" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "cohort=COHORT_ID" \
  -d "text=device_id_1\ndevice_id_2\ndevice_id_3"
```

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Collection: | Updates member count incrementally as users are added |
| `countly.cohortUsers` | Collection: | Records individual user membership in cohort; One document per user-cohort relationship |
| `countly.profile_groups_imports` | Collection: | Tracks asynchronous import tasks; Records status, matched count, and processing details |
| `countly.app_users{app_id}` | Collection: | Creates or updates user records |
| `chr` | Adds cohort reference in | object for membership tracking |

---

## Related Endpoints

- [Remove users from cohort](cohort-remove-users.md) - POST /i/cohorts/remove_users
- [Create cohort](cohort-create.md) - POST /i/cohorts/add
- [Get cohort](cohort-single-read.md) - GET /o?method=get_cohort

---

## Limitations

- Intended for manual cohorts (profile groups) workflows.
- Import processing is asynchronous and handled as a long-task.
- Requests must include one of `query`, `uids`, `import_file`, or `text`.

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
