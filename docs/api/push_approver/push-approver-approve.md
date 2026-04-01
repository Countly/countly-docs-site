---
sidebar_label: "Approve or Reject"
keywords:
  - "/i/push/approve"
  - "approve"
  - "push"
---

# Push Approver - Approve or Reject Message

## Endpoint

```text
/i/push/approve
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Approves or rejects a push message that is waiting for approver action.

## Authentication

**Authentication methods**:
- API Key (parameter): `api_key=YOUR_API_KEY`
- Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
- Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`

## Permissions

- Push Approver: `Update` permission on the Push feature.
- Caller must also be an approver (`member.approver = true`).

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `_id` | String (ObjectID) | Yes | Push message ID |
| `approve` | Boolean String | Yes | `true` to approve, `false` to reject |

## Response

### Success Response

```json
{
  "_id": "67b9c2e2f67aab0012cd3456",
  "app": "6991c75b024cb89cdc04efd2",
  "status": "active",
  "info": {
    "createdBy": "67b9c1a8f67aab0012cd1234",
    "approved": "2026-02-15T14:20:12.151Z",
    "approvedBy": "67b9c1fdf67aab0012cd2345",
    "approvedByName": "Approver User"
  }
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `_id` | String | Push message ID |
| `app` | String | App ID attached to the message |
| `status` | String | `active` when approved, `rejected` when rejected |
| `info` | Object | Message metadata including approver/rejector details |

### Error Responses

- **HTTP 400** - Validation failure or permission issue:
```json
{
  "errors": [
    "You're not an approver"
  ]
}
```

- **HTTP 400** - Already approved:
```json
{
  "errors": [
    "The message has been already approved"
  ]
}
```

- **HTTP 404** - Message not found:
```json
{
  "errors": [
    "No such message"
  ]
}
```

## Behavior/Processing

- Validates `_id` and `approve` with `common.validateArgs(...)`.
- Rejects self-approval/rejection attempts by message creator.
- On approve: updates message status to `active`, writes approver metadata, then schedules eligible message sending.
- On reject: updates message status to `rejected`, writes rejector metadata, and notifies creator by email.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.messages` | Push/message records | Stores message lifecycle and approval/scheduling state used by this endpoint. |
| `countly.members` | Member/account enrichment | Stores member profile fields (for example names/IDs) used to resolve actor metadata. |

---

## Examples

```text
/i/push/approve?api_key=YOUR_API_KEY&_id=67b9c2e2f67aab0012cd3456&approve=true
```

```text
/i/push/approve?api_key=YOUR_API_KEY&_id=67b9c2e2f67aab0012cd3456&approve=false
```

## Related Endpoints

- [Push Approver - Approval Flow](push-approver-approval-flow.md)

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

---

## Last Updated

2026-02-16
