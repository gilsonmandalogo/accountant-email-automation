import FormProcessStatements from '@/app/components/formProcessStatements';

export default function Home() {
  return (
    <div>
      <main>
        <h1>Accountant Email Automation</h1>
        <div className="card">
          <a href="https://wise.com/balances/statements/balance-statement" target="_blank">
            Export Wise statements
          </a>
          <FormProcessStatements />
        </div>
      </main>
    </div>
  );
}
