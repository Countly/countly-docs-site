---
sidebar_position: 1
sidebar_label: "Overview"
---

# Online Users

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The Online Users feature provides real-time monitoring of users actively using your application at any given moment. It tracks simultaneous user sessions across multiple time granularities (current, minutes, hours, days, and overall maximums) with optional segmentation by geography, device type, and carrier. The feature also includes configurable alert systems to notify administrators when online user counts exceed thresholds or fall patterns. Perfect for monitoring app health, capacity planning, and identifying usage spikes or anomalies.

## Database Collections

| Collection | Purpose |
|---|---|
| `countly.concurrent_users_max` | Stores maximum online user counts (overall, per-app) with TTL-based expiration |
| `countly.concurrent_users_active` | Current active session state with processing flags and cache timestamps |
| `countly.concurrent_users_alerts` | Alert definitions and execution status tracking for online user thresholds |
| `countly.members` | User profiles (referenced when returning alert creator information) |
| `countly.apps` | Application metadata (referenced during initialization and alerts) |
| `countly.app_users{appId}` | Application-specific user sessions (indexed by last_sync and session cookie) |

## Configuration & Settings

| Setting | Default | Type | Description |
|---|---|---|---|
| `read_interval` | 10 | seconds | Frequency of online user data sampling and updates |
| `online_time` | 180 | seconds | Session inactivity threshold; sessions inactive longer than this are considered offline |
| `sampling_interval` | 30 | seconds | Aggregation interval for metrics breakdown calculations |
| `alert_interval` | 3 | minutes | Minimum time window for alert condition evaluation (alert.minutes must be >= this) |

## API Endpoints

### Online User Metrics

- [Get Online User Metrics](concurrent-users-metrics.md) - `/o?method=concurrent`
- [Get Live Online User Count](concurrent-users-live.md) - `/o?method=live`

### Alert Management

- [Get All Alerts](concurrent-users-alerts.md) - `/o?method=concurrent_alerts`
- [Create or Update Alert](concurrent-users-alert-save.md) - `/i/concurrent_alert/save`
- [Delete Alert](concurrent-users-alert-delete.md) - `/i/concurrent_alert/delete`
- [Update Alert Status](concurrent-users-alert-status.md) - `/i/concurrent_alert/status`

### Maximum Value Management

- [Reset Maximum Values](concurrent-users-reset.md) - `/i/concurrent_users_max/reset`

## Data Models

### Alert Object Structure

**Threshold Alert (`type: 't'):**
```json
{
  "_id": "ObjectID",
  "name": "Alert Name",
  "app": "app_id",
  "type": "t",
  "enabled": true,
  "condition_title": "User-facing description",
  "def": "max|min",
  "users": 5000,
  "minutes": 5,
  "email": ["user@example.com"],
  "created_by": "member_id",
  "created_at": 1567474533960,
  "defined_at": 1567474533960,
  "last_triggered": 1567480000000,
  "status": "ready"
}
```

**Metric Alert (`type: 'm'):**
```json
{
  "_id": "ObjectID",
  "name": "Traffic Pattern Alert",
  "app": "app_id",
  "type": "m",
  "enabled": true,
  "condition_title": "Offline pattern detected",
  "alertBy": ["push", "email"],
  "allGroups": false,
  "created_by": "member_id",
  "created_at": 1567474533960
}
```

### Online Users Max Entry

```json
{
  "_id": "app_id_overall|app_id_overall_new",
  "mx": 5000,
  "ea": 1567474533960
}
```

Keys:
- `{appId}_overall` - Maximum concurrent existing users
- `{appId}_overall_new` - Maximum concurrent new users
- `ea` - Expiration timestamp (TTL index set to 0 for custom expiration)

### Active Session State

```json
{
  "_id": "app_id",
  "online": 1250,
  "metrics": {
    "cc": {"US": 450, "UK": 280},
    "lv": {"iPhone": 520, "Android": 600},
    "src": {"organic": 800, "paid": 350}
  },
  "processing": false,
  "fetchedAt": 1567474533960,
  "lockedAt": 0
}
```

## Key Concepts

### Session Inactivity & Expiration

**Online Time Definition:**
- Users are considered "online" if their last activity (last_sync) occurred within the `online_time` window (default: 180 seconds)
- Sessions older than 180 seconds automatically expire and are removed from online user counts
- Configured via `online_time` setting in feature defaults

### Metrics Breakdown

Real-time metrics segmentation includes:
- **Country (cc)**: Geographic location via country code
- **Device (lv)**: Device type (iPhone, Android, Web, etc.)
- **Source (src)**: Traffic source/attribution (organic, paid, direct, etc.)

Each metric type shows independent user distributions for the current moment.

### Alert Types

**Threshold Alerts (type: 't'):**
- Monitor online user count against fixed thresholds
- Evaluate based on `def` mode ('max' for peaks, 'min' for valleys)
- Trigger when threshold exceeded for specified `minutes` window
- Most common alert type

**Metric Alerts (type: 'm'):**
- Monitor traffic patterns and offline conditions
- Triggered by algorithmic detection (not user-configured thresholds)
- Support multiple notification channels (push, email)
- Can target specific user groups

### Permission-Based Access Control

Online user data respects application permissions:
- **Global Admins**: Can access all applications' online user data
- **App Admins**: Can only access applications they administer
- **Feature-Specific Access**: Users with Online Users feature permission (`concurrent_users`) for 'r' (read) can access specific apps
- Alerts filtered by same visibility rules; users only see alerts for accessible apps

