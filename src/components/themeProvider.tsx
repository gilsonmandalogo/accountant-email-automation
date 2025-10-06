'use client';

import { useEffect } from 'react';

export default function ThemeProvider() {
  useEffect(() => {
    // Function to update theme based on system preference
    const updateTheme = (e: MediaQueryList | MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    updateTheme(mediaQuery);

    // Listen for changes to system theme
    mediaQuery.addEventListener('change', updateTheme);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', updateTheme);
    };
  }, []);

  return null;
}
