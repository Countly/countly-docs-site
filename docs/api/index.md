---
sidebar_label: "Overview"
---

# Countly API Documentation

Welcome to the Countly Server API reference. This documentation covers all read (`GET /o/...`) and write (`POST /i/...`) endpoints across the core platform and enterprise plugins.

---

## Authentication

All API calls require one of the following keys, passed as a query parameter or in the request body:

| Key | Scope | How to obtain |
|-----|-------|---------------|
| `api_key` | Full access for the user | **Management → API Key** in the dashboard |
| `app_key` | App-level SDK writes | **Management → Apps → App Key** |

---

## Core API

The core platform ships with every Countly installation.

| Category | Description |
|----------|-------------|
| [Analytics](../core/analytics/index.md) | Sessions, users, and technology metrics |
| [App Users](../core/app-users/index.md) | User profiles, exports, and data subjects |
| [Apps](../core/apps/index.md) | Create, update, and delete applications |
| [Bulk](../core/bulk/index.md) | Batch request ingestion |
| [Events](../core/events/index.md) | Custom event tracking and management |
| [Export](../core/export/index.md) | Data export and downloads |
| [User Management](../core/users/index.md) | Dashboard user accounts and permissions |
| [Token](../core/token/index.md) | Authentication token management |
| [Tasks](../core/tasks/index.md) | Long-running task status and results |
| [SDK](../core/sdk/index.md) | SDK configuration endpoints |
| [System](../core/system/index.md) | Server health, jobs, and configuration |
| [Plugins](./plugins/index.md) | Plugin state and management |

---

## Enterprise Plugins

Features marked with **Ⓔ** require an Enterprise license.

### Analytics &amp; Insights

| Plugin | Description |
|--------|-------------|
| [Drill](./drill/index.md) **Ⓔ** | Raw event querying with filters and projections |
| [Funnels](./funnels/index.md) **Ⓔ** | Multi-step conversion funnels |
| [Flows](./flows/index.md) **Ⓔ** | User flow visualization |
| [Cohorts](./cohorts/index.md) **Ⓔ** | Behavioral user segments |
| [Formulas](./formulas/index.md) **Ⓔ** | Calculated metrics from existing data |
| [Retention Segments](./retention_segments/index.md) **Ⓔ** | Retention analysis by cohort |
| [Active Users](./active_users/index.md) **Ⓔ** | Daily / weekly / monthly active users |
| [Concurrent Users](./concurrent_users/index.md) **Ⓔ** | Real-time online user count |
| [Activity Map](./activity-map/index.md) **Ⓔ** | Geographic session heatmaps |
| [Times of Day](./times-of-day/index.md) | Session distribution by hour |

### User Engagement

| Plugin | Description |
|--------|-------------|
| [Push](./push/index.md) | Push notification campaigns |
| [Surveys](./surveys/index.md) **Ⓔ** | In-app surveys (NPS, ratings, feedback) |
| [Remote Config](./remote-config/index.md) | Server-side feature flags and variables |
| [AB Testing](./ab-testing/index.md) **Ⓔ** | Experiment variants and results |
| [Content](./content/index.md) **Ⓔ** | In-app content management |
| [Journey Engine](./journey_engine/index.md) **Ⓔ** | Automated user journeys |
| [AI Assistants](./ai-assistants/index.md) **Ⓔ** | AI-powered insights |

### Crashes &amp; Errors

| Plugin | Description |
|--------|-------------|
| [Crashes](./crashes/index.md) | Crash reporting and grouping |
| [Crash Symbolication](./crash_symbolication/index.md) **Ⓔ** | Symbol file upload and stack trace resolution |
| [Crashes Jira](./crashes-jira/index.md) **Ⓔ** | Jira integration for crash groups |
| [Error Logs](./errorlogs/index.md) | Server error log viewer |

### Security &amp; Authentication

| Plugin | Description |
|--------|-------------|
| [LDAP](./ldap/index.md) **Ⓔ** | LDAP / Active Directory SSO |
| [Active Directory](./active_directory/index.md) **Ⓔ** | Azure AD integration |
| [OIDC](./oidc/index.md) **Ⓔ** | OpenID Connect SSO |
| [Okta](./okta/index.md) **Ⓔ** | Okta SSO integration |
| [Cognito](./cognito/index.md) **Ⓔ** | AWS Cognito integration |
| [Two-Factor Auth](./two-factor-auth/index.md) | TOTP-based 2FA |
| [reCAPTCHA](./recaptcha/index.md) | Login reCAPTCHA protection |
| [Block](./block/index.md) **Ⓔ** | IP / device blocking |

### Data &amp; Infrastructure

| Plugin | Description |
|--------|-------------|
| [ClickHouse](./clickhouse/index.md) | ClickHouse analytics backend |
| [Kafka](./kafka/index.md) | Kafka event streaming |
| [Data Manager](./data-manager/index.md) **Ⓔ** | Event schema and transformation rules |
| [Data Migration](./data_migration/index.md) | Import / export server data |
| [Config Transfer](./config-transfer/index.md) **Ⓔ** | Transfer settings between servers |
| [DBViewer](./dbviewer/index.md) | Direct database collection browser |

### Dashboards &amp; Reporting

| Plugin | Description |
|--------|-------------|
| [Dashboards](./dashboards/index.md) | Custom dashboard builder |
| [Alerts](./alerts/index.md) | Metric-based alert rules |
| [Reports](./reports/index.md) | Scheduled email reports |

---

## Conventions

- **Read endpoints** — `GET /o/...` — retrieve data; require `api_key` + `app_id`.
- **Write endpoints** — `POST /i/...` — create or modify data; may require `app_key` or `api_key`.
- **Responses** — JSON. Successful calls return the result directly; errors return `{"result": "Error message"}`.
- **Pagination** — List endpoints accept `iDisplayStart` and `iDisplayLength` parameters.

---

## Quick Links

- [Countly Server (GitHub)](https://github.com/Countly/countly-server)
- [Product Documentation](https://support.count.ly)
- [Enterprise Features](https://count.ly/enterprise)
- [Guides](./guides/index.md)
