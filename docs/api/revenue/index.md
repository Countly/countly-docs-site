---
sidebar_label: "Overview"
sidebar_position: 1
---

# Revenue

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The Revenue feature tracks and analyzes in-app purchase and monetization metrics. Monitor paying users, revenue trends, and purchase patterns across time periods. Segment revenue data by in-app events and calculate paying user metrics automatically.

---

## Key Features

- **Paying User Tracking**: Identify and track users who have made purchases
- **Revenue Metrics**: Calculate total revenue, revenue per user, purchase frequency
- **Event-Based Revenue**: Associate revenue with specific in-app purchase events
- **Time-Based Analytics**: Revenue trends by day, week, month, year
- **User Segmentation**: Filter revenue by user properties and cohorts
- **Dashboard Integration**: Revenue widgets show key metrics
- **Period Analysis**: Compare revenue across custom date ranges
- **Purchase Frequency**: Track repeat purchase behavior

---

## Configuration

Revenue feature configuration includes:

| Setting | Type | Description |
|---------|------|-------------|
| `iap_events` | Array | List of event names representing in-app purchases |

The `iap_events` configuration specifies which events should be counted as purchases. These events typically have `sum` values representing purchase amounts.

---

## Revenue Tracking

Revenue is tracked through:

1. **User Properties** (stored in app_users collection):
   - `tp` (total purchases amount): Cumulative revenue from user
   - `tpc` (total purchase count): Total number of purchases
   - `lp` (last purchase timestamp): Time of most recent purchase
   - `lpa` (last purchase amount): Amount of most recent purchase
   - `purchased` (purchased status): "yes" if user has made purchases

2. **Users Aggregation** (stored in users collection):
   - `d.p` or `d.{period}.p`: Count of paying users in period
   - Tracked at day, week, month, and year granularities

---

## Database Collections

- **Collection**: `countly.app_users{app_id}`
  - Stores user purchase data (tp, tpc, lp, lpa, purchased)
- **Collection**: `countly.users`
  - Aggregated paying user counts by time period
- **Collection**: `countly_drill.drill_events`
  - Source for revenue event data
- **Collection**: `countly.apps`
  - Stores IAP event configuration

---

## API Endpoints

### Read Endpoints
- [Revenue - Analytics](analytics.md) - GET /o/revenue

### Dashboard Integration
- Revenue widgets automatically calculate and display metrics

---

## Export Data

Revenue data can be exported for external analysis through:
- Revenue time-series data (paying users, totals)
- Custom event filtering
- Period-based analysis

---

## Authentication Requirements

All revenue endpoints require:
- **Feature Permission**: `revenue` feature enabled for user
- **App Access**: User must have read access to the specific app
- **Method**: GET or POST (both accepted)

---

## Common Use Cases

1. **Revenue Dashboard**: Display revenue trends and metrics
2. **Period Comparison**: Compare revenue across time periods
3. **Event Analysis**: Analyze revenue from specific purchase events
4. **Paying User Tracking**: Monitor active paying user count
5. **Revenue Forecasting**: Predict future revenue based on trends
6. **Custom Reports**: Export revenue data for business intelligence

---

## Related Features

- **[Events](../flows/index.md)** - Define purchase events
- **[Drill](../drill/index.md)** - Analyze event data in detail
- **[Data Manager](../data-manager/index.md)** - Configure event properties

---

## Best Practices

- **Event Naming**: Use clear event names for purchase events (e.g., `purchase`, `in_app_purchase`)
- **Amount Tracking**: Always include `sum` value for revenue events
- **Timestamp Recording**: Ensure accurate timestamps on purchase events
- **Regular Analysis**: Monitor revenue trends regularly for insights
- **Segmentation**: Analyze revenue by user properties for better targeting
- **Data Validation**: Verify IAP events are being tracked correctly

---

## Performance Considerations

- Revenue calculations performed asynchronously
- Large date ranges may require additional processing time
- Paying user aggregation cached for dashboard efficiency
- Custom queries filtered through drill database

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

