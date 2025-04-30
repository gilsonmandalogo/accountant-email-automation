'use server';

import { exportFile } from 'vendus-export';
import path from 'node:path';

const outputPath = path.join(process.cwd(), 'private', 'faturas.zip');

export default async function exportInvoices(prevState: void, formData: FormData) {
  await exportFile({
    month: formData.get('month') as string,
    'base-url': process.env.VENDUS_URL!,
    user: process.env.VENDUS_USER!,
    password: process.env.VENDUS_PASS!,
    output: outputPath,
  });
}
