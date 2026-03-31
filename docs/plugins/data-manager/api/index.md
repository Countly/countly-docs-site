---
sidebar_position: 1
sidebar_label: "Overview"
---
# Data Manager - API Documentation

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Data Manager helps you control event and user-property schemas in production. It supports event/segment lifecycle workflows, transformation rules, validation cleanup/approval, schema import/export, and masking/expiration controls.

This index is product-oriented by design. Endpoint pages contain request/response details.

## Quick Links

### Events
- [Events Extended - Read](events-extended-read.md)
- [Event Segments - Read](event-segments-read.md)
- [Events - Create](events-create.md)
- [Event Properties - Update](event-properties-update.md)
- [Event Status - Update](event-status-update.md)
- [Events Visibility - Update](events-visibility-update.md)

### Segments
- [Segment Properties - Update](segment-properties-update.md)
- [Segment Status - Update](segment-status-update.md)
- [Segments - Delete](segments-delete.md)

### User Properties & Types
- [User Properties - Read](user-properties-read.md)
- [User Properties - Delete](user-properties-delete.md)
- [Property Expiration - Update](property-expiration-update.md)
- [Data Types - Create](data-types-create.md)
- [Property Values - Read](property-values-read.md)

### Transformations
- [Transformations - Read](transformations-read.md)
- [Transformations - Create](transformations-create.md)
- [Transformation Rules - Update](transformation-rules-update.md)
- [Transformation Status - Update](transformation-status-update.md)
- [Transformations - Delete](transformations-delete.md)
- [Transformation History - Read](transformation-history-read.md)

### Validation
- [Validations - Read](validations-read.md)
- [Validation Approvals - Update](validation-approvals-update.md)
- [Validations - Delete](validations-delete.md)

### Schema & Export
- [Schema Import - Update](schema-import-update.md)
- [Schema Export - Read](schema-export-read.md)
- [Event Export - Read](event-export-read.md)

### Privacy
- [Data Masking - Update](data-masking-update.md)

## Workflows

### Event Governance Workflow
1. Create event schema with segments.
2. Approve or block event/segment status.
3. Adjust event visibility for UI usage.
4. Use validation approvals/deletions for incoming anomalies.

### Transformation Workflow
1. Read existing rules.
2. Create a new rule for `incoming`, `existing`, or `both`.
3. Toggle status as needed.
4. Edit/delete rules and review transformation history.

### Schema Portability Workflow
1. Export schema as CSV.
2. Review/edit schema file.
3. Import schema updates.
4. Export event template for populator when needed.

## Data Sources

- `countly.events`: Event list/map/segments metadata.
- `countly.systemlogs`: Audit trail for Data Manager actions.
- `countly.validation_errors{appId}`: Validation records per app.
- `countly.datamanager_transforms`: Transformation rule definitions.
- `countly.event_categories`: Event category mapping used by schema import/export.
- `countly.app_users{appId}`: User profile fields for user-property deletion operations.
- `countly.apps`: App-level masking and override settings.
- `countly.events_data`: Aggregated events metadata affected by some segment operations.
- `countly_drill.drill_meta`: Drill metadata for events/segments/user properties.
- `countly_drill.drill_events`: Drill event-level data affected by segment operations.

## Configuration Notes

From `plugins.setConfigs("data-manager", ...)`:

- `allowUnplannedEvents`: controls visibility behavior for `unplanned` status.
- `enableValidation`: validation feature switch.
- `triggerUnplannedError`: controls unplanned-event signaling behavior.
- `enableDataMasking` and `redactedLabel`: masking behavior and label.
- `segmentLevelValidationAction`, `globalValidationAction`, `globalRegex`: validation controls.

## Documentation Scope

- Public Data Manager endpoints are documented here.
- Deprecated and non-public lifecycle endpoints are intentionally excluded from endpoint docs.
- Response examples in endpoint pages follow the runtime payload shape returned by each handler.

---

## Last Updated

2026-02-16
