---
sidebar_position: 1
sidebar_label: "Overview"
keywords:
  - "/o"
  - "GET /o"
  - "o"
---

# User Profiles - API Documentation

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The User Profiles feature provides comprehensive user-level analytics and detailed user profile management for Countly Enterprise. It enables access to individual user timelines, engagement metrics, session data, event tracking, and custom user properties—all critical for understanding user behavior at the finest granularity.

This feature extends Countly's drill functionality to expose user-specific analytics endpoints, allowing administrators and analysts to drill down from aggregated data to individual user records with full event history, session information, and custom attributes.

## Key Features

- **User List & Search**: Query lists of users with filtering, sorting, and pagination
- **User Details**: Access complete user profiles including engagement scores and custom properties
- **User Timeline**: View chronological event and session history for individual users
- **User Graph Analytics**: Time-series graphs of user engagement, sessions, and event frequency
- **Session Breakdown**: Review detailed session information per user with duration, location, device info
- **Event Timeline**: Complete event history per user with calculated properties and custom dimensions
- **Engagement Scoring**: Automatic engagement metrics including session count, days active, and activity frequency
- **Custom Properties**: Store and query unlimited custom user properties with expiration policies
- **User Search**: Full-text search across user names, emails, usernames, and device IDs
- **Batch Processing**: Server-side batch processing for large user queries with configurable limits

## Configuration Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `custom_set_limit` | `50` | Number | Maximum number of custom properties per user | `COUNTLY_CONFIG_PLUGINUSERS_CUSTOMSETLIMIT` |
| `custom_prop_limit` | `20` | Number | Individual property value limit for custom properties | `COUNTLY_CONFIG_PLUGINUSERS_CUSTOMPROPLIMIT` |
| `show_notes_in_list` | `true` | Boolean | Display user notes in user list view | `COUNTLY_CONFIG_PLUGINUSERS_SHOWNOTESINLIST` |
| `sampling_threshold` | `100000` | Number | User count threshold for enabling sampling in queries | `COUNTLY_CONFIG_PLUGINUSERS_SAMPLINGTHRESHOLD` |
| `batch_size` | `100` | Number | Number of users processed per batch in background jobs | `COUNTLY_CONFIG_PLUGINUSERS_BATCHSIZE` |
| `batch_cooldown` | `10` | Number | Milliseconds between batch processing cycles | `COUNTLY_CONFIG_PLUGINUSERS_BATCHCOOLDOWN` |
| `app_user_job` | `true` | Boolean | Enable background jobs for user aggregation and stats | `COUNTLY_CONFIG_PLUGINUSERS_APPUSERJOB` |
| `engagement_score` | `true` | Boolean | Calculate and track engagement score metrics per user | `COUNTLY_CONFIG_PLUGINUSERS_ENGAGEMENTSCORE` |

## Authentication

All user analytics endpoints require standard Countly authentication:

| Method | Required | Description |
|--------|----------|-------------|
| **HTTP Method** | GET or POST | Both methods accepted interchangeably |
| **API Key** | Yes | Admin or analyst API key with user read permissions |
| **App ID** | Yes | Application ID for which to retrieve user data |

## Endpoints

- [User Profiles - List/Profile](list.md) - **GET** `/o?method=user_details`
- [User Profiles - Timeline Graph](graph.md) - **GET** `/o?method=user_details&calculate=graph`
- [User Profiles - Sessions](sessions.md) - **GET** `/o?method=user_details&calculate=sessions`
- [User Profiles - Events Table](events-table.md) - **GET** `/o?method=user_details&calculate=eventsTable`
- [User Profiles - History](history.md) - **GET** `/o?method=user_details&calculate=history`
- [User Profiles - Counts](counts.md) - **GET** `/o?method=user_counts`
- [User Profiles - Update Properties](update-properties.md) - **POST** `/i?user_details`

### Internal Events (Not Public Requests)

These endpoints are internal lifecycle events dispatched by core and should not be treated as public API requests:

