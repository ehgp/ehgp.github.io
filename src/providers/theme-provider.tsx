'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import theme from '@/theme/mui-theme';

export default function AppThemeProvider({ children }: { children: ReactNode }) {
  const memoizedTheme = useMemo(() => theme, []);

  return (
    <ThemeProvider theme={memoizedTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
