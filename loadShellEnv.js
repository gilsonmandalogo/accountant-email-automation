import dotenv from 'dotenv'

dotenv.config()

console.log(`STATEMENTS_FILE_NAME="${process.env.STATEMENTS_FILE_NAME}"`)
console.log(`INVOICE_FILE_NAME="${process.env.INVOICE_FILE_NAME}"`)
