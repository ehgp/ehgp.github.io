import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import ContactList from '@/components/contact-list';
import AppThemeProvider from '@/providers/theme-provider';
import { describe, expect, it } from 'vitest';
import type { RenderResult } from '@testing-library/react';

const renderWithProviders = (ui: ReactNode): RenderResult => render(<AppThemeProvider>{ui}</AppThemeProvider>);

describe('ContactList', () => {
  it('renders all primary contact methods', () => {
    renderWithProviders(<ContactList />);

    ['@ehgp93', 'ehgp@utexas.edu'].forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });

    expect(screen.getAllByText('ehgp').length).toBeGreaterThanOrEqual(1);
  });
});
