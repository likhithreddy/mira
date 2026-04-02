import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock framer-motion to render children directly
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useReducedMotion: vi.fn(() => false),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      ...actual.motion,
      button: ({
        children,
        onClick,
        ...props
      }: React.PropsWithChildren<{ onClick?: () => void }>) => (
        <button onClick={onClick} {...props}>
          {children}
        </button>
      ),
      svg: ({ children, ...props }: React.PropsWithChildren) => <svg {...props}>{children}</svg>,
    },
  };
});

import { ScrollToTop } from '@/components/shared/scroll-to-top';

describe('ScrollToTop', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
    window.scrollTo = vi.fn();
  });

  it('is not visible when page is at the top', () => {
    render(<ScrollToTop />);
    expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument();
  });

  it('becomes visible when scrolled past one viewport height', () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 900, writable: true });
      fireEvent.scroll(window);
    });

    expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();
  });

  it('hides again when scrolled back to top', () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 900, writable: true });
      fireEvent.scroll(window);
    });
    expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      fireEvent.scroll(window);
    });
    expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument();
  });

  it('calls window.scrollTo with smooth behavior on click', () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 900, writable: true });
      fireEvent.scroll(window);
    });

    fireEvent.click(screen.getByLabelText('Scroll to top'));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('stays hidden when scrollY equals exactly innerHeight', () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 800, writable: true });
      fireEvent.scroll(window);
    });

    expect(screen.queryByLabelText('Scroll to top')).not.toBeInTheDocument();
  });

  it('shows when scrollY is just past innerHeight', () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 801, writable: true });
      fireEvent.scroll(window);
    });

    expect(screen.getByLabelText('Scroll to top')).toBeInTheDocument();
  });

  it('contains "Back to Top" rotating text', () => {
    render(<ScrollToTop />);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 900, writable: true });
      fireEvent.scroll(window);
    });

    expect(screen.getByText(/back to top/i)).toBeInTheDocument();
  });
});
