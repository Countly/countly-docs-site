#!/usr/bin/env bash
# Posts one short message to the docs Slack channel, for drift-run failures and reminders.
# Usage: post-slack-note.sh "<text>"
# Needs SLACK_BOT_TOKEN and SLACK_CHANNEL; does nothing when they are not set.
set -uo pipefail

if [ -z "${SLACK_BOT_TOKEN:-}" ] || [ -z "${SLACK_CHANNEL:-}" ]; then
  echo "SLACK_BOT_TOKEN or SLACK_DOCS_CHANNEL is not set, so no Slack message was sent."
  exit 0
fi

# Slack answers 200 even on failure, so check its "ok" field.
jq -n --arg channel "$SLACK_CHANNEL" --arg text "$1" '{channel: $channel, text: $text, unfurl_links: false}' \
  | curl -sS -X POST https://slack.com/api/chat.postMessage \
      -H "Authorization: Bearer $SLACK_BOT_TOKEN" -H 'Content-Type: application/json; charset=utf-8' --data @- \
  | jq -e '.ok' > /dev/null \
  || echo "::warning::Slack message was not sent. Check that the bot is in the channel."
