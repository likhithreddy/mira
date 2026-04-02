import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock next/font/google — returns a function that produces className and style
vi.mock('next/font/google', () => ({
  Syne: () => ({ className: 'mocked-syne', style: { fontFamily: 'Syne' } }),
  DM_Serif_Display: () => ({
    className: 'mocked-dm-serif',
    style: { fontFamily: 'DM Serif Display' },
    variable: '--font-dm-serif',
  }),
  Figtree: () => ({
    className: 'mocked-figtree',
    style: { fontFamily: 'Figtree' },
    variable: '--font-figtree',
  }),
  Patrick_Hand: () => ({
    className: 'mocked-patrick-hand',
    style: { fontFamily: 'Patrick Hand' },
  }),
}));
