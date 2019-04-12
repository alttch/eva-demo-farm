#!/bin/bash

if [ `whoami` != 'root' ]; then
  echo "Please run me as root"
  exit 2
fi

cd ..

MASTERKEY=`head -1024 /dev/urandom | sha256sum | awk '{ print $1 }'`
DEFAULTKEY=`head -1024 /dev/urandom | sha256sum | awk '{ print $1 }'`

sed "s/- MASTERKEY=.*/- MASTERKEY=${MASTERKEY}/g" docker-compose.yml | \
  sed "s/- DEFAULTKEY=.*/- DEFAULTKEY=${DEFAULTKEY}/g" | \
  grep -v $'ports:\n.*\- "8828:8828"' > docker-compose-online-demo.yml

sh ./.online/_online-deploy.sh || exit 1
python3 ./.online/_online-demo-initial-generator.py || exit 1
echo "--------------------------------------------------------"
echo "Online demo deployement completed"
