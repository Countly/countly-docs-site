---
sidebar_label: "Cohort Read"
---

# Get Cohort Details

## Endpoint

`/o?method=get_cohort`

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Retrieves detailed information about a single cohort, including configuration, member count, creation metadata, and current state. Provides comprehensive view of cohort definition and status.

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
| cohort | String | Yes | ID of the cohort to retrieve |

## Configuration Impact

| Setting | Default | Affects | User-visible impact |
|---|---|---|---|
| `api.*` | Server API defaults | Shared API execution controls (for example processing thresholds/limits). | Changes to API-level controls can affect runtime behavior, limits, or response timing for this endpoint. |

## Response

### Success Response

```json
{
  "_id": "cohort1234567890abc",
  "app_id": "APP_ID",
  "name": "High Value Users",
  "description": "Users with revenue > $100",
  "type": "auto",
  "created_at": 1234567890,
  "result": 1050
}
```

When cohort is not found or not visible to the member, the endpoint returns:

```json
false
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root object)` | Object or Boolean | Cohort document, or `false` when not found/not visible. |
| `_id` | String | Unique cohort identifier |
| `app_id` | String | Application ID this cohort belongs to |
| `name` | String | Name of the cohort |
| `type` | String | Cohort type: `auto` or `manual` |

### Error Responses

No explicit `returnMessage(...)` path in this branch; not-found and unauthorized visibility paths return `false`.

---

## Behavior/Processing

- Validates read permission for `cohorts` feature.
- Validates app_id and cohort_id parameters.
- Retrieves cohort document from `cohorts` collection.
- Includes full cohort configuration:
  - Metadata (name, description, type, timestamps)
  - Access control (creator, owner, visibility)
  - Definition (steps for auto cohorts, segmentation query)
  - State information (current status, member count)
  - Optional: Calculated metrics if available
- Returns comprehensive cohort snapshot.

### Included Fields

- **Metadata**: `_id`, `name`, `cohort_desc`, `type`, `created_at`, `updated_at`
- **Access**: `creator`, `owner_id`, `visibility`, `shared_email_edit`
- **Config**: `steps`, `user_segmentation`, `times`, `group`
- **State**: `state`, `member_count`, `last_calculated`
- **Metrics**: If calculated, includes member trends and engagement stats

---

## Examples

### Example 1: Fetch cohort details

**Request**:
```bash
curl -X GET "https://your-server.com/o?method=get_cohort" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d "cohort=COHORT_ID"
```

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.cohorts` | Collection: | Source of cohort definition and metadata |
| `countly.cohortdata` | Optional Collection: | Source of aggregated metrics if requested |

---

## Limitations

- Does not return individual member list (use separate endpoint)
- Metrics only included if previously calculated
- Historical data only available if retention enabled

---

## Database Collections

- `countly.cohorts` - Stores cohort definitions and configuration
- `countly.members` - Resolves creator metadata for cohort details

## Related Endpoints

- [Get list of cohorts](read.md) - GET /o?method=get_cohorts
- [Get cohort metrics](cohort-metrics-read.md) - GET /o?method=get_cohort_metrics
- [Get cohort state](cohort-state-read.md) - GET /o?method=cohortstate

---

## Use Cases

1. **UI display**: Fetch cohort details for editing form
2. **Integration**: Get cohort configuration for external sync
3. **Validation**: Verify cohort exists and is accessible
4. **Audit**: Review cohort definition and ownership
5. **Analytics**: Check cohort metrics and member count


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
