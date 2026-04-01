# Issue #8 — Landing Page Plan

## Overview

Build the public `/` landing page with: top nav, hero (Spline 3D + Spotlight), feature cards, browser compatibility banner. Fully static, scrollable, responsive.

## Files to Create

| File                                                 | Purpose                                                                        |
| ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| `components/ui/splite.tsx`                           | Lazy-loaded Spline 3D wrapper                                                  |
| `components/ui/spotlight.tsx`                        | Aceternity SVG spotlight effect                                                |
| `utils/animations.ts`                                | Shared Framer Motion variants                                                  |
| `components/shared/landing-nav.tsx`                  | Top nav: logo left, Sign In + Get Started right, hamburger Sheet on mobile     |
| `components/shared/hero-section.tsx`                 | Dark card hero: left text + CTAs, right Spline robot, Spotlight overlay        |
| `components/shared/feature-cards.tsx`                | Three callout cards: Contextual Questions, Spoken Practice, Performance Report |
| `components/shared/browser-banner.tsx`               | Dismissible Chrome/Edge notice, hidden if already on Chrome/Edge               |
| `tests/unit/components/shared/landing-page.test.tsx` | All 8 test cases                                                               |

## Files to Modify

| File                 | Change                                         |
| -------------------- | ---------------------------------------------- |
| `app/page.tsx`       | Replace placeholder with composed landing page |
| `tailwind.config.ts` | Add `spotlight` keyframe + animation           |

## Dependencies to Install

- `@splinetool/runtime`
- `@splinetool/react-spline`

## TDD Order

1. Write all 8 failing tests → commit
2. Create UI components (splite, spotlight) + tailwind keyframe → commit
3. Create utils/animations.ts → commit
4. Build shared components + update page.tsx → commit (tests pass)
5. Refactor if needed → commit

## Design Decisions

- Hero: dark card (`bg-black/[0.96]`), Aceternity Spotlight, Spline GENKUB robot scene
- Spline scene URL: `https://prod.spline.design/8H4ttucx5puaDT80/scene.splinecode`
- Feature cards: lucide-react icons (Brain, Mic, BarChart3 or similar)
- Browser banner: client component, `navigator.userAgent` detection, dismissible via state
- Mobile nav: ShadCN Sheet (hamburger menu)
- All animations respect `prefers-reduced-motion` via `useReducedMotion`
- Hero is two-column on lg+, single-column (stacked) on mobile
- Page is scrollable: hero → feature cards → footer area
