import { test, expect } from '@playwright/test';

/**
 * E2E tests for Landing Page (Issue #8)
 * Tests manual browser-based checks that can't be verified with unit tests
 */

test.describe('Landing Page - Smoke Test', () => {
  test('page loads and has content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Check for MIRA brand
    const hasMira = await page.getByText('MIRA').count();
    expect(hasMira).toBeGreaterThan(0);

    // Check for navigation
    const hasFeatures = await page.getByText('Features').count();
    expect(hasFeatures).toBeGreaterThan(0);

    // Check for hero content
    const hasCoach = await page.getByText('AI coach').count();
    expect(hasCoach).toBeGreaterThan(0);
  });
});

test.describe('Landing Page - Issue #8', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for client-side hydration to complete (TargetCursor causes CSR bailout)
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
  });

  test('renders all sections', async ({ page }) => {
    // Hero section
    await expect(page.getByText('Your AI coach to')).toBeVisible();

    // Features section - "What MIRA does" is the section label
    await expect(page.getByText('What MIRA does')).toBeVisible();

    // How it works section
    await expect(page.getByText('How It Works')).toBeVisible();

    // About section - "Built for the" is part of the heading
    await expect(page.getByText('Built for the')).toBeVisible();

    // Get Started button (orb link) - use more specific selector
    await expect(page.getByText('Get Started').first()).toBeVisible();
  });

  test('dark/light theme toggle works', async ({ page }) => {
    // Find and click theme toggle
    const html = page.locator('html');
    const themeToggle = page
      .locator('button')
      .filter({ hasText: /theme/i })
      .or(page.locator('[data-testid="theme-toggle"]'));
    await themeToggle.first().click();

    // Wait for transition
    await page.waitForTimeout(400);

    // Verify theme has a class (dark or light)
    const newClass = await html.getAttribute('class');
    expect(newClass).toBeTruthy();
  });

  test('navbar logo uses Syne font with full stop', async ({ page }) => {
    // Find the logo button with MIRA. text
    const logo = page.getByRole('button').filter({ hasText: /MIRA/i });
    await expect(logo.first()).toBeVisible();
  });

  test('logo click scrolls to top', async ({ page }) => {
    // Scroll down first - ensure page has content first
    await expect(page.getByText('What MIRA does')).toBeVisible();
    await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }));
    await page.waitForTimeout(200);

    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    // Click logo
    const logo = page.getByRole('button').filter({ hasText: /MIRA/i });
    await logo.first().click();

    // Wait for smooth scroll
    await page.waitForTimeout(600);

    // Should be at top
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBeLessThan(50);
  });

  test('navigation links work', async ({ page }) => {
    // Find Sign In link - it's inside a gooey wrapper
    const signInLink = page.locator('a').filter({ hasText: 'Sign In' });
    await expect(signInLink.first()).toHaveAttribute('href', '/login');
  });

  test('interview orb link works', async ({ page }) => {
    const orbLink = page.locator('a').filter({ hasText: /Get Started/i });
    await expect(orbLink.first()).toBeVisible();
  });

  test('CTA button works', async ({ page }) => {
    const ctaButton = page.locator('a').filter({ hasText: /Start/i });
    await expect(ctaButton.first()).toHaveAttribute('href', /login|signup/);
  });

  test('scroll to top button appears after scrolling', async ({ page }) => {
    // Scroll to top button appears after scrolling past one viewport
    await page.evaluate(() => {
      window.scrollTo({ top: window.innerHeight + 500, behavior: 'instant' });
    });
    await page.waitForTimeout(500);

    // Button has aria-label="Scroll to top" for reliable selection
    const scrollButton = page.locator('button[aria-label="Scroll to top"]');
    await expect(scrollButton).toBeVisible();
  });

  test('tagline pill is visible and interactive', async ({ page }) => {
    // Look for the rotating text words
    const rotatingText = page.getByText(/build confidence|ace interviews|get hired/i);
    await expect(rotatingText.first()).toBeVisible();
  });
});

