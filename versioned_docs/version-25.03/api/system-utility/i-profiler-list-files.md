---
sidebar_label: "Profiler Files"
keywords:
  - "/i/profiler/list-files"
  - "list-files"
  - "profiler"
last_update:
  date: "2026-03-07"
---

# System Utility - List Profiler Files

## Endpoint

```plaintext
/i/profiler/list-files
```

## Overview

Returns profiler output file list from profile directory.

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
/i/profiler/list-files?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
{
  "result": [
    "master-12345.cpuprofile",
    "master-12345.heapprofile",
    "master-12345.coverage"
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | Array of String | Profiler artifact file names currently available for download. |

### Error Responses

```json
{
  "result": "Profiler files couldn't be found"
}
```

## Behavior

- Returns file list from profiler directory when present.

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
