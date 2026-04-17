# API Validation Code Fix Backlog

This file tracks runtime/code issues found while validating the documented API against `https://v2.count.ly/`.

It is intentionally separate from the public docs. Items here are candidates for server/plugin fixes, not doc changes.

## Feedback Upload Handling

### Endpoints

- `/i/feedback/upload`
- `/i/feedback/logo`

### Current Findings

- `v2.count.ly` validation repeatedly showed unstable behavior on these routes:
  - `/i/feedback/upload` returned timeouts or upstream `503`
  - `/i/feedback/logo` returned upstream `502`
- These failures are consistent with missing-file handling problems in the upload handlers, not just documentation gaps.

### Why This Likely Needs Code Changes

#### 1. Missing file is not validated before dereferencing upload object

In star-rating:
- [api.js](../countly-server/plugins/star-rating/api/api.js) around `uploadFile(myfile, id, callback)`
- [api.js](../countly-server/plugins/star-rating/api/api.js) around `uploadFeedbackFile(myname, myfile)`
- [api.js](../countly-server/plugins/star-rating/api/api.js) around `plugins.register("/i/feedback/upload", ...)`
- [api.js](../countly-server/plugins/star-rating/api/api.js) around `plugins.register("/i/feedback/logo", ...)`

In surveys:
- [api.js](../countly-enterprise-plugins/plugins/surveys/api/api.js) around `uploadFile(myname, myfile)`
- [api.js](../countly-enterprise-plugins/plugins/surveys/api/api.js) around `plugins.register("/i/feedback/upload", ...)`

Observed problem:
- `/i/feedback/logo` calls `uploadFile(params.files.logo, ...)`
- `/i/feedback/upload` may call `uploadFeedbackFile(params.qstring.name, params.files.file)`
- neither handler validates that `params.files` exists and that the required file field exists before dereferencing `myfile.path`, `myfile.type`, or `myfile.size`

Effect:
- when no multipart file is present, the handler can throw instead of returning a clean `400`
- depending on surrounding middleware/reverse proxy behavior, this can surface as timeout / `502` / `503`

### Proposed Fix

For both star-rating and surveys handlers:

1. validate file presence up front
- `/i/feedback/logo` should return a clean `400` if `params.files?.logo` is missing
- `/i/feedback/upload` should return a clean `400` if neither:
  - `params.files.feedback_logo`
  - nor `params.files.file` with `params.qstring.name`
  is present

2. guard helper functions
- `uploadFile(...)` and `uploadFeedbackFile(...)` should reject/return immediately if `myfile` is missing
- they should not assume `myfile.path`, `myfile.type`, or `myfile.size` exist

3. return explicit validation messages
- examples:
  - `"Missing file: logo"`
  - `"Missing file: feedback_logo or file"`
  - `"Missing parameter: name"`

4. keep behavior consistent across plugins
- `/i/feedback/upload` is handled by star-rating when Surveys is disabled
- `/i/feedback/upload` is handled by Surveys when Surveys is enabled
- both implementations should validate inputs the same way

## Feedback Upload Ownership Split

### Current Routing Behavior

- star-rating plugin defines `/i/feedback/upload`, but returns `false` when Surveys is enabled
  - [api.js](../countly-server/plugins/star-rating/api/api.js)
- surveys plugin also defines `/i/feedback/upload`
  - [api.js](../countly-enterprise-plugins/plugins/surveys/api/api.js)

### Interpretation

- `/i/feedback/upload` should still work when Surveys is enabled
- in that case, Surveys becomes the effective handler
- this means the route should not be documented as "gone"; the fix should be in handler robustness, not by removing the endpoint from docs

## Validation Evidence

Recent isolated validation runs showed:

- `star-rating`
  - `8 passed / 2 failed / 1 skipped`
- remaining failures were:
  - `/i/feedback/logo`
  - `/i/feedback/upload`

Related endpoint status:
- `/i/feedback/input` still times out on `v2.count.ly` after validator-side event shaping and a real widget id
- widget list/read/edit/status endpoints all pass

This makes the upload/logo failures stand out as code-path issues rather than a general plugin failure.

## Push Plugin Follow-up

The push developer confirmed the plugin is not fully finished yet, so the remaining validation failures below should be tracked as code/runtime follow-up items first, not treated as settled docs problems.

### Remaining Push Validation Findings

Recent isolated push validation reached:

- `8 passed / 5 failed / 4 skipped`

The remaining failing endpoints were:

- `/o/push/message/all`
- `/o/push/message/estimate`
- `/o/push/message/{_id}` equivalent runtime path for message read
- `/i/push/message/test`
- `/o/push/mime`

