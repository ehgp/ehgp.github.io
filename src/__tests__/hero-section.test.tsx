import { render, screen } from '@testing-library/react';
import type { AnchorHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from 'react';
import HeroSection from '@/components/hero-section';
import AppThemeProvider from '@/providers/theme-provider';
import { primarySocials } from '@/data/socials';
import { describe, expect, it, vi } from 'vitest';
import type { RenderResult } from '@testing-library/react';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: ComponentPropsWithoutRef<'img'>) => (
    // Next.js optimizes images, the test double renders a plain img instead
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={props.alt ?? ''} {...props} />
  )
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}));

const renderWithProviders = (ui: ReactNode): RenderResult => render(<AppThemeProvider>{ui}</AppThemeProvider>);

describe('HeroSection', () => {
  it('renders the EHGP greeting and subtitle', () => {
    renderWithProviders(<HeroSection />);

    expect(screen.getByText(/Hi, I'm EHGP/i)).toBeInTheDocument();
    expect(screen.getByText(/Web Developer/i)).toBeInTheDocument();
  });

  it('shows social buttons linking to external pages', () => {
    renderWithProviders(<HeroSection />);

    const primaryLabel = primarySocials[0]?.label ?? 'Resume';
    const socialLinks = screen.getAllByRole('link', { name: new RegExp(primaryLabel, 'i') });
    expect(socialLinks[0]).toHaveAttribute('href', primarySocials[0].href);
  });
});
