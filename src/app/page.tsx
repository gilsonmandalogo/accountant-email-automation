import FormProcessStatements from '@/app/components/formProcessStatements';
import FormGenerateEmail from '@/app/components/formGenerateEmail';
import FormExportInvoices from '@/app/components/formExportInvoices';

export default function Home() {
  return (
    <main>
      <h1>Accountant Email Automation</h1>
      <div className="card">
        <h2>Statements</h2>
        <a href="https://wise.com/balances/statements/balance-statement" target="_blank">
          Export Wise statements
        </a>
        <FormProcessStatements />
      </div>
      <div className="card">
        <h2>Export Invoices</h2>
        <FormExportInvoices />
      </div>
      <div className="card">
        <h2>Generate Email</h2>
        <FormGenerateEmail />
      </div>
    </main>
  );
}
