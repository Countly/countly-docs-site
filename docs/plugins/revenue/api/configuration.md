---
sidebar_label: "Configuration"
---

# Revenue - Configuration Reference

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

This page explains Revenue feature settings and how they affect endpoint behavior. It does not define a standalone public endpoint.

## Configuration

Revenue tracking uses app plugin config:

- `apps.plugins.revenue.iap_events` (Array of event keys)

These event keys are treated as purchase events during user-property updates and paying-user calculations.

## Operational Impact

When an incoming SDK event matches configured `iap_events` and has `sum`:

- User profile totals are updated (`tp`, `tpc`, `lp`, `lpa`, `purchased`).
- Aggregated paying-user counters are updated in time buckets.
- Revenue analytics endpoint (`/o/revenue`) can report `p` values and purchase totals.

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.apps` | App configuration and metadata | Stores app-level feature settings and metadata used or modified by this endpoint. |
| `countly.app_users{appId}` | Per-app user profiles | Stores user-level properties and profile fields affected by this endpoint. |
| `countly.users` | User aggregates | Stores app-level user aggregate counters/metrics read or updated by this endpoint. |

## Best Practices

- Keep event names stable and consistent.
- Ensure purchase events always include valid `sum` values.
- Normalize currency before sending events when multi-currency sources are used.

## Related Endpoints

- [Revenue - Analytics](analytics.md)

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
