---
sidebar_position: 1
sidebar_label: "Overview"
last_update:
  date: "2026-02-17"
---

# Locale - API Documentation

## Overview

The Locale feature provides app-level language usage analytics and a language metadata map used across dashboard localization flows.

## Quick Links

- [Locale - Languages Read](o-langs.md)
- [Locale - Language Map Read](o-langmap.md)

## Configuration & Settings

Locale uses core analytics storage and permissions. No dedicated Locale-specific runtime settings are applied to these endpoints.

<details>
<summary>Implementation details</summary>

**Database Collections**

| Collection | Purpose |
|---|---|
| `countly.langs` | Stores aggregated language metrics by app and time period for locale analytics responses. |

</details>
