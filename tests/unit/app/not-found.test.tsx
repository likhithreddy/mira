import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

// Mock MutationObserver
const mockMutationObserver = vi.fn();
mockMutationObserver.mockReturnValue({
  observe: vi.fn(),
  disconnect: vi.fn(),
});
vi.stubGlobal('MutationObserver', mockMutationObserver);

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

vi.mock('@lottiefiles/dotlottie-react', () => ({
  DotLottieReact: ({ src }: { src: string }) => (
    <div data-testid="lottie-cat" data-src={src}>
      Lottie Mock
    </div>
  ),
}));

vi.mock('@splinetool/react-spline', () => ({
  __esModule: true,
  default: () => <div data-testid="spline-scene">Spline Mock</div>,
}));

import NotFound from '@/app/not-found';

describe('NotFound (404 Page)', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
  });

  it('renders the 404 heading', () => {
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders the 404 heading as an h1', () => {
    render(<NotFound />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('404');
  });

  it('renders the cat Lottie animation', () => {
    render(<NotFound />);
    const lottie = screen.getByTestId('lottie-cat');
    expect(lottie).toBeInTheDocument();
    expect(lottie).toHaveAttribute(
      'data-src',
      'https://lottie.host/8cf4ba71-e5fb-44f3-8134-178c4d389417/0CCsdcgNIP.json'
    );
  });

  it('renders the rotating tagline prefix', () => {
    render(<NotFound />);
    expect(screen.getByText(/looks like a/i)).toBeInTheDocument();
  });

  it('renders the description text', () => {
    render(<NotFound />);
    expect(
      screen.getByText(/this page doesn't exist\. it might have been moved/i)
    ).toBeInTheDocument();
  });

  it('renders "Back to Home" link pointing to /', () => {
    render(<NotFound />);
    const homeLinks = screen.getAllByRole('link').filter((l) => l.getAttribute('href') === '/');
    expect(homeLinks.length).toBeGreaterThan(0);
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  it('contains the gooey SVG filter for the button', () => {
    const { container } = render(<NotFound />);
    const filter = container.querySelector('#gooey-filter-404');
    expect(filter).toBeInTheDocument();
  });

  it('renders the LandingNav', () => {
    render(<NotFound />);
    // LandingNav renders the MIRA logo
    expect(screen.getByText('MIRA')).toBeInTheDocument();
  });

  it('sets up MutationObserver for dark mode detection', () => {
    render(<NotFound />);
    expect(mockMutationObserver).toHaveBeenCalled();
    const observerInstance = mockMutationObserver.mock.results[0].value;
    expect(observerInstance.observe).toHaveBeenCalledWith(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
  });

  it('disconnects MutationObserver on unmount', () => {
    const { unmount } = render(<NotFound />);
    const observerInstance = mockMutationObserver.mock.results[0].value;
    unmount();
    expect(observerInstance.disconnect).toHaveBeenCalled();
  });

  it('renders correctly with reduced motion preference', () => {
    mockUseReducedMotion.mockReturnValueOnce(true);
    render(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });

  it('detects dark mode from documentElement class', () => {
    document.documentElement.classList.add('dark');
    render(<NotFound />);
    // Should still render correctly in dark mode
    expect(screen.getByText('404')).toBeInTheDocument();
    document.documentElement.classList.remove('dark');
  });
});
