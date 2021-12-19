#!/bin/sh -e

eva feature setup default_cloud host=10.27.12.200,announce=5,proto=mqtt
eva ns uc subscribe log eva_1
