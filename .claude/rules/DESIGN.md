## Design Rules

- **Typography:** DM Serif Display for headings, Figtree for body text
- **Icons:** lucide-react only — no emojis anywhere
- **Animations:** Framer Motion, ease-out — 200–400ms for UI transitions, 400–600ms for page transitions, fade + `y: 10 → 0` for route changes
- Always respect `prefers-reduced-motion` via Framer Motion's `useReducedMotion` hook — set `duration: 0` when enabled
- **Loading states:** ShadCN `Skeleton` components with shimmer — never spinner-only for content areas
- **Forms:** no focus rings (`focus-visible:ring-0`), inline field-level error messages only — no top-of-form banners
- No blank white flash between route transitions — use `AnimatePresence` at the layout level
- Full responsiveness: 320px mobile through 1536px+ desktop — no fixed pixel widths on containers

## Browser Compatibility

- **Full functionality** (TTS + speech recognition): Chrome 110+, Edge 110+ only
- **Core functionality** (text input fallback): Safari 16+
- **Firefox**: speech features not supported — display a browser recommendation notice on the setup page
- Always implement the text input fallback for non-Chromium browsers; never assume mic is available
