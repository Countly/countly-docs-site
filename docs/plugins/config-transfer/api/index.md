---
sidebar_position: 1
sidebar_label: "Overview"
---

# Config Transfer

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Config Transfer allows exporting and importing configuration data (dashboards, segments, cohorts, transformations, etc.) across applications and environments. This enables replicating configurations between development, staging, and production applications, or quickly sharing configurations across multiple apps.

The feature works through a two-step process:
1. **Export** - Extract configuration from a source application
2. **Import** - Import exported configuration into a target application

The system automatically handles dependency resolution, ID mapping, and ownership assignment during the process.

---

## API Endpoints

- [Export Configuration](config-transfer-export.md) - Export configuration data from an application (`/o/export`)
- [Import Configuration](config-transfer-import.md) - Import exported configuration into an application (`/i/import`)

---

## Workflow Overview

### Basic Export & Import Flow

```
1. User selects items to export from Source App
                  ↓
2. Export API retrieves items and dependencies
                  ↓
3. Export returns JSON file with:
   - Selected items
   - Dependencies
   - Placeholder values (APP_ID, OWNER_ID)
                  ↓
4. User downloads exported JSON file
                  ↓
5. User uploads file to Import endpoint for Target App
                  ↓
6. Import validates all items
                  ↓
7. Import creates ID mappings (old IDs → new IDs)
                  ↓
8. Import updates all references with new IDs & app context
                  ↓
9. Import inserts configuration into Target App
                  ↓
10. User now has replicated configuration in Target App
```

---

## Supported Features

Config Transfer can export/import any feature that implements the export and import dispatch handlers. Common supported features include:

- Dashboards (including their widgets)
- Dashboards Widgets
- Cohorts
- Segments
- User Properties
- Transformations
- And others depending on plugin support

Contact your system administrator for a complete list of supported features in your environment.

---

## Key Concepts

### Placeholders

Exported data uses placeholder values that are replaced during import:

- `APP_ID` - Replaced with the target application ID
- `OWNER_ID` - Replaced with the importing user's ID

This allows configuration to be portable across applications without manual ID substitution.

### Dependencies

When exporting items, Config Transfer automatically identifies and includes dependencies:

- Dashboard exports include their widgets
- Widgets export their dashboard references
- Cohorts export their segment dependencies
- etc.

During import, dependencies are processed first to ensure referential integrity.

### ID Mapping

Config Transfer maintains a mapping of original IDs to new IDs during import:

- Each imported item receives a new unique ID
- All references to old IDs are updated to new IDs
- Cross-references between items remain valid

---

## Permissions

Config Transfer uses a central permission system:

- **Read permission**: Required to export configuration
- **Update permission**: Required to import configuration

Both require the `config_transfer` feature permission in the target application.

---

## Database Collections

Config Transfer does not directly manage data collections. Instead:

- Uses the plugin dispatch system (`plugins.dispatch()`) to coordinate with feature plugins
- Each feature plugin manages its own collections
- Export dispatches to feature plugins to retrieve data
- Import dispatches to feature plugins to insert data
- Enables loose coupling and extensibility

---

## Related Documentation

- [Dashboards - API Documentation](../../../api/dashboards/index.md) - Dashboard creation and management
- [Cohorts - API Documentation](../../cohorts/api/index.md) - Cohort creation and management

---

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions

---

_Last Updated: 2026-02-15_
