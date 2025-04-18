'use server';

import fs from 'node:fs';
import path from 'node:path';
import csvParser from 'csv-parser';
import { Readable } from 'node:stream';

const csvPath = path.join(process.cwd(), 'private', 'extrato.csv');
const pdfPath = path.join(process.cwd(), 'private', 'extrato.pdf');

function loadFile(formData: FormData, fileName: string) {
  const file = formData.get(fileName) as File | null;
  if (!file) {
    throw new Error(`Invalid ${fileName} file`);
  }
  return Readable.from(file.stream() as unknown as Iterable<unknown>, { encoding: 'utf-8' });
}

export async function generateCSV(formData: FormData) {
  const statementsStream = loadFile(formData, 'statementsCSV');
  const statementsPDFStream = loadFile(formData, 'statementsPDF');
  const outputStream = fs.createWriteStream(csvPath, { encoding: 'utf-8' });
  const locale = formData.get('locale') as string || 'pt-PT';
  const numberFormatter = new Intl.NumberFormat(locale);
  const dateFormatter = new Intl.DateTimeFormat(locale);

  // Save the CSV file
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

  // Save the PDF file
  const pdfStream = fs.createWriteStream(pdfPath, { encoding: 'utf-8' });
  statementsPDFStream
    .pipe(pdfStream)
    .on('error', (error: Error) => {
      console.error('Error writing PDF file:', error);
    })
    .on('finish', () => {
      console.log('PDF file written successfully');
    });
}
