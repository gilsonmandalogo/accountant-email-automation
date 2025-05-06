#!/usr/bin/with-contenv bashio

export VENDUS_URL=$(bashio::config 'vendus_url')
export VENDUS_USER=$(bashio::config 'vendus_user')
export VENDUS_PASS=$(bashio::config 'vendus_pass')
export EMAIL_TO=$(bashio::config 'email_to')
export SUBJECT=$(bashio::config 'email_subject')
export TEMPLATE=$(bashio::config 'email_template')

node server.js
