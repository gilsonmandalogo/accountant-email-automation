import { program } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import { Client } from '@microsoft/microsoft-graph-client';
import { PublicClientApplication } from '@azure/msal-node';
import 'isomorphic-fetch'; // Required by Microsoft Graph SDK

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(dirname, 'private/.env') });

const app = JSON.parse(fs.readFileSync(path.resolve(dirname, 'package.json'), 'utf-8'));
const log = console.log;
const { TO, SUBJECT, LOCALE, CLIENT_ID } = process.env;

async function getAccessToken() {
  try {
    // Use Device Code flow to acquire token
    const deviceCodeRequest = {
      scopes: ['https://graph.microsoft.com/Mail.Send'],
      deviceCodeCallback: (response) => {
        log(`\nVisit ${response.verificationUri} and enter the code: ${response.userCode}`);
      },
    };

    // Initialize MSAL Public Client Application for Personal Account Authentication
    const msalClient = new PublicClientApplication({
      auth: {
        clientId: CLIENT_ID,
        authority: 'https://login.microsoftonline.com/consumers', // For personal accounts
      },
    });
    const tokenResponse = await msalClient.acquireTokenByDeviceCode(deviceCodeRequest);

    return tokenResponse.accessToken;
  } catch (error) {
    console.error('Error during initial token acquisition via Device Code Flow.');
    throw error;
  }
}

// Create Microsoft Graph client
async function getGraphClient() {
  const accessToken = await getAccessToken();
  return Client.init({
    authProvider: (done) => {
      done(null, accessToken); // Provide the access token
    },
  });
}

// Function to send email using Microsoft Graph API
async function sendEmail(month, attachments) {
  const client = await getGraphClient();

  const parsedTemplatePath = path.resolve(dirname, 'private/template.txt');
  log(chalk.green(`Loading template file "${parsedTemplatePath}"...`));
  const text = fs.readFileSync(parsedTemplatePath, 'utf-8').replaceAll('{{month}}', month);

  const mail = {
    message: {
      subject: SUBJECT.replace('{{month}}', month),
      body: {
        contentType: 'Text',
        content: text,
      },
      toRecipients: [{ emailAddress: { address: TO } }],
      attachments: attachments.map((filePath) => ({
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: path.basename(filePath),
        contentBytes: fs.readFileSync(filePath, { encoding: 'base64' }),
      })),
    },
  };

  log(chalk.green(`Sending mail for ${month} with ${attachments.length} attachment(s)...`));
  await client.api('/me/sendMail').post(mail); // Use `/me/sendMail` for personal accounts
  log(chalk.bold.green('Email sent successfully.'));
}

try {
  program
    .name(app.name)
    .version(app.version)
    .description(app.description)
    .option('-m, --month <number>', 'Month of the files', String(new Date().getMonth()))
    .requiredOption('-a, --attachments <files...>', 'Files to be included on the mail attachment');

  program.parse();

  log(chalk.underline(`${app.name} v${app.version}`));
  log('');

  const { month, attachments } = program.opts();
  const selectedMonth = parseInt(month);

  if (isNaN(selectedMonth)) {
    throw new Error('Invalid month');
  }

  const date = new Date();
  date.setMonth(selectedMonth - 1);
  const localizedMonth = date.toLocaleString(LOCALE, { month: 'long' });
  const parsedMonth = localizedMonth[0].toUpperCase() + localizedMonth.slice(1);

  sendEmail(parsedMonth, attachments).catch(console.error);
} catch (error) {
  log('');

  if (error instanceof Error) {
    log(`${error.name}: ${error.message}`);
    log(error.stack);
  } else {
    log(error);
  }

  log(chalk.red('Program exited due to error. 😢'));
  process.exitCode = 1;
}
