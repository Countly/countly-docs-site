---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-04-01"
---

# Attribution - API Documentation

:::note Enterprise
This feature is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Overview

Attribution APIs manage campaigns and return campaign performance data such as clicks, installs, revenue, sessions, and total cost.

Campaign clicks are recorded when users open a campaign link ([Campaign Click](i-campaign-click.md)). Server-to-server postbacks ([Campaign Postback](i-campaign-postback.md)) record a click and an install for the matched user.

## Endpoint Index

- [Campaign Read](o-campaign.md) - `/o/campaign`
- [Campaign Data Read](o-campaign-data.md) - `/o?method=campaigndata`
- [Campaign Create](i-campaign-create.md) - `/i/campaign/create`
- [Campaign Update](i-campaign-update.md) - `/i/campaign/update`
- [Campaign Delete](i-campaign-delete.md) - `/i/campaign/delete`
- [Campaign Hide](i-campaign-hide.md) - `/i/campaign/hide`
- [Campaign Show](i-campaign-show.md) - `/i/campaign/show`
- [Campaign Click](i-campaign-click.md) - `/i/campaign/click`
- [Campaign Postback](i-campaign-postback.md) - `/i/campaign/postback`

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.campaigns` | Campaign definitions and summary counters. |
| `countly.campaigndata` | Time-series campaign metrics used by campaign reporting. |
| `countly.attribution` | Click-tracking records keyed by campaign/user fingerprint. |
| `countly.campaign_users{appId}` | Per-app campaign user tracking documents. |

</details>
