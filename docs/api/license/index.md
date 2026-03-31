---
sidebar_position: 1
sidebar_label: "Overview"
---

# License

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The License feature manages Countly Enterprise dashboard licensing. It controls access to the dashboard UI based on license status and usage metrics (DP or MAU). Data ingestion continues even when the dashboard is locked.

## Key Concepts

- **License file**: JWT file uploaded into the dashboard; contains client info and usage limits.
- **Billing metrics**: One of `dp_monthly`, `dp_total`, `active_monthly`, `active_avg_monthly`, or `unlimited`.
- **Locking rules**: Dashboard locks if no license, expired license, or usage limit exceeded (with warning period).
- **Warning period**: 3-day grace period before lock after a failure condition.

## Components and Responsibilities

License functionality spans multiple features:

- **license (this feature)**: UI for uploading license and viewing usage.
- **drill**: Backend endpoints for license upload and metrics.
- **license-generator (stats server)**: Generates license files.
- **license-viewer (stats server)**: Displays metrics from client dashboards.

## License File Fields

Common fields stored inside the JWT:

- `name`: Client name
- `rule`: Billing metric rule
- `start`, `end`: License period (unix timestamps)
- `license_stage`: `Testing`, `Trial`, `Production`
- `license_hosting`: `Self-Hosted` or `Countly-Hosted`
- `tiers`: Usage limits
- `active_tier`: Active usage tier
- `lock_on_metric`, `lock_on_expire`: Locking behavior flags
- `disable_tracking`: Stop sending metrics to stats server
- `_id`: License ID

## Related Endpoints (in Drill)

License endpoints live in the Drill feature:

- `GET /o/license-metrics/mau`
- `GET /o/license-metrics/dp`

## Notes

- This feature does not register public API endpoints.
- Dashboard locking is enforced by the Drill frontend logic.

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

