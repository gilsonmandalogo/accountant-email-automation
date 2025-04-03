'use client';

import { create, Mode } from '@transferwise/approve-api-action-helpers';
import { useCallback, useState } from 'react';

export default function ExportStatements() {
  const [result, setResult] = useState('');

  const handlePress = useCallback(async () => {
    const request = create({ mode: Mode.PRODUCTION });
    const response = await request('/api/tw/export-statements', {
      method: 'POST',
      body: JSON.stringify({
        locale: 'pt-PT',
        month: 1,
        filename: 'extrato',
        type: 'csv',
        currency: 'EUR',
        profile: 'Binário Hexagonal - Unipessoal Lda',
      }),
    });
    setResult(`${response.status}: ${response.statusText}`);
  }, []);

  return (
    <div>
      <button onClick={handlePress}>
        Export Statements
      </button>
      {result && (
        <div>
          <h3>Response</h3>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
};
