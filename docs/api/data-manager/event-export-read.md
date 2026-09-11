---
sidebar_label: "Event Export"
keywords:
  - "/i/data-manager/export-event-to-populator"
  - "export-event-to-populator"
  - "data-manager"
last_update:
  date: "2026-02-16"
---

# Export events for populator template

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```text
/i/data-manager/export-event-to-populator
```

## Overview

Exports event/segment template data as a downloadable JSON file for populator usage.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

Requires `data_manager` `Read` permission.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Target app ID. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

```text
/i/data-manager/export-event-to-populator?
  app_id=64f5c0d8f4f7ac0012ab3456
```

## Response

### Success Response

```json
[
  {
    "name": "populator",
    "data": [
      {
        "name": "Events Export Scheme(6991c75b024cb89cdc04efd2)",
        "isDefault": false,
        "events": [
          {
            "key": "Playback Started",
            "duration": {
              "isActive": false,
              "minDurationTime": 0,
              "maxDurationTime": 0
            },
            "sum": {
              "isActive": false,
              "minSumValue": 0,
              "maxSumValue": 0
            },
            "segmentations": [
              {
                "key": "Content Type",
                "values": [
                  { "key": "Movie", "probability": "100" }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]
```

Note: the endpoint returns this JSON as downloadable file content (`Content-Type: text/json` + attachment headers), not inside a `result` wrapper.

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[]` | Array | Populator template containers. |
| `[].name` | String | Template name (currently `populator`). |
| `[].data[]` | Array | Export bundles. |
| `[].data[].events[]` | Array | Exported event definitions for populator. |
| `[].data[].events[].segmentations[]` | Array | Segment groups and values per exported event. |

### Error Responses

- `401`

```json
{
  "result": "No app_id provided"
}
```

- `500`

```json
{
  "result": "Error"
}
```

## Behavior

- Collects events and segmentation info from drill metadata.
- Builds populator template structure with sequence defaults and behavior defaults.
- Returns downloadable JSON file named `countly_data_manager_event_export_{app_id}.json`.

## Operational Considerations

- Endpoint builds export payload and returns it as attachment in one request.
- Apps with high event/segmentation cardinality can produce very large payloads and slower response times.

## Related Endpoints

- [Schema Export - Read](schema-export-read.md)
- [Events Extended - Read](events-extended-read.md)

<details>
<summary>Implementation details</summary>

**Configuration Impact**

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `drill.list_limit` | System default | Maximum number of segmentation values exported per segment | Export output truncates each segment's value list to this limit. |

**Audit & System Logs**

- This endpoint does not emit `/systemlogs` actions.

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly_drill.drill_meta` | Event/segment metadata and value sampling | Reads event segment definitions and sampled values (`values`) used to build populator segment options. |
| `countly.events` | Event catalog fallback | Reads event list/segment arrays for events that do not have matching drill list-value documents. |

</details>
