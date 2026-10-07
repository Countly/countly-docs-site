---
sidebar_label: "Profiler Download"
keywords:
  - "/i/profiler/download-all"
  - "download-all"
  - "profiler"
last_update:
  date: "2026-03-07"
---

# System Utility - Download All Profiler Files

## Endpoint

```plaintext
/i/profiler/download-all
```

## Overview

Streams all profiler output files as a tar archive.

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
/i/profiler/download-all?api_key=YOUR_API_KEY
```

## Response

### Success Response

Binary stream download with headers:

- `Content-Type: plain/text; charset=utf-8`
- `Content-Disposition: attachment; filename=profiler.tar`

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(stream body)` | Binary stream | Tar archive containing profiler output files. |
| `Content-Type` | Header | `plain/text; charset=utf-8` |
| `Content-Disposition` | Header | `attachment; filename=profiler.tar` |

### Error Responses

- `404`

```json
{
  "result": "Profiler files couldn't be found"
}
```

- `500`

```json
{
  "result": "...error text..."
}
```

## Behavior

- Builds tar stream from profiler files directory and pipes it to response.

<details>
<summary>Implementation details</summary>

**Database Collections**

This endpoint does not read or write database collections.

</details>
