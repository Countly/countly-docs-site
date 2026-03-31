---
sidebar_position: 1
sidebar_label: "Overview"
---

# LDAP Authentication

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

The LDAP (Lightweight Directory Access Protocol) feature enables Countly Enterprise to authenticate users against an LDAP directory service. This integration allows organizations to leverage existing LDAP infrastructure (such as Active Directory) for centralized user management and authentication without maintaining separate credentials in Countly.

The feature supports multiple authentication modes:
- **Basic Authentication**: LDAP credentials-only verification
- **Profile Verification**: Enhanced authentication with LDAP profile and group validation
- **Group-based Role Mapping**: Automatic Countly role assignment based on LDAP group membership

## Key Features

- **Directory-based Authentication**: Authenticate Countly users directly against LDAP servers
- **Group Mapping**: Map LDAP groups to Countly administrative roles (global admin, push approver)
- **Profile Verification**: Optional verification of user profiles stored in LDAP
- **Multi-Base DN Support**: Search across multiple organizational units
- **Secure Connections**: Support for LDAPS (LDAP over SSL/TLS) with certificate validation
- **Connection Pooling**: Connection timeout management with configurable pool settings
- **Group Alias Mapping**: Map LDAP group names to Countly group names
- **Environment Variable Configuration**: Support for deployment automation via environment variables

## Authentication Flow

### Basic Authentication (Skip Profile Verification)
1. User submits username/password to Countly login page
2. Feature receives authentication request
3. Attempt LDAP bind with user credentials (username + password)
4. If bind succeeds → authentication successful, user logged in
5. If bind fails → authentication rejected

### With Profile Verification (Recommended)
1. User submits username/password to Countly login page
2. Feature receives authentication request
3. Authenticate with bind manager credentials (ldap-reader service account)
4. Search for user in configured base DN using provided username
5. If user found, attempt bind with user's full DN and provided password
6. If bind succeeds → retrieve user profile and groups
7. Extract LDAP groups and map to Countly roles
8. Create or update Countly user with mapped group permissions
9. User logged in with appropriate role

## Configuration Settings

### Connection Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `ldapURI` | `'ldap://localhost:389'` | String | LDAP server URI (use `ldaps://` for SSL) | `COUNTLY_CONFIG_PLUGINLDAP_LDAPURI` |
| `baseDN` | `['ou=People,dc=example,dc=com', 'ou=People,dc=example2,dc=com']` | Array | Base DNs for user search (supports multiple organizations) | `COUNTLY_CONFIG_PLUGINLDAP_BASEDN` |
| `groupDN` | `'ou=Groups,dc=example,dc=com'` | String | Optional group DN when groups in separate organizational unit | `COUNTLY_CONFIG_PLUGINLDAP_GROUPDN` |
| `certificatePath` | `''` | String | Absolute path to certificate file for LDAPS connections | `COUNTLY_CONFIG_PLUGINLDAP_CERTIFICATEPATH` |

### Authentication Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `verifyProfile` | `true` | Boolean | Enable profile verification and group mapping (false = basic auth only) | `COUNTLY_CONFIG_PLUGINLDAP_VERIFYPROFILE` |
| `baseBindDN` | `'dc=example,dc=com'` | String | Base DN for the bind/manager user | `COUNTLY_CONFIG_PLUGINLDAP_BASEBINDDN` |
| `bindUsername` | `'bindusername'` | String | Service account username with read permissions | `COUNTLY_CONFIG_PLUGINLDAP_BINDUSERNAME` |
| `bindPassword` | `'bindpassword'` | String | Service account password (encrypt via: `countly encrypt yourpassword`) | `COUNTLY_CONFIG_PLUGINLDAP_BINDPASSWORD` |

### Group Authentication Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `groupAuthentication` | `true` | Boolean | Enable LDAP group mapping to Countly groups | `COUNTLY_CONFIG_PLUGINLDAP_GROUPAUTHENTICATION` |
| `globalAdminGroup` | `'countly-global-admin'` | String | LDAP group name mapping to Countly global admin role | `COUNTLY_CONFIG_PLUGINLDAP_GLOBALADMINGROUP` |
| `pushApproverGroups` | `['push-approver-group']` | Array | LDAP group names mapping to Countly push approver permission | `COUNTLY_CONFIG_PLUGINLDAP_PUSHAPPROVERGROUPS` |
| `groupAliasMap` | `{'ldap-manager': 'countly-manager'}` | Object | Optional LDAP-to-Countly group name mapping | `COUNTLY_CONFIG_PLUGINLDAP_GROUPALIASMAP` |

### Admin Override Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `countlyGlobalAdmins` | `['global_admin_username']` | Array | Local Countly users who use Countly auth (bypass LDAP) | `COUNTLY_CONFIG_PLUGINLDAP_COUNTLYGLOBALADMINS` |

### Timeout Settings

