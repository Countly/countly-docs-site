---
sidebar_position: 1
sidebar_label: "Overview"
---

# AWS Cognito Authentication

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The Cognito feature lets Countly authenticate users through Amazon Cognito instead of the default local authentication flow. It supports both:

- Authorization code login (Cognito redirects back to Countly with `code`)
- Header-based login (`X-Amzn-Oidc-Data` provided by upstream auth infrastructure)

After identity data is validated, the feature maps Cognito groups to Countly roles and signs users into the dashboard.

## API Surface

This feature does **not** expose standalone public endpoints under `/i/cognito`.

Instead, it extends Countly authentication routes:

- `<countlyPath>/login`
- `<countlyPath>/clogin/:code`
- `<countlyPath>/logout` (GET and POST)

## Key Features

- Cognito-based login for Countly users
- Authorization code flow with Cognito token exchange
- Header-based login using `X-Amzn-Oidc-Data`
- Group-to-role mapping against Countly groups
- Global admin elevation via a configured Cognito group
- Push approver permissions via configured Cognito groups
- Short-code bridge (`/clogin/:code`) for completing authenticated sessions
- Encrypted temporary auth payload storage before session creation

## Authentication Workflows

### 1) Authorization Code Flow

```text
User authenticates in Cognito
  -> Cognito redirects to Countly login with ?code=...
  -> Countly exchanges code at /oauth2/token
  -> Countly fetches profile at /oauth2/userInfo
  -> Countly reads groups from ID token claim "cognito:groups"
  -> Countly stores encrypted short-code payload
  -> User is redirected to /clogin/:code
  -> Countly maps roles and creates/logs in member
```

### 2) Header Token Flow

```text
Upstream auth sends X-Amzn-Oidc-Data header to Countly login
  -> Countly decodes payload
  -> Reads email + user identity + groups (custom:Role/custom:Groups)
  -> Stores encrypted short-code payload
  -> Redirects to /clogin/:code
  -> Countly maps roles and creates/logs in member
```

### 3) Short-Code Completion Flow

`<countlyPath>/clogin/:code`:

1. Reads encrypted payload from `shortCode` collection
2. Validates expiration (`urlExpireMinute`)
3. Resolves Countly permissions from Cognito groups
4. Creates/updates member via external auth flow
5. Deletes used short code
6. Redirects to dashboard

## Configuration Settings

| Setting | Default | Required | Description | Environment Variable |
|---------|---------|----------|-------------|----------------------|
| `baseUrl` | `''` | Yes | Countly base URL; used for login redirect construction | `COUNTLY_CONFIG_PLUGINCOGNITO_BASEURL` |
| `cognitoHost` | `''` | Yes | Cognito host (for `/oauth2/token`, `/oauth2/userInfo`, `/oauth2/revoke`) | `COUNTLY_CONFIG_PLUGINCOGNITO_COGNITOHOST` |
| `cognitoClientId` | `''` | Yes | Cognito app client ID | `COUNTLY_CONFIG_PLUGINCOGNITO_COGNITOCLIENTID` |
| `cognitoClientSecret` | `''` | Yes | Cognito app client secret | `COUNTLY_CONFIG_PLUGINCOGNITO_COGNITOCLIENTSECRET` |
| `globalAdminGroup` | `'countly-global-admin-group'` | No | Cognito group that grants Countly global admin access | `COUNTLY_CONFIG_PLUGINCOGNITO_GLOBALADMINGROUP` |
| `pushApproverGroups` | `['']` | No | Cognito groups that grant push approver permissions | `COUNTLY_CONFIG_PLUGINCOGNITO_PUSHAPPROVERGROUPS` |
| `urlExpireMinute` | `10` | No | Short-code payload expiration window (minutes) | `COUNTLY_CONFIG_PLUGINCOGNITO_URLEXPIREMINUTE` |
| `cognitoExternalLoginUrl` | `''` | No | Optional retry login URL shown on login error screen | `COUNTLY_CONFIG_PLUGINCOGNITO_COGNITOEXTERNALLOGINURL` |

## Required Identity Data

