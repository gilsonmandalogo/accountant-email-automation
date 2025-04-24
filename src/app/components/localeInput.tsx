'use client';

import { useCallback, useState } from 'react';

export default function LocaleInput() {
  const [locale, setLocale] = useState<string>(navigator.language || 'pt-PT');

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