- `POST /i/apps/create`
- `POST /i/apps/reset`
- `POST /i/apps/clear_all`

## Database Collections

The User Profiles feature stores and queries data from these MongoDB collections:

| Collection | Purpose | Fields |
|------------|---------|--------|
| `countly.app_users{appid}` | User profiles with engagement metrics and custom properties | `_id`, `uid`, `name`, `email`, `custom`, `engagement_score`, `sc` (session count), `ls` (last session), `tsd` (total session duration) |
| `countly_drill.drill_events` | Event records for all users including custom properties | `ts`, `e` (event name), `u` (user ID), `c` (custom properties), `cc` (country), `cty` (city), `did` (device ID), `p` (platform) |
| `countly_drill.drill_meta` | Event and property metadata including custom property definitions | `_id`, `e` (event names), `s` (segment names), `custom` (custom property definitions) |
| `countly.apps` | Application configurations including user custom property settings | `_id` (app_id), `ovveridden_types` (custom property type overrides) |

### Collection Indexes

The User feature automatically creates the following indexes on `countly.app_users{appid}`:

- `uid`: User ID lookup
- `name`: User name search
- `{hasInfo: 1, name: 1}`: Efficient filtration by profile completion
- `sc`: Session count aggregations
- `{hasInfo: 1, sc: 1}`: Combined profile and session filtering
- `{hasInfo: 1, lac: -1}`: Last activity tracking
- `tsd`: Total session duration sorting
- `{hasInfo: 1, tsd: 1}`: Duration-based queries
- `{name: "text", email: "text", username: "text", did: "text", uid: "text"}`: Full-text search index
- `{"chr.$**": 1}`: Custom property wildcard index for flexible custom property queries
- `{hasInfo: 1, ls: -1}`: Last session recency sorting

## User Profile Fields

### Core Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `_id` | String | User identifier (device hash at first, can be changed by SDK) | `abc1234567890def1234567890abc123` |
| `uid` | Number | Numeric user identifier | `12345` |
| `name` | String | User's full name | `John Doe` |
| `email` | String | User's email address | `john@example.com` |
| `username` | String | User login username | `johndoe` |
| `phone` | String | User's phone number | `+1-555-123-4567` |
| `organization` | String | User's organization/company | `Acme Corp` |
| `picture` | String | URL path to user's profile picture | `/userimages/123456789/{uid}.png` |

### Demographic Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `byear` | Number | Birth year | `1991` |
| `age` | Number | Calculated age (current year - birth year) | `33` |
| `gender` | String | Gender: M (male), F (female), or empty | `M` |
| `cc` | String | Country code (2-letter ISO) | `US` |
| `cty` | String | City name | `New York` |

### Engagement Metrics

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `sc` | Number | Session count (total number of sessions) | `42` |
| `e` | Number | Event count (total events recorded) | `1245` |
| `d` | Number | Days active (distinct days with activity) | `38` |
| `ls` | Number | Last session timestamp (Unix epoch) | `1707619200` |
| `tsd` | Number | Total session duration (milliseconds) | `126540` |
| `ds` | Number | Device switching count | `5` |
| `engagement_score` | Number | Calculated engagement metric (0-100+) | `75` |
| `engagement` | Object | Per-day engagement breakdown (if enabled) | `{"2024-01-15": {"sc": 2, "sd": 1200}}` |

### Technical Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `did` | String | Device ID | `device123ABC` |
| `uid_seq` | Number | Sequential user ID | `1000` |
| `hasInfo` | Boolean | Whether user has any information set | `true` |
| `customMeta` | Object | Metadata for custom properties (last updated times) | `{"property_name": {"last_updated": 1707619200}}` |

### Custom Properties

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `custom` | Object | User-defined custom properties (up to `custom_set_limit` properties) | `{"subscription_tier": "premium", "ltv": 250.50}` |

## Use Cases

### Use Case 1: High-Value Customer Analysis

Identify and analyze high-value customers with engagement metrics:

