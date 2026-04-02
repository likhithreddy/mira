import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserBanner } from '@/components/shared/browser-banner';

describe('BrowserBanner', () => {
  const originalNavigator = window.navigator;

  function setUserAgent(ua: string) {
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: ua },
      writable: true,
      configurable: true,
    });
  }

  afterEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
  });

  it('does not render on Chrome', () => {
    setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    render(<BrowserBanner />);
    expect(screen.queryByTestId('browser-banner')).not.toBeInTheDocument();
  });

  it('does not render on Edge', () => {
    setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    );
    render(<BrowserBanner />);
    expect(screen.queryByTestId('browser-banner')).not.toBeInTheDocument();
  });

  it('renders on Firefox', () => {
    setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
    );
    render(<BrowserBanner />);
    expect(screen.getByTestId('browser-banner')).toBeInTheDocument();
  });

  it('renders on Safari', () => {
    setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
    );
    render(<BrowserBanner />);
    expect(screen.getByTestId('browser-banner')).toBeInTheDocument();
  });

  it('displays the correct message text', () => {
    setUserAgent('Mozilla/5.0 Firefox/121.0');
    render(<BrowserBanner />);
    expect(
      screen.getByText(/for the best experience with voice features, use chrome or edge/i)
    ).toBeInTheDocument();
  });

  it('has a dismiss button with accessible label', () => {
    setUserAgent('Mozilla/5.0 Firefox/121.0');
    render(<BrowserBanner />);
    const dismissBtn = screen.getByTestId('banner-dismiss');
    expect(dismissBtn).toHaveAttribute('aria-label', 'Dismiss banner');
  });

  it('removes banner from DOM when dismiss is clicked', () => {
    setUserAgent('Mozilla/5.0 Firefox/121.0');
    render(<BrowserBanner />);
    expect(screen.getByTestId('browser-banner')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('banner-dismiss'));
    expect(screen.queryByTestId('browser-banner')).not.toBeInTheDocument();
  });

  it('stays dismissed after clicking dismiss (does not reappear)', () => {
    setUserAgent('Mozilla/5.0 Firefox/121.0');
    render(<BrowserBanner />);
    fireEvent.click(screen.getByTestId('banner-dismiss'));
    expect(screen.queryByTestId('browser-banner')).not.toBeInTheDocument();
    // No re-render triggers it back
    expect(screen.queryByTestId('browser-banner')).not.toBeInTheDocument();
  });
});
