---
sidebar_label: "Upload License"
keywords:
  - "/i/license/upload"
  - "license"
  - "upload"
last_update:
  date: "2026-10-08"
---

# License - Upload License

:::note Enterprise
This endpoint is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Endpoint

```plaintext
/i/license/upload
```

## Overview

Installs a Countly license file on the server. The request is a multipart file upload.

## Authentication

Pass `api_key` or `auth_token` as a query parameter, or send `countly-token` as a header. See [Authentication](../index.md#authentication).

## Permissions

- `Update` permission on the `license` feature.
- The member must be a global admin; other members get `403`.

## Request Parameters

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key` | String | Yes (or `auth_token`) | API key authentication |
| `auth_token` | String | Yes (or `api_key`) | Auth token authentication |
| `app_id` | String | Yes | App ID used for permission validation |
| `license` | File | Yes | The license file, sent as a multipart form field named `license`. |

## Examples

```bash
curl -X POST "https://your-countly-server.com/i/license/upload?api_key=YOUR_API_KEY&app_id=YOUR_APP_ID" \
  -F "license=@countly.license"
```

## Response

### Success Response

```json
"Success"
```

### Error Responses

| HTTP Status | Response |
|---|---|
| 403 | `Forbidden` (the member is not a global admin) |
| 403 | `not_applicable_on_flex` (the deployment does not use license files) |
| 500 | `License already exists` (this license was installed before) |
| 500 | `Error in license activation` (the file is missing, unreadable or its signature is not valid) |

Standard authentication/authorization errors from update validation can also be returned.

## Behavior

- Reads the uploaded file and verifies its signature with the license public key.
- Rejects a license whose ID is already stored.
- Keeps the active tier of the license being replaced, if one can be read, as the previous tier.
- Saves the new license as the active license, clears license state kept from the previous license, and stores a record of it in the list of installed licenses.
- Deletes the uploaded file from the server when done.

## Related Endpoints

- [License Overview](index.md)

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Used for | Data touched by this endpoint |
|---|---|---|
| `countly.plugins` | Active license and plugin settings | Replaces the `license` document; clears stored license state. |
| `countly.licenses` | Installed licenses | Reads and inserts the license record. |

</details>
