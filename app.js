import mailgun from 'mailgun-js'
import chalk from 'chalk'
import { program } from 'commander'
import fs from 'fs'
import path from 'path'
import url from 'url'
import dotenv from 'dotenv'

dotenv.config()

const dirname = path.dirname(url.fileURLToPath(import.meta.url))
const app = JSON.parse(fs.readFileSync(path.resolve(dirname, 'package.json'), 'utf-8'))
const log = console.log
const { API_KEY, DOMAIN, FROM, TO, SUBJECT, TEMPLATE, LOCALE } = process.env

try {
  program
    .name(app.name)
    .version(app.version)
    .description(app.description)
    .option('-m, --month <number>', 'Month of the files', String(new Date().getMonth() + 1))
    .requiredOption('-a, --attachments <files...>', 'Files to be included on the mail attachment')

  program.parse()

  log(chalk.underline(`${app.name} v${app.version}`))
  log('')

  const { month, attachments } = program.opts()
  const selectedMonth = parseInt(month)

  if (selectedMonth === NaN) {
    throw new Error('Invalid month')
  }

  const date = new Date()
  date.setMonth(selectedMonth - 1)
  const localizedMonth = date.toLocaleString(LOCALE, { month: 'long' })
  const parsedMonth = localizedMonth[0].toUpperCase() + localizedMonth.slice(1)

  const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN })
  const data = {
    from: FROM,
    to: TO,
    subject: SUBJECT.replace('{{month}}', parsedMonth),
    template: TEMPLATE,
    't:variables': JSON.stringify({ month: parsedMonth }),
    attachment: attachments,
  }

  log(chalk.green(`Sending mail of "${parsedMonth}" with ${attachments.length} attachment(s)...`))
  await mg.messages().send(data)

  log(chalk.bold.green('Done, enjoy your saved time!'))
} catch (error) {
  log('')

  if (error instanceof Error) {
    log(`${error.name}: ${error.message}`)
    log(error.stack)
  } else {
    log(error)
  }

  log(chalk.red('Program exited due to error. 😢'))
  process.exitCode = 1
}
