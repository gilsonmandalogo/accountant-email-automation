import dotenv from 'dotenv'
import path from 'path'
import url from 'url'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

dotenv.config({ path: path.resolve(dirname, 'private/.env') })

console.log(`STATEMENTS_FILE_NAME="${process.env.STATEMENTS_FILE_NAME}"`)
console.log(`INVOICE_FILE_NAME="${process.env.INVOICE_FILE_NAME}"`)
