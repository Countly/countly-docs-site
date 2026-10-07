---
sidebar_label: "Heap Snapshot"
keywords:
  - "/i/profiler/take-heap-snapshot"
  - "take-heap-snapshot"
  - "profiler"
last_update:
  date: "2026-03-07"
---

# System Utility - Take Heap Snapshot

## Endpoint

```plaintext
/i/profiler/take-heap-snapshot
```

## Overview

Streams a heap snapshot file as download.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires Global Admin access.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```plaintext
/i/profiler/take-heap-snapshot?api_key=YOUR_API_KEY
```

## Response

### Success Response

Binary stream download with headers:

- `Content-Type: plain/text; charset=utf-8`
- `Content-Disposition: attachment; filename=heap.heapsnapshot`

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(stream body)` | Text stream | Heap snapshot content for the running process. |
| `Content-Type` | Header | `plain/text; charset=utf-8` |
| `Content-Disposition` | Header | `attachment; filename=heap.heapsnapshot` |

### Error Responses

```json
{
  "result": "...error text..."
}
```

## Behavior

- Writes response headers and streams heap snapshot content.

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
