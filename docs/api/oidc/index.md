---
sidebar_position: 1
sidebar_label: "Overview"
---

# OpenID Connect (OIDC) Authentication

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The OpenID Connect (OIDC) feature enables Countly Enterprise to authenticate users through any standards-compliant OpenID Connect provider. OIDC is built on top of OAuth2 and provides identity verification, making it ideal for integrating with popular identity providers like Google, Microsoft Entra ID (Azure AD), Okta, Auth0, and any other OIDC-compliant provider.

This feature allows users to log in to Countly using their existing credentials from their organization's identity provider, eliminating the need to maintain separate authentication systems while ensuring enterprise-grade security.

## Key Features

- **Standards-Compliant OIDC**: Support for any OpenID Connect provider implementing OAuth2/OIDC standards
- **Google Integration**: Pre-configured example for Google accounts
- **Per-Provider Configuration**: Support for any OIDC issuer with published .well-known endpoints
- **Automatic User Provisioning**: Users are created automatically on first login
- **Role Assignment on Creation**: Configure default permissions and app access for new users
- **Email-based User Lookup**: Users identified by email address for profile updates
- **Group Claims Support**: Optional support for group-based role mapping via ID token claims
- **Refresh Token Handling**: Automatic session management via OAuth2 token refresh
- **Secure Callback Flow**: OAuth2 authorization code flow with PKCE support

## Authentication Flow

```
User → Click "Login with OIDC Provider"
  ↓
Redirect to Provider → User Authenticates
  ↓
Provider Redirects to Countly Callback → Authorization Code Received
  ↓
Countly Exchanges Code for ID Token + Access Token
  ↓
Extract User Identity (email, name, groups from claims)
  ↓
Lookup/Create User in countly.members
  ↓
Apply Default Permissions (global_admin, admin_of, user_of)
  ↓
Create Session → Redirect to Dashboard
```

## Configuration Settings

### Core Connection Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `auth_url` | `'https://accounts.google.com'` | String | OIDC provider issuer URL (host with .well-known/openid-configuration) | `COUNTLY_CONFIG_PLUGINOIDC_AUTHURL` |
| `auth_callback` | `'https://oauth2.googleapis.com/token'` | String | OIDC provider token endpoint for code exchange | `COUNTLY_CONFIG_PLUGINOIDC_AUTHCALLBACK` |
| `client_id` | `''` | String | OIDC client ID from provider registration | `COUNTLY_CONFIG_PLUGINOIDC_CLIENTID` |
| `client_secret` | `''` | String | OIDC client secret from provider registration | `COUNTLY_CONFIG_PLUGINOIDC_CLIENTSECRET` |

### User Provisioning Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `global_admin` | `true` | Boolean | Automatically make new users global admin on first login | `COUNTLY_CONFIG_PLUGINOIDC_GLOBALADMIN` |
| `admin_of` | `[]` | Array | List of app IDs where new users get admin access | `COUNTLY_CONFIG_PLUGINOIDC_ADMINOF` |
| `user_of` | `[]` | Array | List of app IDs where new users get read-only access | `COUNTLY_CONFIG_PLUGINOIDC_USEROF` |

### Advanced Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `acr_values` | `undefined` | String | Authentication Context Class References (optional; provider-specific) | `COUNTLY_CONFIG_PLUGINOIDC_ACRVALUES` |
| `scope` | `'openid profile email'` | String | OIDC scope request (standard: openid, profile, email, groups) | `COUNTLY_CONFIG_PLUGINOIDC_SCOPE` |
| `response_type` | `'code'` | String | OAuth2 response type (authorization code flow) | `COUNTLY_CONFIG_PLUGINOIDC_RESPONSETYPE` |
| `prompt` | `'login'` | String | Login prompt behavior (login, consent, select_account, none) | `COUNTLY_CONFIG_PLUGINOIDC_PROMPT` |

## Database Collections

The OIDC feature integrates with existing Countly collections (no separate collections created):

| Collection | Purpose |
|------------|---------|
| `countly.members` | User accounts created via OIDC authentication; includes email, profile information, and assigned roles |

User information is stored during first login via OIDC. Subsequent logins update user profile (email lookup via email field).

