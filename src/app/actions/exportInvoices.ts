'use server';

import puppeteer from 'puppeteer';
import path from 'node:path';
import fs from 'node:fs/promises';

const outputPath = path.join(process.cwd(), 'private', 'faturas.zip');

export default async function exportInvoices(prevState: void, formData: FormData) {
  const selectedMonth = parseInt(formData.get('month') as string);
  if (Number.isNaN(selectedMonth)) {
    throw new Error('Invalid month selected');
  }

  const start = new Date();
  start.setMonth(selectedMonth - 1);
  start.setUTCDate(1);

  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1);
  end.setUTCDate(0);

  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-accelerated-2d-canvas',
      '--no-zygote',
      '--single-process'
    ],
    headless: true, // Allow plenty of time for the DevTools protocol operations in slow environments
    timeout: 0,
    protocolTimeout: 600000, // Let user override executable path via env (useful in containers)
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  });
  const page = await browser.newPage();
  await page.goto(`${process.env.VENDUS_URL}/login/`);
  await page.setViewport({width: 1080, height: 1024});

  // Login
  await page.type('#email', process.env.VENDUS_USER!);
  await page.type('[type="password"]', process.env.VENDUS_PASS!);
  await page.click('[type="submit"]');
  await page.waitForNavigation();

  // Load documents
  await page.goto(`${process.env.VENDUS_URL}/app/office/invoice/`);
  await page.click('.icon-calendar');
  await page.waitForSelector('#list-filter-start', { visible: true });
  await page.type('#list-filter-start', formatDate(start));
  await page.type('#list-filter-end', formatDate(end));
  await page.click('#office-list-filter > [type="submit"]');
  await page.waitForNetworkIdle();

  // Check if there are any documents
  try {
    await page.waitForSelector('::-p-xpath(//*[contains(text(), "Sem Documentos em ")])', { timeout: 1000, visible: true });
    await browser.close();
    console.log('No documents found');
    return;
  }
  catch {
    // Do nothing, there are documents
  }

  // Check if there are a cancel button
  try {
    await page.waitForSelector('#office-export-cancel', { timeout: 1000, visible: true });
    console.log('Canceling previous export');
    await page.click('#office-export-cancel');
    await page.waitForNetworkIdle();
  }
  catch {
    // Do nothing
  }

  // Export documents
  await page.click('#office-export-btn');
  await page.waitForNetworkIdle();
  const element = await page.waitForSelector('#office-export-done-link', { timeout: 600000, visible: true });
  if (!element) {
    await browser.close();
    throw new Error('Failed to export the documents');
  }

  // Download the file
  const href = await element.getProperty('href');
  const url = await href.jsonValue();
  if (typeof url !== 'string') {
    await browser.close();
    throw new Error('Failed to download the file');
  }  
  await browser.close();
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error('Failed to download the file');
  }
  await fs.writeFile(outputPath, response.body as never);
  console.log('File downloaded successfully');
}

function formatDate(date: Date) {
  return `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
}
