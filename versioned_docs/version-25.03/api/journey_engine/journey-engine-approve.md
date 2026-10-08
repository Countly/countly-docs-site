---
sidebar_label: "Approve"
keywords:
  - "/i/journey-engine/approve"
  - "approve"
  - "journey-engine"
last_update:
  date: "2026-10-08"
---

# Journey Engine - Approve or Reject Journey

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/approve
```

## Overview

Approves or rejects a journey that is waiting for approval. Approving carries out the submitted action (publish, pause or resume); rejecting returns the journey to its previous status.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `journey_engine` feature
- **Additional rule**: the member must be an approver (`journey_approver`) or a global admin. Other members get `403`.
- A member cannot approve or reject a journey they submitted themselves, unless they are a global admin.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID |
| `journeyId` | String | Yes | Journey definition ID. |
| `versionId` | String | Yes | ID of the journey version that was submitted for approval. |
| `approve` | Boolean String | Yes | `true` to approve, `false` to reject. |
| `reason` | String | No | Reason for a rejection. Only the first 1024 characters are kept. |

## Examples

### Example 1: Approve a journey

```text
/i/journey-engine/approve?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&journeyId=67164f4a1f1bd90d6354430a&versionId=67164f4a1f1bd90d6354430b&approve=true
```

### Example 2: Reject a journey

```text
/i/journey-engine/approve?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&journeyId=67164f4a1f1bd90d6354430a&versionId=67164f4a1f1bd90d6354430b&approve=false&reason=Missing%20content
```

## Response

### Success Response

Approved:

```json
{
  "result": "approved",
  "status": "active",
  "journeyId": "67164f4a1f1bd90d6354430a",
  "versionId": "67164f4a1f1bd90d6354430b"
}
```

Rejected:

```json
{
  "result": "rejected",
  "status": "draft",
  "journeyId": "67164f4a1f1bd90d6354430a",
  "versionId": "67164f4a1f1bd90d6354430b"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | `approved` or `rejected`. |
| `status` | String | The journey's status after the decision. |
| `journeyId` | String | Journey definition ID. |
| `versionId` | String | ID of the journey version that was decided on. |

### Error Responses

| HTTP Status | Response |
|---|---|
| 400 | `Error: ...` (missing or invalid `journeyId`, `versionId` or `approve`) |
| 400 | `Journey is not pending approval` |
| 400 | `You cannot approve a journey you submitted` |
| 400 | `Journey has no submitted version to approve` |
| 400 | `Version does not match the one submitted for approval` |
| 400 | `Version not found or already active` |
| 403 | `You do not have permission to approve or reject journeys` |
| 404 | `Journey not found` |
| 500 | `Failed to process approval` |

## Behavior

- Looks up the journey in the given app. It must have the status `pending_approval`.
- `versionId` must be the version that was submitted for approval.
- On approval, the submitted action is carried out:
  - publish (default): the submitted version becomes the active version, all other non-deleted versions of the journey become drafts, and the journey becomes `active`.
  - pause: the version is paused and the journey becomes `draft`.
  - resume: the version is resumed and the journey becomes `active`.
- On rejection, the journey goes back to the status it had before it was submitted (or `draft` if none was recorded), and the reason is stored. If the submitting member is found, they are sent a rejection email with the reason.
- The approver and the time of the decision are stored on the journey.
- Writes a system log entry (`journey_<action>_approved` or `journey_<action>_rejected`).

## Related Endpoints

- [Publish Journey](journey-engine-journeys-publish.md)
- [Pause Journey](journey-engine-journeys-pause.md)
- [Resume Journey](journey-engine-journeys-resume.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_definition` | Journey definitions | Reads the journey; updates its status and approval details. |
| `countly.journey_versions` | Journey versions | Updates version statuses when publishing, pausing or resuming. |
| `countly.members` | Dashboard members | Reads the submitting member for the rejection email. |
| `countly.systemlogs` | Audit trail | Receives the approval or rejection entry. |

</details>
