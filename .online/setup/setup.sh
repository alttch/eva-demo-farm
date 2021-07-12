#!/bin/sh -e

cd /deploy
SINGLE_MACHINE=1 ./deploy.sh
eva lm job create --enable "@system('/opt/sse/_sse.sh')" every 1 minute
