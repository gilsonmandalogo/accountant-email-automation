import type { Metadata } from 'next';
import './globals.css';

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
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
