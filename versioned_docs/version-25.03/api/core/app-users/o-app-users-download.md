---
sidebar_label: "Export Download"
keywords:
  - "/o/app_users/download/{id}"
  - "download"
  - "app_users"
  - "{id}"
last_update:
  date: "2026-02-17"
---

# `/o/app_users/download/\{id\}`

## Endpoint

```plaintext
/o/app_users/download/\{id\}
```

## Overview

Download previously created app-user export data.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../../index.md#authentication).

## Permissions

- Requires read-level app access.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | Dashboard API authentication key. |
| `auth_token` | String | Yes (or use `api_key`) | Dashboard auth token. |
| `id` | String | Yes | Export identifier path segment, or task ID that resolves to export identifier. |
| `app_id` | String | Yes | Target app ID used for read-access validation. |

## Examples

### Example 1: Download export archive

```plaintext
/o/app_users/download/appUser_64b0ac10c2c3ce0012dd1001_1?api_key=YOUR_API_KEY&app_id=64b0ac10c2c3ce0012dd1001
```

### Example 2: Download via task ID

```plaintext
/o/app_users/download/03ccb0c8ac773298f62f8bdb5d0f8869cb78f788?api_key=YOUR_API_KEY&app_id=64b0ac10c2c3ce0012dd1001
```

## Response

### Success Response

```plaintext
HTTP 200 with streamed file content
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `HTTP body` | Binary stream / streamed JSON | Export archive (`application/x-gzip`) or JSON stream fallback when archive is unavailable. |
| `Content-Disposition` | Header | Inline filename for downloaded content. |

### Error Responses

**Status Code**: `400 Bad Request`
```json
{
  "result": "Missing filename"
}
```

**Status Code**: `400 Bad Request`
```json
{
  "result": "Export doesn't exist"
}
```

**Status Code**: `400 Bad Request`
```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

**Status Code**: `401 Unauthorized`
```json
{
  "result": "No app_id provided"
}
```

## Behavior

### Behavior Modes

| Mode | Trigger | Processing Path | Response Shape |
|---|---|---|---|
| Archive stream | Export archive exists in GridFS | Streams `appUser_...tar.gz` content from GridFS bucket. | HTTP stream response (non-JSON body) |
| Exports collection fallback | Archive size resolves to `0` | Streams rows from `countly.exports` as JSON documents. | HTTP stream response (JSON stream) |
| Task-ID resolution | `id` is a task ID | Looks up task result, maps to export filename, then runs archive/fallback flow. | Same as stream modes above |

### Response Header Notes

- The fallback JSON stream branch still sends `Content-Type: application/x-gzip` in current implementation.
- Consumers should treat fallback payload as JSON stream by body format, not only by content-type header.

## Operational Considerations

- This endpoint returns streamed file/content output, not standard JSON success payloads.
- Download behavior depends on export storage state (archive stream first, then JSON-stream fallback).
- Long-running exports should be completed first; if a task ID is used, result mapping must exist.

## Limitations

- Successful response is file/stream output, not a standard JSON payload.
- Fallback JSON stream uses a legacy gzip content-type header.

## Related Endpoints

- [App Users - Export](i-app-users-export.md)
- [App Users - Delete Export](i-app-users-deleteexport.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | Authentication and permission validation | Reads member identity and app-level read permissions. |
| `countly.long_tasks` | Task ID to export name resolution | Reads task result data when download `id` is a task ID. |
| `countly.exports` | Fallback download source | Streams export rows when archive file is unavailable. |
| `countly_fs` | Archive storage | Reads export archive from GridFS `appUsers` bucket. |

</details>
