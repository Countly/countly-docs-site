---
sidebar_position: 1
sidebar_label: "Overview"
---

# Active Directory Authentication

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The Active Directory feature enables Countly Enterprise to integrate with both **Microsoft Azure Active Directory (Azure AD)** and **on-premises Active Directory (LDAP)**. This unified authentication solution allows organizations to leverage existing directory infrastructure for centralized user management and role-based access control.

The feature supports two authentication modes:
- **Azure AD (Cloud)**: OAuth2-based authentication with Azure Active Directory
- **LDAP (On-premises)**: Direct LDAP authentication with on-premises Active Directory or compatible LDAP servers

Both modes support automatic user group mapping to Countly administrative roles, enabling zero-touch provisioning and enterprise-grade access control.

## Key Features

- **Dual Authentication Modes**: Support for both Azure AD and on-premises LDAP
- **Group-based Role Mapping**: Automatic assignment of Countly roles based on AD group membership
- **Per-App Group Configuration**: Different AD group requirements per application
- **Tenant Configuration**: Azure AD supports multi-tenant (`multi`) or tenant-specific configuration
- **Permission Groups**: Default permission groups for all authenticated users
- **Push Approver Mapping**: Specific AD groups mapped to push approver permission
- **TLS/SSL Support**: Secure LDAP connections with certificate validation
- **Retry Logic**: Configurable connection retry attempts for reliability
- **Azure AD OAuth2**: Standards-compliant OAuth2 flow for cloud deployments

## Architecture

### Azure AD Flow
```
User Login → Azure AD OAuth2 → Exchange code for access token
→ Fetch profile (/me) + groups (/me/memberOf)
→ Map to Countly Roles → Create/Update Session
```

### LDAP Flow
```
User Credentials → LDAP Bind → Query User Groups → Map to Countly Roles 
→ Create/Update Session
```

## Configuration Settings

### Azure AD Configuration

#### Connection Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `clientId` | `'8db7e011-a15f-4454-9472-2f475550c7a7'` | String | Azure AD application client ID | `COUNTLY_CONFIG_PLUGINAD_CLIENTID` |
| `clientSecret` | `'c33wTBoBv@_1jPm.e1ENTLhpoB]IE@iC'` | String | Azure AD application client secret | `COUNTLY_CONFIG_PLUGINAD_CLIENTSECRET` |
| `tenant` | `'multi'` | String | Tenant value (`multi` or a specific tenant ID) | `COUNTLY_CONFIG_PLUGINAD_TENANT` |

#### Role Mapping Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `globalAdminGroup` | `'countly-global-admins'` | String | Azure AD group that becomes Countly global admin | `COUNTLY_CONFIG_PLUGINAD_GLOBALADMINGROUP` |
| `defaultGroup` | `'default-group'` | String | Countly default permission group for all users | `COUNTLY_CONFIG_PLUGINAD_DEFAULTGROUP` |
| `pushApproverGroups` | `['push-approver-group']` | Array | Azure AD groups mapped to push approver permission | `COUNTLY_CONFIG_PLUGINAD_PUSHAPPROVERGROUPS` |

### LDAP Configuration

#### Connection Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `ldapURI` | `'ldap://localhost:389'` | String | LDAP server URI (use `ldaps://` for TLS) | `COUNTLY_CONFIG_PLUGINAD_LDAPURI` |
| `baseDN` | `'DC=active-directory,DC=count,DC=ly'` | String | Base LDAP distinguished name for user search | `COUNTLY_CONFIG_PLUGINAD_BASEDN` |
| `domainPrefix` | `'ACTIVE-DIRECTOR\\'` | String | Domain prefix for usernames (e.g., 'ACME\\') | `COUNTLY_CONFIG_PLUGINAD_DOMAINPREFIX` |
| `adminUsername` | `'username'` | String | Service account username for LDAP queries | `COUNTLY_CONFIG_PLUGINAD_ADMINUSERNAME` |
| `adminPassword` | `'password'` | String | Service account password (use `countly encrypt` for encryption) | `COUNTLY_CONFIG_PLUGINAD_ADMINPASSWORD` |

