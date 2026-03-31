---
sidebar_label: "Import"
---

# Import Configuration

## Endpoint

```
/i/import
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Imports previously exported configuration data into an application. Reads a JSON file from the export endpoint, validates all items for compatibility, performs ID mapping, and inserts the configuration into the target application with automatic dependency resolution.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Update` on the Config Transfer feature (`config_transfer`)

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Target application identifier (where to import configuration) |
| import_file | File | Yes | JSON file exported from the Config Transfer export endpoint |

### import_file Format

JSON file structure exactly as exported from `/o/export`:

```json
[
  {
    "name": "feature_name",
    "data": [...],
    "dependencies": {...}
  }
]
```

## Response

### Success Response

```json
"Success"
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root value)` | String | Status message on successful import |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{"result": "Missing parameter \"api_key\" or \"auth_token\""}` | Missing authentication parameters |
| 401 | `{"result": "No app_id provided"}` | Missing target app identifier |
| 401 | `{"result": "User does not have right"}` | User lacks Update permission on Config Transfer feature |
| 500 | `{"result": "Error in import"}` | Import validation or data insertion failed |

## Behavior/Processing

### Import Process

1. **Validation Phase**:
   - Validates update permission for `config_transfer` feature
   - Reads and parses uploaded JSON file from export
   - Validates imported data structure

2. **Feature Validation**:
   - For each feature in import file:
     - Dispatches `/import/validate` to the feature plugin
     - Receives validation result with status and old→new ID mapping
     - Collects plugin ID maps

3. **Dependency Validation**:
   - Processes dependency items:
     - Dispatches `/import/validate` for each dependency
     - Builds complete ID map (old IDs → newly generated IDs)

4. **ID Reference Updates**:
   - Replaces all references in imported data:
     - `APP_ID` placeholder → Target application ID
     - `OWNER_ID` placeholder → Importing user's member ID
     - Old object IDs → Newly generated IDs
   - Ensures all cross-references remain valid

5. **Import Execution**:
   - Imports dependencies first (in correct order)
   - Then imports main items
   - Dashboard widgets imported last due to dependency on dashboards
   - Dispatches `/import` event to each feature plugin for data insertion

6. **Data Persistence**:
   - Each feature plugin manages writing to its own collections
   - Maintains referential integrity across features

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `/import` | Dispatches | event to feature plugins; Dashboard plugin writes to dashboard collections; Cohorts plugin writes to cohort collections; Segments plugin writes to segment collections; etc. |

---

## Examples

### Example 1: Import configuration file to target app

**Request** (multipart/form-data):
```bash
curl -X POST "https://your-server.com/i/import" \
  -F "api_key=YOUR_API_KEY" \
  -F "app_id=TARGET_APP_ID" \
  -F "import_file=@export_config.json"
```

Where `export_config.json` is a file previously downloaded from the export endpoint.

**Response**:
```json
"Success"
```

### Example 2: Save export, then import to another app

**Step 1: Export from source app**:
```bash
curl -X GET "https://your-server.com/o/export" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=SOURCE_APP_ID" \
  -d 'exportData=[{"id":"dashboards","name":"Dashboards","children":[{"id":"dash_123"}]}]' \
  > export_config.json
```

**Step 2: Import to target app**:
```bash
curl -X POST "https://your-server.com/i/import" \
  -F "api_key=YOUR_API_KEY" \
  -F "app_id=TARGET_APP_ID" \
  -F "import_file=@export_config.json"
```

**Response**:
```json
"Success"
```

---

## Limitations

- **File size**: Import file size limited by server upload limits (typically 100MB).
- **Supported features**: Only features that implement `/import` and `/import/validate` dispatches can be imported. Check plugin documentation for import support.
- **ID replacement mechanism**: IDs are replaced using string replacement of `APP_ID` and `OWNER_ID` placeholders. Custom serialization logic in imported data may break if not handled properly.
- **Dependency conflicts**: If exported item depends on items not being imported, import may fail with validation error from the feature plugin.
- **User-specific data**: Some user-specific data (permissions, favorites, personal settings) may not be exported depending on feature implementation.
- **Ownership**: Imported items are assigned to the importing user. Previous ownership is not preserved.
- **Duplicate handling**: Importing the same configuration twice creates duplicate items (no upsert/merge logic).

---

## Related Endpoints

- [Config Transfer - Export](config-transfer-export.md)
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

## Last Updated

2026-02-16