| Field | Required | Source | Usage |
|------|----------|--------|-------|
| `email` | Yes | Cognito user info or token payload | Countly member email |
| `groups` | Yes | `cognito:groups` (auth code flow) or `custom:Role`/`custom:Groups` (header flow) | Countly role mapping |
| `sub` | No | Token payload | Used as member ID when available |
| `name` | No | User info/token payload | Used as member full name |
| `username` | No | User info/token payload | Used as member username |

If `sub`, `name`, or `username` are missing, the feature falls back to generated/derived values.

## Group and Permission Mapping

Role resolution is based on Cognito group names:

- If user belongs to `globalAdminGroup`, user becomes Countly global admin.
- Otherwise, Cognito groups are matched against Countly groups by `name` or `groupID`.
- Mapped Countly group permissions are merged.
- If matched group is in `pushApproverGroups`, push approver permissions are granted.
- If no group matches, login is rejected.

## Data Storage

| Collection | Purpose |
|------------|---------|
| `countly.members` | Cognito-authenticated Countly users |
| `countly.groups` | Source of Countly role definitions used during group mapping |
| `countly.shortCode` | Temporary encrypted login payload keyed by short code |

Notes:

- Short-code expiration is checked using the stored `expires` value.
- Used short codes are removed after successful login.
- The plugin does not create a TTL index for automatic short-code cleanup.

## Configuration Methods

### Method 1: `config.js`

Copy `config.sample.js` to `config.js`, then set values:

```javascript
const config = {
    baseUrl: "https://countly.company.com",
    globalAdminGroup: "countly-global-admin-group",
    urlExpireMinute: 10,
    cognitoHost: "your-pool.auth.us-east-1.amazoncognito.com",
    cognitoClientId: "your-client-id",
    cognitoClientSecret: "your-client-secret",
    pushApproverGroups: ["push-approver-group"],
    cognitoExternalLoginUrl: ""
};

module.exports = require("../../api/configextender")("PLUGINCOGNITO", config, process.env, {
    BASEURL: "baseUrl",
    GLOBALADMINGROUP: "globalAdminGroup",
    URLEXPIREMINUTE: "urlExpireMinute",
    COGNITOHOST: "cognitoHost",
    COGNITOCLIENTID: "cognitoClientId",
    COGNITOCLIENTSECRET: "cognitoClientSecret",
    PUSHAPPROVERGROUPS: "pushApproverGroups",
    COGNITOEXTERNALLOGINURL: "cognitoExternalLoginUrl"
});
```

### Method 2: Environment Variables

Set values with `COUNTLY_CONFIG_PLUGINCOGNITO_` prefix:

```bash
export COUNTLY_CONFIG_PLUGINCOGNITO_BASEURL="https://countly.company.com"
export COUNTLY_CONFIG_PLUGINCOGNITO_COGNITOHOST="your-pool.auth.us-east-1.amazoncognito.com"
export COUNTLY_CONFIG_PLUGINCOGNITO_COGNITOCLIENTID="your-client-id"
export COUNTLY_CONFIG_PLUGINCOGNITO_COGNITOCLIENTSECRET="your-client-secret"
export COUNTLY_CONFIG_PLUGINCOGNITO_GLOBALADMINGROUP="countly-global-admin-group"
export COUNTLY_CONFIG_PLUGINCOGNITO_URLEXPIREMINUTE="10"
export COUNTLY_CONFIG_PLUGINCOGNITO_COGNITOEXTERNALLOGINURL=""
```

For `pushApproverGroups`, prefer configuring it in `config.js` to avoid formatting ambiguity.

## AWS Cognito Setup

### Step 1: Create Cognito User Pool

1. Sign in to AWS Management Console.
2. Open **Amazon Cognito** and create a **User Pool**.
3. Configure sign-in options for your organization (email, username, etc.).
4. Configure password policy and recovery options.
5. Save the pool and note its region.

### Step 2: Create and Configure App Client

1. In your User Pool, open **App integration**.
2. Create an app client for Countly.
3. Enable authorization code flow.
4. Configure callback URL as `<baseUrl>/login`.
5. Save and record:
   - App client ID
   - App client secret
   - User Pool domain host (used as `cognitoHost`)

