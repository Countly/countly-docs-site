---
sidebar_position: 1
sidebar_label: "Overview"
---

# Active Users

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The Active Users feature provides real-time engagement metrics that measure user activity on a daily, weekly, and monthly basis. It enables organizations to track active user trends, understand user retention, and measure the effectiveness of engagement campaigns through three key metrics: Daily Active Users (DAU), Weekly Active Users (WAU), and Monthly Active Users (MAU).

This feature calculates active user metrics by analyzing session data from the Drill feature, storing aggregated results in a cache for fast retrieval, and supporting background refresh cycles to keep metrics current with minimal performance impact.

## Key Features

- **Daily Active Users (DAU)**: Unique user count per calendar day
- **Weekly Active Users (WAU)**: Unique users active in trailing 7-day rolling window
- **Monthly Active Users (MAU)**: Unique users active in trailing 30-day rolling window
- **Cached Calculations**: Results cached in MongoDB for instant retrieval
- **Background Processing**: Automatic recalculation in background jobs
- **Calculation Status**: Real-time indication whether data is stale or calculating
- **Multi-Period Support**: Query across custom date ranges and Countly-standard periods
- **Timezone Support**: Per-app timezone adjustments for accurate daily boundaries
- **Cache Invalidation**: Manual cache clearing with app-specific or global options
- **Session-Based**: Leverages `[CLY]_session` and `[CLY]_session_begin` events from Drill storage

## Dependencies

This feature requires:

- **Drill feature**: Must be enabled; active user metrics are derived from ClickHouse `countly_drill.drill_events` (default)
- **Session Tracking**: App must track session events to generate active user data

If Drill feature is disabled, active_users returns empty results with a `drillDisabled: true` flag.

## Configuration Settings

The Active Users feature does not expose feature-specific settings via `plugins.getConfig("active_users")`. In default deployments (ClickHouse enabled), queries run through QueryRunner on the ClickHouse Drill adapter (see [Active Users - Read](active-users-metrics.md)).

## Data Storage

The Active Users feature uses these data stores:

| Store | Purpose | Key Fields |
|------------|---------|------------|
| `countly_drill.drill_events` (ClickHouse, default) | Source data for active user calculations; session events are filtered by event name | `a` (app_id), `e` (event name), `uid` (user ID), `ts` (timestamp) |
| `countly.active_users` | MongoDB cache for calculated active user metrics per app | `appid`, date keys (e.g., `2024.2.11`), `d` (DAU), `w` (WAU), `m` (MAU), `ts` (cache timestamp) |
| `countly.apps` | Application configuration lookup (timezone and app metadata) | `_id` (app_id), timezone settings |

Active user aggregations read from ClickHouse `countly_drill.drill_events` through QueryRunner. If `clickhouse.database` is overridden, the table path becomes `<clickhouse.database>.drill_events`.

## Authentication

All active users endpoints require standard Countly authentication:

| Method | Required | Description |
|--------|----------|-------------|
| **API Key** | Yes (or auth token) | Admin or analyst credentials with read permissions |
| **Auth Token** | Yes (or API key) | Token via `auth_token` parameter or `countly-token` header |
| **App ID** | Required for read endpoint | Application ID for metric reads and app-specific cache clear |

## Endpoints

- [Read](active-users-metrics.md) - `/o/active_users`
- [Clear Cache](active-users-cache-clear.md) - `/i/active_users/clear_active_users_cache`

## Period Values

Standard time period values for active user queries:

| Period | Description | Example Range |
|--------|-------------|----------------|
| `hour` | Current calendar day | 2024.2.13 only |
| `yesterday` | Previous calendar day | 2024.2.12 only |
| `7days` | Last 7 calendar days | 2024.2.7 through 2024.2.13 |
| `30days` | Last 30 calendar days | 2024.1.15 through 2024.2.13 (default) |
| `60days` | Last 60 calendar days | 2023.12.16 through 2024.2.13 |
| `day` | Current calendar month | 2024.2.1 through 2024.2.29 |
| `month` | Current calendar year | 2024.1.1 through 2024.12.31 |
| Custom array | [start_ts, end_ts] | `[1707619200, 1710297600]` |

## Use Cases

### Use Case 1: Monitor App Health - Daily Active Users Trend

Track daily active user growth to assess app health and engagement:

```
/o/active_users?api_key={API_KEY}&app_id={APP_ID}&period=30days
```

**Response includes**:
- Last 30 days of DAU (d), WAU (w), MAU (m) per day
- Identify decline trends or spike patterns
- Compare DAU-to-MAU ratio to assess engagement intensity

**Action**: Plot DAU over time to visualize retention and engagement trends. Investigate sudden drops to identify issues.

### Use Case 2: Weekly Engagement Benchmarking

