# accountant-email-automation

Sends a monthly email using a provided template and attachments.

## Usage

You will need to create a `.env` file, you can use the follow template:

```properties
HOST=api.eu.mailgun.net
DOMAIN=mydomain.com
API_KEY=123
FROM=Myself <myself@mydomain.com>
TO=myfriend@somedomain.com
BCC=example@somedomain.com
# {{month}} will be replaced by the actual month
SUBJECT=Files of {{month}}
TEMPLATE=myTemplate
LOCALE=pt-PT

STATEMENTS_FILE_NAME=statements
INVOICE_FILE_NAME=invoices
```

You also will need a `private.pem` and a `wise-statements.config.json` files, required by the [wise-statements](https://github.com/gilsonmandalogo/wise-statements) package and a `vendus-export.config.json` file, required by the [vendus-export](https://github.com/gilsonmandalogo/vendus-export) package.