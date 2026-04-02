import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => {
    const MockComponent = () => <div data-testid="target-cursor">Cursor Mock</div>;
    MockComponent.displayName = 'MockDynamic';
    return MockComponent;
  },
}));

import { LandingCursor } from '@/components/shared/landing-cursor';

describe('LandingCursor', () => {
  it('renders without crashing', () => {
    const { container } = render(<LandingCursor />);
    expect(container).toBeTruthy();
  });
});
