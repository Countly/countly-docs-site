---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-15"
---

# Push Approver - API Documentation

:::note Enterprise
This feature is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Overview

Push Approver adds an approval workflow for push notifications. Messages can be held for approval, approved or rejected by designated approvers, and then scheduled after approval.

## Quick Links

- [Push Approver - Approve or Reject Message](push-approver-approve.md)
- [Push Approver - Approval Flow](push-approver-approval-flow.md)

## Notes

- Approvers are members with `approver: true`.
- `approver_bypass` allows auto-approval on activation.
- User create/update hooks are internal and not public endpoints.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.messages` | Push message records and approval status |
| `countly.members` | Approver flags (`approver`, `approver_bypass`) |

</details>
