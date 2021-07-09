#!/bin/sh

[ -z "$MASTERKEY" ] && [ -f /keys/masterkey ] && MASTERKEY=$(cat /keys/masterkey)

/opt/eva/venv/bin/python /opt/sse/simulate_se.py \
  --local -K "${MASTERKEY}"
