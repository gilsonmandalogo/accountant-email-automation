#!/usr/bin/env bash
set -e

CONFIG_PATH=/data/options.json

export VENDUS_URL=$(jq --raw-output '.vendus_url // empty' $CONFIG_PATH)
export VENDUS_USER=$(jq --raw-output '.vendus_user // empty' $CONFIG_PATH)
export VENDUS_PASS=$(jq --raw-output '.vendus_pass // empty' $CONFIG_PATH)
export EMAIL_TO=$(jq --raw-output '.email_to // empty' $CONFIG_PATH)
export SUBJECT=$(jq --raw-output '.email_subject // empty' $CONFIG_PATH)
export TEMPLATE=$(jq --raw-output '.email_template // empty' $CONFIG_PATH)

node server.js
