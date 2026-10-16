---
sidebar_label: "Domains Read"
keywords:
  - "/o/heatmaps/domains"
  - "heatmaps"
  - "domains"
last_update:
  date: "2026-10-16"
---

# Heatmaps - Domains Read

## Endpoint

```plaintext
/o/heatmaps/domains
```

## Overview

Returns the view segments and the domains for which heatmap data is available in an app.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `heatmaps` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |
| `app_id` | String | Yes | App id. |

## Examples

### Read domains of an app

```plaintext
/o/heatmaps/domains?api_key=YOUR_API_KEY&app_id=6991c75b024cb89cdc04efd2
```

## Response

### Success Response

```json
{
  "segments": {
    "platform": ["Android", "iOS"]
  },
  "domains": ["example.com"]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `segments` | Object | View segments of the app. Each key is a segment name and its value lists the segment values. |
| `domains` | Array | Domains with recorded click data. |

## Behavior

- `domains` is empty when no Drill database is available.