### Confirmed / Likely Code-Side Gaps

#### 1. `/o/push/message/all` returns live `500`

Observed behavior:
- minimal read request with only `api_key` and `app_id` returned:
  - `{"kind":"ServerError","errors":["Server error"]}`

Current interpretation:
- docs route/parameters match current handler shape
- this looks like runtime/implementation instability, not a simple documentation mismatch

Relevant code:
- [api-message.js](../countly-server/plugins/push/api/api-message.js)

#### 2. `/i/push/message/test` still validates against full message shape

Observed behavior:
- live validation returned `Missing triggers argument` until the validator started sending `triggers`

Why this matters:
- the handler internally replaces triggers for the test send, but it still runs full message validation first
- this is now documented, but it is still a design quirk worth revisiting in code

Relevant code:
- [api-message.js](../countly-server/plugins/push/api/api-message.js) in `module.exports.test`

Possible future improvement:
- allow a reduced request shape for test sends and inject the temporary trigger before validation

#### 3. `/o/push/mime` vs older `/o/push/message/mime`

Current state:
- runtime/frontend/openapi use `/o/push/mime`
- older docs had `/o/push/message/mime`

This was updated in docs, but if there is still compatibility expectation for the older path, code may need either:
- an alias route
- or an explicit deprecation/redirect strategy

Relevant code:
- [api-message.js](../countly-server/plugins/push/api/api-message.js)
- [push.json](../countly-server/openapi/push.json)

#### 4. Message read path shape

Current state:
- live server rejected query-style `/o/push/message?_id=...` with `Invalid path`
- current runtime/tests use path-style `/o/push/message/{_id}`

This was updated in docs, but if older clients still use query-style access, code may need:
- an alias route
- or a compatibility fallback

Relevant code:
- [api-message.js](../countly-server/plugins/push/api/api-message.js)
- [tests-integration.js](../countly-enterprise-plugins/core/plugins/push/tests/tests-integration.js)

#### 5. Platform credential handling blocks estimate/create flows on partially configured instances

Observed behavior on `v2.count.ly`:
- create / estimate could fail depending on selected platform credentials

This is not inherently a bug, but it makes these endpoints sensitive to instance configuration and can look like API instability during validation.

Possible future improvement:
- clearer server-side error payloads that include the concrete missing platform config
- or a lightweight capability/read endpoint for configured push platforms per app

### Recommendation

Before making more push doc changes, recheck these against the next push plugin revision:

1. `/o/push/message/all`
2. `/i/push/message/test`
3. `/o/push/mime`
4. `/o/push/message/{_id}`
5. estimate/create behavior on apps with partial credentials

## Feedback Input Follow-up

### Endpoint

- `/i/feedback/input`

### Current Findings

- Validator sends:
  - valid `app_key`
  - valid `device_id`
  - exactly one `[CLY]_star_rating` event
  - a validator-created widget id
- `v2.count.ly` still times out with no response body (`HTTP 0`).
- A direct curl reproduction with the same encoded payload also times out.

### Why This Likely Needs Code Investigation

- The endpoint handler validates the event locally, then creates a synthetic `/i?...` request and calls `requestProcessor.processRequest(params)`.
- The timeout suggests the callback path is not always returning to the original `/i/feedback/input` request, or the proxied ingestion request is blocked/stuck under the current v2 data-filter/runtime configuration.

Relevant code:
- [api.js](../countly-server/plugins/star-rating/api/api.js) around `nonChecksumHandler`

### Recommended Investigation

1. trace whether `requestProcessor.processRequest(params)` calls `APICallback` for this proxy request
2. log the proxied `/i` URL and the ingestion result for blocked/ignored SDK requests
3. return a clean error when the internal ingestion request is blocked instead of leaving the original request open

## CMS Clear Runtime Follow-up

### Endpoint

- `/i/cms/clear`

### Current Findings

- Validator sends a minimal valid request with `api_key`, `app_id`, and `_id=server-guides`.
- `v2.count.ly` times out with no response body (`HTTP 0`).
- Direct curl with the same request and a 10 second timeout also times out.

### Why This Likely Needs Code Investigation

- Current code path appears simple: `validateUserForWrite(...)` then `common.db.collection('cms_cache').deleteMany(...)` and `common.returnMessage(...)`.
- Since the request does not return at all on v2, the issue is likely in deployed validation/DB runtime behavior, not validator request shape.

Relevant code:
- [cms.ts](../countly-server/api/parts/mgmt/cms.ts) around `clearCache`
- [requestProcessor.js](../countly-server/api/utils/requestProcessor.js) around `/i/cms/clear`

### Recommended Investigation

