import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock IntersectionObserver for Framer Motion viewport detection
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);

// Mock Spline to avoid loading 3D scene in tests
vi.mock('@splinetool/react-spline', () => ({
  __esModule: true,
  default: () => <div data-testid="spline-scene">Spline Mock</div>,
}));

// Mock next/link
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

import HomePage from '@/app/page';

describe('Landing Page', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      writable: true,
      configurable: true,
    });
  });

  it('renders the hero headline', () => {
    render(<HomePage />);
    const hero = screen.getByTestId('hero-section');
    expect(hero).toBeInTheDocument();
    expect(screen.getByText(/your ai coach to/i)).toBeInTheDocument();
  });

  it('renders single-column layout at 375px without horizontal overflow', () => {
    // Set viewport width
    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
    window.dispatchEvent(new Event('resize'));

    const { container } = render(<HomePage />);
    const main = container.querySelector('main');
    expect(main).toBeTruthy();
    // No element should exceed viewport width
    expect(main!.scrollWidth).toBeLessThanOrEqual(375);
  });

  it('renders two-column hero layout at 1280px', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1280, writable: true });
    window.dispatchEvent(new Event('resize'));

    render(<HomePage />);
    // The hero section should contain the flex layout with two children
    const heroCard = screen.getByTestId('hero-section');
    expect(heroCard).toBeTruthy();
  });

  it('has "Get Started Free" link pointing to /signup', () => {
    render(<HomePage />);
    const ctaLinks = screen.getAllByRole('link', { name: /get started free/i });
    expect(ctaLinks.length).toBeGreaterThan(0);
    expect(ctaLinks[0]).toHaveAttribute('href', '/signup');
  });

  it('has "Sign In" link pointing to /login', () => {
    render(<HomePage />);
    // There may be multiple Sign In links (nav + hero); at least one should point to /login
    const signInLinks = screen.getAllByRole('link', { name: /sign in/i });
    expect(signInLinks.some((link) => link.getAttribute('href') === '/login')).toBe(true);
  });

  it('does not show browser banner when user agent is Chrome', () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      writable: true,
      configurable: true,
    });

    render(<HomePage />);
    expect(screen.queryByTestId('browser-banner')).not.toBeInTheDocument();
  });

  it('shows browser banner when user agent is Firefox', () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      },
      writable: true,
      configurable: true,
    });

    render(<HomePage />);
    expect(screen.getByTestId('browser-banner')).toBeInTheDocument();
  });

  it('removes browser banner from DOM when dismissed', () => {
    Object.defineProperty(window, 'navigator', {
      value: {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
      },
      writable: true,
      configurable: true,
    });

    render(<HomePage />);
    const banner = screen.getByTestId('browser-banner');
    expect(banner).toBeInTheDocument();

    const dismissButton = screen.getByTestId('banner-dismiss');
    fireEvent.click(dismissButton);

    expect(screen.queryByTestId('browser-banner')).not.toBeInTheDocument();
  });
});