## Configuration Methods

### Method 1: Configuration File

Create or modify `config.js` in the OIDC feature directory:

```javascript
const config = {
    // OIDC Provider Information
    auth_url: "https://accounts.google.com",
    auth_callback: "https://oauth2.googleapis.com/token",
    
    // Client Credentials (from OIDC Provider Registration)
    client_id: "123456789.apps.googleusercontent.com",
    client_secret: "GOCSPX-aBcDefGhIjKlMnOpQrStUvWx",
    
    // User Provisioning on First Login
    global_admin: false,  // Don't auto-promote to global admin
    admin_of: ["app1", "app2"],  // Auto-admin access to these apps
    user_of: ["app3", "app4"],   // Auto-read access to these apps
    
    // Advanced Options
    acr_values: undefined,  // Optional; provider-specific auth requirements
};

module.exports = require('../../api/configextender')('PLUGINOIDC', config, process.env, {
    AUTHURL: 'auth_url',
    AUTHCALLBACK: 'auth_callback',
    CLIENTID: 'client_id',
    CLIENTSECRET: 'client_secret',
    ACRVALUES: 'acr_values',
    GLOBALADMIN: "global_admin",
    ADMINOF: "admin_of",
    USEROF: "user_of"
});
```

### Method 2: Environment Variables

Set with prefix `COUNTLY_CONFIG_PLUGINOIDC_`:

```bash
export COUNTLY_CONFIG_PLUGINOIDC_AUTHURL="https://accounts.google.com"
export COUNTLY_CONFIG_PLUGINOIDC_AUTHCALLBACK="https://oauth2.googleapis.com/token"
export COUNTLY_CONFIG_PLUGINOIDC_CLIENTID="123456789.apps.googleusercontent.com"
export COUNTLY_CONFIG_PLUGINOIDC_CLIENTSECRET="GOCSPX-aBcDefGhIjKlMnOpQrStUvWx"
export COUNTLY_CONFIG_PLUGINOIDC_GLOBALADMIN="false"
export COUNTLY_CONFIG_PLUGINOIDC_ADMINOF="app1,app2"
export COUNTLY_CONFIG_PLUGINOIDC_USEROF="app3,app4"
```

## Supported OIDC Providers

### Google
- **auth_url**: `https://accounts.google.com`
- **auth_callback**: `https://oauth2.googleapis.com/token`
- **Setup**: Google Cloud Console → OAuth 2.0 credentials → Create OAuth 2.0 Client ID

### Microsoft Entra ID (Azure AD - OIDC mode)
- **auth_url**: `https://login.microsoftonline.com/{tenant_id}/v2.0`
- **auth_callback**: `https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token`
- **Setup**: Azure Portal → App registrations → Create application → Credentials

### Auth0
- **auth_url**: `https://{your-auth0-domain}`
- **auth_callback**: `https://{your-auth0-domain}/oauth/token`
- **Setup**: Auth0 Dashboard → Applications → Regular Web Applications

### Okta (OIDC)
- **auth_url**: `https://{your-okta-domain}`
- **auth_callback**: `https://{your-okta-domain}/oauth2/v1/token`
- **Setup**: Okta Admin Console → Applications → Create App Integration

### Generic OIDC Provider
- **auth_url**: Any provider with `.well-known/openid-configuration` endpoint
- **auth_callback**: Provider's token endpoint URL
- **Setup**: Follow provider's OAuth2/OIDC registration process

## Use Cases

### Use Case 1: Google Workspace Authentication

Enable employees with Google Workspace accounts to log in to Countly:

```javascript
{
    auth_url: "https://accounts.google.com",
    auth_callback: "https://oauth2.googleapis.com/token",
    client_id: "your-google-client-id.apps.googleusercontent.com",
    client_secret: "your-google-client-secret",
    global_admin: false,
    admin_of: [],
    user_of: ["analytics-app"]  // All Google users get read access to analytics
}
```

**Result**: Google Workspace users can log in directly; new users appear in Countly.members with email-based identity.

### Use Case 2: Auth0 Enterprise Integration

Integrate with Auth0 for enterprise SSO (Single Sign-On) capabilities:

