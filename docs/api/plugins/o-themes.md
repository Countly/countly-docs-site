---
sidebar_label: "Themes List"
keywords:
  - "/o/themes"
  - "themes"
last_update:
  date: "2026-02-17"
---

# /o/themes

## Endpoint

```plaintext
/o/themes
```

## Overview

Returns available dashboard theme names discovered from the frontend themes directory.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- Required permission: Authenticated user.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or use `auth_token`) | API key for authentication. |
| `auth_token` | String | No | Auth token as query parameter or `countly-token` header. |

## Examples

### Read available themes

```plaintext
/o/themes?api_key=YOUR_API_KEY
```

## Response

### Success Response

```json
[
  "",
  "dark",
  "light"
]
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `(root)` | Array | Raw array of theme names. |
| `[]` | String | Theme name; empty string entry represents default/no explicit theme. |

### Error Responses

`400 Bad Request`

```json
{
  "result": "Missing parameter \"api_key\" or \"auth_token\""
}
```

`400 Bad Request`

```json
{
  "result": "Token not valid"
}
```

`401 Unauthorized`

```json
{
  "result": "User does not exist"
}
```

`401 Unauthorized`

```json
{
  "result": "User does not have right"
}
```

`401 Unauthorized`

```json
{
  "result": "User is locked"
}
```

`401 Unauthorized`

```json
{
  "result": "Token is invalid"
}
```

## Behavior

- Reads the frontend themes directory.
- Ensures output is always an array.
- Prepends empty-string default entry.
- Removes `.gitignore` from the returned list.

## Limitations

- Output reflects filesystem directory names; it does not validate theme completeness.
- If theme directory listing fails, response may only contain the default empty-string entry.

## Related Endpoints

- [Features - User Config Update](i-userconfigs.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.members` | User authentication | Reads authenticated user account for access validation. |

</details>