1. add server-side timing/logging around `validateUserForWrite` and `deleteMany`
2. confirm whether the regex delete query against `cms_cache` is reaching MongoDB and returning
3. return a bounded error if cache clearing cannot complete

## Export Download Runtime Follow-up

### Endpoint

- `/o/export/download/{task_id}`

### Current Findings

- Validator creates an export task through `/o/export/requestQuery` and uses the returned `task_id`.
- The long task remains in `running` state on v2 when checked later through `/o/tasks/task`.
- Download therefore returns `400` with empty output / unavailable export content.

### Why This Likely Needs Runtime Investigation

- The download endpoint requires a completed task with stored GridFS output.
- The validator can create the task, but the v2 task processor does not appear to finish that task during validation.

Relevant code:
- [requestProcessor.js](../countly-server/api/utils/requestProcessor.js) around `/o/export/requestQuery`
- [requestProcessor.js](../countly-server/api/utils/requestProcessor.js) around `/o/export/download`

### Recommended Investigation

1. check the task worker processing `tableExport` tasks on v2
2. inspect the created `long_tasks` document and task logs for the validator export task
3. confirm GridFS `task_results` output is written before download is attempted

## Render Runtime Follow-up

### Endpoint

- `/o/render`

### Current Findings

- Validator now sends the documented dashboard route shape: `view=/dashboard?ssr=true`, `route=/analytics/sessions/overview`, plus valid auth and `app_id`.
- A direct request that also included the active app id inside the render view query (`view=/dashboard?ssr=true&app_id=...`) returned the same error.
- v2 still returns `400` with `{"result":"Error creating screenshot. Please check logs for more information."}`.

### Why This Likely Needs Runtime Investigation

- The request reaches the render path and fails after token creation / screenshot processing.
- Code in [requestProcessor.js](../countly-server/api/utils/requestProcessor.js) delegates to [render.js](../countly-server/api/utils/render.js), which depends on the server-side Puppeteer/Chrome runtime and the dashboard route loading successfully.

### Recommended Investigation

1. check v2 render logs for the underlying Puppeteer error
2. confirm Chrome/Puppeteer is installed and executable in the API container
3. confirm the configured render host/protocol points at a reachable dashboard URL from inside the container

## DB Viewer Deprecated Endpoint Follow-up

### Endpoints

- `/o/db/mongostat`
- `/o/db/mongotop`

### Current Findings

- Other DB viewer endpoints pass.
- These two endpoints return nginx `502` / `503` on v2.
- These endpoints should be removed from public API docs instead of treated as supported live API surface.

### Why This Likely Needs Code/Runtime Investigation

- Both endpoints spawn MongoDB diagnostic binaries (`mongostat`, `mongotop`).
- The docs already mention the binary/environment dependency, so the current failures look like v2 runtime/tooling availability or process execution issues.

Relevant code:
- [api.js](../countly-server/plugins/dbviewer/api/api.js) around `fetchMongoStat`
- [api.js](../countly-server/plugins/dbviewer/api/api.js) around `fetchMongoTop`

### Recommended Investigation

1. confirm whether server routes should also be removed or hidden in code
2. if routes remain internally available, add clean error handling when binaries are unavailable or fail
3. avoid returning nginx upstream errors for expected diagnostic-tool failures

## Crashes Binary Download Follow-up

### Endpoint

- `/o/crashes/download_binary`

### Current Findings

- The validator can seed a real crash group through `/i?crash=...`.
- `/o/crashes/download_stacktrace` can use the seeded crash group id.
- `/o/crashes/download_binary` still cannot be validated as successful from the current code path.

### Code-Level Finding

In [api.js](../countly-server/plugins/crashes/api/api.js), the `download_binary` branch calls `getCrashesTable(...)` with `fields: { error: 1 }`, then checks `crash.binary_crash_dump`. Since the projection does not request `binary_crash_dump`, a crash with binary data is likely to be treated as missing the dump.

### Recommended Investigation

1. include `binary_crash_dump` in the `download_binary` projection
2. add a test with a crash payload containing `_binary_crash_dump`
3. verify whether crash ingestion stores the binary dump on the grouped record returned by `getCrashesTable`

## Tasks Runtime Follow-up

### Endpoint

- `/i/tasks/name`

### Current Findings

- Isolated validation for `core/tasks` reaches this route with:
  - valid `api_key`
  - valid `app_id`
  - fresh validator-created `task_id`
  - simple `name` payload
- The request still times out on `v2.count.ly` with curl timeout / `HTTP 0`.
- Neighboring task endpoints pass in the same isolated run:
  - `/i/tasks/update`
  - `/i/tasks/delete`
  - `/o/tasks/list`
  - `/o/tasks/count`
  - `/o/tasks/check`
  - `/o/tasks/task`

