#!/bin/bash
# External dependencies:
# - https://www.selenic.com/smem/
# - https://stedolan.github.io/jq/
set -eEuo pipefail

trap 'kill 0' exit INT

# 5s is the default interval between samples.
# Note that this might be greater if either smem or the k6 API takes more time
# than this to return a response.
sint="${K6_BENCH_SAMPLE_INTERVAL:-5}"

k6 run "$@" >/dev/null 2>&1 &
pid="$!"

echo "Time(s),CPU(%),RAM(kB),VUs,RPS"
while true; do
  cpu=$(top -b -n 2 -d "$sint" -p "$pid" | tail -1 | awk '{print $9}')
  mem=$(smem -H -U "$USER" -c 'pid pss' -P 'k6 run' | grep "$pid" | awk '{ print $NF }')
  vus=$({ curl -fsSL http://localhost:6565/v1/metrics/vus 2>/dev/null || echo '{}'
        } | jq '.data.attributes.sample.value // 0')
  rps=$({ curl -fsSL http://localhost:6565/v1/metrics/http_reqs 2>/dev/null || echo '{}'
        } | jq '.data.attributes.sample.rate // 0')
  etimes=$(ps -p "$pid" --no-headers -o etimes | awk '{ print $1 }')
  echo "${etimes},${cpu},${mem},${vus},${rps}"
done
