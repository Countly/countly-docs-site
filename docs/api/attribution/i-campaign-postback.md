---
sidebar_label: "Campaign Postback"
keywords:
  - "/i/campaign/postback"
  - "campaign"
  - "postback"
last_update:
  date: "2026-10-01"
---

# /i/campaign/postback

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```plaintext
/i/campaign/postback
```

## Overview

Receives an install postback for a campaign, matches it to an app user, records the click and install metrics, saves the attribution on the user, and forwards the data to the campaign's configured postbacks.

## Authentication

- No API key or token is required. The campaign is identified by `cly_id`.

## Permissions

- None. The endpoint is meant to be called by attribution partners or SDKs.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `cly_id` | String | Yes | Campaign ID. |
| `aid_<name>` | String | Conditional | Advertising identifier (for example `aid_idfa`). Used to find the app user whose `aid.<name>` matches. Required if `idfa` is not provided. |
| `click_url` | String | No | Link the user clicked. Stored as the referrer. For Countly tracking links (path starting with `/at/`), its query parameters are also read. |
| `click_timestamp` | String | No | Time of the click; used as the event timestamp and stored as `last_click`. |
| `idfa` | String | Conditional | Legacy iOS attribution. Used when no `aid_` parameter is given. Must be the lowercase hexadecimal MD5 hash of the user's Countly device ID. Required if no `aid_` parameter is provided. |
| `device_id` | String | No | Device ID. Not stored as a segment. |
| `adid` | String | No | Ignored. Not stored as a segment. |
| Other parameters | String | No | Any other non-empty parameter is stored on the user's attribution record and recorded as a segment. |

At least one identifier is required: an `aid_<name>` parameter or `idfa`.

## Examples

### Example 1: Server-to-server postback

```plaintext
/i/campaign/postback?cly_id=campaign-summer-2026&aid_idfa=ABCDEF12-3456-7890-ABCD-EF1234567890&click_timestamp=1767225600
```

This succeeds only if an app user already has a matching `aid.idfa` value. Identifier values are lowercased before matching, so the stored value must be lowercase. Otherwise the endpoint returns `404` `User Not Found`.

## Response

### Success Response

```json
{
  "result": "Success"
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `result` | String | Result message. |

### Error Responses

**Status Code**: `404 Not Found`
```json
{
  "result": "Campaign Not Found"
}
```

**Status Code**: `404 Not Found`
```json
{
  "result": "App Not Found"
}
```

**Status Code**: `404 Not Found`
```json
{
  "result": "User Not Found"
}
```

## Behavior

1. Finds the campaign by `cly_id`, then its app.
2. If the app has a redirect URL configured, the request is forwarded there (as `POST` with the body when the request was a `POST`, otherwise `GET`) and nothing else happens in Countly.
3. Collects `aid_` identifiers and other parameters from the request, and from `click_url` when it is a Countly tracking link.
4. Finds the app user by advertising identifier (`aid.<name>`), or, when no `aid_` parameter is given, by `idfa` (iOS). For `aid_` matches, a matching stored click is read for extra segments and removed.
5. Records `aclk` and `ins` (click and install) metrics for the campaign, stores the attribution data on the user under `cmp`, sends the data to each configured campaign postback, and returns `Success`.

## Related Endpoints

- [Campaign Click](i-campaign-click.md)
- [Campaign Create](i-campaign-create.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.campaigns` | Campaign storage | Reads the campaign and its postbacks. |
| `countly.apps` | App lookup | Reads the app and its redirect URL. |
| `countly.app_users{appId}` | User matching | Finds the user and saves attribution under `cmp`. |
| `countly.attribution` | Click fingerprints | Reads and removes a matching click record. |
| `countly.campaign_users{appId}` | Campaign users | Reads the click user for extra segments. |
| `countly.campaigndata` | Campaign metrics | Records click and install metrics. |

</details>