#### Authentication Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `timeout` | `20000` | Number | LDAP operation timeout (milliseconds) | `COUNTLY_CONFIG_PLUGINAD_TIMEOUT` |
| `retry` | `5` | Number | Maximum LDAP connection retry attempts | `COUNTLY_CONFIG_PLUGINAD_RETRY` |
| `tlsEnabled` | `false` | Boolean | Enable TLS for LDAP connections | `COUNTLY_CONFIG_PLUGINAD_TLSENABLED` |
| `tlsCert` | `''` | String | TLS certificate path for secure LDAP | `COUNTLY_CONFIG_PLUGINAD_TLSCERT` |

#### Role Mapping Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `globalAdminGroup` | `'ad-global-admin'` | String | LDAP group that becomes Countly global admin | `COUNTLY_CONFIG_PLUGINAD_GLOBALADMINGROUP` |
| `defaultGroup` | `'default'` | String | Countly default permission group for all users | `COUNTLY_CONFIG_PLUGINAD_DEFAULTGROUP` |
| `pushApproverGroups` | `['push-approver-group']` | Array | LDAP groups mapped to push approver permission | `COUNTLY_CONFIG_PLUGINAD_PUSHAPPROVERGROUPS` |
| `useCountlyGroups` | `true` | Boolean | Use Countly group mapping (`true`) or legacy app-level AD group mapping (`false`) | `COUNTLY_CONFIG_PLUGINAD_USECOUNTLYGROUPS` |

### Per-Application Group Configuration

When an application is created with AD group settings, the feature stores three group mappings in `countly.apps`:

| Field | Type | Description |
|-------|------|-------------|
| `ad_group_admin` | String | AD group for app administrators; app create hook appends `-{app_name}-admin` when suffix is not already detected |
| `ad_group_user` | String | AD group for app users; app create hook appends `-{app_name}-user` when suffix is not already detected |
| `ad_group_marketing` | String | AD group for app marketing users; app create hook appends `-{app_name}-marketing` when suffix is not already detected |

## Database Collections

The Active Directory feature stores group mappings in existing Countly collections:

| Collection | Purpose |
|------------|---------|
| `countly.members` | User accounts created via AD authentication; includes mapped AD groups in user roles |
| `countly.apps` | Application records; extended with `ad_group_admin`, `ad_group_user`, `ad_group_marketing` fields for per-app group settings |
| `countly.groups` | Countly permission groups used during AD/Azure group-to-role mapping |

No separate collections are created; AD configuration integrates directly with core Countly collections.

## Configuration Methods

### Method 1: Azure AD Configuration File

Create or edit `config.js` from `config.azure.sample.js` in the Active Directory feature directory:

```javascript
const config = {
    // Azure AD Connection
    clientId: '8db7e011-a15f-4454-9472-2f475550c7a7',
    clientSecret: 'c33wTBoBv@_1jPm.e1ENTLhpoB]IE@iC',
    tenant: 'multi',  // 'multi' for multi-tenant or a specific tenant ID
    
    // Role Mapping
    globalAdminGroup: 'countly-global-admins',
    defaultGroup: 'default-group',
    pushApproverGroups: ['push-approver-group'],
};

module.exports = require('../../api/configextender')('PLUGINAD', config, process.env, {
    CLIENTID: 'clientId',
    CLIENTSECRET: 'clientSecret',
    GLOBALADMINGROUP: 'globalAdminGroup',
    DEFAULTGROUP: 'defaultGroup',
    PUSHAPPROVERGROUPS: 'pushApproverGroups',
    TENANT: 'tenant'
});
```

**How mode is selected**: Azure AD mode is used when `clientId` and `clientSecret` are present in `config.js`.

### Method 2: LDAP Configuration File

Create or edit `config.js` from `config.ldap.sample.js` in the Active Directory feature directory:

```javascript
const config = {
    // LDAP Connection
    ldapURI: 'ldaps://ad.company.com:636',
    baseDN: 'CN=Users,DC=company,DC=com',
    domainPrefix: 'COMPANY\\',
    adminUsername: 'ldap-reader',
    adminPassword: 'encrypted-password-here',
    
    // Connection Options
    timeout: 20000,
    retry: 5,
    tlsEnabled: true,
    tlsCert: '/etc/ssl/certs/ad.crt',
    
    // Role Mapping
    globalAdminGroup: 'ad-global-admin',
    defaultGroup: 'default',
    pushApproverGroups: ['push-approver-group'],
    useCountlyGroups: true
};

module.exports = require('../../api/configextender')('PLUGINAD', config, process.env, {
    LDAPURI: 'ldapURI',
    BASEDN: 'baseDN',
    DOMAINPREFIX: 'domainPrefix',
    ADMINUSERNAME: 'adminUsername',
    ADMINPASSWORD: 'adminPassword',
    GLOBALADMINGROUP: 'globalAdminGroup',
    DEFAULTGROUP: 'defaultGroup',
    PUSHAPPROVERGROUPS: 'pushApproverGroups',
    USECOUNTLYGROUPS: 'useCountlyGroups',
    TIMEOUT: 'timeout',
    RETRY: 'retry',
    TLSENABLED: 'tlsEnabled',
    TLSCERT: 'tlsCert'
});
```

**How mode is selected**: LDAP mode is used when `clientId` / `clientSecret` are not configured.

### Method 3: Environment Variables

Set with prefix `COUNTLY_CONFIG_PLUGINAD_`:

```bash
# Azure AD
export COUNTLY_CONFIG_PLUGINAD_CLIENTID="8db7e011-..."
export COUNTLY_CONFIG_PLUGINAD_CLIENTSECRET="c33wTBoBv@..."
export COUNTLY_CONFIG_PLUGINAD_TENANT="multi"
export COUNTLY_CONFIG_PLUGINAD_GLOBALADMINGROUP="countly-global-admins"
export COUNTLY_CONFIG_PLUGINAD_DEFAULTGROUP="default-group"
export COUNTLY_CONFIG_PLUGINAD_PUSHAPPROVERGROUPS='["push-approver-group"]'

# LDAP
export COUNTLY_CONFIG_PLUGINAD_LDAPURI="ldaps://ad.company.com:636"
export COUNTLY_CONFIG_PLUGINAD_BASEDN="CN=Users,DC=company,DC=com"
export COUNTLY_CONFIG_PLUGINAD_DOMAINPREFIX="COMPANY\\"
export COUNTLY_CONFIG_PLUGINAD_ADMINUSERNAME="ldap-reader"
export COUNTLY_CONFIG_PLUGINAD_ADMINPASSWORD="encrypted-password"
export COUNTLY_CONFIG_PLUGINAD_USECOUNTLYGROUPS="true"
```

## Use Cases

### Use Case 1: Azure AD Cloud Authentication

Enable enterprise-wide authentication using Azure Active Directory:

```javascript
{
    clientId: 'your-azure-client-id',
    clientSecret: 'your-client-secret',
    tenant: 'multi',
    globalAdminGroup: 'Countly-Admins',
    defaultGroup: 'Countly-Users',
    pushApproverGroups: ['Countly-Push-Team']
}
```

**Result**: Users authenticate via Azure AD OAuth2; group memberships determine Countly roles automatically.

### Use Case 2: On-Premises LDAP Authentication

Authenticate users against existing on-premises Active Directory:

```javascript
{
    ldapURI: 'ldaps://ad.company.com:636',
    baseDN: 'CN=Users,DC=company,DC=com',
    domainPrefix: 'COMPANY\\',
    adminUsername: 'service-account',
    adminPassword: 'encrypted-password',
    tlsEnabled: true,
    tlsCert: '/etc/ssl/certs/ad.crt',
    globalAdminGroup: 'AD-Admins',
    defaultGroup: 'AD-Users',
    pushApproverGroups: ['Push-Team']
}
```

**Result**: Users log in with domain credentials; automatic group-based role assignment.

### Use Case 3: Per-Application Group Configuration

Configure different AD groups for different applications:

```javascript
// During app creation:
{
    name: 'Analytics Dashboard',
    ad_group_admin: 'analytics-admins',      // → becomes 'analytics-admins-Analytics Dashboard-admin'
    ad_group_user: 'analytics-users',        // → becomes 'analytics-users-Analytics Dashboard-user'
    ad_group_marketing: 'marketing-team'     // → becomes 'marketing-team-Analytics Dashboard-marketing'
}
```

