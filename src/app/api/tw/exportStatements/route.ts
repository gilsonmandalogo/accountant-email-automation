import { NextRequest } from 'next/server';
import path from 'node:path';
import fs from 'node:fs';

interface Profile {
  id: number;
  fullName: string;
}

interface Balance {
  id: number;
  currency: string;
}

interface Statements {
  transactions: [{
    date: string;
    amount: {
      value: number;
    };
    details: {
      description: string;
    };
  }];
}

class TransferWise2FAError extends Error {
  response: Response;
  constructor(message: string, response: Response) {
    super(message);
    this.name = 'TransferWise2FAError';
    this.response = response;
  }
}

async function get(path: string): Promise<Response> {
  const response = await fetch(`https://api.transferwise.com${path}`, {
    headers: {
      'Authorization': `Bearer ${process.env.API_TOKEN}`,
    },
  });
  if (!response.ok) {
    if (response.status === 403 && response.headers.has('x-2fa-approval')) {
      throw new TransferWise2FAError('Two-factor authentication required', new Response(
        'Two-factor authentication required',
        { status: 403, headers: { 'x-2fa-approval': response.headers.get('x-2fa-approval')! } },
      ));
    }

    throw new Error(`Failed to fetch ${path} - ${response.status}: ${response.statusText}\n${await response.text()}`);
  }
  return response;
}

async function getProfiles(): Promise<Profile[]> {
  const response = await get('/v2/profiles');
  const data = await response.json();
  return data;
}

async function getBalances(profileId: number): Promise<Balance[]> {
  const response = await get(`/v3/profiles/${profileId}/balances?types=STANDARD`);
  const data = await response.json();
  return data;
}

async function getStatementsJson(profileId: number, balanceId: number, start: Date, end: Date, locale: string): Promise<Statements> {
  const response = await get(`/v1/profiles/${profileId}/balance-statements/${balanceId}/statement.json?intervalStart=${start.toISOString()}&intervalEnd=${end.toISOString()}&type=FLAT&statementLocale=${locale}`);
  const data = await response.json();
  return data;
}

async function getStatementsPdf(profileId: number, balanceId: number, start: Date, end: Date, locale: string): Promise<ReadableStream<Uint8Array<ArrayBufferLike>>> {
  const response = await get(`/v1/profiles/${profileId}/balance-statements/${balanceId}/statement.pdf?intervalStart=${start.toISOString()}&intervalEnd=${end.toISOString()}&type=FLAT&statementLocale=${locale}`);
  if (!response.body) {
    throw new Error('No response body while fetching PDF statements');
  }
  return response.body;
}

export async function POST(request: NextRequest) {
  const { locale, month, type, profile, currency, filename } = await request.json();
  const numberFormatter = new Intl.NumberFormat(locale);
  const dateFormatter = new Intl.DateTimeFormat(locale);

  const selectedMonth = parseInt(month);

  if (Number.isNaN(selectedMonth)) {
    return new Response('Please enter a valid month', { status: 400 });
  }

  const start = new Date();
  start.setMonth(selectedMonth);
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  end.setUTCDate(0);
  end.setUTCHours(23, 59, 59, 999);

  console.log(`From ${start.toUTCString()} to ${end.toUTCString()}`);

  try {
    console.log('Loading profiles...');
    const profiles = await getProfiles();
    const profileId = profiles.find(p => p.fullName === profile)!.id;

    console.log('Loading balances...');
    const balances = await getBalances(profileId);
    const balanceId = balances.find(b => b.currency === currency)!.id;

    const output = path.resolve(process.cwd(), 'private', `${filename}.${type}`);
    const outputPath = path.parse(output);

    if (type === 'csv') {
      console.log('Loading statements...');
      const statements = await getStatementsJson(profileId, balanceId, start, end, locale);
      const transactions = statements.transactions.map(t => [t.date, t.details.description, t.amount.value]);

      console.log(`Writing "${outputPath.base}" file into "${outputPath.dir}"...`);

      const stream = fs.createWriteStream(path.resolve(output));
      stream.once('open', () => {
        stream.write('DATA;;\n');

        for (const transaction of transactions) {
          let signal = '';
          const line = transaction.map((t, i) => {
            if (typeof t === 'number') {
              signal = t < 0 ? '"D"' : '"C"';
              return numberFormatter.format(t);
            }
            if (i === 0) {
              return dateFormatter.format(new Date(t));
            }
            return `"${t}"`;
          });
          line.push(signal);
          stream.write(`${line.join(';')}\n`);
        }
        stream.end();
      });
    }

    if (type === 'pdf') {
      console.log(`Downloading "${outputPath.base}" file into "${outputPath.dir}"...`);
      const pdf = await getStatementsPdf(profileId, balanceId, start, end, locale);
      const stream = fs.createWriteStream(path.resolve(output));
      await new Promise((resolve, reject) => {
        pdf.pipe(stream);
        pdf.on('error', reject);
        stream.on('finish', resolve);
      });
    }
  } catch (error) {
    if (error instanceof TransferWise2FAError) {
      return error.response;
    }
    throw error;
  }
}
