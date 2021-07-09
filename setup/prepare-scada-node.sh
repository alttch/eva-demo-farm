#!/bin/sh -x

eva server disable uc || exit 1
eva ns lm destroy eva_1
eva ns sfa destroy eva_1
(
cat <<EOF
create eva_1 mqtt:10.27.12.200
set eva_1 discovery_enabled 1
enable eva_1
EOF
) | eva ns lm --exec-batch=stdin || exit 1
(
cat <<EOF
create eva_1 mqtt:10.27.12.200
set eva_1 discovery_enabled 1
set eva_1 collect_logs 1
enable eva_1
EOF
) | eva ns sfa --exec-batch=stdin || exit 1