### TTL Expiration

The `countly.concurrent_users_max` collection uses MongoDB TTL indexes:
- `ea` field contains expiration timestamp
- TTL set to 0 (immediate expiration at specified time)
- Prevents indefinite growth of historical max values
- Automatic cleanup managed by MongoDB background index

## Use Cases

### 1. Real-Time App Health Monitoring
Monitor online user counts minute-by-minute to detect sudden drops or spikes. Set alerts to trigger when counts deviate from expected baselines. Useful for detecting server issues (if counts drop unexpectedly) or viral moments (if counts spike).

**Setup:**
- Query `/o?method=concurrent` with `mode: 0` (current online)
- Set threshold alert for users < 100 (potential outage)
- Set threshold alert for users > 10,000 (capacity planning)
- Dashboard refreshes every 10-30 seconds via `/o?method=live`

### 2. Capacity Planning & Infrastructure Scaling
Track peak online user counts to forecast infrastructure needs. Identify daily, weekly, and seasonal patterns in usage.

**Setup:**
- Query `/o?method=concurrent` with `mode: 5` (overall maximum)
- Review 30-day trend via `mode: 4` (daily data)
- Compare hour-by-hour patterns via `mode: 3` (hourly data)
- Alert when approaching previous peaks with buffer (e.g., 90% of max)

### 3. Multi-Application SaaS Monitoring
Aggregate online user data across multiple customer applications from single dashboard. Identify which apps are experiencing traffic spikes.

**Setup:**
- Query `/o?method=concurrent` with `r_apps` parameter (multiple app IDs)
- Filter alerts for specific app subsets via `/o?method=concurrent_alerts`
- Real-time widget fetches live counts for active apps via `/o?method=live`

### 4. Geographic Traffic Distribution Analysis
Understand online user distribution by geography and device type. Identify regional usage patterns and device preferences.

**Setup:**
- Query `/o?method=concurrent` with `mode: 1` (metrics breakdown)
- Extract country codes from `cc` metrics
- Analyze device distribution from `lv` metrics
- Correlate with time zones for regional capacity planning

### 5. Alert-Driven Operations Response
Set up threshold alerts with email notifications for on-call engineers. Create escalation paths for different severity levels.

**Setup:**
- Create threshold alert for users > 15,000 (high load - ops team)
- Create threshold alert for users < 50 (potential outage - escalate)
- Add multiple emails to alert for notification redundancy
- Monitor alert execution via `last_triggered` timestamps

## Configuration & Best Practices

### Performance Optimization

1. **sampling_interval**: Default 30 seconds balances accuracy with database load. Increase for high-traffic apps (> 100k online users).

2. **read_interval**: Default 10 seconds suitable for most apps. Increase to 30+ seconds if concurrent_users data collection impacts performance.

3. **online_time**: Default 180 seconds is industry standard for session timeout. Adjust based on:
   - Mobile apps: 60-120 seconds (frequent background/foreground)
   - Web apps: 180-300 seconds (page interactions)
   - IoT/long-polling: 300+ seconds (persistent connections)

4. **Query Optimization**: Always filter by `r_apps` when querying multiple apps; avoid unfiltered queries.

### Alert Configuration

1. **Threshold Setting**: Set thresholds to 90%+ of observed peak for meaningful alerts; avoid false positives.

2. **alert_interval**: Default 3 minutes allows alert windows of 3-63 minutes; extend if detecting false positives.

3. **Minutes Parameter**: Use 5-15 minutes to smooth out momentary spikes; use 1-2 minutes for rapid event detection.

4. **Email Alerts**: Limit recipient list to on-call responders; automated escalation recommended for 24/7 coverage.

### Troubleshooting

- **No concurrent data appearing**: Check that `online_time` is not too aggressive; verify app has active users within the window.
- **Counts resetting unexpectedly**: Check for application reset/clear_all hooks; max values cleared during maintenance.
- **Alerts not triggering**: Verify alert `enabled: true`; check `users` threshold is not outside actual traffic range; confirm alert_interval configuration.
- **Memory growth**: Monitor `countly.concurrent_users_active` collection size; TTL expiration on `countly.concurrent_users_max` should prevent unbounded growth.

## Related Features

- **Drill**: Provides underlying event segmentation for metrics breakdowns by geography, device, and source
- **Analytics Features**: Dashboard integration for real-time widget display

## System Integration Points

### App Lifecycle
- **Create**: Initializes active session state via `resetActive()`
- **Update**: Propagates app name changes to all associated alerts
- **Delete**: Removes all alerts and max records for app
- **Reset**: Clears all online user data
- **Clear All**: Resets max values and active state (preserves alerts)

### System Logs
- **online_users_alert_created**: Logged when new alert created
- **online_users_alert_edited**: Logged when alert configuration updated
- **online_users_alert_deleted**: Logged when alert removed

## API Response Codes

| Code | Meaning |
|---|---|
| 200 | Successful operation |
| 400 | Invalid parameters or permission denied |
| 500 | Server error (database, calculation, or configuration error) |

## Permissions & Authentication

All endpoints require user authentication:
- **Read endpoints** (`/o/*`): Require `validateRead` with Online Users feature permission (`concurrent_users`)
- **Write endpoints** (`/i/*`): Require:
  - `validateCreate` for `/i/concurrent_alert/save` (new alerts)
  - `validateUpdate` for existing alerts
  - `validateDelete` for alert removal

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions
