'use client';

import SelectMonth from '@/app/components/selectMonth';
import exportInvoices from '@/app/actions/exportInvoices';
import { useActionState } from 'react';

export default function FormExportInvoices() {
  const [, formAction, pending] = useActionState(exportInvoices, void 0);

  return (
    <form className="vertical gap">
      <SelectMonth />
      <button formAction={formAction} disabled={pending}>
        Export invoices
      </button>
    </form>
  );
}