### Step 3: Configure Group Strategy

1. Create Cognito groups that represent your access model.
2. Define one group for Countly global admin mapping (`globalAdminGroup`).
3. Define optional groups for push approval (`pushApproverGroups`).
4. Ensure users are assigned to expected groups.

### Step 4: Configure Countly Plugin

1. Set plugin config in `config.js` (or environment variables).
2. Verify `baseUrl`, `cognitoHost`, `cognitoClientId`, and `cognitoClientSecret`.
3. Verify group mapping settings (`globalAdminGroup`, `pushApproverGroups`).
4. Set `urlExpireMinute` based on your login completion timeout preference.

### Step 5: Enable Feature in Countly

1. Open **Management > Feature Management** in Countly.
2. Enable **AWS Cognito**.
3. In multi-server environments, enable plugin state sync.
4. Restart/reload services if required by your deployment process.

## Setup Checklist

1. Create Cognito app client and obtain host/client credentials.
2. Set Cognito callback URL to `<baseUrl>/login`.
3. Ensure user claims include email and group information.
4. Configure plugin settings (`config.js` or environment variables).
5. Enable **AWS Cognito** in Countly Feature Management.
6. In multi-server deployments, enable plugin-state sync.

## Use Cases

### Use Case 1: Standard Enterprise SSO

```javascript
{
    baseUrl: "https://analytics.company.com",
    cognitoHost: "company-pool.auth.us-east-1.amazoncognito.com",
    cognitoClientId: "client-id",
    cognitoClientSecret: "client-secret",
    globalAdminGroup: "analytics-admins",
    pushApproverGroups: ["push-team"]
}
```

Result: Cognito users can sign in, and admin/push permissions are derived from mapped groups.

### Use Case 2: Header-Based Login Behind Load Balancer/Auth Proxy

```javascript
{
    baseUrl: "https://analytics.company.com",
    cognitoHost: "company-pool.auth.us-east-1.amazoncognito.com",
    cognitoClientId: "client-id",
    cognitoClientSecret: "client-secret",
    urlExpireMinute: 10
}
```

Result: Upstream auth sends `X-Amzn-Oidc-Data`; Countly completes login via short-code flow.

### Use Case 3: Short-Lived Login Completion Links

```javascript
{
    baseUrl: "https://analytics.company.com",
    cognitoHost: "company-pool.auth.us-east-1.amazoncognito.com",
    cognitoClientId: "client-id",
    cognitoClientSecret: "client-secret",
    urlExpireMinute: 3
}
```

Result: Unused short-code login payloads expire quickly, reducing replay window.

## Troubleshooting

### Missing Parameters

Symptom: redirected to login with missing parameter message.  
Checks:
- Authorization code flow: ensure `code` exists in query.
- Header flow: ensure `X-Amzn-Oidc-Data` is present.

### Missing Email or Groups

Symptom: redirected with missing email/groups message.  
Checks:
- Ensure Cognito user profile provides email.
- Ensure group claims are present (`cognito:groups` or custom claims).

### Login URL Expired

Symptom: redirected with "login url expired".  
Checks:
- Increase `urlExpireMinute` if needed.
- Reduce user delay between initial auth and `/clogin/:code`.

### User Cannot Access Expected Areas

Symptom: login succeeds but permissions are insufficient.  
Checks:
- Verify Cognito group names match Countly group names or group IDs.
- Confirm `globalAdminGroup` and `pushApproverGroups` values.
- Ensure target Countly groups exist and have correct permissions.

### Logout Works Locally but Cognito Session Persists

Behavior:
- Plugin clears Countly session and attempts Cognito token revoke.
- Upstream SSO/session infrastructure may still require separate sign-out handling.

## Additional Resources

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Cognito OAuth 2.0 Authorization Code Flow](https://docs.aws.amazon.com/cognito/latest/developerguide/authorization-endpoint.html)
- [Cognito UserInfo Endpoint](https://docs.aws.amazon.com/cognito/latest/developerguide/userinfo-endpoint.html)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.