Compare this week's WAU against baseline to track momentum:

```
/o/active_users?api_key={API_KEY}&app_id={APP_ID}&period=7days
```

**Response includes**:
- 7 days of WAU values
- Establish weekly baseline (e.g., typical Wednesday WAU = 5000 users)
- Identify if current week deviates from baseline

**Action**: Calculate average WAU for current week; alert if 20%+ below historical average (churn indicator).

### Use Case 3: Monthly Retention Analysis

Calculate monthly retention by comparing MAU cohorts:

```
/o/active_users?api_key={API_KEY}&app_id={APP_ID}&period=60days
```

**Response includes**:
- 60 days of MAU showing rolling 30-day windows
- Compare MAU on day 30 vs day 60 for retention insight

**Formula**: Retention = (MAU_Day60 / MAU_Day30) × 100%

**Action**: If retention < 30%, launch re-engagement campaign.

### Use Case 4: Cache Invalidation After Data Import

Clear stale cache after bulk user or event import:

```
/i/active_users/clear_active_users_cache?api_key={API_KEY}&app_id={APP_ID}
```

**Effect**: Forces recalculation on next `/o/active_users` request.

**Action**: Use after data migration, backfill, or corruption fixes to ensure metrics accuracy.

### Use Case 5: Multi-App Dashboard

Monitor active users across all apps:

```javascript
const apps = ["app_1", "app_2", "app_3"];
for (const appId of apps) {
  const response = await fetch(`/o/active_users?api_key=${API_KEY}&app_id=${appId}&period=hour`);
  const data = await response.json();
  // Plot data.data current day DAU
}
```

**Result**: Dashboard showing DAU for each app, identified by app colors/sections.

## Active User Calculation Process

### Data Flow

```
1. Session Event Recorded
   ↓
2. Stored in ClickHouse `countly_drill.drill_events`
   ↓
3. User requests /o/active_users endpoint
   ↓
4. Check countly.active_users cache
   ├─ Cache valid and current? → Return cached data
   └─ Cache missing/stale? → Return current/default data + start async recalculation + set calculating=true
   ↓
5. Background Recalculation (Async)
   ├─ Aggregate drill events by date and uid
   ├─ Calculate unique user count per date
   ├─ Compute WAU and MAU from DAU data
   └─ Store results in countly.active_users cache
   ↓
6. Cache Updated
   Next request gets fresh data with calculating=false
```

### Calculation Algorithm

For each date in the requested period:

1. **DAU Calculation**:
   - Query drill events for `[CLY]_session` and `[CLY]_session_begin` on specific date
   - Count distinct uid values
   - Result = DAU for that date

2. **WAU Calculation**:
   - Query drill events in past 7 days (including current date)
   - Count distinct uid values
   - Result = WAU for current date

3. **MAU Calculation**:
   - Query drill events in past 30 days (including current date)
   - Count distinct uid values
   - Result = MAU for current date

### Recalculation Triggers

Cache entries are recalculated when:

1. **Today's data**: Always recalculated (user activity ongoing)
2. **Previous days**: Recalculated if cache older than 24 hours
3. **Missing cache**: Recalculated on first request for period
4. **Manual clear**: Cache is removed by `clear_active_users_cache`, then next fetch triggers recalculation
5. **Scheduled report refresh**: Hourly job requests active users for report widgets and refreshes stale data

## Best Practices

### Querying

1. **Use Standard Periods**: Prefer `30days`, `7days` over custom ranges for performance
2. **Avoid Aggressive Polling**: Calculations are asynchronous; refresh on reasonable intervals
3. **Check "calculating" Flag**: If `true`, display "data updating" notification to users
4. **Handle Timezone**: Ensure app's timezone setting is configured correctly
5. **Cache Results Client-Side**: Don't call endpoint multiple times per minute

### Data Integrity

1. **Monitor Drill feature**: Active users requires drill enabled; no drill = no active users
2. **Verify Session Events**: Confirm app is tracking `[CLY]_session` or `[CLY]_session_begin` events
3. **Clear Cache After Imports**: Always clear cache after bulk data imports or corrections
4. **Test with Sample Data**: Verify calculations with known user counts before production
5. **Monitor Calculate Status**: Track how long `calculating: true` persists and investigate prolonged runs

### Performance

1. **Limit Query Frequency**: Avoid excessive per-app polling
2. **Use App-Specific Clear**: Use `app_id` instead of `all_apps=true` when possible
3. **Avoid Peak Calculation Times**: Schedule manual cache clears during low-traffic periods
4. **Monitor Server Resources**: Long periods and stale ranges increase aggregation cost
5. **Monitor Query Logs**: Use ClickHouse logs to detect slow aggregations

## Troubleshooting

### No Active Users Data (Empty Results)

**Problem**: Active users endpoint returns empty `data` object

