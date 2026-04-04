# Issue #8 — Landing Page Exploration

## Existing State

- `app/page.tsx` — placeholder `<h1>MIRA</h1>`, needs full replacement
- `app/layout.tsx` — DM Serif Display + Figtree fonts configured, CSS variables set
- `app/globals.css` — ShadCN theme tokens (light + dark) in place
- `tailwind.config.ts` — fonts, colors, border-radius, accordion keyframes configured; needs `spotlight` keyframe
- `components/ui/` — ShadCN primitives available: `button.tsx`, `card.tsx`, `sheet.tsx`, `skeleton.tsx`
- `components/shared/` — empty (`.gitkeep` only)
- `utils/` — directory exists but empty; `animations.ts` does not exist yet
- `framer-motion` — already installed (v11.18.2)
- `@splinetool/*` — NOT installed

## Key Findings

1. Card component already exists — no need to recreate
2. Sheet component exists — will use for mobile hamburger nav
3. No `lib/utils.ts` check needed — ShadCN projects always have it
4. No Supabase imports allowed on this page (fully static)
5. The `animate-spotlight` CSS class used by Aceternity Spotlight needs a keyframe in tailwind config
