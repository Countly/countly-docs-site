---
sidebar_position: 1
sidebar_label: "Overview"
---

# Okta Authentication

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The Okta feature enables Countly Enterprise to authenticate users and manage access through Okta's identity management platform. Okta provides enterprise-grade authentication, group management, and access control, allowing organizations to leverage their existing Okta infrastructure for seamless Countly user management.

This feature supports group-based access control, allowing different Okta groups to have different permission levels in Countly (global admin, push approver, etc.), enabling zero-configuration user provisioning and permissions management.

## Key Features

- **Okta OAuth2 Authentication**: Standards-compliant OAuth2 integration with Okta
- **Group-Based Access Control**: Okta groups automatically map to Countly permissions and roles
- **Global Admin Groups**: Specify Okta groups whose members become Countly global admins
- **Push Approver Groups**: Designate Okta groups with push notification approval permissions
- **Automatic Group Sync**: Group memberships synchronize on user login
- **Email-Based User Lookup**: Users identified by email for consistent identity management
- **Session Management**: Secure session handling with configurable expiration
- **API Token Support**: Direct Okta API access for user and group queries
- **Multi-Language Support**: Localization support for global teams

## Authentication Flow

```
User → Click "Login with Okta"
  ↓
Redirect to Okta Login → User Authenticates
  ↓
Okta Redirects with Auth Code → Countly Receives Code
  ↓
Countly Exchanges Code for ID Token + Access Token
  ↓
Extract User Identity + Okta Groups from Token
  ↓
Query Okta API for User's Group Memberships (if needed)
  ↓
Lookup/Create User in countly.members
  ↓
Map Okta Groups to Countly Groups/Permissions
  ↓
Create Session → Redirect to Dashboard
```

## Configuration Settings

### Core Connection Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `orgUrl` | `'https://dev-example.okta.com'` | String | Okta organization URL | `COUNTLY_CONFIG_PLUGINOKTA_ORIGINURL` |
| `clientId` | `''` | String | OAuth2 client ID from Okta application | `COUNTLY_CONFIG_PLUGINOKTA_CLIENTID` |
| `clientSecret` | `''` | String | OAuth2 client secret from Okta application | `COUNTLY_CONFIG_PLUGINOKTA_CLIENTSECRET` |
| `apiToken` | `''` | String | Okta API token for server-to-server API calls | `COUNTLY_CONFIG_PLUGINOKTA_APITOKEN` |
| `baseUrl` | `'https://countly.example.com'` | String | Countly base URL for OAuth2 redirect URI | `COUNTLY_CONFIG_PLUGINOKTA_BASEURL` |

### Group Mapping Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `globalAdminGroup` | `'countly-global-admin'` | String | Okta group ID/name whose members become Countly global admins | `COUNTLY_CONFIG_PLUGINOKTA_GLOBALADMINGROUP` |
| `pushApproverGroups` | `['push-approver-group']` | Array | Okta group IDs/names with push notification approver permission | `COUNTLY_CONFIG_PLUGINOKTA_PUSHAPPROVERGROUPS` |

### Session Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `sessionTimeout` | `3600000` | Number | Session timeout in milliseconds (default: 1 hour) | `COUNTLY_CONFIG_PLUGINOKTA_SESSIONTIMEOUT` |
| `tokenRefreshThreshold` | `300000` | Number | Refresh token when remaining TTL < milliseconds | `COUNTLY_CONFIG_PLUGINOKTA_TOKENREFRESHTHRESHOLD` |

### Advanced Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `userIdAttribute` | `'email'` | String | Okta user attribute to use as Countly user identifier | `COUNTLY_CONFIG_PLUGINOKTA_USERIDATTRIBUTE` |
| `groupSync` | `true` | Boolean | Enable automatic group membership synchronization | `COUNTLY_CONFIG_PLUGINOKTA_GROUPSYNC` |
| `groupSyncInterval` | `3600000` | Number | Group sync interval in milliseconds (default: 1 hour) | `COUNTLY_CONFIG_PLUGINOKTA_GROUPSYNCINTERVAL` |
| `deactivateOnRemove` | `true` | Boolean | Deactivate Countly user when removed from all Okta application groups | `COUNTLY_CONFIG_PLUGINOKTA_DEACTIVATEONREMOVE` |

## Database Collections

The Okta feature stores user and group information in existing Countly collections:

| Collection | Purpose |
|------------|---------|
| `countly.members` | User accounts authenticated via Okta; includes provider field = 'okta' for filtering Okta users |
| `countly.groups` | User group memberships; Okta group names mapped to Countly groups for permission assignment |

