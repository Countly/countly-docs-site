---
sidebar_position: 1
sidebar_label: "Overview"
---

# Activity Map

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Activity Map visualizes how session and event activity is distributed geographically.  
It supports drill-down analysis across three levels:

- Countries
- Regions (within a selected country)
- Cities (within a selected country)

The feature is UI-driven and does not expose a dedicated Activity Map endpoint.

## Quick Links

| Page | Description |
|---|---|
| [Overview](index.md) | Feature behavior, workflows, and data shape |
| Public Endpoints | None (uses shared data query flow) |

## Database Collections

Activity Map is read-only and relies on Drill data in ClickHouse.

| Collection | Purpose | Key fields |
|---|---|---|
| `countly_drill.drill_events` (default) | Source data for geographic aggregation | `a`, `e`, `up.cc`, `up.rgn`, `up.cty`, `ts` |

If `clickhouse.database` is customized, the source path becomes `<clickhouse.database>.drill_events`.

## UI Overview

### Main Controls

- **Event selector**: switch between session activity and custom events
- **Date range picker**: change the analysis period
- **Filter bar**: narrow data by selected segment conditions

### Map and Data Panel

- A map displays activity intensity by geography
- A side data panel shows ranked locations with values
- Users can search within location lists for faster navigation

### Drill-Down Behavior

1. Start at country level.
2. Select a country to open details.
3. Switch between region and city details for the selected country.
4. Return to world view when needed.

## Returned Data Fields

Even without a dedicated endpoint, Activity Map depends on shared query responses.  
These fields are the most relevant for users and integrators:

| Field | Type | Description |
|---|---|---|
| `task_id` | String | Present when query runs asynchronously in background |
| `segments` | Object | Aggregated values grouped by geographic key |
| `segments.<location>.t` | Number | Value displayed for that location (sessions/events total) |

Notes:
- Geographic key meaning depends on current view (country, region, or city).
- `Unknown` can appear when source events do not include complete geo metadata.

## Configuration & Usage

### Requirements

- Drill feature must be enabled.
- User must have permission to access Drill-powered analytics for the app.

### Typical Workflow

1. Open Activity Map.
2. Select session activity or a custom event.
3. Set date range.
4. Apply optional filters.
5. Review countries, then drill down to regions and cities.
6. Compare distribution changes across periods or events.

## Use Cases

### 1. Global Activity Monitoring

Identify where activity is strongest and detect unusual drops by geography.

**Workflow:**
- Review countries first to spot anomalies
- Drill into affected countries for regional and city impact
- Compare with prior period for confirmation

### 2. Geographic Expansion Analysis

Measure growth in new markets and identify strong sub-regions.

**Workflow:**
- Select a broader period
- Compare top countries by activity
- Drill down to regions/cities to identify growth clusters

### 3. Feature Adoption by Region

Compare how a specific custom event is distributed geographically.

**Workflow:**
- Switch to a target custom event
- Apply relevant filters
- Compare distribution against session activity baseline

### 4. Incident Impact Triage

Understand which geographies were affected most during an incident window.

**Workflow:**
- Keep event and filters consistent
- Compare before/after period snapshots
- Focus on countries with sharp declines

### 5. Campaign Validation

Check whether a launch or campaign reached intended regions.

**Workflow:**
- Use campaign-relevant event
- Filter to campaign audience where needed
- Validate geographic spread against target markets

## Limitations & Troubleshooting

### Limitations

- No standalone Activity Map REST endpoint.
- Data quality depends on geo metadata present in source events.
- Some heavy queries may be processed asynchronously (`task_id`).

### Common Issues

**No data visible**
- Confirm Drill is enabled.
- Confirm selected event has data in selected date range.
- Remove filters and retry.

**Region or city view appears empty**
- Select a country first.
- Verify source data includes region/city values for that country.

**High number of `Unknown` locations**
- Check geo enrichment quality in event ingestion pipeline.

## Related Features

- [Drill - API Documentation](../../drill/api/index.md) - Query backend used by Activity Map
- [Geo - API Documentation](../../geo/api/index.md) - Complementary geographic analytics views

## Frequently Asked Questions

**Q: Does Activity Map have its own API endpoint?**  
A: No. It uses shared query infrastructure.

**Q: What geographic levels are available?**  
A: Country, region, and city.

**Q: Can I filter map results?**  
A: Yes. Use date range and filter conditions.

**Q: Why do I sometimes get `task_id` instead of immediate full results?**  
A: The request is being processed in background due to query load/size.

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

**Last Updated**: 2026-02-15