| Setting | Default | Type | Description | Environment Variable |
|---------|---------|------|-------------|----------------------|
| `timeout` | `60000` | Number | General LDAP operation timeout (milliseconds) | `COUNTLY_CONFIG_PLUGINLDAP_TIMEOUT` |
| `connectTimeout` | `10000` | Number | Initial connection establishment timeout (milliseconds) | `COUNTLY_CONFIG_PLUGINLDAP_CONNECTTIMEOUT` |
| `idleTimeout` | `60000` | Number | Idle connection timeout in pool (milliseconds) | `COUNTLY_CONFIG_PLUGINLDAP_IDLETIMEOUT` |

## Database Collections

The LDAP feature does not create its own database collections. Instead, it integrates with existing Countly collections:

| Collection | Purpose |
|------------|---------|
| `countly.members` | User accounts created via LDAP authentication; includes both regular and admin users, with mapped LDAP groups in user roles |

Authentication events are not tracked separately; standard Countly session and authentication logs apply.

## Configuration Methods

### Method 1: Configuration File

Create `config.js` in the LDAP feature directory:

```javascript
const config = {
    // Connection settings
    ldapURI: 'ldaps://ldap.company.com:636',
    baseDN: ['ou=Users,dc=company,dc=com'],
    groupDN: 'ou=Groups,dc=company,dc=com',
    certificatePath: '/etc/ssl/certs/ldap.crt',
    
    // Authentication settings
    verifyProfile: true,
    baseBindDN: 'dc=company,dc=com',
    bindUsername: 'ldap-reader',
    bindPassword: 'encrypted-password-here',
    
    // Group mapping
    groupAuthentication: true,
    globalAdminGroup: 'countly-administrators',
    pushApproverGroups: ['push-approvers', 'mobile-team'],
    groupAliasMap: {
        'ldap-manager': 'countly-manager',
        'ldap-admin': 'countly-admin'
    },
    
    // Admin overrides (bypass LDAP)
    countlyGlobalAdmins: ['admin1', 'admin2'],
    
    // Connection timeouts
    timeout: 60000,
    connectTimeout: 10000,
    idleTimeout: 60000
};

module.exports = config;
```

### Method 2: Environment Variables

Set with prefix `COUNTLY_CONFIG_PLUGINLDAP_`:

```bash
export COUNTLY_CONFIG_PLUGINLDAP_LDAPURI="ldaps://ldap.company.com:636"
export COUNTLY_CONFIG_PLUGINLDAP_BASEDN="ou=Users,dc=company,dc=com"
export COUNTLY_CONFIG_PLUGINLDAP_BASEBINDDN="dc=company,dc=com"
export COUNTLY_CONFIG_PLUGINLDAP_BINDUSERNAME="ldap-reader"
export COUNTLY_CONFIG_PLUGINLDAP_BINDPASSWORD="encrypted-password"
export COUNTLY_CONFIG_PLUGINLDAP_TIMEOUT="60000"
export COUNTLY_CONFIG_PLUGINLDAP_CONNECTTIMEOUT="10000"
export COUNTLY_CONFIG_PLUGINLDAP_IDLETIMEOUT="60000"
```

## Use Cases

### Use Case 1: Authentication with Active Directory

Enable enterprise-wide authentication against Microsoft Active Directory:

```javascript
{
    ldapURI: 'ldaps://ad.company.com:636',
    baseDN: ['ou=Users,dc=company,dc=com'],
    groupDN: 'ou=Groups,dc=company,dc=com',
    verifyProfile: true,
    baseBindDN: 'dc=company,dc=com',
    bindUsername: 'COMPANY\\ldap-reader',
    bindPassword: 'encrypted-password',
    certificatePath: '/etc/ssl/certs/ad.crt',
    groupAuthentication: true,
    globalAdminGroup: 'AD-Countly-Admins',
    pushApproverGroups: ['AD-Push-Team']
}
```

**Result**: Users log in with Active Directory credentials; Countly admins automatically assigned based on AD group membership.

### Use Case 2: Multiple Organization Support

Support multiple LDAP base DNs (separate departments/organizations):

```javascript
{
    ldapURI: 'ldaps://ldap.company.com:636',
    baseDN: [
        'ou=Engineering,dc=company,dc=com',
        'ou=Marketing,dc=company,dc=com',
        'ou=Sales,dc=company,dc=com'
    ],
    verifyProfile: true,
    baseBindDN: 'dc=company,dc=com',
    bindUsername: 'ldap-reader',
    bindPassword: 'encrypted-password',
    groupAuthentication: true,
    globalAdminGroup: 'Countly-Admins'
}
```

**Result**: Users from any organization can authenticate; search performed across all base DNs.

### Use Case 3: Hybrid Authentication (LDAP + Local)

Mix LDAP authentication with local Countly admin accounts:

```javascript
{
    ldapURI: 'ldaps://ldap.company.com:636',
    baseDN: ['ou=Users,dc=company,dc=com'],
    verifyProfile: true,
    baseBindDN: 'dc=company,dc=com',
    bindUsername: 'ldap-reader',
    bindPassword: 'encrypted-password',
    groupAuthentication: true,
    countlyGlobalAdmins: ['root-admin', 'backup-admin']  // These use Countly auth, not LDAP
}
```

