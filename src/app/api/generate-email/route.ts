import { NextRequest, NextResponse } from 'next/server';
import MailComposer from 'nodemailer/lib/mail-composer';
import path from 'node:path';
 
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const month = formData.get('month') as string | null;
  const locale = formData.get('locale') as string | null;

  if (!month || !locale) {
    return NextResponse.json({ error: 'Missing month or locale' }, { status: 400 });
  }

  const selectedMonth = parseInt(month);
  const date = new Date();
  date.setMonth(selectedMonth - 1);
  const localizedMonth = date.toLocaleString(locale, { month: 'long' });
  const parsedMonth = localizedMonth[0].toUpperCase() + localizedMonth.slice(1);

  // fix line endings
  const html = process.env.TEMPLATE!.replace(/(\r\n|\n|\r)/gm, '<br/>\r\n');

  const eml = await new MailComposer({
    to: process.env.EMAIL_TO,
    subject: process.env.SUBJECT!.replace('{{month}}', parsedMonth),
    html: html.replaceAll('{{month}}', parsedMonth),
    headers: {
      'X-Unsent': '1',
    },
    attachments: [
      {
        filename: 'extrato.csv',
        path: path.join(process.cwd(), 'private', 'extrato.csv'),
        contentType: 'text/csv',
      },
      {
        filename: 'extrato.pdf',
        path: path.join(process.cwd(), 'private', 'extrato.pdf'),
        contentType: 'application/pdf',
      },
      {
        filename: 'faturas.zip',
        path: path.join(process.cwd(), 'private', 'faturas.zip'),
        contentType: 'application/zip',
      },
    ],
  }).compile().build();
  return new NextResponse(eml, {
    headers: {
      'Content-Type': 'message/rfc822',
      'Content-Disposition': 'attachment; filename="mail.eml"',
    },
  });
}
