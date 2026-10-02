---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-17"
---

# Guides

The **Guides** feature manages in-app user onboarding guides and tutorials.

## Configuration & Settings

Guides configured through dashboard UI. No API settings.

## API Endpoints

This feature does not expose user-facing API endpoints. It operates internally as part of Countly's core functionality.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `app_users{appId}` | User profiles with guide completion status |

</details>