```
GET /o?api_key={API_KEY}&app_id={APP_ID}&method=user_details
     &query={"custom.ltv":{$gte:1000}}
     &sort=tsd&order=-1
     &iDisplayLength=100
     &calculate=graph
     &period=30days
```

**Purpose**: Find top users by lifetime value and engagement, track their session trends.

### Use Case 2: User Churn Detection

Identify users at risk of churning based on inactivity:

```
GET /o?api_key={API_KEY}&app_id={APP_ID}&method=user_details
     &query={"ls":{$lt:{currentTimestamp - 30days}},
             "sc":{$gte:10}}
     &sort=ls&order=1
     &calculate=sessions
```

**Purpose**: Find previously active users who haven't returned in 30 days; retrieve their last sessions.

### Use Case 3: Feature Adoption Tracking

Track which users have adopted a new feature:

```
GET /o?api_key={API_KEY}&app_id={APP_ID}&method=user_details
     &query={"custom.feature_adopted":true}
     &calculate=eventsTable
     &period=7days
```

**Purpose**: Monitor event patterns among users who've adopted a feature.

### Use Case 4: Segmentation by Demographics

Query users by demographic segment:

```
GET /o?api_key={API_KEY}&app_id={APP_ID}&method=user_details
     &query={"cc":"US","age":{$gte:25,$lte:45}}
     &sort=sc&order=-1
```

**Purpose**: Analyze engagement patterns within demographic segments.

### Use Case 5: Individual User Deep Dive

Get complete activity history for a specific user:

```
GET /o?api_key={API_KEY}&app_id={APP_ID}&method=user_details
     &uid={USER_ID}&calculate=eventsTable
     &period=90days&bucket=daily
```

**Purpose**: Audit complete user journey over extended period.

## Best Practices

### Query Performance

1. **Use Sampling for Large User Bases**: When user count exceeds `sampling_threshold`, server automatically enables sampling
2. **Limit Query Results**: Use `iDisplayLength` to paginate; avoid requesting all records at once
3. **Add Specific Queries**: Narrow queries with filtered `query` parameter to reduce scope
4. **Sort Efficiently**: Sort by indexed fields (`sc`, `ls`, `tsd`, `cc`) for fastest results
5. **Cache Results**: Cache frequently accessed user lists to reduce database load

### Custom Property Management

1. **Stay Within Limits**: Do not exceed `custom_set_limit` (default: 50 properties per user)
2. **Use Consistent Keys**: Use consistent key naming (e.g., snake_case: `subscription_tier`, not `subscriptionTier`)
3. **Type Consistency**: Keep same parameter type across all users to avoid type coercion issues
4. **Set Expiration TTL**: Configure custom property TTL to auto-clean temporary properties
5. **Regular Audits**: Periodically review unused custom properties and clean them

### Engagement Scoring

1. **Enable Scoring**: Set `engagement_score: true` in configuration to track engagement metrics
2. **Review Thresholds**: Adjust engagement score calculations in application code as needed
3. **Account for Seasonality**: Consider seasonal patterns when interpreting engagement trends
4. **Multi-Dimensional Analysis**: Combine engagement with custom properties for better insights

### Search & Filtering

1. **Full-Text Search**: Use `sSearch` parameter for flexible user lookup across multiple fields
2. **Query Syntax**: Use MongoDB query syntax for advanced filtering
3. **Regular Expressions**: Match patterns with `{field: {$regex: "pattern", $options: "i"}}`
4. **Compound Filters**: Combine conditions for complex segmentation

## Common Parameters & Values

### Period Values

Standard time period values for analytics queries:

- `today` - Current calendar day
- `yesterday` - Previous calendar day
- `7days` - Last 7 calendar days
- `30days` - Last 30 calendar days
- `60days` - Last 60 calendar days
- `90days` - Last 90 calendar days
- `month` - Current calendar month
- `year` - Current calendar year

### Bucket Values

Time aggregation granularity:

- `hourly` - Group by hour (for periods up to 3 days)
- `daily` - Group by day (default)
- `weekly` - Group by ISO week
- `monthly` - Group by month

