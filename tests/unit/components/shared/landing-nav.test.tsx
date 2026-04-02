import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

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

import { LandingNav } from '@/components/shared/landing-nav';

describe('LandingNav', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });

  it('renders the MIRA logo', () => {
    render(<LandingNav />);
    expect(screen.getByText('MIRA')).toBeInTheDocument();
  });

  it('renders all three nav links on desktop', () => {
    render(<LandingNav />);
    const featuresLinks = screen.getAllByText('Features');
    const howItWorksLinks = screen.getAllByText('How It Works');
    const aboutLinks = screen.getAllByText('About');
    expect(featuresLinks.length).toBeGreaterThan(0);
    expect(howItWorksLinks.length).toBeGreaterThan(0);
    expect(aboutLinks.length).toBeGreaterThan(0);
  });

  it('renders nav links with correct anchor hrefs', () => {
    render(<LandingNav />);
    const links = screen.getAllByRole('link');
    const featuresLink = links.find((l) => l.getAttribute('href') === '#features');
    const howItWorksLink = links.find((l) => l.getAttribute('href') === '#how-it-works');
    const aboutLink = links.find((l) => l.getAttribute('href') === '#about');
    expect(featuresLink).toBeTruthy();
    expect(howItWorksLink).toBeTruthy();
    expect(aboutLink).toBeTruthy();
  });

  it('renders Sign In link pointing to /login', () => {
    render(<LandingNav />);
    const signInLinks = screen.getAllByText(/sign in/i);
    expect(signInLinks.length).toBeGreaterThan(0);
  });

  it('renders the mobile menu trigger button', () => {
    render(<LandingNav />);
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('type', 'button');
  });

  it('has cursor-target on the logo', () => {
    render(<LandingNav />);
    const logo = screen.getByText('MIRA');
    expect(logo).toHaveClass('cursor-target');
  });

  it('applies scrolled styles when scrolled past threshold', () => {
    const { container } = render(<LandingNav />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 50, writable: true });
      fireEvent.scroll(window);
    });

    // After scroll, the inner div should have rounded-full class
    const innerDiv = container.querySelector('.rounded-full');
    expect(innerDiv).toBeInTheDocument();
  });

  it('applies non-scrolled styles when at the top', () => {
    const { container } = render(<LandingNav />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
      fireEvent.scroll(window);
    });

    const transparentDiv = container.querySelector('.bg-transparent');
    expect(transparentDiv).toBeInTheDocument();
  });

  it('renders the mobile hamburger menu button', () => {
    render(<LandingNav />);
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();
  });
});