No separate collections created; Okta integration uses core Countly collection infrastructure.

## Configuration Methods

### Method 1: Configuration File

Create or modify `config.js` in the Okta feature directory:

```javascript
const config = {
    // Okta Organization Settings
    orgUrl: 'https://your-organization.okta.com',
    
    // OAuth2 Credentials (from Okta Application)
    clientId: 'your-okta-client-id',
    clientSecret: 'your-okta-client-secret',
    
    // Okta API Token (for group querying)
    apiToken: 'your-okta-api-token',
    
    // Countly Configuration
    baseUrl: 'https://countly.your-domain.com',
    
    // Group Mapping
    globalAdminGroup: 'countly-global-admins',
    pushApproverGroups: ['countly-push-approvers', 'mobile-team'],
};

module.exports = require('../../api/configextender')('PLUGINOKTA', config, process.env, {
    ORIGINURL: 'orgUrl',
    CLIENTID: 'clientId',
    CLIENTSECRET: 'clientSecret',
    APITOKEN: 'apiToken',
    BASEURL: 'baseUrl',
    GLOBALADMINGROUP: 'globalAdminGroup',
    PUSHAPPROVERGROUPS: 'pushApproverGroups'
});
```

### Method 2: Environment Variables

Set with prefix `COUNTLY_CONFIG_PLUGINOKTA_`:

```bash
export COUNTLY_CONFIG_PLUGINOKTA_ORIGINURL="https://your-organization.okta.com"
export COUNTLY_CONFIG_PLUGINOKTA_CLIENTID="your-okta-client-id"
export COUNTLY_CONFIG_PLUGINOKTA_CLIENTSECRET="your-okta-client-secret"
export COUNTLY_CONFIG_PLUGINOKTA_APITOKEN="your-okta-api-token"
export COUNTLY_CONFIG_PLUGINOKTA_BASEURL="https://countly.your-domain.com"
export COUNTLY_CONFIG_PLUGINOKTA_GLOBALADMINGROUP="countly-global-admins"
export COUNTLY_CONFIG_PLUGINOKTA_PUSHAPPROVERGROUPS="countly-push-approvers,mobile-team"
```

## Okta Application Setup

### Step 1: Create Okta Application

1. Log in to Okta Admin Console
2. Navigate to **Applications** → **Applications**
3. Click **Create App Integration**
4. Select **OIDC** as the integration type
5. Select **Web** as the application type
6. Click **Next**

### Step 2: Configure Application Settings

1. **App Integration Name**: Enter `Countly` (or your preferred name)
2. **Grant Type**: Select `Authorization Code` and `Refresh Token`
3. **Sign-in redirect URIs**: Enter `https://countly.your-domain.com/auth/okta/callback`
4. **Sign-out redirect URIs**: Enter `https://countly.your-domain.com/logout`
5. **Controlled access**: Select `Skip group assignment for now`
6. Click **Save**

### Step 3: Obtain Credentials

1. In the application, navigate to **General** tab
2. Copy **Client ID** and **Client Secret**
3. Navigate to **API** → **Tokens**
4. Click **Create Token**
5. Enter `Countly-API` as the token name
6. Copy the generated token

### Step 4: Assign Groups

1. Navigate to **Directory** → **Groups**
2. Create or identify groups for Countly access (e.g., `countly-global-admins`, `countly-push-approvers`)
3. Add users to appropriate groups
4. Navigate back to the Countly application
5. In the **Assignments** tab, assign the groups

## Use Cases

### Use Case 1: Enterprise Single Sign-On

Enable enterprise-wide SSO with Okta for all Countly users:

```javascript
{
    orgUrl: 'https://company.okta.com',
    clientId: 'okta-app-client-id',
    clientSecret: 'okta-app-client-secret',
    apiToken: 'okta-api-token',
    baseUrl: 'https://analytics.company.com',
    globalAdminGroup: 'Analytics-Admins',
    pushApproverGroups: ['Analytics-Push-Team']
}
```

**Result**: All Okta users can authenticate; group memberships determine Countly permissions automatically.

### Use Case 2: Role-Based Access Control

Different Okta groups have different Countly permissions:

```javascript
{
    orgUrl: 'https://enterprise.okta.com',
    clientId: 'countly-oauth-client',
    clientSecret: 'client-secret-value',
    apiToken: 'api-token-value',
    baseUrl: 'https://countly.enterprise.com',
    globalAdminGroup: 'countly-admins',
    pushApproverGroups: ['marketing-push-team', 'product-push-team']
}
```

