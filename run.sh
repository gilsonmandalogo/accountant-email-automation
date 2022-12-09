#!/bin/sh

export $(node loadShellEnv.js | xargs)
npx --yes wise-statements export -k private/private.pem -t csv -o "attachments/${STATEMENTS_FILE_NAME}.csv"
echo
npx --yes wise-statements export -k private/private.pem -t pdf -o "attachments/${STATEMENTS_FILE_NAME}.pdf"
echo
npx --yes vendus-export export -o "attachments/${INVOICE_FILE_NAME}.zip"
echo
node app.js -a "attachments/${STATEMENTS_FILE_NAME}.csv" "attachments/${STATEMENTS_FILE_NAME}.pdf" "attachments/${INVOICE_FILE_NAME}.zip"
