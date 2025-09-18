'use client';

import SelectMonth from '@/app/components/selectMonth';
import exportInvoices from '@/app/actions/exportInvoices';
import { useActionState } from 'react';
import { Button } from '@/components/ui/button';

export default function FormExportInvoices() {
  const [, formAction, pending] = useActionState(exportInvoices, void 0);

  return (
    <form className="space-y-4">
      <SelectMonth />
      <Button 
        formAction={formAction} 
        disabled={pending}
        type="submit"
        className="w-full"
      >
        {pending ? 'Exporting...' : 'Export invoices'}
      </Button>
    </form>
  );
}