**Result**: Marketing and product teams get push approval rights; admins have full control.

### Use Case 3: Contractor/Partner Access

Limited access for external contractors via specific Okta application:

```javascript
{
    orgUrl: 'https://company.okta.com',
    clientId: 'contractor-client-id',
    clientSecret: 'contractor-secret',
    apiToken: 'contractor-api-token',
    baseUrl: 'https://countly.company.com',
    globalAdminGroup: undefined,  // No global admins from contractor org
    pushApproverGroups: []  // No push approvers from contractor org
}
```

**Result**: Contractors authenticate via Okta but get limited read-only access (manually configured).

### Use Case 4: Multi-Application Setup

Separate Okta apps for production and staging with different permission levels:

```javascript
// Production config
{
    orgUrl: 'https://company.okta.com',
    clientId: 'production-client-id',
    clientSecret: 'production-secret',
    apiToken: 'production-api-token',
    baseUrl: 'https://analytics-prod.company.com',
    globalAdminGroup: 'prod-admins',
    pushApproverGroups: ['prod-push-team']
}

// Staging config (separate Countly instance)
{
    orgUrl: 'https://company.okta.com',
    clientId: 'staging-client-id',
    clientSecret: 'staging-secret',
    apiToken: 'staging-api-token',
    baseUrl: 'https://analytics-staging.company.com',
    globalAdminGroup: 'staging-admins',
    pushApproverGroups: []  // No push approvers in staging
}
```

**Result**: Same Okta org serves multiple Countly environments with different permission profiles.

### Use Case 5: Lifecycle Management

Automatic user deactivation when removed from Okta application:

```javascript
{
    orgUrl: 'https://company.okta.com',
    clientId: 'countly-client',
    clientSecret: 'secret',
    apiToken: 'api-token',
    baseUrl: 'https://countly.company.com',
    groupSync: true,
    groupSyncInterval: 1800000,  // Sync every 30 minutes
    deactivateOnRemove: true,  // Deactivate users removed from app
    globalAdminGroup: 'countly-admins',
    pushApproverGroups: []
}
```

**Result**: User access automatically revoked when removed from Okta; no manual user deactivation needed.

## Best Practices

### Security

1. **Use HTTPS**: All callback URLs must use HTTPS
2. **Secure Client Secret**: Store in environment variables or secrets management system
3. **API Token Security**: Store API token securely; rotate every 90 days
4. **Restrict Scopes**: Request only necessary OAuth2 scopes
5. **CORS Settings**: Configure CORS properly in Okta to only allow Countly domain
6. **Webhook Validation**: Implement webhook signature validation for Okta events
7. **Token Expiry**: Implement token refresh to avoid expiration

### Application Setup

1. **Dedicated Okta App**: Create separate Okta application for Countly (not shared with other services)
2. **Group Assignment**: Always assign groups to the application for access control
3. **Redirect URIs**: Include both production and staging redirect URIs for multi-env setup
4. **Token Settings**: Set appropriate token lifetime (default: 1 hour recommended)
5. **MFA Requirement**: Enable MFA in Okta policies for additional security layer

### User & Group Management

1. **Consistent Naming**: Use consistent group names between Okta and Countly
2. **Admin Groups**: Create dedicated Okta groups for different admin levels
3. **Access Review**: Regularly audit group memberships and permissions
4. **Onboarding Process**: Document standard group assignment for new hires
5. **Offboarding**: Ensure timely removal from Okta groups when departing

### Monitoring

1. **Authentication Logs**: Monitor Okta and Countly authentication logs for failures
2. **Group Sync Status**: Track group synchronization success/failures
3. **Token Errors**: Alert on token validation or refresh failures
4. **User Access Changes**: Log group membership changes and permission updates
5. **Session Duration**: Monitor and alert on unusual session patterns

## Troubleshooting

### Authentication Failures

**Problem**: "Authentication failed" or "Invalid client credentials"

**Solutions**:
- Verify `clientId` and `clientSecret` match Okta app registration
- Confirm `orgUrl` is correct Okta organization URL
- Check that redirect URI exactly matches Okta app configuration (including HTTPS, domain, path)
- Verify Okta app is assigned to users (in Assignments tab)
- Test Okta connectivity manually

**Debug**: Check Okta System Log for authentication failures

### Group Mapping Issues

**Problem**: Users authenticate but lack expected permissions or group membership

**Solutions**:
- Verify Okta group names exactly match configuration (`globalAdminGroup`, `pushApproverGroups`)
- Check user is member of correct groups in Okta
- Confirm group names are case-sensitive
- Ensure Okta app has access to group information (check app profile)
- Verify Countly groups exist and have appropriate permissions

