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

import { CtaSection } from '@/components/shared/cta-section';

describe('CtaSection', () => {
  it('renders the CTA heading', () => {
    render(<CtaSection />);
    expect(screen.getByText(/ready to practise/i)).toBeInTheDocument();
  });

  it('renders the CTA description', () => {
    render(<CtaSection />);
    expect(
      screen.getByText(/upload your resume, pick a role, and start your first session/i)
    ).toBeInTheDocument();
  });

  it('renders "Get Started Free" button text', () => {
    render(<CtaSection />);
    expect(screen.getByText('Get Started Free')).toBeInTheDocument();
  });

  it('links "Get Started Free" to /signup', () => {
    render(<CtaSection />);
    const links = screen.getAllByRole('link');
    const signupLinks = links.filter((link) => link.getAttribute('href') === '/signup');
    expect(signupLinks.length).toBeGreaterThan(0);
  });

  it('contains the gooey SVG filter', () => {
    const { container } = render(<CtaSection />);
    const filter = container.querySelector('#gooey-filter-cta');
    expect(filter).toBeInTheDocument();
  });

  it('has the gooey filter with correct blur and color matrix', () => {
    const { container } = render(<CtaSection />);
    const blur = container.querySelector('feGaussianBlur');
    expect(blur).toBeInTheDocument();
    expect(blur).toHaveAttribute('stdDeviation', '4');

    const colorMatrix = container.querySelector('feColorMatrix');
    expect(colorMatrix).toBeInTheDocument();
  });

  it('renders correctly with reduced motion preference', () => {
    mockUseReducedMotion.mockReturnValueOnce(true);
    render(<CtaSection />);
    expect(screen.getByText(/ready to practise/i)).toBeInTheDocument();
    expect(screen.getByText('Get Started Free')).toBeInTheDocument();
  });
});
