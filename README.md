# accountant-email-automation

Sends a monthly email using a provided template and attachments.

## Usage

You will need to create a `.env` file inside `private` dir, you can use the follow template:

```properties
FROM=Myself <myself@mydomain.com>
TO=myfriend@somedomain.com
# {{month}} will be replaced by the actual month
SUBJECT=Files of {{month}}
LOCALE=pt-PT

STATEMENTS_FILE_NAME=statements
INVOICE_FILE_NAME=invoices
```

You also will need a `private.pem`, a `wise-statements.config.json` files, required by the [wise-statements](https://github.com/gilsonmandalogo/wise-statements) package, a `vendus-export.config.json` file, required by the [vendus-export](https://github.com/gilsonmandalogo/vendus-export) package, a `template.txt` file with the message you want to send (you can use the `{{month}}` placeholder inside) and a `smtpConfig.json` file, required by the [Nodemailer](https://nodemailer.com/smtp/), all these files inside `private` dir.