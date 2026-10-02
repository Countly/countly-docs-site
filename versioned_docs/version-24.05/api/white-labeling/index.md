---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-15"
---

# White Labeling - API Documentation

:::note Enterprise
This feature is part of [Countly Enterprise](https://count.ly/enterprise). To get access, [contact sales](https://count.ly/demo) or [compare versions](https://countly.com/pricing). Existing customers can reach the [support portal](https://support.countly.com/hc/en-us/requests/new) with questions.
:::

## Overview

White Labeling customizes Countly branding (logos, colors, favicon, and selected email identity settings).

## Quick Links

- [White Labeling - Upload Assets](upload.md)

## Configuration & Settings

Configured with `plugins.setConfigs("white-labeling", ...)`:

- `prelogo`, `stopleftlogo`, `favicon`
- `prebcolor`, `preb_text_color`, `smenucolor`
- `stitle`, `footerLabel`
- `emailFrom`, `emailCompany`, `newsletter`

## Notes

- Image payloads are stored as data URIs in GridFS.
- Upload endpoint enforces 1.5 MB file size limit.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly_fs.white-labeling.files` | GridFS metadata for branding assets |
| `countly_fs.white-labeling.chunks` | GridFS binary chunks for branding assets |

</details>
