---
sidebar_label: "Entities Read"
keywords:
  - "/o/cleanup/entities"
  - "cleanup"
  - "entities"
last_update:
  date: "2026-10-16"
---

# Cleanup Center - Entities Read

## Endpoint

```plaintext
/o/cleanup/entities
```

## Overview

Returns a page of cohorts, dashboards, funnels and formulas with their usage figures, so that unused ones can be found. Entities of all apps are listed.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `cleanup_center` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Conditional | App id. Required for users who are not global admins. |
| `type` | String | No | Only return one kind of entity: `cohort`, `dashboard`, `funnel` or `formula`. All kinds are returned by default. |
| `q` | String | No | Only return entities whose key or display name contains this text (case-insensitive). |
| `page` | Integer | No | Page number, starting at `1`. Defaults to `1`. |
| `limit` | Integer | No | Entities per page. Values are limited to 1-100; defaults to `25`. |
| `sortBy` | String | No | `lastSeen`, `usage30d`, `createdAt`, `updatedAt` or `name`. Defaults to `lastSeen`. |
| `sortOrder` | String | No | `asc` or `desc`. Defaults to `desc`. |

## Examples

### List the least recently used entities

```plaintext
/o/cleanup/entities?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&sortBy=lastSeen&sortOrder=asc
```

### List funnels matching a text

```plaintext
/o/cleanup/entities?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&type=funnel&q=checkout&limit=10
```

## Response

### Success Response

```json
{
  "entities": [
    {
      "id": "cohort_6991c75b024cb89cdc04efd2_65f1f7b2ad5b9b001f12ab34",
      "type": "cohort",
      "key": "Active buyers",
      "displayName": "Active buyers",
      "status": "live",
      "hidden": false,
      "blocked": false,
      "owner": "65f1f7b2ad5b9b001f12ab00",
      "lastSeen": "2026-09-01T10:00:00.000Z",
      "usage30d": 4,
      "totalViews": 12,
      "createdAt": 1682328445330,
      "updatedAt": 1682328445330,
      "tags": [],
      "userCount": 250,
      "description": null,
      "appId": "6991c75b024cb89cdc04efd2",
      "viewUsers": [],
      "isUnused": false
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 25,
  "sortBy": "lastSeen",
  "sortOrder": "desc"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `entities` | Array | Entities of the requested page. |
| `entities[].id` | String | Entity id, built from the type, app and entity id. |
| `entities[].type` | String | `cohort`, `dashboard`, `funnel` or `formula`. |
| `entities[].key` | String | Entity key or name. |
| `entities[].displayName` | String | Name shown for the entity. |
| `entities[].status` | String | Always `live`. |
| `entities[].hidden` | Boolean | Always `false`. |
| `entities[].blocked` | Boolean | Always `false`. |
| `entities[].owner` | String | Id of the member who owns the entity, or `null`. |
| `entities[].lastSeen` | String | Time of the latest recorded view, or `null`. |
| `entities[].usage30d` | Number | Views in the last 30 days. |
| `entities[].totalViews` | Number | Recorded views. |
| `entities[].createdAt` | Number | Creation time in milliseconds, or `null`. |
| `entities[].updatedAt` | Number | Last update time in milliseconds, or `null`. |
| `entities[].tags` | Array | Always empty. |
| `entities[].userCount` | Number | Users in the cohort. Cohorts only. |
| `entities[].description` | String | Cohort description, or `null`. Cohorts only. |
| `entities[].appId` | String | App id, or `global` for dashboards and entities without an app. |
| `entities[].viewUsers` | Array | Recorded views, each with the member id and the date. |
| `entities[].isUnused` | Boolean | `true` when the entity was not viewed in the last 30 days. |
| `total` | Number | Number of entities matching the request, before paging. |
| `page` | Number | Returned page. |
| `limit` | Number | Entities per page. |
| `sortBy` | String | Sort field used. |
| `sortOrder` | String | Sort order used. |

### Error Responses

- `500`

```json
{
  "result": "Error fetching entities: ..."
}
```

## Behavior

- Entities of all apps are returned, whichever `app_id` is sent.
- Sorting by an unknown `sortBy` value keeps the original order.

## Related Endpoints

- [Dashboards](../dashboards/index.md)
