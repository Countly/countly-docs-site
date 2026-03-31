---
sidebar_position: 5
sidebar_label: "Overview"
---

# Retention Segments API Documentation

**Feature**: retention_segments  
**Version**: Enterprise  
**Last Updated**: 2026-02-11

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The Retention Segments feature provides user retention analytics, tracking how cohorts of users engage over time after their initial action. It calculates retention rates at configurable intervals (daily, weekly, monthly) and supports filtering by events and user properties.

## Key Features

- **Retention Analysis**: Track user retention over time periods
- **Multiple Retention Types**: Full, classic, and unbounded retention modes
- **Event-based Filtering**: Calculate retention for specific events or sessions
- **Time Period Flexibility**: Daily, weekly, or monthly retention tracking
- **User Property Filtering**: Filter retention cohorts by user properties and segments
- **Caching**: Optimized retention calculations with intelligent caching
- **Dashboard Integration**: Built-in retention segment widgets for dashboards

## Configuration Settings

The feature uses the following configuration settings (from `features.setConfigs`):

- **`span`**: Default number of days/weeks/months to show in retention reports (default: `10`)

## API Endpoints

### Read Endpoints (GET /o)

| Endpoint | Purpose | Details |
|----------|---------|---------|
| [retention](retention-read.md) | Get retention data | Calculate user retention with filtering and date ranges |

## Retention Types

### Full Retention
Shows how many users return on each day/week/month after their first activity. Most commonly used retention metric showing actual returning users.

### Classic Retention
Shows cohort-based retention where users are grouped by their first activity date, and retention is tracked relative to that cohort.

### Unbounded Retention
Counts all users who were active in the specified period and tracks their retention, regardless of when they first appeared.

## Common Use Cases

1. **Daily Retention**: Track day-over-day user engagement drop-off
2. **Cohort Analysis**: Compare retention across cohorts by signup date
3. **Feature Adoption**: Measure retention for users who adopted specific features (via events)
4. **Segment Performance**: Analyze retention by user properties (location, device, etc.)
5. **Campaign Impact**: Measure retention impact of campaigns or updates

## Authentication

All endpoints require:
- Valid API key or authentication token
- App ID parameter
- Read access for `retention_segments` feature

## Database Collections

- **`countly.drill_events{app_id}`**: Underlying drill event data used for retention calculations
- **`countly.retention_cache`**: Cached retention calculation results (TTL: 10 minutes)
- **`countly.app_users{app_id}`**: User profiles with retention-related fields

## Best Practices

1. **Use Caching**: Allow retention calculations to cache for performance
2. **Adjust Span**: Modify `span` parameter based on app lifecycle (mobile vs. web)
3. **Filter Appropriately**: Use query parameters to focus on relevant user segments
4. **Leverage Events**: Calculate retention by specific events for feature-level insights
5. **Cache Busting**: Use `no_cache=true` only when immediate data refresh is critical

## Performance Considerations

- Retention calculations based on drill events can be computationally intensive for large datasets
- Caching reduces repeated calculations significantly
- Long time spans (6+ months) may take longer to compute
- User property filtering can impact query performance
- Consider using batch/scheduled calculations for complex retained reports

## Related Features

- **Drill**: Underlying event data for retention calculations
- **Cohorts**: User segmentation that can be combined with retention analysis
- **Funnels**: Compare funnel conversion with retention patterns
- **Formulas**: Create custom retention metrics

---

_Last Updated: 2026-02-11_  
_Feature: retention_segments_  
_Configuration: `span: 10`_

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