**Result**: Different AD groups can have different permissions levels per application.

### Use Case 4: Legacy Per-App AD Group Mapping

Use legacy app-level AD group mapping instead of Countly groups:

```javascript
{
    ldapURI: 'ldaps://ad.company.com:636',
    baseDN: 'CN=Users,DC=company,DC=com',
    adminUsername: 'service-account',
    adminPassword: 'encrypted-password',
    useCountlyGroups: false
}
```

**Result**: AD groups are matched against app fields (`ad_group_admin`, `ad_group_user`, `ad_group_marketing`) when assigning app-level roles.

### Use Case 5: Multi-Tenant Azure AD

Support multiple Azure AD tenants in single Countly instance:

```javascript
{
    tenant: 'multi',  // Allows any Azure AD tenant
    clientId: 'shared-client-id',
    clientSecret: 'shared-client-secret',
    globalAdminGroup: 'countly-global-admins',
    defaultGroup: 'countly-users'
}
```

**Result**: Users from any Azure AD tenant can authenticate; role assignment based on their tenant's group memberships.

## Best Practices

### Azure AD

1. **Use Multi-Tenant for SaaS**: Set `tenant: 'multi'` to allow any Azure AD organization
2. **Secure Client Secret**: Store client secret in secure configuration management, never in code
3. **Register Reply URLs**: Ensure Azure app registration includes all Countly callback URLs
4. **Graph Permissions**: Ensure Microsoft Graph permissions allow reading profile and group membership
5. **Test in Dev Tenant**: Always test configuration in development Azure AD tenant first

### LDAP (On-Premises)

1. **Use LDAPS**: Always enable TLS in production (`tlsEnabled: true`, `ldaps://` URI)
2. **Dedicated Service Account**: Create account with read-only permissions for LDAP queries
3. **Encrypt Password**: Use `countly encrypt` to encrypt `adminPassword` in config
4. **Certificate Validation**: Provide valid certificate path for TLS validation
5. **Test Connectivity**: Verify LDAP server is accessible before enabling in production
6. **Timeout Tuning**: Increase timeout for WAN/cloud connections (30000-60000ms)
7. **Retry Logic**: Adjust retry count based on network stability (default: 5)

### General

1. **Group Testing**: Verify group names exactly match AD configuration before enabling
2. **Role Mapping**: Test role assignments for all group types (admin, user, approver)
3. **Backup Authentication**: Maintain at least one local admin account for recovery
4. **Audit Logging**: Monitor authentication logs for failed attempts and unusual patterns
5. **Regular Review**: Periodically verify AD group memberships match intended access levels

## Troubleshooting

### Azure AD Authentication Failures

**Problem**: "Authentication failed" or "Invalid Azure AD credentials"

**Solutions**:
- Verify `clientId` and `clientSecret` match Azure AD application registration
- Confirm redirect URIs in Azure AD app include all Countly URLs
- Check Azure AD tenant setting matches configuration (`multi` or specific tenant ID)
- Verify user has necessary Azure AD group memberships
- Ensure Azure AD application has permission to read group memberships

**Debug**: Check Azure AD sign-in logs in Azure Portal

### LDAP Authentication Failures

**Problem**: "LDAP bind failed" or "User not found"

**Solutions**:
- Test admin credentials with ldapsearch tool: `ldapsearch -D "CN=admin,DC=company,DC=com" -w password`
- Verify `baseDN` is correct (use ldapsearch to discover correct DN)
- Confirm `domainPrefix` matches actual domain structure
- Check user exists in LDAP under configured `baseDN`
- Verify LDAP server allows search operations

**Debug**: Increase logging, check Countly error logs

### Group Mapping Issues

**Problem**: Users authenticate but lack expected roles

**Solutions**:
- Verify group names exactly match `globalAdminGroup`, `defaultGroup`, `pushApproverGroups`
- Check user is member of groups in AD (use AD Users & Computers or Azure AD Portal)
- Confirm group names are case-sensitive in configuration
- Confirm matching values are aligned with Countly group names/group IDs (or legacy app-level AD group fields when `useCountlyGroups: false`)
- Verify `useCountlyGroups` setting matches your AD structure