### Sort Fields

Common field names for sorting user lists:

| Field | Description |
|-------|-------------|
| `sc` | Session count |
| `e` | Event count |
| `ls` | Last session timestamp (Descending: -1) |
| `tsd` | Total session duration (Descending: -1) |
| `d` | Days active |
| `name` | User name |
| `engagement_score` | Engagement metric |

## Troubleshooting

### Empty User List

**Problem**: Query returns `iTotalRecords: 0` when users should exist

**Solutions**:
- Verify API key has read permissions for users analytics
- Check app_id is correct and contains user data
- Ensure users have been processed (app_user_job must be enabled)
- Confirm user has activity data (e.g., `hasInfo: true`)

### Slow Query Performance

**Problem**: User list queries take > 5 seconds to respond

**Solutions**:
- Limit result set with `iDisplayLength` parameter
- Add specific query filters to reduce result scope
- Sort by indexed fields only (e.g., `sc`, `ls`, `tsd`)
- Check server resource availability (CPU, disk I/O)
- Consider splitting query into smaller time periods

### Custom Properties Not Appearing

**Problem**: Custom properties aren't showing in `custom` field

**Solutions**:
- Verify custom properties were sent by SDK with `user_details` parameter
- Check property count is under `custom_prop_limit` (default: 20)
- Confirm property value type is compatible (string, number, array, object)
- Verify SDK version supports custom user properties
- Check property wasn't filtered by TTL (Session-scoped properties expire after session)

### Engagement Score Not Calculated

**Problem**: `engagement_score` field is missing from user profiles

**Solutions**:
- Set `engagement_score: true` in feature configuration
- Ensure user has at least one session recorded
- Confirm background jobs are enabled (`app_user_job: true`)
- Wait for next aggregation cycle (daily job)
- Check server logs for job execution errors

### Graph Data Missing

**Problem**: Graph calculation returns empty data with `calculate=graph`

**Solutions**:
- Verify `period` parameter is reasonable (not more than 1 year)
- Ensure user has events in selected period
- Confirm `bucket` value matches period (e.g., `hourly` only for periods up to 3 days)
- Check drill events collection contains data for app_id
- Verify `drill_meta` collection exists with event definitions

### Search Not Working

**Problem**: `sSearch` parameter doesn't return expected users

**Solutions**:
- Verify full-text search index was created on app_users collection
- Check search term appears in name, email, username, or device ID
- Use substring search: `{name: {$regex: "substring", $options: "i"}}`
- Ensure user has `hasInfo: true` (profile information set)
- Try reducing search complexity (single term vs. multi-term phrases)

## Performance Considerations

- **User Count Impact**: Queries on large user bases (100k+) may require sampling
- **Query Complexity**: Complex MongoDB queries with $regex or $text operations slower than indexed field lookups
- **Time Period**: Longer periods require more drill events processing
- **Batch Processing**: Large batch_size may increase memory usage; tune based on available RAM
- **Disk I/O**: User list queries hit MongoDB heavily; ensure adequate disk I/O bandwidth

## Integration with Other Features

The User Profiles feature integrates with:

- **Drill feature**: Extends drill query infrastructure for user-level analytics
- **Data Manager Feature**: Users custom properties can be managed through data-manager API
- **Cohorts feature**: Users can be organized into cohorts based on custom properties and engagement
- **Crash Reporting**: User context automatically captured for crash logs
- **Session Management**: Engagement metrics derived from session feature

## Related Documentation

- [Drill feature - Advanced Querying](../drill/index.md)
- [Data Manager - Custom Properties](../data-manager/index.md)
- [Cohorts feature - User Segmentation](../cohorts/index.md)

## Additional Resources

- [MongoDB Query Language Reference](https://docs.mongodb.com/manual/reference/operator/query/)
- [Full-Text Search in MongoDB](https://docs.mongodb.com/manual/text-search/)
- [Countly SDK User Properties](https://resources.count.ly/docs)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