**Result**: Regular users authenticate via LDAP; specified admin accounts use local Countly credentials (for recovery/bypass scenarios).

### Use Case 4: Low-Latency Network Connection

For WAN/cloud-to-cloud LDAP connections with higher latency:

```javascript
{
    ldapURI: 'ldaps://ldap-cloud.company.com:636',
    baseDN: ['ou=Users,dc=company,dc=com'],
    verifyProfile: true,
    timeout: 90000,        // 90 seconds
    connectTimeout: 20000, // 20 seconds
    idleTimeout: 90000     // 90 seconds
}
```

**Result**: Extended timeouts prevent connection failures on high-latency LDAP servers.

## Best Practices

1. **Always Use LDAPS in Production**: Use `ldaps://` instead of `ldap://` and provide valid certificate path
2. **Minimal Bind Permissions**: Create a dedicated service account (ldap-reader) with read-only permissions on base DNs only
3. **Encrypt Passwords**: Use Countly's `countly encrypt` command to encrypt the bind password in config
4. **Separate Group DN**: If your LDAP structure separates groups and users, configure `groupDN` explicitly
5. **Test Group Mappings**: Verify LDAP group names exactly match configuration before enabling in production
6. **Monitor Timeouts**: For unstable networks, increase timeout values gradually rather than setting very high defaults
7. **Backup Authentication**: Always maintain at least one local admin account (via `countlyGlobalAdmins`) for recovery
8. **Certificate Management**: Keep LDAP certificates current; expired certificates will break authentication

## Troubleshooting

### Authentication Failures

**Problem**: Users cannot log in with LDAP credentials

**Solutions**:
- Verify bind credentials are correct (test with ldapsearch tool)
- Check user DN format matches LDAP server structure
- Confirm user exists in configured base DN
- Ensure LDAP server allows bind operations from Countly host
- Increase connection timeout if network latency is high

**Debug**: Check Countly logs for LDAP-specific error messages

### Group Mapping Issues

**Problem**: LDAP group mappings not working, users lack expected roles

**Solutions**:
- Verify group DN is correct (use ldapsearch to find groups)
- Confirm user is member of groups in LDAP
- Check group names exactly match configuration (case-sensitive)
- Ensure `groupAuthentication` is set to `true`
- Verify group alias mappings if using `groupAliasMap`

**Debug**: Manually verify group membership with ldapsearch

### Connection Timeouts

**Problem**: "Connection timeout" or "Idle timeout" errors

**Solutions**:
- Increase `timeout`, `connectTimeout`, and `idleTimeout` values
- Verify network connectivity to LDAP server (ping, telnet to LDAP port)
- Check if LDAP server is responding (service status on LDAP server)
- Monitor firewall rules between Countly and LDAP server
- For cloud/WAN connections, use timeout values: 90000-120000ms

### Certificate Errors

**Problem**: "Certificate verification failed" or SSL/TLS errors

**Solutions**:
- Verify certificate file path is absolute and accessible
- Ensure certificate is in PEM format
- Check certificate is not expired
- Verify certificate matches LDAP server hostname
- For self-signed certificates, ensure correct CA certificate is provided

## Performance Considerations

- **Connection Pooling**: The feature automatically manages LDAP connection pools; idle connections timeout after `idleTimeout` ms
- **Group Lookups**: If using group mapping, an additional LDAP search is performed after user bind (minimal performance impact)
- **Caching**: User profiles are cached in Countly database; LDAP queries only occur during login
- **Multiple Search Paths**: Searching multiple base DNs adds search time; consider optimizing base DN selection

## Security Considerations

1. **TLS/SSL**: Always use `ldaps://` protocol (LDAP over TLS) in production
2. **Certificate Validation**: Configure `certificatePath` to validate server identity
3. **Password Encryption**: Use `countly encrypt` to encrypt `bindPassword` in config files
4. **Service Account Privileges**: Bind account should have minimal read permissions (no write/delete)
5. **Network Isolation**: LDAP traffic should be isolated on internal network only
6. **Admin Bypass**: Use `countlyGlobalAdmins` sparingly for emergency recovery only
7. **Audit Logging**: Monitor authentication logs for suspicious patterns or repeated failures

## Integration with Other Features

The LDAP feature integrates with Countly's core authentication system and affects:

- **User Management**: Created/updated during LDAP authentication; can be managed alongside plugin_users feature
- **Group Management**: LDAP groups mapped to Countly groups; affects dashboard access control
- **Admin Console**: Admin users authenticated via LDAP have roles based on group mappings
- **Permission System**: User permissions determined by mapped LDAP groups

## Related Documentation

- [Active Directory Integration](../../active_directory/api/index.md)
- [OIDC Integration](../../oidc/api/index.md)
- [Okta Integration](../../okta/api/index.md)
- [Cognito Integration](../../cognito/api/index.md)
- [User Management Feature](../../users/api/index.md)

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

