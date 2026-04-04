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

import { FeaturesSection } from '@/components/shared/features-section';

describe('FeaturesSection', () => {
  it('renders the section heading', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/built for the/i)).toBeInTheDocument();
    expect(screen.getByText(/interview room/i)).toBeInTheDocument();
  });

  it('renders the section label', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/what mira does/i)).toBeInTheDocument();
  });

  it('renders all three feature cards', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('Questions Built for Your Role')).toBeInTheDocument();
    expect(screen.getByText('Practice Out Loud')).toBeInTheDocument();
    expect(screen.getByText('Real Follow-Up Questions')).toBeInTheDocument();
  });

  it('renders the signature full-width card', () => {
    render(<FeaturesSection />);
    expect(screen.getByText('A Report That Actually Helps')).toBeInTheDocument();
  });

  it('renders descriptions for all feature cards', () => {
    render(<FeaturesSection />);
    expect(screen.getByText(/upload your resume and the job description/i)).toBeInTheDocument();
    expect(screen.getByText(/answer every question by speaking/i)).toBeInTheDocument();
    expect(screen.getByText(/mira listens to your answers/i)).toBeInTheDocument();
    expect(
      screen.getByText(/after each session you get a structured breakdown/i)
    ).toBeInTheDocument();
  });

  it('has the features id for anchor navigation', () => {
    const { container } = render(<FeaturesSection />);
    const section = container.querySelector('#features');
    expect(section).toBeInTheDocument();
  });

  it('renders correctly with reduced motion preference', () => {
    mockUseReducedMotion.mockReturnValueOnce(true);
    render(<FeaturesSection />);
    expect(screen.getByText('Questions Built for Your Role')).toBeInTheDocument();
    expect(screen.getByText('A Report That Actually Helps')).toBeInTheDocument();
  });
});
