import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Accountant Email Automation',
  description: 'Sends a monthly email using a provided template and attachments.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Accountant Email Automation</title>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="max-w-2xl my-0 mx-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