```javascript
{
    auth_url: "https://company.auth0.com",
    auth_callback: "https://company.auth0.com/oauth/token",
    client_id: "auth0-client-id",
    client_secret: "auth0-client-secret",
    scope: "openid profile email roles",
    global_admin: false,
    admin_of: ["production-app"],
    user_of: ["staging-app", "development-app"]
}
```

**Result**: Enterprise SSO via Auth0; users assigned to pre-configured apps based on `admin_of` and `user_of`.

### Use Case 3: Microsoft Entra ID (Azure AD) OIDC

Authenticate against Microsoft Entra ID using OIDC protocol:

```javascript
{
    auth_url: "https://login.microsoftonline.com/common/v2.0",
    auth_callback: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    client_id: "azure-application-id",
    client_secret: "azure-client-secret",
    scope: "openid profile email",
    global_admin: false,
    admin_of: ["admin-app"],
    user_of: []
}
```

**Result**: Azure AD users authenticate via OIDC; email-based user creation in Countly.

### Use Case 4: Okta Multi-Application Setup

Setup Okta as identity provider with different app permissions:

```javascript
{
    auth_url: "https://company.okta.com",
    auth_callback: "https://company.okta.com/oauth2/v1/token",
    client_id: "okta-client-id",
    client_secret: "okta-client-secret",
    global_admin: false,
    admin_of: ["executive-dashboard"],
    user_of: ["employee-analytics", "customer-insights"]
}
```

**Result**: Okta federated users get different access levels based on their identity provider and Countly app configuration.

### Use Case 5: Zero-Trust with Selected Admin

Allow OIDC login for all users but restrict admin access:

```javascript
{
    auth_url: "https://accounts.google.com",
    auth_callback: "https://oauth2.googleapis.com/token",
    client_id: "your-google-client-id.apps.googleusercontent.com",
    client_secret: "your-google-client-secret",
    global_admin: false,      // Don't auto-promote
    admin_of: [],              // No auto-admin apps
    user_of: ["public-app"],  // All users get read access by default
    // Admin access granted manually via user management dashboard
}
```

**Result**: OIDC users auto-created with limited read-only access; admins grant elevated permissions manually.

## Best Practices

### Security

1. **Use HTTPS**: All callback URLs and provider communications must use HTTPS
2. **Secure Client Secret**: Store client secret in secure configuration management (environment variables, secrets vault)
3. **Validate Tokens**: Verify ID token signatures using provider's public keys
4. **PKCE for SPAs**: Use PKCE (Proof Key for Code Exchange) for Single Page Applications
5. **Scope Minimization**: Request minimal necessary scopes (openid, profile, email basic)
6. **Token Expiry**: Implement token refresh for long-lived sessions
7. **Redirect URI Validation**: Only allow registered callback URIs to prevent authorization code interception

### Provider Configuration

1. **Register Callback URL**: Always register exact Countly callback URL in OIDC provider settings
2. **Example**: `https://countly.company.com/auth/oidc/callback`
3. **Test Provider Access**: Verify `.well-known/openid-configuration` endpoint is accessible
4. **Credential Rotation**: Rotate client secrets periodically (90-180 days)
5. **Monitor Provider Uptime**: OIDC provider outages will block user authentication

### User Provisioning

1. **Default Permissions**: Set conservative default permissions (avoid `global_admin: true` unless necessary)
2. **App-Specific Access**: Use `admin_of` and `user_of` to pre-assign app-level permissions
3. **Email Consistency**: Ensure email addresses are consistent between OIDC provider and Countly
4. **Profile Updates**: User profile updates on each login; keep profile data fresh
5. **Manual Override**: Admins can manually modify user permissions after creation

### Monitoring

1. **Authentication Logs**: Monitor authentication events for failed logins
2. **Token Validation Errors**: Log token validation failures for debugging
3. **Provider Connectivity**: Alert on provider unreachability
4. **User Creation Rate**: Monitor new user creation to detect unauthorized access
5. **Session Duration**: Track session timings to ensure appropriate token refresh

## Troubleshooting

### Authentication Failures

**Problem**: "Authentication failed" or "Invalid OIDC credentials"

