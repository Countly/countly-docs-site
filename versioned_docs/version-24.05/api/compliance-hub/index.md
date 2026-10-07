---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-17"
---

# Compliance Hub - API Documentation

## Overview

Compliance Hub provides consent analytics and consent-history exploration APIs used for privacy/compliance operations.

## Quick Links

- [Compliance Hub - Consents Read](o-consents-fetch.md)
- [Compliance Hub - Consent Current](o-consent-current.md)
- [Compliance Hub - Consent Search](o-consent-search.md)
- [Compliance Hub - App Users Consents](o-app-users-consents.md)

## Operational Notes

- `search` endpoint reads consent history from MongoDB (`countly.consent_history`) with skip/limit pagination.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.consents` | Consent metric time-series used by `method=consents` endpoint. |
| `countly.app_users{appId}` | Current per-user consent state and profile fields. |
| `countly.consent_history` | Consent change history source used by `search`. |
| `countly.members` | Used for endpoint authentication and Compliance Hub read permission validation. |
| `countly.apps` | Used for app-scoped validation and context resolution on app-specific requests. |

</details>
