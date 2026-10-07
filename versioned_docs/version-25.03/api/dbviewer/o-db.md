---
sidebar_label: "Databases List"
keywords:
  - "/o/db"
  - "db"
last_update:
  date: "2026-03-07"
---

# DB Viewer - Databases List

## Endpoint

```plaintext
/o/db
```

## Overview

Returns the list of databases and collections available to the current user in DB Viewer.

- Global admins get all available MongoDB databases.
- Non-admin users get only collections they can access for their assigned apps.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires DB Viewer access (`dbviewer` read right for app-scoped users).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | No | Restricts output to collections accessible for that app (when user has access). |

## Examples

### List accessible databases

```plaintext
/o/db?api_key=YOUR_API_KEY
```

### List databases scoped to one app

```plaintext
/o/db?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
[
  {
    "name": "countly",
    "collections": {
      "members (Users)": "members",
      "apps (Applications)": "apps",
      "sessions": "sessions",
      "events": "events"
    }
  },
  {
    "name": "countly_drill",
    "collections": {
      "drill_events": "drill_events"
    }
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[]` | Array | List of accessible databases. |
| `[].name` | String | Database name. |
| `[].collections` | Object | Map of pretty collection labels to actual collection names. |

### Error Responses

- `404`

```json
{
  "result": "Database not found."
}
```

Standard authentication and authorization errors from user validation can also be returned.

## Behavior

- When `db`/`dbs`, `collection`, `document`, `aggregation`, and `action=get_indexes` are all omitted, this endpoint runs in database-list mode.
- MongoDB collections `system.indexes` and `sessions_*` are excluded.
- Collection entries are filtered by user access (`dbviewer` rights and app scoping).
- Collection names are transformed into UI-friendly labels in the `collections` object keys.

## Related Endpoints

- [DB Viewer - Collection Read](o-db-collection.md)
- [DB Viewer - Document Read](o-db-document.md)
- [DB Viewer - Indexes Read](o-db-indexes.md)
- [DB Viewer - Aggregation Query](o-db-aggregation.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App lookup for name mapping and app filtering | Reads app IDs and names used to generate readable collection labels and app-scoped filtering. |

</details>
