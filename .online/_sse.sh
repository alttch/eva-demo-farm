#!/bin/sh

[ -z "$MASTERKEY" ] && [ -f /keys/masterkey ] && MASTERKEY=$(cat /keys/masterkey)

/opt/eva/python3/bin/python /opt/sse/simulate_se.py \
  --local -K "${MASTERKEY}"
