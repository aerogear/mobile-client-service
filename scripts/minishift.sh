#!/usr/bin/env bash

cd "$(dirname "$0")"

minishift delete -f

MINISHIFT_ENABLE_EXPERIMENTAL=y minishift start --openshift-version v3.11.0 \
--extra-clusterup-flags "--enable=*,service-catalog,automation-service-broker,template-service-broker"

oc login -u system:admin

export ASB_PROJECT_NAME='openshift-automation-service-broker'

./post_install.sh

export ROUTING_SUFFIX=$(minishift ip).nip.io

./setup-router-certs.sh
