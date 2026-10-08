#!/usr/bin/env bash
# Posts the docs-drift Slack message: a short plain-language summary in the channel,
# and the private reviewer notes as a reply in its thread.
# Usage: post-drift-slack.sh "<title>" "<docs path prefix>"
# Needs SLACK_BOT_TOKEN, SLACK_CHANNEL, GH_TOKEN, PR_NUMBER, PR_URL.
set -uo pipefail
title=$1
prefix=$2

if [ -z "${SLACK_BOT_TOKEN:-}" ] || [ -z "${SLACK_CHANNEL:-}" ]; then
  echo "SLACK_BOT_TOKEN or SLACK_DOCS_CHANNEL is not set, so no Slack message was sent."
  exit 0
fi

# Slack answers 200 even on failure, so check its "ok" field. Prints the message ts.
post() {
  jq -n --arg channel "$SLACK_CHANNEL" --arg text "$1" --arg ts "${2:-}" \
      '{channel: $channel, text: $text, unfurl_links: false} + (if $ts == "" then {} else {thread_ts: $ts} end)' \
    | curl -sS -X POST https://slack.com/api/chat.postMessage \
        -H "Authorization: Bearer $SLACK_BOT_TOKEN" -H 'Content-Type: application/json; charset=utf-8' --data @- \
    | jq -er 'select(.ok) | .ts'
}

files=$(gh api "repos/$GITHUB_REPOSITORY/pulls/$PR_NUMBER/files" --paginate --jq ".[] | select(.filename | startswith(\"$prefix\")) | .status")
added=$(echo "$files" | grep -c '^added$' || true)
removed=$(echo "$files" | grep -c '^removed$' || true)
changed=$(echo "$files" | grep -c '^modified$' || true)
left=$(node -e 'const r=require("./drift-report/drift.json"); console.log(r.missing.length + r.removed.length)')

# The PR description is already written in plain language for customers; reuse it,
# turning Markdown headings and bold into Slack's bold.
summary=$(sed -E -e 's/^#+ +(.*)$/*\1*/' -e 's/\*\*([^*]+)\*\*/*\1*/g' drift-report/pr-body.md 2>/dev/null)

notes=drift-report/review-notes.md
if grep -q 'failed the endpoint test' "$notes" 2>/dev/null; then
  test_line="⚠️ Some new pages failed the endpoint test. Fix or drop them before merging."
elif grep -q 'Endpoint test: not run' "$notes" 2>/dev/null; then
  test_line="⚠️ The pages were not tested (no test server). Test them before merging."
else
  test_line="✅ The new pages passed the endpoint test."
fi

text="📘 *$title*
$summary

$added pages added, $removed removed, $changed updated. $left still to do in later runs.
$test_line
<$PR_URL|Review the pull request>"
[ -s "$notes" ] && text="$text · sources and open questions in the thread 🧵"

ts=$(post "$text") || { echo "::warning::Slack message was not sent. Check that the bot is in the channel."; exit 0; }

# Sources, open questions and test results stay out of the public PR; they go in the thread.
if [ -s "$notes" ]; then
  # Slack cuts long messages, so post the notes in chunks of whole lines.
  # Slack does not render Markdown headings or tables; turn them into bold lines and bullets.
  sed -E -e 's/^#+ +(.*)$/*\1*/' -e 's/\*\*([^*]+)\*\*/*\1*/g' -e '/^\|[-| :]+\|$/d' \
      -e 's/^\| *(.*[^ ]) *\|$/• \1/' -e 's/ *\| */ · /g' "$notes" > drift-report/notes-slack.md
  notes=drift-report/notes-slack.md
  awk -v RS='\n' 'BEGIN{n=0} {if (len + length($0) > 3500) {n++; len=0} print > ("drift-report/notes-part-" sprintf("%03d", n)); len += length($0) + 1}' "$notes"
  first="*Notes for reviewers (team only)*"$'\n'
  for part in drift-report/notes-part-*; do
    post "$first$(cat "$part")" "$ts" > /dev/null \
      || { echo "::warning::The reviewer notes were not posted to the Slack thread."; break; }
    first=""
  done
fi
