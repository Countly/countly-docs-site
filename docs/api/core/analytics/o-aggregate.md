---
sidebar_label: "Run Aggregate Query"
keywords:
  - "/o/aggregate"
  - "aggregate"
last_update:
  date: "2026-10-16"
---

# Analytics - Run Aggregate Query

## Endpoint

```plaintext
/o/aggregate
```

## Overview

Runs a stored-data query as a long-running task. The response contains the result when the query finishes in time, or a task to check later when it does not.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../../index.md#authentication).

## Permissions

Requires a valid dashboard user. When `query.appID` is set, the user must be a global admin or have access to every listed app.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `query` | JSON String (Object) | Yes | Query definition. |
| `query.appID` | String or Array | No | App ID or list of app IDs to query. Defaults to the `app_id` parameter. |
| `app_id` | String | Conditional | Used as `query.appID` when the query does not set it. |
| `period` | String | No | Used as `query.period` when the query does not set it. |
| `periodOffset` | Number | No | Used as `query.periodOffset` when the query does not set it. |
| `no_cache` | Boolean | No | If set, a cached result is not used. |

## Examples

### Run a query

```plaintext
/o/aggregate?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2&period=30days&query={"appID":"6991c75b024cb89cdc04efd2"}
```

## Response

### Success Response

```json
{
  "result": {}
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Object | Query result, or task information when the query is still running. |

### Error Responses

- `400`

```json
{
  "result": "Missing parameter \"query\""
}
```

- `400`

```json
{
  "result": "Invalid query parameter"
}
```

- `401`

```json
{
  "result": "User does not have access right for this app"
}
```

## Behavior

- Runs the query as a long task: if it takes longer than the server's request threshold, the response describes the running task instead of the data.
- Query errors are returned with status `400`.

## Related Endpoints

- [Analytics - Run Query](./o-query.md)