**Solutions**:
- Verify Drill feature is enabled: check admin console
- Confirm app has recorded session events in ClickHouse `countly_drill.drill_events`
- Verify session events exist:
  `SELECT count() FROM countly_drill.drill_events WHERE e IN ('[CLY]_session', '[CLY]_session_begin');`
- Check app timezone is set: wrong timezone shifts date calculations
- Wait for background calculation: if `calculating: true`, retry after recalculation completes

### `drillDisabled` Flag Present

**Problem**: Response includes `"drillDisabled": true`

**Solutions**:
- Enable Drill feature in admin console
- Restart Countly services to reload features
- Verify Drill/QueryRunner services are initialized (check logs)
- Confirm ClickHouse `countly_drill.drill_events` table exists

### Cache Clear Fails with "Db error"

**Problem**: `/i/active_users/clear_active_users_cache` returns database error

**Solutions**:
- Verify Countly database connection is active
- Check countly.active_users collection exists
- Verify enough disk space on MongoDB server
- Check API key has sufficient permissions
- Review MongoDB logs for specific errors

### Calculation Takes Too Long

**Problem**: `calculating: true` persists for a long time

**Solutions**:
- Check server CPU/disk usage
- Verify ClickHouse `countly_drill.drill_events` is healthy and queryable
- Consider reducing query period (e.g., 30days instead of 90days)
- Check for long-running ClickHouse queries:
  `SELECT * FROM system.processes;`
- Monitor background job queue; may be backed up

### WAU/MAU Values Not Changing

**Problem**: WAU and MAU values static despite DAU changes

**Solutions**:
- Verify session events are being recorded continuously
- Check date calculations: WAU includes rolling 7-day window
- Confirm app timezone matches expected timezone
- Clear cache to force full recalculation
- Verify distinct `uid` values in ClickHouse `countly_drill.drill_events`

### Timezone-Related Discrepancies

**Problem**: DAU counts don't match expected values; suspect timezone issue

**Solutions**:
- Verify app's configured timezone in app settings
- Check server timezone vs app timezone
- Recalculate manually with UTC offset: `timestamp + (app_timezone_offset * -60000)`
- Use `/i/active_users/clear_active_users_cache` to reset with correct timezone
- Test with known-UTC events to isolate timezone factor

## Integration with Other Features

The Active Users feature integrates with:

- **Drill feature**: Requires drill enabled; sources data from ClickHouse `countly_drill.drill_events`
- **Session Feature**: Uses `[CLY]_session` / `[CLY]_session_begin` events for calculations
- **Dashboard Feature**: Widgets can display active user metrics
- **Reports Feature**: Hourly job refreshes active users data for report dashboards with active user widgets

## Performance Characteristics

- **Asynchronous Refresh**: Requests can return current/default data with `calculating: true` while recomputation runs.
- **Windowed Aggregation**: Queries scan additional lookback windows to compute WAU (7-day) and MAU (30-day).
- **Adapter Execution**: Aggregation runs through QueryRunner using ClickHouse `countly_drill.drill_events`.
- **Monthly Period Behavior**: For `period=month`, daily values are aggregated into monthly averages (`YYYY.M` keys).
- **Hourly Warm-up Job**: Scheduled job fetches data for report widgets, which helps keep caches warm.

## API Examples

### curl - Get Last 30 Days Active Users

```bash
curl "https://your-server.com/o/active_users?api_key=abc123&app_id=123456789&period=30days"
```

### curl - Get Current Day Active Users

```bash
curl "https://your-server.com/o/active_users?api_key=abc123&app_id=123456789&period=hour"
```

### curl - Query Custom Date Range

```bash
curl "https://your-server.com/o/active_users?api_key=abc123&app_id=123456789&period=[1707619200,1710297600]"
```

### curl - Clear Cache for Specific App

```bash
curl "https://your-server.com/i/active_users/clear_active_users_cache?api_key=abc123&app_id=123456789"
```

### curl - Clear Cache for All Apps

```bash
curl "https://your-server.com/i/active_users/clear_active_users_cache?api_key=abc123&all_apps=true"
```

### JavaScript - Fetch and Display Active Users

```javascript
async function getActiveUsers(appId) {
  const response = await fetch(
    `/o/active_users?api_key=admin_key&app_id=${appId}&period=30days`
  );
  const data = await response.json();
  
  if (data.drillDisabled) {
    console.warn("Drill feature not enabled");
    return;
  }
  
  if (data.calculating) {
    console.log("Data calculating in background...");
  }
  
  // Plot DAU over time
  const dau = Object.entries(data.data).map(([date, metrics]) => ({
    date,
    users: metrics.d
  }));
  
  console.table(dau);
}
```
---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

**Last Updated**: 2026-02-15
