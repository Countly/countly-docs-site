---
sidebar_label: "Queue - Debug"
keywords:
  - "/o/content/debug"
  - "debug"
  - "content"
---

# Get queue debug info

## Endpoint

```
/o/content/debug
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Returns user-friendly queue status details for one user.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the `content` feature

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier |
| uid | String | Yes | User ID |

## Response

### Success Response

```json
{
  "Queue Summary": {
    "Total Items": 2,
    "Last Content View": "2 hours ago",
    "Cooldown Status": "Cooldown expired 2 hours ago",
    "Content Available": "Yes"
  },
  "Next Available Content": {
    "Content ID": "5d4472152de8f07336f3b352",
    "Priority Level": 3,
    "Category": "Uncategorized",
    "Added to Queue": "5 minutes ago",
    "Expires": "in 23 hours",
    "Journey ID": "No Journey",
    "Additional Metadata": {}
  },
  "All Queue Items": [
    {
      "Content ID": "5d4472152de8f07336f3b352",
      "Priority Level": 3,
      "Category": "Uncategorized",
      "Added to Queue": "5 minutes ago",
      "Expires": "in 23 hours",
      "Journey ID": "No Journey",
      "Additional Metadata": {}
    }
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| Queue Summary | Object | Queue overview |
| Queue Summary.Total Items | Number | Number of non-expired queue items (max 20 listed) |
| Queue Summary.Last Content View | String | Relative time string |
| Queue Summary.Cooldown Status | String | Cooldown state description |
| Queue Summary.Content Available | String | Content availability summary |
| Next Available Content | Object/String | Next deliverable item details, or a cooldown/empty state string |
| All Queue Items | Array | List of queue entries with friendly fields |
| Queue Status | String | Returned when queue is empty |

### Error Responses

| HTTP Status | Response |
|---|---|
| 500 | `"Error"` |

## Behavior/Processing

1. Builds `EngagementQueue` for `app_id` + `uid`.
2. Reads user state and up to 20 non-expired queue entries.
3. Computes cooldown text and availability summary.
4. Returns a user-friendly debug object.

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.content_queue` | Endpoint data source | ** - Queue entries |
| `countly.app_users{app_id}` | Endpoint data source | ** - User content state (`content.last_view_ts`, `content.state_update_ts`) |
| `countly.apps` | Endpoint data source | ** - App plugin cooldown configuration lookup |

---

## Examples

### Example 1: Check Queue Status for a User

```text
/o/content/debug?api_key=YOUR_API_KEY&app_id=5be987d7b93798516eb5289a&uid=user_12345
```

## Related Endpoints

- [SDK Read - Content Delivery](delivery-retrieve.md): Retrieve content from queue
- [Content Blocks - Read](blocks-read.md): Inspect content definitions

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
