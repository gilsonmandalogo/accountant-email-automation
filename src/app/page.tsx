import FormProcessStatements from '@/components/formProcessStatements';
import FormGenerateEmail from '@/components/formGenerateEmail';
import FormExportInvoices from '@/components/formExportInvoices';
import ButtonSendDoneEvent from '@/components/buttonSendDoneEvent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-8">Accountant Email Automation</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Statements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <a 
            href="https://wise.com/balances/statements/balance-statement" 
            target="_blank"
            className="text-primary inline-block"
          >
            Export Wise statements
          </a>
          <FormProcessStatements />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Export Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <FormExportInvoices />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Email</CardTitle>
        </CardHeader>
        <CardContent>
          <FormGenerateEmail />
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <ButtonSendDoneEvent />
      </div>
    </main>
  );
}
