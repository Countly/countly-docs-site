---
sidebar_label: "Campaign Click"
keywords:
  - "/i/campaign/click"
  - "campaign"
  - "click"
last_update:
  date: "2026-10-01"
---

# /i/campaign/click

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```plaintext
/i/campaign/click/{campaign_id}
```

## Overview

Tracking link for a campaign. Records a click for the campaign and redirects the visitor to the campaign's destination link, chosen by the visitor's platform.

## Authentication

- No API key or token is required. The campaign is identified by the ID in the URL path.

## Permissions

- None. The endpoint is meant to be opened by end users following a campaign link.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `campaign_id` | String | Yes | Campaign ID, as the last path segment of the URL. |
| `segments` | JSON String (Object) | No | Extra values to record with the click. Keys starting with `aid_` are treated as advertising identifiers; other keys become click segments. Invalid JSON is ignored. |
| `ip_address` | String | No | IP address to use for country and city lookup instead of the request's own IP. |
| `ignore` | Any | No | When present, the click is not recorded; the visitor is redirected to the campaign's default link directly. |
| `test` | Any | No | When present, the response is JSON with the resulting link instead of a redirect. The click is still recorded, with a new campaign-user ID instead of the one from the cookie. |
| `timestamp` | Number | No | Unix timestamp of the click, used as the click time and for the metric date. Defaults to the current time. |

The platform, browser, language, referer and location of the click are taken from the request's `User-Agent`, `Accept-Language` and `Referer` headers and IP address.

## Examples

### Example 1: Follow a tracking link

```plaintext
/i/campaign/click/campaign-summer-2026
```

### Example 2: Get the destination link as JSON

```plaintext
/i/campaign/click/campaign-summer-2026?test=1
```

## Response

### Success Response

By default the response is an HTTP `302` redirect with these headers:

| Header | Description |
|---|---|
| `Location` | Destination link for the visitor's platform. |
| `Set-Cookie` | Sets a cookie named after the campaign ID holding the campaign-user ID. |
| `Campaign-User` | The campaign-user ID. |

With `test` set, the response is JSON:

```json
{
  "link": "https://example.com/landing"
}
```

With `ignore` set (and `test` set), the response is the same JSON; without `test`, it is a `302` with only the `Location` header.

If the app has a redirect URL configured, the response is a `302` to that URL with the request path and query appended, and the click is not recorded here.

### Response Fields

| Field | Type | Description |
|---|---|---|
| `link` | String | Resolved destination link (only in `test` responses). |

### Error Responses

**Status Code**: `404 Not Found` (plain text)
```text
Campaign not Found
```

**Status Code**: `404 Not Found` (plain text)
```text
App not Found
```

## Behavior

- Looks up the campaign by ID. Campaigns without an app are treated as not found.
- Picks the destination from the campaign's per-platform links, falling back to its default link.
- For App Store links, adds `cid` (campaign name) when missing. For Google Play or `market:` links, adds or extends `referrer` with `countly_cid` and `countly_cuid`.
- For other links, adds `cly_id` and `cly_uid` when the Attribution `pass_campaign` setting is on.
- When the Attribution `pass_query` setting is on, adds the `segments` values as query parameters to the link, whatever its type.
- Stores a click fingerprint (app, IP, platform) and upserts the campaign user, then records an `aclk` (click) metric for the campaign. The first click of a campaign user also counts as a unique click (`clk`).
- With `test`, the click is recorded in the same way; only the response differs.
- Adds one click data point to server stats.
- With `ignore`, the campaign's default link is always used, unmodified.

## Related Endpoints

- [Campaign Postback](i-campaign-postback.md)
- [Campaign Read](o-campaign.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.campaigns` | Campaign storage | Reads the campaign and its links. |
| `countly.apps` | App lookup | Reads the app and its redirect URL. |
| `countly.attribution` | Click fingerprints | Upserts a click record. |
| `countly.campaign_users{appId}` | Campaign users | Upserts the campaign user for the click. |
| `countly.campaigndata` | Campaign metrics | Records the click metric. |

</details>