**Debug**: Check countly.groups collection for group creation

### API Token Errors

**Problem**: "API token invalid" or "Unauthorized" errors when syncing groups

**Solutions**:
- Verify API token is valid and not expired
- Confirm API token has appropriate permissions (groups, users read)
- Check that token hasn't been revoked
- Test token manually: `curl -H "Authorization: Bearer {token}" https://{orgUrl}/api/v1/users`
- Token should be format starting with `00`

### Redirect URI Mismatch

**Problem**: "The redirect URI is not registered" error after authentication

**Solutions**:
- Verify exact match between configured `baseUrl` and Okta redirect URI
- Ensure HTTPS is used (not HTTP)
- Include full path: `/auth/okta/callback`
- Check for trailing slashes (should match exactly)
- Verify in Okta admin console under app's Redirect URIs

### User Creation Failures

**Problem**: Users not appearing in Countly after Okta authentication

**Solutions**:
- Verify Okta app is assigned to user
- Confirm user's email is populated in Okta
- Check database permissions for insertion into countly.members
- Verify `userIdAttribute` is accessible in user profile
- Check Countly logs for user creation errors

## Performance Considerations

- **Token Exchange**: Each login requires OAuth2 token exchange (typically 200-600ms)
- **Group Lookup**: Initial group mapping queries Okta API (adds 100-300ms per login)
- **Group Sync**: Background group synchronization may impact performance during sync windows
- **API Rate Limits**: Okta API has rate limits (110 requests/minute per org); monitor usage
- **Database Operations**: User creation and group mapping are database-backed (indexed operations)

## Integration with Other Features

The Okta feature coexists with other authentication features:

- **LDAP/Active Directory**: Okta users stored separately, both in `countly.members`
- **OIDC**: Both OIDC and Okta serve different authentication flows
- **Local Accounts**: Okta users stored alongside local Countly accounts
- **Multiple Okta Instances**: One Okta org per Countly instance (no multi-org support currently)

## Advanced Okta Concepts

### Group Management

Okta groups are the primary mechanism for controlling Countly access. Group membership is queried:
1. **During Login**: Groups extracted from ID token claims and API queries
2. **During Sync**: Background job periodically refreshes group memberships
3. **On Demand**: Manual group sync triggered via admin interface

### Group Attributes

Okta groups include:
- `id` - Unique group identifier
- `name` - Display name (used for mapping)
- `type` - Group type (OKTA_GROUP for user groups)
- `members` - Array of user IDs in group

### Token Types

1. **ID Token**: Contains user identity information and group claims
2. **Access Token**: Used for API access to query Okta endpoints
3. **Refresh Token**: Obtained automatically; used to get new tokens without re-authentication

### Event Hooks (Optional)

Okta can send event hooks for:
- **User Creation**: New user added to Okta
- **Group Membership**: User added/removed from group
- **Deactivation**: User deactivated in Okta

## Okta Org URL Format

- **Preview**: `https://{subdomain}.okta.com`
- **Production**: `https://{subdomain}.okta.com` (same format)
- **Custom Domain** (optional): `https://{custom-domain}.okta.com` (if configured)

**Example**: `https://company.okta.com`

Never use login URL (`okta.com` without subdomain).

## Account Lifecycle

### User Creation

1. User authenticates via Okta
2. Countly checks if user exists in `countly.members` by email
3. If not exists, creates new user with Okta provider field
4. Maps Okta groups to Countly groups
5. Assigns permissions based on group mappings

### User Update

1. On subsequent login, user profile updated with latest Okta data
2. Group memberships refreshed
3. Permission changes applied immediately

### User Deactivation

1. If `deactivateOnRemove: true`, user deactivated when removed from Okta app
2. User cannot log in but account data preserved
3. Admin can manually reactivate via Countly console

## Related Documentation

- [Active Directory Integration](../active_directory/index.md)
- [LDAP Integration](../ldap/index.md)
- [OIDC Integration](../oidc/index.md)
- [Cognito Integration](../cognito/index.md)
- [User Management Feature](../users/index.md)

## Additional Resources

- [Okta OAuth 2.0 Documentation](https://developer.okta.com/docs/guides/implement-oauth2/)
- [Okta API Reference](https://developer.okta.com/docs/api/)
- [Okta Groups Management](https://help.okta.com/okta_help.htm?id=ext_Directory_Groups)
- [Okta System Log](https://help.okta.com/okta_help.htm?id=ext_System_Log)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

