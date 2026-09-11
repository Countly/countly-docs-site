---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-17"
---

# Recaptcha

The **Recaptcha** feature.

## Configuration & Settings

ReCAPTCHA settings in `api/config.js`:
- **Site Key**: Public reCAPTCHA site key
- **Secret Key**: Private verification key
- **Enabled Forms**: Login, registration, password reset

## API Endpoints

This feature does not expose user-facing API endpoints. It operates internally as part of Countly's core functionality.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `None` | ReCAPTCHA verification performed externally via Google API |

</details>
