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

import { HowItWorksSection } from '@/components/shared/how-it-works-section';

describe('HowItWorksSection', () => {
  it('renders the section heading', () => {
    render(<HowItWorksSection />);
    expect(screen.getByText(/from resume to ready/i)).toBeInTheDocument();
  });

  it('renders the section label', () => {
    render(<HowItWorksSection />);
    expect(screen.getByText(/the process/i)).toBeInTheDocument();
  });

  it('renders the section subtitle', () => {
    render(<HowItWorksSection />);
    expect(screen.getByText(/five minutes of setup/i)).toBeInTheDocument();
  });

  it('renders all five steps', () => {
    render(<HowItWorksSection />);
    expect(screen.getByText('Upload Your Context')).toBeInTheDocument();
    expect(screen.getByText('Questions Are Generated')).toBeInTheDocument();
    expect(screen.getByText('Speak Your Answers')).toBeInTheDocument();
    expect(screen.getByText('Get Pushed Back')).toBeInTheDocument();
    expect(screen.getByText('Read Your Report')).toBeInTheDocument();
  });

  it('renders step numbers 01 through 05', () => {
    render(<HowItWorksSection />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
  });

  it('renders descriptions for each step', () => {
    render(<HowItWorksSection />);
    expect(screen.getByText(/paste your resume and the job description/i)).toBeInTheDocument();
    expect(screen.getByText(/mira produces 8–12 interview questions/i)).toBeInTheDocument();
    expect(screen.getByText(/answer each question out loud/i)).toBeInTheDocument();
    expect(screen.getByText(/mira evaluates each answer/i)).toBeInTheDocument();
    expect(screen.getByText(/when the session ends/i)).toBeInTheDocument();
  });

  it('has the how-it-works id for anchor navigation', () => {
    const { container } = render(<HowItWorksSection />);
    const section = container.querySelector('#how-it-works');
    expect(section).toBeInTheDocument();
  });

  it('renders correctly with reduced motion preference', () => {
    mockUseReducedMotion.mockReturnValueOnce(true);
    render(<HowItWorksSection />);
    expect(screen.getByText('Upload Your Context')).toBeInTheDocument();
    expect(screen.getByText('Read Your Report')).toBeInTheDocument();
  });
});
