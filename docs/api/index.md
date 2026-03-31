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
| [Analytics](../core/analytics) | Sessions, users, and technology metrics |
| [App Users](../core/app-users) | User profiles, exports, and data subjects |
| [Apps](../core/apps) | Create, update, and delete applications |
| [Bulk](../core/bulk) | Batch request ingestion |
| [Events](../core/events) | Custom event tracking and management |
| [Export](../core/export) | Data export and downloads |
| [User Management](../core/users) | Dashboard user accounts and permissions |
| [Token](../core/token) | Authentication token management |
| [Tasks](../core/tasks) | Long-running task status and results |
| [SDK](../core/sdk) | SDK configuration endpoints |
| [System](../core/system) | Server health, jobs, and configuration |
| [Plugins](../api/plugins) | Plugin state and management |

---

## Enterprise Plugins

Features marked with **Ⓔ** require an Enterprise license.

### Analytics &amp; Insights

| Plugin | Description |
|--------|-------------|
| [Drill](drill) **Ⓔ** | Raw event querying with filters and projections |
| [Funnels](funnels) **Ⓔ** | Multi-step conversion funnels |
| [Flows](flows) **Ⓔ** | User flow visualization |
| [Cohorts](cohorts) **Ⓔ** | Behavioral user segments |
| [Formulas](formulas) **Ⓔ** | Calculated metrics from existing data |
| [Retention Segments](retention_segments) **Ⓔ** | Retention analysis by cohort |
| [Active Users](active_users) **Ⓔ** | Daily / weekly / monthly active users |
| [Concurrent Users](concurrent_users) **Ⓔ** | Real-time online user count |
| [Activity Map](activity-map) **Ⓔ** | Geographic session heatmaps |
| [Times of Day](times-of-day) | Session distribution by hour |

### User Engagement

| Plugin | Description |
|--------|-------------|
| [Push](push) | Push notification campaigns |
| [Surveys](surveys) **Ⓔ** | In-app surveys (NPS, ratings, feedback) |
| [Remote Config](remote-config) | Server-side feature flags and variables |
| [AB Testing](ab-testing) **Ⓔ** | Experiment variants and results |
| [Content](content) **Ⓔ** | In-app content management |
| [Journey Engine](journey_engine) **Ⓔ** | Automated user journeys |
| [AI Assistants](ai-assistants) **Ⓔ** | AI-powered insights |

### Crashes &amp; Errors

| Plugin | Description |
|--------|-------------|
| [Crashes](crashes) | Crash reporting and grouping |
| [Crash Symbolication](crash_symbolication) **Ⓔ** | Symbol file upload and stack trace resolution |
| [Crashes Jira](crashes-jira) **Ⓔ** | Jira integration for crash groups |
| [Error Logs](errorlogs) | Server error log viewer |

### Security &amp; Authentication

| Plugin | Description |
|--------|-------------|
| [LDAP](ldap) **Ⓔ** | LDAP / Active Directory SSO |
| [Active Directory](active_directory) **Ⓔ** | Azure AD integration |
| [OIDC](oidc) **Ⓔ** | OpenID Connect SSO |
| [Okta](okta) **Ⓔ** | Okta SSO integration |
| [Cognito](cognito) **Ⓔ** | AWS Cognito integration |
| [Two-Factor Auth](two-factor-auth) | TOTP-based 2FA |
| [reCAPTCHA](recaptcha) | Login reCAPTCHA protection |
| [Block](block) **Ⓔ** | IP / device blocking |

### Data &amp; Infrastructure

| Plugin | Description |
|--------|-------------|
| [ClickHouse](clickhouse) | ClickHouse analytics backend |
| [Kafka](kafka) | Kafka event streaming |
| [Data Manager](data-manager) **Ⓔ** | Event schema and transformation rules |
| [Data Migration](data_migration) | Import / export server data |
| [Config Transfer](config-transfer) **Ⓔ** | Transfer settings between servers |
| [DBViewer](dbviewer) | Direct database collection browser |

### Dashboards &amp; Reporting

| Plugin | Description |
|--------|-------------|
| [Dashboards](dashboards) | Custom dashboard builder |
| [Alerts](alerts) | Metric-based alert rules |
| [Reports](reports) | Scheduled email reports |

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
- [Guides](guides)
