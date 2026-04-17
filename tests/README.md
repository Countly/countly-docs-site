# API Docs Validator

This folder contains a docs-driven validator for the Countly API documentation.

## What It Does

- Scans `docs/api/**/*.md`
- Validates basic doc structure for every API page
- Calls live endpoints for resolvable read-only docs
- Skips mutating endpoints by default
- Writes a report to `tests/reports/latest.json`

## Environment

Create `tests/.env` with:

- `COUNTLY_BASE_URL`
- `COUNTLY_APP_ID`
- `COUNTLY_APP_KEY`
- `COUNTLY_API_KEY`
- `COUNTLY_AUTH_TOKEN`
- `COUNTLY_TIMEOUT_MS`
- `COUNTLY_ALLOW_MUTATION`
- `COUNTLY_LOG_FILTER`

## Run

```bash
npm run test:docs-api
```

## Notes

- By default, `/i/*` endpoints are skipped because they mutate data.
- Plugin endpoints are skipped automatically when the plugin is not enabled on the target Countly instance.
- Some read endpoints still require resource-specific IDs that cannot be resolved generically; those are reported as skipped with a reason.
- `/o?method=logs` is skipped unless `COUNTLY_LOG_FILTER` is set, because unfiltered logger reads can be too heavy on busy instances.