### Certificate/TLS Errors

**Problem**: "Certificate verification failed" or TLS connection errors

**Solutions** (LDAP only):
- Verify certificate file path is correct and accessible
- Ensure certificate is in PEM format
- Check certificate validity: `openssl x509 -in cert.crt -noout -dates`
- Verify certificate hostname matches LDAP server

## Performance Considerations

- **LDAP login path**: LDAP mode performs authenticate, profile lookup, and group lookup per login.
- **Retry impact**: LDAP operations use retry logic (`retry`), which improves resilience but can increase latency during outages.
- **Azure AD login path**: Azure mode performs token exchange, `/me` profile lookup, and `/me/memberOf` group retrieval.
- **Large group memberships**: Azure group retrieval is paged (`top(999)` with skip token), so users in many groups may have slower login.
- **Default group fallback**: `defaultGroup` is prepended when configured, reducing role resolution failures for users with limited directory groups.

## Security Considerations

### Azure AD

1. **OAuth2 Protocol**: Uses industry-standard OAuth2; credentials never transmitted to Countly
2. **Client Secret Protection**: Store in secure configuration; rotate periodically
3. **Least Privilege**: Limit Graph permissions to only what is needed for profile/group lookups
4. **Redirect URI Safety**: Keep callback URI strict and exact in Azure app registration

### LDAP

1. **TLS/SSL**: Always use `ldaps://` in production; never send credentials over unencrypted connection
2. **Password Encryption**: Use `countly encrypt` to encrypt bind password in config files
3. **Service Account**: Bind account should have minimal permissions (read-only on base DN)
4. **Network Isolation**: LDAP traffic should remain on internal network only
5. **Certificate Validation**: Ensure `tlsCert` points to a valid readable certificate when `tlsEnabled: true`

### Both Modes

1. **Separate Service Accounts**: Never use personal AD accounts for LDAP bind or Azure AD service principal
2. **Audit Logging**: Enable authentication logging to detect suspicious patterns
3. **Conditional Access**: For Azure AD, consider using Conditional Access policies
4. **MFA Integration**: Azure AD supports MFA; enable for additional security
5. **Regular Rotation**: Rotate passwords and secrets periodically (every 90 days)

## Integration with Other Features

The Active Directory feature integrates with Countly's core authentication and applies to:

- **User Management**: Authenticated users stored in `countly.members`
- **Group Management**: AD group mappings applied to Countly group permissions
- **Admin Console**: Admin users authenticated via AD have roles based on group mappings
- **Permission System**: User permissions determined by AD group mappings
- **App Management**: Per-app AD group settings stored in application configuration

## Comparison: Azure AD vs LDAP

| Feature | Azure AD | LDAP |
|---------|----------|------|
| **Deployment** | Cloud (SaaS/Office 365) | On-premises (Active Directory) |
| **Protocol** | OAuth2 | LDAP/LDAPS |
| **User Management** | Azure AD Portal | Active Directory Users & Computers |
| **MFA Support** | Native/Conditional Access | Via LDAP server settings |
| **Scalability** | Multi-tenant cloud | Single organization/tenant |
| **Setup Complexity** | Low (OAuth2 registration) | Medium (LDAP configuration) |
| **Security** | Token-based, industry-standard | Direct authentication, TLS optional |
| **Ideal For** | SaaS deployments, multi-org | Enterprise, on-premises infrastructure |

## Upgrading/Migrating Between Modes

To migrate from LDAP to Azure AD:

1. **Test Azure AD configuration** on development/staging instance
2. **Verify group mappings** work with Azure AD tenant
3. **Document current LDAP groups** and Azure AD equivalents
4. **Plan switchover** during maintenance window
5. **Notify users** of authentication changes
6. **Keep LDAP** as fallback during transition period
7. **Monitor authentication logs** post-migration for issues

## Related Documentation

- [LDAP Integration](../ldap/index.md)
- [OIDC Integration](../oidc/index.md)
- [Okta Integration](../okta/index.md)
- [Cognito Integration](../cognito/index.md)
- [User Management Feature](../users/index.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

**Last Updated**: 2026-02-15
