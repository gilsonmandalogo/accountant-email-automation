'use server';

import fs from 'node:fs';
import path from 'node:path';
import csvParser from 'csv-parser';
import { Readable } from 'node:stream';

const csvPath = path.join(process.cwd(), 'private', 'extrato.csv');

function loadStatementsFile(formData: FormData) {
  const file = formData.get('statementsCSV') as File | null;
  if (!file) {
    throw new Error('Invalid file');
  }
  return Readable.from(file.stream(), { encoding: 'utf-8' });
}

export async function generateCSV(formData: FormData) {
  const statementsStream = loadStatementsFile(formData);
  const outputStream = fs.createWriteStream(csvPath, { encoding: 'utf-8' });
  const locale = 'pt-PT'; // TODO: Get locale from formData
  const numberFormatter = new Intl.NumberFormat(locale);
  const dateFormatter = new Intl.DateTimeFormat(locale);
  outputStream.once('open', () => {
    outputStream.write('DATA;;\n');

    statementsStream
      .pipe(csvParser())
      .on('data', (row: Record<string, string>) => {
        const signal = row.Amount.startsWith('-') ? '"D"' : '"C"';
        const [day, month, year] = row.Date.split('-').map(Number);
        const date = dateFormatter.format(new Date(year, month - 1, day));
        const description = `"${row.Description}"`;
        const amount = numberFormatter.format(row.Amount as Intl.StringNumericLiteral);
        outputStream.write(`${date};${description};${amount};${signal}\n`);
      })
      .on('error', (error: Error) => {
        console.error('Error reading CSV file:', error);
      })
      .on('end', () => {
        outputStream.end();
        console.log('CSV file written successfully');
      });
  });
}
