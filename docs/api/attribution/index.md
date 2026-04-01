---
sidebar_position: 1
sidebar_label: "Overview"
---

# Attribution - API Documentation

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Attribution APIs manage campaigns and return campaign performance data such as clicks, installs, revenue, sessions, and total cost.

## Endpoint Index

- [Campaign Read](o-campaign.md) - `/o/campaign`
- [Campaign Create](i-campaign-create.md) - `/i/campaign/create`
- [Campaign Update](i-campaign-update.md) - `/i/campaign/update`
- [Campaign Delete](i-campaign-delete.md) - `/i/campaign/delete`
- [Campaign Hide](i-campaign-hide.md) - `/i/campaign/hide`
- [Campaign Show](i-campaign-show.md) - `/i/campaign/show`

## Database Collections

| Collection | Purpose |
|---|---|
| `countly.campaigns` | Campaign definitions and summary counters. |
| `countly.campaigndata` | Time-series campaign metrics used by campaign reporting. |
| `countly.attribution` | Click-tracking records keyed by campaign/user fingerprint. |
| `countly.campaign_users{appId}` | Per-app campaign user tracking documents. |

## Last Updated

2026-04-01
