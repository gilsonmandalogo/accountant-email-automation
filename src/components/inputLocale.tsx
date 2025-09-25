'use client';

import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InputLocale() {
  const [locale, setLocale] = useState('pt-PT');

  useEffect(() => {
    setLocale(navigator.language);
  }, []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocale(event.target.value);
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="locale">Locale:</Label>
      <Input
        id="locale"
        name="locale"
        type="text"
        value={locale}
        onChange={handleChange}
        placeholder="e.g., pt-PT"
      />
    </div>
  );
};
