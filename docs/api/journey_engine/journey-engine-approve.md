---
sidebar_label: "Approve"
keywords:
  - "/i/journey-engine/approve"
  - "approve"
  - "journey-engine"
last_update:
  date: "2026-10-09"
---

# Journey Engine - Approve

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/approve
```

## Overview

Approves or rejects a journey that is pending approval. The approved action is the one that was submitted for approval: publish, pause or resume.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `journey_engine` feature
- The member must also be a journey approver or a global admin, otherwise the request is rejected with `403`.
- A member who is not a global admin cannot approve a journey they submitted themselves.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | Application ID. |
| `journeyId` | String | Yes | Journey definition ID. |
| `versionId` | String | Yes | Version ID the approval applies to. |
| `approve` | Boolean | Yes | `true` to approve, `false` to reject. |
| `reason` | String | No | Reason for the decision. Only used when rejecting; truncated to 1024 characters. |
| `api_key` | String | Conditional | Required if `auth_token` is not provided. |
| `auth_token` | String | Conditional | Required if `api_key` is not provided. |

## Examples

### Approve a journey

```text
/i/journey-engine/approve?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  journeyId=67164f4a1f1bd90d6354430a&
  versionId=67164f4a1f1bd90d6354430b&
  approve=true
```

### Reject a journey

```text
/i/journey-engine/approve?
  app_id=6991c75b024cb89cdc04efd2&
  api_key=YOUR_API_KEY&
  journeyId=67164f4a1f1bd90d6354430a&
  versionId=67164f4a1f1bd90d6354430b&
  approve=false&
  reason=Needs a shorter delay
```

## Response

### Success Response

```json
{
  "result": "approved",
  "status": "active",
  "journeyId": "67164f4a1f1bd90d6354430a",
  "versionId": "67164f4a1f1bd90d6354430b"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | `approved` or `rejected`. |
| `status` | String | Journey status after the decision. |
| `journeyId` | String | Journey definition ID from the request. |
| `versionId` | String | Version ID from the request. |

### Error Responses

- **400**: `Error: ...` when a required parameter is missing or invalid
- **400**: `Journey is not pending approval`
- **400**: `You cannot approve a journey you submitted`
- **400**: `Version not found or already active`
- **403**: `You do not have permission to approve or reject journeys`
- **404**: `Journey not found`
- **500**: `Failed to process approval`

## Behavior

- The journey must be in the pending approval state.
- Approving a publish request activates the given version and sets the journey to `active`.
- Approving a pause request pauses the version and sets the journey to `draft`.
- Approving a resume request resumes the version and sets the journey to `active`.
- Rejecting restores the status the journey had before it was submitted (`draft` if none was recorded) and stores the reason.
- The submitter of a rejected journey is notified by email.
- Each decision is written to system logs.

## Related Endpoints

- [Journey Engine - Versions Activate](journey-engine-versions-activate.md)
- [Journey Engine - Pause Journey](journey-engine-journeys-pause.md)
- [Journey Engine - Resume Journey](journey-engine-journeys-resume.md)