**Solutions**:
- Verify `client_id` and `client_secret` match OIDC provider registration
- Confirm `auth_url` and `auth_callback` are correct for the provider
- Check that `.well-known/openid-configuration` endpoint is accessible
- Verify OIDC provider allows the registered callback URL
- Ensure redirect URL matches exactly (HTTPS, domain, path)

**Debug**: Check Countly logs for token exchange errors

### User Creation Issues

**Problem**: Users not appearing in Countly.members after OIDC login

**Solutions**:
- Verify `global_admin`, `admin_of`, `user_of` settings are valid
- Check user email in OIDC provider matches expected format
- Confirm app IDs in `admin_of` and `user_of` exist in Countly
- Verify email field is returned in OIDC ID token claims
- Check Countly database permissions for insertion into countly.members

### Provider Connection Errors

**Problem**: "Cannot reach OIDC provider" or timeout errors

**Solutions**:
- Verify network connectivity to OIDC provider endpoints
- Confirm firewall allows outbound HTTPS to provider
- Check provider status page for service disruptions
- Verify DNS resolution of provider hostname
- Increase timeout settings if provider is slow
- Test provider accessibility manually: `curl https://{provider}/.well-known/openid-configuration`

### Token Validation Errors

**Problem**: "Invalid token" or "Signature verification failed"

**Solutions**:
- Verify OIDC provider's public keys are current
- Check system time is synchronized (NTP enabled)
- Confirm token hasn't expired
- Verify provider's algorithm matches token validation code
- Test provider's token validation endpoint

## Performance Considerations

- **Token Exchange**: Each login requires token exchange with provider (typically 100-500ms)
- **Public Key Retrieval**: OIDC public keys cached; first request fetches from provider
- **Email Lookup**: User lookup in countly.members by email (indexed operation, fast)
- **User Creation**: New user insertion on first login (minimal overhead)
- **Network Latency**: Performance depends on OIDC provider responsiveness

## Interoperability

### OIDC with Other Authentication Methods

The OIDC feature coexists with other authentication features:

- **LDAP/Active Directory**: OIDC users and LDAP users both stored in `countly.members`; separate authentication paths
- **SAML**: Separate authentication method; both OIDC and SAML users in `countly.members`
- **Local Accounts**: OIDC users stored alongside local Countly accounts
- **Multiple OIDC Providers**: Configure one provider per Countly instance; multi-provider requires separate instances

### Federation Scenarios

| Scenario | Configuration | Result |
|----------|---------------|--------|
| **Google Auth Only** | auth_url: Google, global_admin: false | Only Google users can log in |
| **Okta Federation** | auth_url: Okta, admin_of: [apps], user_of: [apps] | Okta users auto-assigned to apps |
| **OIDC + Local Admins** | OIDC provider + local service accounts | OIDC users + emergency local admin access |
| **Auth0 SSO** | auth_url: Auth0 tenant | Single Sign-On via Auth0 |

## Advanced OIDC Concepts

### ID Token Claims

Standard OIDC ID token includes:
- `sub` - Subject (unique user identifier)
- `email` - User email address
- `name` - User full name
- `given_name` - First name
- `family_name` - Last name
- `picture` - Profile picture URL
- `email_verified` - Email verification status

**Custom Claims**: Providers may include custom claims (groups, roles, department)

### Access Token

Used for accessing provider's user info endpoint if additional claims needed. Current implementation uses ID token claims primarily.

### Refresh Tokens

Optional; used to obtain new tokens without re-authentication. Enables long-lived sessions with automatic token refresh.

## Related Documentation

- [Active Directory Integration](../active_directory/index.md)
- [LDAP Integration](../ldap/index.md)
- [Okta Integration](../okta/index.md)
- [Cognito Integration](../cognito/index.md)
- [User Management Feature](../users/index.md)

## Standards & Specifications

- [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html)
- [OAuth2 Authorization Code Flow](https://tools.ietf.org/html/rfc6749#section-1.3.1)
- [PKCE - Proof Key for Code Exchange](https://tools.ietf.org/html/rfc7636)
- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Auth0 OpenID Connect](https://auth0.com/docs/get-started/authentication-and-authorization-flow/openid-connect-protocol)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

