---
sidebar_label: "Overview"
sidebar_position: 1
---
# Drill - API Documentation

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Drill provides deep event analytics with flexible segmentation, metadata lookup, and saved query workflows.

This index keeps a product-oriented view. Endpoint pages include request and response details.

## Quick Links

### Queries
- [Query Segmentation - Read](query-segmentation-read.md)
- [Query Metadata - Read](query-metadata-read.md)

### Bookmarks
- [Bookmarks - Read](bookmarks-read.md)
- [Bookmark - Read](bookmark-read.md)
- [Bookmark - Create](bookmark-create.md)
- [Bookmark - Update](bookmark-update.md)
- [Bookmark - Delete](bookmark-delete.md)

### Maintenance
- [Metadata Cleanup - Update](metadata-cleanup-update.md)
- [Metadata Lists - Recheck](metadata-list-recheck-update.md)
- [Metadata Regeneration](metadata-regeneration-update.md)
- [Data Regeneration](data-regeneration-create.md)

## Common Workflows

### Analyze Event Performance
1. Call [Query Metadata - Read](query-metadata-read.md) to discover available fields.
2. Run [Query Segmentation - Read](query-segmentation-read.md) with filter and grouping parameters.
3. Save reusable queries with [Bookmark - Create](bookmark-create.md).

### Manage Saved Queries
1. Load bookmarks with [Bookmarks - Read](bookmarks-read.md).
2. Apply selected query settings in Drill UI/API calls.
3. Remove unused entries with [Bookmark - Delete](bookmark-delete.md).

### Maintain Metadata
1. Run [Metadata Cleanup - Update](metadata-cleanup-update.md) for one app or all apps.
2. Use [Metadata Lists - Recheck](metadata-list-recheck-update.md) when stored metadata value lists need to be re-evaluated.
3. Use [Metadata Regeneration](metadata-regeneration-update.md) when metadata needs to be rebuilt from recent Drill data.
4. Confirm completion from system logs.

## Data Sources

- `countly_drill.drill_meta`: Event and property metadata used by meta endpoints.
- `countly_drill.drill_events{appId/hash}`: Event-level drill data queried by segmentation flows.
- `countly_drill.drill_bookmarks`: Stored drill query bookmarks.
- `countly_drill.drill_cache`: Cached drill query results (TTL-managed).
- `countly_drill.drill_snapshots`: Snapshot support for drill queries.
- `countly.systemlogs`: Operational logs for cleanup/bookmark operations.

## Configuration Notes

From `plugins.setConfigs("drill", ...)` in `plugins/drill/api/api.js`:

- `list_limit`: max value list size for metadata responses.
- `projection_limit`: limit for projection dimensions.
- `big_list_limit`: limit for big-list property value extraction.
- `cache_threshold`: threshold for cached query usage.
- `use_drill_snapshots` and `drill_snapshots_cache_time`: snapshot behavior.
- `clickhouse_use_approximate_uniq`: ClickHouse unique-count behavior.

## Notes

- Most Drill reads are exposed through `/o?method=...`.
- Bookmark create/delete and maintenance operations are exposed through `/i/drill/<action>`.

---

_Last Updated: 2026-04-17_