### Why This Likely Needs Code Investigation

## Dashboard User Self-Delete Follow-up

### Endpoint

- `/i/users/deleteOwnAccount`

### Current Findings

- The validator creates a fresh global-admin user with a known password, authenticates as that user with the returned `api_key`, and then calls `/i/users/deleteOwnAccount` with the same plaintext password.
- The route still returns:
  - `{"result":"password not valid"}`
- This is not explained by validator request shaping. The request is reaching the handler with the correct authenticated member context.

### Why This Likely Needs Code Investigation

- User creation hashes passwords as `argon2(password + passwordSecret)`:
  - [users.js](../countly-server/api/parts/mgmt/users.js)
- Self-delete verifies passwords via:
  - `verifyMemberArgon2Hash(params.member.email, params.qstring.password, ...)`
  - which calls `argon2.verify(hashedStr, str)` on the raw password string
  - [users.js](../countly-server/api/parts/mgmt/users.js)
- That means the verification path does not apply the same `passwordSecret` transformation used during creation/update hashing.

### Likely Fix

1. make Argon2 verification consistent with hashing
- verify `password + passwordSecret`, not the raw password

2. review legacy SHA1/SHA512 migration path too
- it should use the same effective plaintext convention as the current Argon2 path

3. add automated coverage
- create user with known password
- call `/i/users/deleteOwnAccount` as that user
- expect `Success` when there is more than one global admin

## Notes Save/Delete Follow-up

### Endpoints

- `/i/notes/save`
- `/o/notes`
- `/i/notes/delete`

### Current Findings

- Live validation on `v2.count.ly` shows:
  - `/i/notes/save` returns `{"result":"Success"}`
  - but the newly created note is not recoverable through `/o/notes`
  - which in turn blocks `/i/notes/delete`, since delete requires a real `note_id`

### Code-Level Findings

In [users.js](../countly-server/api/parts/mgmt/users.js), note creation has a false-success path:

- the create branch inserts into `countly.notes`
- if insert fails, it calls:
  - `common.returnMessage(params, 503, 'Insert Note failed.')`
- but then immediately falls through and still calls:
  - `common.returnMessage(params, 200, 'Success')`

That means note creation can report success even when the insert failed.

### Likely Fix

1. stop after insert error
- add `return` after `common.returnMessage(params, 503, 'Insert Note failed.')`

2. add server-side coverage
- create note
- read back via `/o/notes`
- delete by returned `_id`

3. investigate why readback may still be empty even after a nominally successful save
- verify actual inserted `app_id`
- verify note timestamp matches `/o/notes` period filter expectations
- verify `notes_apps` + permission filter path for the creating member

- Current server route in [requestProcessor.js](../countly-server/api/utils/requestProcessor.js) forwards `/i/tasks/name` to `taskmanager.nameResult(...)` and then returns `"Success"`.
- On paper, this is a simple metadata update path and should be lighter than the other task endpoints that already pass.
- Since the validator now uses a fresh seeded task instead of reusing stale IDs, this no longer looks like a harness issue.

### Recommended Investigation

1. trace `/i/tasks/name` on `v2.count.ly` with the same payload shape used by the validator
2. check whether `taskmanager.nameResult(...)` blocks on a bad db/update path
3. compare behavior against `/i/tasks/update`, which currently succeeds under the same auth context

## Notes Runtime Follow-up

### Endpoint

- `/i/notes/delete`

### Current Findings

- Validator now reaches the endpoint and gets real permission behavior instead of skipping.
- `/i/notes/save` succeeds, but the created note id is not exposed in the save response.
- Follow-up `/o/notes` calls on `v2.count.ly` return empty `aaData` for the validator auth context, so the validator cannot recover an owned/deletable `note_id`.
- When forced to use a placeholder ObjectId, `/i/notes/delete` returns `403`, which is consistent with the permission checks in code.

### Why This Likely Needs Code/Runtime Investigation

- The list/read path in [users.js](../countly-server/api/parts/mgmt/users.js) appears correct for notes and the validator request shape matches it.
- The problem is that save and list are not behaving as a discoverable pair in this instance:
  - save succeeds
  - list does not surface the created note back to the same validation flow
- That makes delete validation impossible with a real owned note, even though the docs themselves look reasonable.

### Recommended Investigation

1. verify whether notes created by the current auth context are actually being inserted into `countly.notes`
2. compare the saved note fields against the `/o/notes` query filters:
   - `app_id`
   - `ts`
   - `owner`
   - `noteType`
3. check whether there is an instance-specific visibility/permission mismatch causing saved notes to be omitted from `/o/notes`
