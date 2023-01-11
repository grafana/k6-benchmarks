#!/bin/bash
# External dependencies:
# - https://www.selenic.com/smem/
# - https://stedolan.github.io/jq/
set -eEuo pipefail

trap 'cleanup; exit 0' EXIT
trap 'trap - INT; cleanup; kill -INT $$' INT
trap 'trap - TERM; cleanup; kill -TERM $$' TERM

# Create temp files to store the output of each collection command.
cpuf=$(mktemp)
memf=$(mktemp)
vusf=$(mktemp)
rpsf=$(mktemp)

cleanup() {
  rm -f "$cpuf" "$memf" "$vusf" "$rpsf"
}

# 5s is the default interval between samples.
# Note that this might be greater if either smem or the k6 API takes more time
# than this to return a response.
sint="${K6_BENCH_SAMPLE_INTERVAL:-5}"

k6 run "$@" >/dev/null 2>&1 &
k6pid="$!"

# Run the collection processes in parallel to avoid blocking.
# For details see https://stackoverflow.com/a/68316571

echo '"Time (s)","CPU (%)","RAM (kB)","VUs","RPS"'
while true; do
  etimes=$(ps -p "$k6pid" --no-headers -o etimes | awk '{ print $1 }')
  pids=()
  { exec >"$cpuf"; top -b -n 2 -d "$sint" -p "$k6pid" | tail -1 | awk '{print $9}'; } &
  pids+=($!)
  { exec >"$memf"; smem -H -U "$USER" -c 'pid pss' -P 'k6 run' | grep "$k6pid" | awk '{ print $NF }'; } &
  pids+=($!)
  { exec >"$vusf"; { curl -fsSL http://localhost:6565/v1/metrics/vus 2>/dev/null || echo '{}'
    } | jq '.data.attributes.sample.value // 0'; } &
  pids+=($!)
  { exec >"$rpsf"; { curl -fsSL http://localhost:6565/v1/metrics/http_reqs 2>/dev/null || echo '{}'
    } | jq '.data.attributes.sample.rate // 0'; } &
  pids+=($!)
  wait "${pids[@]}"
  echo "${etimes},$(cat "$cpuf"),$(cat "$memf"),$(cat "$vusf"),$(cat "$rpsf")"
done
