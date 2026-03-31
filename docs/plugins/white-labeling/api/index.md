---
sidebar_position: 1
sidebar_label: "Overview"
---

# White Labeling - API Documentation

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

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

## Database Collections

| Collection | Purpose |
|---|---|
| `countly_fs.white-labeling.files` | GridFS metadata for branding assets |
| `countly_fs.white-labeling.chunks` | GridFS binary chunks for branding assets |

## Notes

- Image payloads are stored as data URIs in GridFS.
- Upload endpoint enforces 1.5 MB file size limit.

## Ⓔ Enterprise

This feature is part of **Countly Enterprise**.

**Get Access:**
- [Learn about Enterprise](https://count.ly/enterprise)
- [Contact Sales](https://count.ly/demo)
- [Compare Versions](https://countly.com/pricing)

**Already a Customer?** Use [support portal](https://support.countly.com/hc/en-us/requests/new) if you have any questions.

---

_Last Updated: 2026-02-15_
