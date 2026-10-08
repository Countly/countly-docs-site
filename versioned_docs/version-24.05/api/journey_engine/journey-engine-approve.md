---
sidebar_label: "Approve"
keywords:
  - "/i/journey-engine/approve"
  - "approve"
  - "journey-engine"
  - "approval"
last_update:
  date: "2026-10-08"
---

# Journey Engine - Approve or Reject

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```
/i/journey-engine/approve
```

## Overview

Approves or rejects a journey that is waiting for approval. Approving carries out the submitted action (publish, pause or resume); rejecting restores the journey's previous status.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- **Required permission**: `Update` on the `journey_engine` feature
- **Additional rule**: the member must be a journey approver or a global admin. Other members get `403`.
- **Additional rule**: a member who submitted the journey cannot approve it, unless they are a global admin.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `app_id` | String | Yes | App ID the journey belongs to. |
| `journeyId` | String | Yes | Journey definition ID. |
| `versionId` | String | Yes | ID of the version that was submitted for approval. |
| `approve` | Boolean String | Yes | `true` to approve, `false` to reject. |
| `reason` | String | No | Reason for a rejection. Truncated to 1024 characters. |

## Examples

### Approve a journey

```text
/i/journey-engine/approve?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&journeyId=67164f4a1f1bd90d6354430a&versionId=67164f4a1f1bd90d6354430b&approve=true
```

### Reject a journey

```text
/i/journey-engine/approve?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID&journeyId=67164f4a1f1bd90d6354430a&versionId=67164f4a1f1bd90d6354430b&approve=false&reason=Missing%20consent%20step
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
| `status` | String | Journey status after the request. |
| `journeyId` | String | Journey definition ID. |
| `versionId` | String | Version ID the request acted on. |

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

- Loads the journey in the given app and requires its status to be pending approval.
- The version in the request must be the one recorded when the journey was submitted.
- On approval, the submitted action decides what happens:
  - `publish` (default): sets all non-deleted versions of the journey to `draft`, then makes the submitted version `active`. The journey becomes `active`.
  - `pause`: pauses the version. The journey becomes `draft`.
  - `resume`: resumes the version. The journey becomes `active`.
- On rejection, the journey returns to the status it had before it was submitted (`draft` if none is recorded). The rejection reason is stored, and the member who submitted the journey is notified by email.
- Emits `journey_<action>_approved` or `journey_<action>_rejected` system log actions.

## Related Endpoints

- [Journey Engine - Journeys Publish](journey-engine-journeys-publish.md)
- [Journey Engine - Journeys Pause](journey-engine-journeys-pause.md)
- [Journey Engine - Journeys Resume](journey-engine-journeys-resume.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.journey_definition` | Journey definitions | Reads the journey and updates its status and approval record. |
| `countly.journey_versions` | Journey versions | Reads and updates version status. |
| `countly.members` | Members | Reads the submitting member for the rejection email. |

</details>
