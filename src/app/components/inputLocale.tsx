'use client';

import { useCallback, useEffect, useState } from 'react';

export default function InputLocale() {
  const [locale, setLocale] = useState('pt-PT');

  useEffect(() => {
    setLocale(navigator.language);
  }, []);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocale(event.target.value);
  }, []);

  return (
    <label>
      Locale:
      <input
        name="locale"
        type="text"
        value={locale}
        onChange={handleChange}
        placeholder="e.g., pt-PT"
      />
    </label>
  );
};
