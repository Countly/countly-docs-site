---
sidebar_label: "Export"
---

# Export Configuration

## Endpoint

```
/o/export
```

> Ⓔ **Enterprise Only**  
> This API is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Exports configuration data (dashboards, segments, cohorts, transformations, etc.) from an application. Returns a JSON file containing selected items and their dependencies, which can be imported into another application or environment.

## Authentication

- **Authentication methods**:
  - API Key (parameter): `api_key=YOUR_API_KEY`
  - Auth Token (parameter): `auth_token=YOUR_AUTH_TOKEN`
  - Auth Token (header): `countly-token: YOUR_AUTH_TOKEN`
## Permissions

- **Required permission**: `Read` on the Config Transfer feature (`config_transfer`)

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| api_key | String | Yes (or auth_token) | API key for authentication |
| auth_token | String | Yes (or api_key) | Auth token for authentication |
| app_id | String | Yes | Application identifier to export from |
| exportData | String (JSON) | Yes | JSON stringified array of features and items to export |

### exportData Format

```json
[
  {
    "id": "dashboards",
    "name": "Dashboards",
    "children": [
      {"name": "Main Dashboard", "id": "62149f4e10b3789d3bcae393"}
    ]
  },
  {
    "id": "cohorts",
    "name": "Cohorts",
    "children": [
      {"name": "Premium Users", "id": "cohort_12345"}
    ]
  }
]
```

Where:
- `id`: Feature identifier (dashboards, cohorts, segments, etc.)
- `name`: Human-readable feature name
- `children`: Array of items to export with their IDs

## Response

### Success Response

```json
[
  {
    "name": "dashboards",
    "data": [
      {
        "_id": "APP_ID",
        "name": "Main Dashboard",
        "owner_id": "OWNER_ID",
        "share_with": "all-users",
        "shared_email_edit": [],
        "shared_email_view": [],
        "shared_user_groups_edit": [],
        "shared_user_groups_view": [],
        "theme": "0",
        "created_at": 1645518670195
      }
    ],
    "dependencies": {
      "dashboard.widgets": []
    }
  }
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| name | String | Name of the exported feature (e.g., "dashboards", "cohorts") |
| data | Array | Array of exported items with all their configuration data |
| data._id | String | Unique identifier of the exported item (uses APP_ID placeholder for app context) |
| data.name | String | Name of the exported item |
| data.owner_id | String | User ID of the item's owner (OWNER_ID placeholder) |
| dependencies | Object | Map of dependent items required by exported items (e.g., `{"dashboard.widgets": [...]}`) |

### Error Responses

| HTTP Status | Error Response | Description |
|---|---|---|
| 400 | `{"result": "Missing parameter \"api_key\" or \"auth_token\""}` | Missing authentication parameters |
| 401 | `{"result": "No app_id provided"}` | Missing app identifier |
| 401 | `{"result": "User does not have right"}` | User lacks Read permission on Config Transfer feature |
| 401 | `{"result": "User does not exist"}` | Authentication user not found |

## Behavior/Processing

- Validates read permission for `config_transfer` feature
- Parses `exportData` JSON string to identify features and items to export
- Dispatches `/export` event to each feature plugin to retrieve data for selected items
- Each plugin returns data with its own dependencies
- Traverses dependency tree to include all required related items
- Flattens and resolves dependencies for all exported items
- Returns nested structure with main data and dependency map
- Uses placeholder values (APP_ID, OWNER_ID) that are replaced during import

---

## Database Collections

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `/export` | Dispatches | event to feature plugins; Dashboards plugin queries dashboard collections; Cohorts plugin queries cohort collections; Segments plugin queries segment collections; etc. |

---

## Examples

### Example 1: Export dashboards

**Request**:
```bash
curl -X GET "https://your-server.com/o/export" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d 'exportData=[{"id":"dashboards","name":"Dashboards","children":[{"name":"Main Dashboard","id":"62149f4e10b3789d3bcae393"}]}]'
```

**Response**:
```json
[
  {
    "name": "dashboards",
    "data": [
      {
        "_id": "APP_ID",
        "name": "Main Dashboard",
        "owner_id": "OWNER_ID",
        "theme": "0",
        "created_at": 1645518670195
      }
    ],
    "dependencies": {
      "dashboard.widgets": [
        {
          "_id": "widget_id_1",
          "title": "Users Chart",
          "visualization": "line"
        }
      ]
    }
  }
]
```

### Example 2: Export dashboards and cohorts

**Request**:
```bash
curl -X GET "https://your-server.com/o/export" \
  -d "api_key=YOUR_API_KEY" \
  -d "app_id=YOUR_APP_ID" \
  -d 'exportData=[{"id":"dashboards","name":"Dashboards","children":[{"name":"Main Dashboard","id":"62149f4e10b3789d3bcae393"}]},{"id":"cohorts","name":"Cohorts","children":[{"name":"Premium Users","id":"59de32b832830e78e8e8e3f0"}]}]'
```

**Response**:
```json
[
  {
    "name": "dashboards",
    "data": [...],
    "dependencies": {...}
  },
  {
    "name": "cohorts",
    "data": [
      {
        "_id": "59de32b832830e78e8e8e3f0",
        "name": "Premium Users",
        "type": "auto",
        "steps": []
      }
    ],
    "dependencies": {}
  }
]
```

---

## Limitations

- **Feature support**: Only features that implement the `/export` dispatch can be exported. Check with your system administrator for available export options.
- **Item selection**: Must explicitly select items to export (entire features cannot be exported without selection).
- **Dependency resolution**: Export automatically includes all dependencies found in the selected items' data.
- **Size limits**: Export response size limited by server response limits (typically 100MB).
- **Data completeness**: Some embedded or reference-based data may not be included depending on feature implementation.

---

## Related Endpoints

- [Config Transfer - Import](config-transfer-import.md)
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