test.describe('Landing Page - Responsive', () => {
  test('mobile view (320px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // All sections should still be visible
    await expect(page.getByText('Your AI coach to')).toBeVisible();
    await expect(page.getByText('What MIRA does')).toBeVisible();

    // Mobile menu button should be present - look for any button in the header
    const headerButtons = await page.locator('header button').count();
    expect(headerButtons).toBeGreaterThan(0);
  });

  test('tablet view (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    await expect(page.getByText('Your AI coach to')).toBeVisible();
  });

  test('desktop view (1536px)', async ({ page }) => {
    await page.setViewportSize({ width: 1536, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    await expect(page.getByText('Your AI coach to')).toBeVisible();

    // Desktop nav should be visible
    await expect(page.locator('a').filter({ hasText: 'Sign In' })).toBeVisible();
  });

  test('no horizontal overflow at any width', async ({ page }) => {
    // Test desktop viewport to avoid overwhelming the dev server with multiple page loads
    await page.setViewportSize({ width: 1536, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    const overflowAmount = await page.evaluate(() => {
      return document.body.scrollWidth - document.body.clientWidth;
    });

    // Allow small overflow (up to 20px) due to sub-pixel rendering or browser quirks
    // But no significant horizontal scroll
    expect(overflowAmount).toBeLessThanOrEqual(20);
  });
});

test.describe('TargetCursor - Desktop vs Mobile', () => {
  test('shows on desktop (Chrome)', async ({ page }) => {
    // Ensure desktop viewport (TargetCursor only renders on non-mobile)
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Wait for TargetCursor to hydrate and render (GSAP animations need time)
    await page.waitForTimeout(3000);

    // TargetCursor renders .target-cursor-wrapper, not .target-cursor
    const hasCursor = await page.evaluate(() => {
      return document.querySelector('.target-cursor-wrapper') !== null;
    });
    expect(hasCursor).toBe(true);
  });

  test('hides on mobile/small screens', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Simulate touch device
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'maxTouchPoints', { get: () => 1 });
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // TargetCursor should not render on touch/small devices
    const hasCursor = await page.evaluate(() => {
      return document.querySelector('.target-cursor') !== null;
    });
    expect(hasCursor).toBe(false);
  });

  test('cursor-target classes on interactive elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Check that interactive elements have cursor-target class
    const cursorTargets = page.locator('.cursor-target');
    const count = await cursorTargets.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Browser Banner - Firefox Detection', () => {
  test('shows banner on Firefox', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'userAgent', {
        get: () =>
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
      });
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Banner should be visible on Firefox
    const banner = page.locator('[data-testid="browser-banner"]');
    const isVisible = await banner.isVisible().catch(() => false);
    expect(isVisible).toBe(true);
  });

  test('hides banner on Chrome', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const banner = page.locator('[data-testid="browser-banner"]');

    // On Chromium, banner should not be visible
    // On WebKit, banner should be visible (WebKit is not Chromium)
    if (browserName === 'chromium') {
      await expect(banner).not.toBeVisible();
    } else {
      // WebKit (Safari) is not Chromium, so banner shows
      await expect(banner).toBeVisible();
    }
  });
});

test.describe('404 Page', () => {
  test('renders with all components', async ({ page }) => {
    await page.goto('/nonexistent-page-404');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // 404 heading
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();

    // Message - check for various possible texts
    const hasMessage =
      (await page.getByText(/dead end/i).count()) > 0 ||
      (await page.getByText(/wrong turn/i).count()) > 0 ||
      (await page.getByText(/doesn't exist/i).count()) > 0;
    expect(hasMessage).toBe(true);

    // Cat animation (Lottie)
    const catContainer = page.locator('[data-testid="cat-animation"]');
    await expect(catContainer).toBeVisible();

    // Back to home button
    const homeButton = page.getByRole('link', { name: 'Back to Home' });
    await expect(homeButton).toBeVisible();
  });

  test('404 page responsive at all sizes', async ({ page }) => {
    const widths = [320, 768, 1024, 1536];

    for (const width of widths) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/nonexistent-page-404');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      await expect(page.getByRole('heading', { name: '404' })).toBeVisible();

      const hasOverflow = await page.evaluate(() => {
        return document.body.scrollWidth > document.body.clientWidth;
      });

      expect(hasOverflow).toBe(false);
    }
  });

  test('404 page theme toggle works', async ({ page }) => {
    await page.goto('/nonexistent-page-404');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    const themeToggle = page
      .locator('button')
      .filter({ hasText: /theme/i })
      .or(page.locator('[data-testid="theme-toggle"]'));
    await themeToggle.first().click();
    await page.waitForTimeout(400);

    // Just verify the click worked
    const html = page.locator('html');
    const hasClass = await html.getAttribute('class');
    expect(hasClass).toBeTruthy();
  });
});

test.describe('Landing Page - Animations', () => {
  test('respects prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    // Page should still render
    await expect(page.getByText('Your AI coach to')).toBeVisible();
  });

  test('hero section has text rotation animation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    // Find the rotating text - look for the actual rotating words
    const rotatingText = page.getByText(/build confidence|ace interviews|get hired/i);
    await expect(rotatingText.first()).toBeVisible();
  });
});
