#!/bin/sh

MA_SETUP="uc/farm-uc1 uc/farm-uc2"

if [ "x$1" = "x" ]; then
  FNAME=docker-compose.yml
else
  FNAME=$1
fi

docker-compose -f ${FNAME} down -t 0 || exit 1
docker pull altertech/eva-ics
echo "Starting cluster"
docker-compose -f ${FNAME} up -d || exit 1
I=0
echo "Waiting for cluster auto configuration..."
while [ 1 ]; do
  sleep 1
  docker exec eva_farm_scada eva sfa test 2>&1|grep "ok" > /dev/null
  [ $? -eq 0 ] && break
  I=`expr $I + 1`
  if [ $I -gt 60 ]; then
    echo 'No response from SFA within 60 seconds. Aborting'
    exit 2
  fi
done
sleep 3
echo "Cluster is up. Waiting 30 seconds to let nodes discover each other..."
sleep 30
echo "Setting up SFA management API"
for c in $MA_SETUP; do
  echo -n "eva sfa controller set $c masterkey \$masterkey -> "
  docker exec eva_farm_scada eva sfa controller set $c masterkey \$masterkey -y |grep OK
  if [ $? -ne 0 ]; then
    echo "FAILED"
    exit 3
  fi
  echo -n "eva sfa controller ma-test $c -> "
  docker exec eva_farm_scada eva sfa controller ma-test $c|grep OK
  if [ $? -ne 0 ]; then
    echo "FAILED"
    exit 3
  fi
done
echo "Setup completed, starting configuration deployment"
docker exec -t eva_farm_scada bash -c 'cd /deploy-cfg && eva sfa cloud deploy -y farm-demo.yml'
exit 0
