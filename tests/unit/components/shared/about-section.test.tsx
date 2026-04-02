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

import { AboutSection } from '@/components/shared/about-section';

describe('AboutSection', () => {
  it('renders the section heading', () => {
    render(<AboutSection />);
    expect(screen.getByText(/we built the interview coach we wish we had/i)).toBeInTheDocument();
  });

  it('renders the section label', () => {
    render(<AboutSection />);
    expect(screen.getByText(/why we built this/i)).toBeInTheDocument();
  });

  it('renders the team label', () => {
    render(<AboutSection />);
    expect(screen.getByText(/the team/i)).toBeInTheDocument();
  });

  it('renders both team members', () => {
    render(<AboutSection />);
    expect(screen.getByText('Likhith Reddy Rechintala')).toBeInTheDocument();
    expect(screen.getByText('Jaya Sriharshita Koneti')).toBeInTheDocument();
  });

  it('renders team member initials', () => {
    render(<AboutSection />);
    expect(screen.getByText('LR')).toBeInTheDocument();
    expect(screen.getByText('JK')).toBeInTheDocument();
  });

  it('renders GitHub links for each team member', () => {
    render(<AboutSection />);
    const githubLinks = screen.getAllByLabelText(/github/i);
    expect(githubLinks).toHaveLength(2);
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/likhithreddy');
    expect(githubLinks[1]).toHaveAttribute('href', 'https://github.com/jayasriharshitakoneti');
  });

  it('renders LinkedIn links for each team member', () => {
    render(<AboutSection />);
    const linkedinLinks = screen.getAllByLabelText(/linkedin/i);
    expect(linkedinLinks).toHaveLength(2);
    expect(linkedinLinks[0]).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/likhithreddyrechintala/'
    );
    expect(linkedinLinks[1]).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/jaya-sriharshita-koneti/'
    );
  });

  it('opens external links in new tab with security attributes', () => {
    render(<AboutSection />);
    const externalLinks = screen.getAllByLabelText(/github|linkedin/i);
    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders mission copy paragraphs', () => {
    render(<AboutSection />);
    expect(screen.getByText(/most people prepare for interviews/i)).toBeInTheDocument();
    expect(screen.getByText(/the people who do well/i)).toBeInTheDocument();
    expect(screen.getByText(/mira gives everyone that/i)).toBeInTheDocument();
  });

  it('has the about id for anchor navigation', () => {
    const { container } = render(<AboutSection />);
    const section = container.querySelector('#about');
    expect(section).toBeInTheDocument();
  });

  it('renders correctly with reduced motion preference', () => {
    mockUseReducedMotion.mockReturnValueOnce(true);
    render(<AboutSection />);
    expect(screen.getByText('Likhith Reddy Rechintala')).toBeInTheDocument();
    expect(screen.getByText(/we built the interview coach/i)).toBeInTheDocument();
  });
});
