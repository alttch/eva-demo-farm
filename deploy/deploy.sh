#!/bin/sh -e

cd /deploy

MA_SETUP="uc/farm-uc1 uc/farm-uc2"

if [ -z "$SINGLE_MACHINE" ]; then
  echo "Cluster is up. Waiting 30 seconds to let controllers discover each other..."
  sleep 30
  echo "Setting up SFA management API"
  for c in $MA_SETUP; do
    echo -n "eva sfa controller set $c masterkey \$masterkey -> "
    if ! eva sfa controller set "$c" masterkey \$masterkey -y |grep OK; then
      echo "FAILED"
      exit 3
    fi
    echo -n "eva sfa controller ma-test $c -> "
    if ! eva sfa controller ma-test "$c"|grep OK; then
      echo "FAILED"
      exit 3
    fi
  done
  echo "Setup completed, starting configuration deployment"
  eva sfa cloud deploy -ys farm-demo.yml
else
  eva sfa cloud deploy -ys farm-demo-single.yml -c srv="$(hostname)"
fi
exit 0
