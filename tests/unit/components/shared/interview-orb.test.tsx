import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

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

import { InterviewOrb } from '@/components/shared/interview-orb';

describe('InterviewOrb', () => {
  it('renders the "Get Started" label', () => {
    render(<InterviewOrb />);
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('links to /signup', () => {
    render(<InterviewOrb />);
    const link = screen.getByRole('link', { name: /get started with mira/i });
    expect(link).toHaveAttribute('href', '/signup');
  });

  it('has accessible aria-label', () => {
    render(<InterviewOrb />);
    expect(screen.getByLabelText('Get started with MIRA')).toBeInTheDocument();
  });

  it('renders the rotating circular text', () => {
    render(<InterviewOrb />);
    expect(screen.getByText(/practice now/i)).toBeInTheDocument();
  });

  it('has cursor-target class on the outer container', () => {
    const { container } = render(<InterviewOrb />);
    const outerDiv = container.firstChild;
    expect(outerDiv).toHaveClass('cursor-target');
  });
});
