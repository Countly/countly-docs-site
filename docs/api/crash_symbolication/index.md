---
sidebar_position: 1
sidebar_label: "Overview"
---

# Crash Symbolication - API Documentation

> Ⓔ **Enterprise Only**  
> This feature is available exclusively in [Countly Enterprise](https://count.ly/enterprise).

## Overview

Crash Symbolication manages debug symbol files and symbolication workflows so crash stack traces can be transformed into readable output.

## Quick Links

| Endpoint | Purpose |
|---|---|
| [List Symbols](crash-symbols-list.md) | List uploaded symbol documents |
| [Add Symbol](crash-symbols-add.md) | Upload symbol/mapping files (dashboard auth) |
| [Upload Symbol (SDK)](crash-symbols-upload.md) | Upload symbol/mapping files with `app_key` |
| [Edit Symbol](crash-symbols-edit.md) | Update metadata or replace files |
| [Remove Symbol](crash-symbols-remove.md) | Delete symbol metadata and files |
| [Download](crash-symbol-download.md) | Download uploaded symbol file |
| [Get Report](crash-report-get.md) | Fetch crash report data by ID |
| [Run Symbolication](crash-symbolicate.md) | Start symbolication for a crash group |
| [Callback](crash-symbolicate-result.md) | Receive symbolication result from server |
| [List Jobs](crash-jobs-list.md) | List symbolication jobs/logs |
| [Test](symbolication-test.md) | Test symbolication server integration |

## Database Collections / Storage

| Collection | Purpose |
|---|---|
| `countly.app_crashsymbols{appId}` | Symbol metadata per app |
| `countly.symbolication_jobs` | Symbolication job lifecycle records |
| `countly.app_crashgroups{appId}` | Crash group data updated after symbolication |
| `countly.apps` | App lookup for `upload_symbol` via `app_key` |
| `countly_fs.crash_symbols` | Stored symbol files (`*.cly_symbol` paths) |

## Configuration & Settings

Crash Symbolication uses `crashes` config scope values:

- `symbolication_server`: External symbolication server URL (default: `https://symbolication.count.ly`)
- `symbolication_key`: API key for symbolication server
- `custom_domain`: Public Countly domain used for callback URLs
- `symbolication_test`: UI helper flag for connection testing
- `max_symbol_file`: Maximum number of JavaScript symbol files per upload (default: `10`)

## Workflows

### Upload and manage symbols

1. Upload symbol files with [Add Symbol](crash-symbols-add.md) or [Upload Symbol (SDK)](crash-symbols-upload.md).
2. Review files with [List Symbols](crash-symbols-list.md).
3. Update or replace files with [Edit Symbol](crash-symbols-edit.md).

### Symbolicate a crash

1. Fetch crash details with [Get Report](crash-report-get.md).
2. Trigger symbolication with [Run Symbolication](crash-symbolicate.md).
3. Track progress in [List Jobs](crash-jobs-list.md).
4. For remote-server flow, process callback in [Callback](crash-symbolicate-result.md).

## Notes

- JavaScript stack traces are deobfuscated locally using source maps.
- Native and other non-JS symbolication may use local minidump tooling or external symbolication server flow, depending on crash type.

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