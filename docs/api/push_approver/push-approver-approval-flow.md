---
sidebar_label: "Approval Flow"
last_update:
  date: "2026-02-16"
---

# Push Approver - Approval Flow

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Overview

This page documents internal approval workflow behavior for push activation. It is not a direct public API endpoint.

## Workflow

1. Push activation enters the approval workflow check.
2. If creator has `approver_bypass`, the message is auto-approved and scheduled.
3. Otherwise message status is set to `inactive` and approvers are notified by email.
4. An approver later uses `/i/push/approve` to approve or reject.

## Impact

- Pending approval messages remain inactive and are not scheduled.
- Approved messages are eligible for scheduling.
- Rejected messages are marked as rejected and creator is notified.

## Related Endpoints

- [Push Approver - Approve or Reject Message](push-approver-approve.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.messages` | Push/message records | Stores message lifecycle and approval/scheduling state used by this flow. |
| `countly.members` | Member/account enrichment | Stores member profile fields (for example names/IDs) used to resolve actor metadata. |

</details>
