#!/bin/sh -e

eva feature setup default_cloud mqtt=10.27.12.200,announce=5
eva ns uc subscribe log eva_1
