import nodemailer from 'nodemailer'
import chalk from 'chalk'
import { program } from 'commander'
import fs from 'fs'
import path from 'path'
import url from 'url'
import dotenv from 'dotenv'

const dirname = path.dirname(url.fileURLToPath(import.meta.url))

dotenv.config({ path: path.resolve(dirname, 'private/.env') })

const app = JSON.parse(fs.readFileSync(path.resolve(dirname, 'package.json'), 'utf-8'))
const log = console.log
const { FROM, TO, SUBJECT, LOCALE } = process.env

try {
  program
    .name(app.name)
    .version(app.version)
    .description(app.description)
    .option('-m, --month <number>', 'Month of the files', String(new Date().getMonth()))
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

  const parsedTemplatePath = path.resolve(dirname, 'private/template.txt')
  log(chalk.green(`Loading template file "${parsedTemplatePath}"...`))
  const text = fs.readFileSync(parsedTemplatePath, 'utf-8').replaceAll('{{month}}', parsedMonth)

  const parsedSmtpConfigPath = path.resolve(dirname, 'private/smtpConfig.json')
  log(chalk.green(`Loading SMTP config file "${parsedSmtpConfigPath}"...`))
  const smtpConfig = fs.readFileSync(parsedSmtpConfigPath, 'utf-8')
  const transporter = nodemailer.createTransport(JSON.parse(smtpConfig))

  log(chalk.green(`Sending mail of "${parsedMonth}" with ${attachments.length} attachment(s)...`))

  await transporter.sendMail({
    from: FROM,
    to: TO,
    subject: SUBJECT.replace('{{month}}', parsedMonth),
    text,
    attachments: attachments.map(path => ({ path })),
  })

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
