# BHeard Design System

## Foundation Tokens

- Colors are mapped from `tailwind.config.ts` token keys only.
- Primary brand accent is `primary`.
- Core surfaces are `surface`, `surface-dim`, and `inverse-surface`.
- Text is limited to `on-background`, `inverse-on-surface`, and `on-surface-variant`.

## Typography

- `font-headline`: Space Grotesk for display and headings.
- `font-body` and `font-label`: Manrope for body and utility copy.
- Type scale utilities:
  - `text-display-xl`
  - `text-display-lg`
  - `text-headline`
  - `text-title`
  - `text-body-lg`
  - `text-label-sm`

## Spacing

- Section spacing: `section-y`, `section-y-md`, `section-y-sm`
- Content container: `content-max`
- Gutters: `gutter`, `gutter-sm`
- Homepage rhythm (see `components/system/sectionTheme.ts`):
  - **`sectionBandY`** — default `py-20 md:py-24` for a full band (clients, proof-of-craft, etc.).
  - **`sectionBandYCompact`** — slightly tighter band (e.g. belief after hero).
  - **`sectionStackBottom` / `sectionStackTop`** — pair when **two consecutive sections share the same `background` token** so padding does not stack visually (belief → services on `bg-surface`; selected works → about on `bg-surface-container-lowest`).

### Adjacent sections with the same background

When two bands use the same surface token, use **`sectionStackBottom`** on the first and **`sectionStackTop`** on the second instead of two full `py-*` blocks. When the background **changes** (e.g. `bg-surface` → `bg-surface-container-lowest`), use a normal **`sectionBandY`** (or explicit `pb` / `pt`) on each side of the seam so the break reads clearly.

## Shared Utilities

- `.img-editorial`: enforced black-and-white editorial treatment.
- `.mockup-frame`: Tier 2 color-work frame wrapper.
- `.bg-grain`: subtle grain overlay for atmospheric dark sections.

## Core Primitives

- `SectionShell`
- `SectionHeading`
- `InnerPageHero`
- `ContentCard`
- `BentoGrid`
- `PinnedStorySection`
- `ProcessTimeline`
- `MetricsRow`
- `MotionWrapper`

## Motion Hooks

Located in `components/system/motion/hooks.ts`:

- `useFadeUpScrub`
- `useStaggerReveal`
- `useParallaxScroll`
- `useTextSplitReveal`
- `useMaskReveal`
- `useLineDraw`
- `useHoverParallax`
- `useHoverLift`
- `usePinnedSection`
- `useCountUp`
- `useHorizontalScroll`
