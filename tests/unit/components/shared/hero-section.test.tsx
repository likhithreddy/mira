import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

const mockUseReducedMotion = vi.fn(() => false);
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => mockUseReducedMotion(),
  };
});

const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);

vi.mock('@splinetool/react-spline', () => ({
  __esModule: true,
  default: () => <div data-testid="spline-scene">Spline Mock</div>,
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

import { HeroSection } from '@/components/shared/hero-section';

describe('HeroSection', () => {
  it('renders the hero section with test id', () => {
    render(<HeroSection />);
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
  });

  it('renders the tagline text', () => {
    render(<HeroSection />);
    expect(screen.getByText(/your ai coach to/i)).toBeInTheDocument();
  });

  it('renders the Spline 3D scene', () => {
    render(<HeroSection />);
    expect(screen.getByTestId('spline-scene')).toBeInTheDocument();
  });

  it('prevents context menu on the section', () => {
    render(<HeroSection />);
    const section = screen.getByTestId('hero-section');
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    const prevented = !section.dispatchEvent(event);
    expect(prevented).toBe(true);
  });

  it('renders the InterviewOrb component', () => {
    render(<HeroSection />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('renders correctly with reduced motion preference', () => {
    mockUseReducedMotion.mockReturnValueOnce(true);
    render(<HeroSection />);
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByText(/your ai coach to/i)).toBeInTheDocument();
  });
});
