#!/bin/zsh
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

export COUNTLY_ALLOW_MUTATION="${COUNTLY_ALLOW_MUTATION:-true}"
export COUNTLY_HOST_OVERRIDE_IP="${COUNTLY_HOST_OVERRIDE_IP:-35.206.183.71}"
export COUNTLY_INTER_REQUEST_DELAY_MS="${COUNTLY_INTER_REQUEST_DELAY_MS:-2000}"
export COUNTLY_RETRYABLE_ERROR_COOLDOWN_MS="${COUNTLY_RETRYABLE_ERROR_COOLDOWN_MS:-30000}"

if [[ $# -gt 0 ]]; then
  export COUNTLY_DOC_FILTER="$1"
fi

if [[ $# -gt 1 ]]; then
  export COUNTLY_ENDPOINT_FILTER="$2"
fi

npm run test:docs-api
