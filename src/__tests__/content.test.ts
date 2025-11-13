import { describe, expect, it } from 'vitest';
import { hero } from '@/data/home';
import { navItems } from '@/data/navigation';
import { driveEmbeds } from '@/data/embeds';
import { badgeSections } from '@/data/badges';

describe('content integrity', () => {
  it('keeps hero highlight parity', () => {
    const highlightTexts = hero.highlights.map((highlight) => highlight.text);
    const highlightHrefs = hero.highlights.map((highlight) => highlight.href ?? '');

    expect(highlightTexts.some((text) => text.toLowerCase().includes('learning'))).toBe(true);
    expect(highlightHrefs.some((href) => href.includes('ehgp.github.io/my-work'))).toBe(true);
  });

  it('exposes navigation for all legacy routes', () => {
    const labels = navItems.map((item) => item.label);
    expect(labels).toEqual(['Home', 'My Work', 'About', 'Contact', 'Resumes']);
  });

  it('keeps Drive embeds pointing to Google preview URLs', () => {
    Object.values(driveEmbeds).forEach((url) => {
      expect(url).toMatch(/^https:\/\/drive.google.com\/file\//);
      expect(url).toContain('/preview');
    });
  });

  it('maintains badge image sources pointing to shields.io', () => {
    badgeSections.forEach((section) => {
      section.badges.forEach((badge) => {
        expect(badge.image).toMatch(/^https:\/\/img\.shields\.io\//);
      });
    });
  });
});
