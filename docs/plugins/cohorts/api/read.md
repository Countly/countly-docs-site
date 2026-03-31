---
sidebar_label: "Cohorts Read"
---

# Get List of Cohorts

## Endpoint

`/o?method=get_cohorts`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Retrieves a paginated, filterable list of all cohorts and profile groups for an app. Supports searching, sorting, grouping, and custom projections for efficient cohort discovery and management.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the `cohorts` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| sSearch | String | No | Search term for filtering by name |
| iDisplayStart | Number | No | Pagination offset |
| iDisplayLength | Number | No | Records per page |
| outputFormat | String | No | `rows` (default) or `full` |
| type | String | No | Cohort type filter (for example `manual`) |
| group | String | No | Group filter (`fav`, `my`, or custom group key) |
| projection | JSON Array String | No | Optional projection field list |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |

## Response

### Success Response

Default (`outputFormat=rows`) response:

```json
[]
```

`outputFormat=full` response:

```json
{
  "sEcho": "0",
  "iTotalRecords": 0,
  "iTotalDisplayRecords": 0,
  "aaData": [],
  "favTotal": []
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `[]` | Array | Default rows output (when `outputFormat` is not `full`). |
| `sEcho` | String | DataTable echo value (`outputFormat=full`). |
| `iTotalRecords` | Number | Total rows before filtering (`outputFormat=full`). |
| `iTotalDisplayRecords` | Number | Total rows after filtering (`outputFormat=full`). |
| `aaData` | Array | Paged cohort rows (`outputFormat=full`). |
| `favTotal` | Array | Favorite facet output (`outputFormat=full`). |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 200 | `false` | Returned on aggregation error branch (`err || !res`) |
| 400 | `{"result": "Insufficient permissions"}` | User lacks Read permission |

---

## Behavior/Processing

- Validates read permission for `cohorts` feature.
- Filters cohorts by app_id and excludes system cohorts (names starting with `[CLY]`).
- Applies visibility filters based on user permissions.
- Supports filtering by cohort type (`auto` vs `manual`).
- Supports grouping filters (`fav`, `my`, or custom groups).
- Uses MongoDB aggregation pipeline for efficient querying.
- Returns paginated results with total counts.
- Includes favorite count in separate `favTotal` field.
- Hides internal group values from response.

### Visibility Rules

- **Global cohorts**: Visible to all users with read permission
- **Private cohorts**: Only visible to creator and users with edit access
- **Shared cohorts**: Visible to creator and specified email list

---

## Examples

### Example 1: Get All Cohorts

**Description**: Retrieve first page of all cohorts.

**Request**:
```bash
curl -X GET "https://your-server.com/o?method=get_cohorts" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "outputFormat=full"
```

**Response**:
```json
{
  "aaData": [
    {
      "_id": "cohort123",
      "name": "Active Users - Last 7 Days",
      "type": "auto",
      "result": 15234,
      "created_at": 1705000000000
    },
    {
      "_id": "cohort456",
      "name": "Beta Testers",
      "type": "manual",
      "result": 250,
      "created_at": 1704900000000
    }
  ],
  "iTotalRecords": 2,
  "iTotalDisplayRecords": 2
}
```

### Example 2: Filter by Type

**Description**: Get only dynamic (auto) cohorts.

**Request**:
```bash
curl -X GET "https://your-server.com/o?method=get_cohorts" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "type=auto" \
  -d "outputFormat=full"
```

**Response**:
```json
{
  "aaData": [
    {
      "_id": "cohort123",
      "name": "Active Users - Last 7 Days",
      "type": "auto",
      "result": 15234
    }
  ],
  "iTotalRecords": 1,
  "iTotalDisplayRecords": 1
}
```

### Example 3: Get My Cohorts

**Description**: Retrieve only cohorts created by the authenticated user.

**Request**:
```bash
curl -X GET "https://your-server.com/o?method=get_cohorts" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "group=my" \
  -d "outputFormat=full"
```

**Response**:
```json
{
  "aaData": [
    {
      "_id": "cohort789",
      "name": "My Test Cohort",
      "type": "auto",
      "creator": "user_123",
      "result": 450
    }
  ],
  "iTotalRecords": 1,
  "iTotalDisplayRecords": 1
}
```

### Example 4: Search and Pagination

**Description**: Search for cohorts with "active" in name, get page 2.

**Request**:
```bash
curl -X GET "https://your-server.com/o?method=get_cohorts" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "sSearch=active" \
  -d "iDisplayStart=10" \
  -d "iDisplayLength=10" \
  -d "outputFormat=full"
```

### Example 5: Custom Projection

**Description**: Get only specific fields to reduce response size.

**Request**:
```bash
curl -X GET "https://your-server.com/o?method=get_cohorts" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d 'projection=["name","type","result"]' \
  -d "outputFormat=full"
```

**Response**:
```json
{
  "aaData": [
    {
      "name": "Active Users",
      "type": "auto",
      "result": 15234
    }
  ]
}
```

---

## Technical Notes

### Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Endpoint data source | **: Cohort definitions and metadata |
| `allowDiskUse: true` | Uses MongoDB aggregation pipeline with | for large result sets ### Configuration |
| `realtime_cohorts` | Endpoint data source | **: Affects whether cohort results are live or cached (default: `true`) |
| `created_at` | DataTable default sorting: | descending ### Limitations |
| `[CLY]` | System cohorts (names starting with | ) are excluded from results ### Performance Considerations |
| `app_id` | Uses indexed queries on | and `creator` |

---

## Database Collections

- `countly.cohorts` - Stores cohort definitions, visibility, and metadata

## Related Endpoints

- [Cohort - Read](cohort-single-read.md)
- [Cohort - Create](cohort-create.md)
- [Cohort - Update](cohort-edit.md)
- [Cohort - Delete](cohort-delete.md)

---

## Best Practices

- Use pagination for apps with many cohorts
- Apply type filters when only dynamic or manual cohorts are needed
- Use projection to fetch only required fields
- Cache cohort lists on client side when appropriate
- Use search functionality for user-driven cohort discovery
- Filter by `group=fav` to show user's favorite cohorts
- Regular cleanup of unused cohorts improves query performance

---

## Errors & Troubleshooting

- `403` - Missing read permission for `cohorts` feature
- `400` - Invalid app_id or missing required parameters
- `500` - Database query error (check logs for details)
- Empty `aaData` - No cohorts match filters or user has no visibility
- Slow queries - Consider adding indexes or reducing result set size

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

## Last Updated

2026-02-16
