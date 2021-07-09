#!/bin/sh -e

eva lm controller remove uc/$(hostname)
eva sfa controller remove uc/$(hostname)
cd /deploy && ./deploy.sh
