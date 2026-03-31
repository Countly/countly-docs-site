---
sidebar_position: 1
sidebar_label: "Overview"
---

# Push Approver - API Documentation

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Push Approver adds an approval workflow for push notifications. Messages can be held for approval, approved or rejected by designated approvers, and then scheduled after approval.

## Quick Links

- [Push Approver - Approve or Reject Message](push-approver-approve.md)
- [Push Approver - Approval Flow](push-approver-approval-flow.md)

## Database Collections

| Collection | Purpose |
|---|---|
| `countly.messages` | Push message records and approval status |
| `countly.members` | Approver flags (`approver`, `approver_bypass`) |

## Notes

- Approvers are members with `approver: true`.
- `approver_bypass` allows auto-approval on activation.
- User create/update hooks are internal and not public endpoints.

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

---

_Last Updated: 2026-02-15_
