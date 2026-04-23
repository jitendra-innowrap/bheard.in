# BHeard — Complete Full-Site Development Plan
**For Cursor. Read every word before writing a single line of code.**

---

## 0. NON-NEGOTIABLES (NEVER BREAK THESE)

These rules govern every file, every component, every page. If any instruction below conflicts with one of these, these win.

| Rule | Detail |
|---|---|
| Stack | Next.js 14 App Router, Next.js API routes, Prisma ORM, MySQL on cPanel, PM2 |
| Color system | Use ONLY existing tailwind.config.ts tokens. Primary orange: `primary` (`#ff923e`). Dark surfaces: `inverse-surface` (`#111827`) and `surface-dim` (`#0e0e0e`). Light surface: `surface` / `background` (`#f7f7f5`). No new colors. No hex codes hardcoded anywhere. |
| Typography | Headline font: `font-headline` → `var(--font-space-grotesk)`. Body/label font: `font-body` / `font-label` → `var(--font-manrope)`. These are the only two font families. Never import or reference any other font. |
| Photography | Four-tier image system (see Section 1.7). Hero and editorial images: B&W high-contrast. Client work/deliverables: full colour inside mockup frames. Texture/abstract backgrounds: orange-graded or dark. Motion graphics: brand-coloured Lottie/SVG only. Never use stock photography, AI-generated images, or generic agency lifestyle shots. |
| Motion engine | GSAP + ScrollTrigger only. No Framer Motion. No CSS keyframes for scroll animations. |
| Animation budget | Max 4 animation patterns per page. No two consecutive sections with the same animation. |
| Image storage | `/public/uploads` only. No external image CDN. All DB references via `MediaAsset` model. |
| Homepage | Standalone — never inherits from `(site)/layout.tsx`. |
| Inner pages | All inherit from `app/(site)/layout.tsx`. Consistent nav, footer, page transitions. |
| Page transitions | Single mask-wipe transition across all route changes. One pattern. No exceptions. |

---

## 1. DESIGN TOKEN CONTRACT

### 1.1 Color Tokens
**Do not add new colors to tailwind.config.ts. Map everything to existing tokens.**

| Role | Tailwind Token | Hex | Usage |
|---|---|---|---|
| Brand orange (primary) | `primary` | `#ff923e` | ONE focal element per section. CTA buttons, eyebrow labels, hover states, inline highlights. |
| Orange hover/active | `primary-container` | `#f58220` | Button hover, active states only |
| Orange subtle tint | `surface-tint` | `#ff923e` at low opacity via `bg-surface-tint/10` | Section background tints sparingly |
| Light surface (default) | `surface` / `background` | `#f7f7f5` | Light-theme section backgrounds |
| Dark surface (primary) | `surface-dim` | `#0e0e0e` | Dark section backgrounds |
| Dark surface (secondary) | `inverse-surface` | `#111827` | Admin, footer, nav when dark |
| Primary text (dark) | `on-background` | `#111827` | All body text on light surfaces |
| Primary text (light) | `inverse-on-surface` | `#f9fafb` | All body text on dark surfaces |
| Muted text | `on-surface-variant` | `#4b5563` | Secondary body text, meta, captions |
| Borders | `outline-variant` | `#d1d5db` | Light-theme borders and dividers |
| Dark borders | `on-background` at low opacity | — | Use `border-on-background/20` on dark sections |

**Color discipline rules:**
- `tertiary` / `tertiary-fixed` (`#ffd162`) — NEVER use. These yellows are not part of the brand visual system.
- `error` / `error-container` — ONLY in form validation states. Never decorative.
- `secondary` (`#6b7280`) — body text only, never backgrounds.
- Never hardcode any hex value in any component. Always use the Tailwind token class.

### 1.2 Typography Scale
**Font families are loaded via Next.js `localFont` or `next/font/google` and injected as CSS variables. Already configured in tailwind.config.ts — do not change font assignments.**

```
font-headline → var(--font-space-grotesk)   ← ALL display text, headings, labels
font-body     → var(--font-manrope)         ← ALL body copy, UI text, form inputs
font-label    → var(--font-manrope)         ← Same as body — used for small labels/meta
```

Type scale (add as custom `fontSize` entries in tailwind.config.ts `extend`):
```
display-xl:   clamp(72px, 10vw, 140px) / weight 800 / uppercase / tracking-tighter  → font-headline
display-lg:   clamp(48px, 7vw, 96px)  / weight 800 / uppercase / tracking-tight     → font-headline
headline:     clamp(32px, 4vw, 56px)  / weight 700 / tracking-tight                 → font-headline
title:        clamp(20px, 2.5vw, 32px)/ weight 600                                  → font-headline
body-lg:      18px / weight 400 / leading-relaxed                                   → font-body
body:         16px / weight 400 / leading-normal                                    → font-body
label:        11px / weight 600 / uppercase / tracking-widest                       → font-label
```

**Typography rules:**
- `font-headline` (Space Grotesk) is used for ALL display text. Its geometric structure works for both large uppercase display and smaller UI labels.
- `font-body` (Manrope) handles all reading text. Never use it for hero headings.
- Never import Google Fonts, system fonts, or any other font family.
- Weight 800 uppercase headlines are the primary visual differentiator — do not soften to 700 on display-xl or display-lg sizes.

### 1.3 Spacing Rhythm
```
section-pad-y:    120px (desktop) / 80px (tablet) / 60px (mobile)
content-max-w:    1280px
gutter:           48px (desktop) / 24px (mobile)
grid-gap:         24px standard / 16px tight
```

### 1.4 Border Radius System
**Already defined in tailwind.config.ts. Do not change these values.**

```
rounded         → 0.125rem  (2px)   ← Default. Sharp corners. Used on almost everything.
rounded-lg      → 0.25rem   (4px)   ← Subtle rounding. Badges, tags, small chips only.
rounded-xl      → 0.5rem    (8px)   ← Input fields, dropdowns.
rounded-full    → 0.75rem   (12px)  ← Pill buttons only. Use sparingly.
```

**Radius discipline:** The near-square default (`0.125rem`) is intentional — it reinforces the sharp, editorial brand aesthetic. Never round cards, images, or section containers. If in doubt, use `rounded` (default) or no rounding at all.

### 1.5 Tailwind Config — Permitted Additions Only
Only add the following to `tailwind.config.ts` under `theme.extend`. Do not touch anything else in the config.

```typescript
fontSize: {
  'display-xl': ['clamp(72px, 10vw, 140px)', { lineHeight: '0.95', fontWeight: '800', letterSpacing: '-0.03em' }],
  'display-lg': ['clamp(48px, 7vw, 96px)',   { lineHeight: '1.0',  fontWeight: '800', letterSpacing: '-0.02em' }],
  'headline':   ['clamp(32px, 4vw, 56px)',   { lineHeight: '1.1',  fontWeight: '700', letterSpacing: '-0.01em' }],
  'title':      ['clamp(20px, 2.5vw, 32px)', { lineHeight: '1.2',  fontWeight: '600' }],
  'body-lg':    ['18px', { lineHeight: '1.7', fontWeight: '400' }],
  'label-sm':   ['11px', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.15em' }],
},
spacing: {
  'section-y':    '120px',
  'section-y-md': '80px',
  'section-y-sm': '60px',
  'content-max':  '1280px',
  'gutter':       '48px',
  'gutter-sm':    '24px',
},
### 1.6 The BHEARD Watermark Device
Every page uses a large ghosted brand word behind the section heading. On the homepage it's "BHEARD". On inner pages it maps to a page-specific word:
```
Brand Solutions page  → "BRAND"
Tech Solutions page   → "BUILD"
About page            → "STORY"
Success Stories       → "PROOF"
Blog                  → "THINK"
Careers               → "JOIN"
Contact               → "TALK"
```
This watermark sits at 4–6% opacity, using the display-xl token, and never competes with the heading above it.

### 1.7 Image & Visual Strategy (Four-Tier System)

This is the most important section for making BHeard look like a premium agency and not a template site. Every image on every page must be assigned to one of these four tiers before it is implemented. If an image doesn't fit a tier, it doesn't go on the site.

---

#### TIER 1 — Editorial B&W: Hero Anchors and Section Statements
**Where used:** Homepage hero, page heroes, Brand Solutions pinned service panels, About page portrait, case study cover images, Success Story detail page opening visual.

**What these images are:**
High-contrast, compositionally strong black-and-white photography. Not desaturated colour photos — properly shot or sourced B&W editorial work. These are the images that define BHeard's visual identity.

**What to look for / brief for:**
- Hands in motion (designer at work, hands on keyboard, hands holding print)
- Architectural details and geometry (staircases, grids, facade textures)
- People in purposeful motion, not posed (walking, focused, mid-action)
- Close-up textures with strong light and shadow (paper grain, fabric, concrete)
- Empty spaces with strong composition (a desk, a studio, a corridor)

**What to avoid absolutely:**
- Smiling people looking at cameras
- Generic office environments
- Laptop-on-desk clichés
- Any image that could appear on a stock site without modification

**Technical spec:** Minimum 2400px wide. High contrast — blacks should be near-black, not grey. Saved as optimised WebP. Alt text always provided.

**CSS treatment:** Rendered natively as B&W. No CSS filter needed if properly sourced. If converting a colour image: `filter: grayscale(100%) contrast(1.1)` applied via a shared utility class `img-editorial`. Never inline the filter style.

---

#### TIER 2 — Colour Work Mockups: Client Deliverables Inside Frames
**Where used:** Selected Works bento grid (homepage), Brand Solutions selected work section, Tech Solutions selected builds, Success Story detail visual showcase sections.

**What these images are:**
Screenshots, renders, or photographs of actual BHeard client work — shown inside device frames, on surfaces, or as large flat compositions. The colour in these images comes entirely from the client's brand and deliverables. BHeard's surrounding page stays controlled.

**Mockup types to use:**
- Browser window frames (for websites and web apps) — minimal, dark-bordered, no OS chrome
- Phone frames (for mobile apps and social content) — single device, straight-on, no angled perspective renders
- Flat lay photography (for print work, brand identity, packaging) — clean surface, natural light, straight-on
- Billboard/OOH mockups (for campaign work) — environmental, real locations preferred
- Social media grid screenshots (for content work) — consistent frame, no notifications visible

**Colour discipline inside mockups:**
- The client's colours are visible inside the frame. They do not bleed into the page.
- The mockup frame itself is always dark (`#111827`) or transparent-on-white.
- Never float a colourful image without a frame. It will break the page's colour control.
- On hover: `useHoverLift` — the frame lifts 8px with a subtle shadow. The colour inside becomes the visual reward for interaction.

**Technical spec:** Minimum 1600px wide for full-bleed mockup images. Mockup frames are SVG or CSS-generated — never raster PNGs of device frames. Saved as optimised WebP.

---

#### TIER 3 — Textured Backgrounds: Depth Without Noise
**Where used:** CTA sections, dark section backgrounds that need visual richness, the homepage CTA orange block, section transitions that feel too flat.

**What these are:**
Subtle texture layers applied to section backgrounds to prevent flat solid colours from feeling empty. These are never the focal point — they are atmosphere.

**Three approved texture treatments:**

**Treatment A — Grain overlay (most used):**
A fine noise texture at 3–6% opacity over any solid background colour. Implemented as a pseudo-element (`::after`) with an SVG noise filter or a repeating PNG grain tile. Makes dark sections feel tactile instead of digital-flat.

```css
/* Grain overlay utility — add to globals.css */
.bg-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/textures/grain.png');
  background-repeat: repeat;
  background-size: 200px 200px;
  opacity: 0.04;
  pointer-events: none;
  z-index: 1;
}
```

**Treatment B — Orange-graded abstract photography:**
A close-up abstract photograph (concrete texture, paper, fabric, liquid) with a strong orange colour grade applied (`mix-blend-mode: multiply` over an orange base, or shot with warm lighting). Used sparingly — maximum once per page, on the primary CTA section or a featured section background.

**Treatment C — Dark editorial photography as background:**
A high-contrast B&W photograph used as a section background at 15–25% opacity (heavily dimmed), with text sitting clearly on top. Only used on dark-theme sections. The image provides depth, not content. Never used on light sections.

**What to never do with textures:**
- Never use pattern libraries or CSS-generated geometric patterns
- Never use gradient meshes or purple/blue gradients (off-brand)
- Never use a texture that calls attention to itself

---

#### TIER 4 — Lottie / SVG Motion Graphics: Brand-Coloured Animation
**Where used:** Brand Solutions pinned panel right-side visuals (where a real photograph isn't available or appropriate), Tech Solutions capability overview visual accents, Blog post featured illustrations if no photo exists.

**What these are:**
Abstract animated visuals built strictly in brand colours (black `#0e0e0e`, white `#f7f7f5`, orange `#ff923e`). These replace photography when the concept being illustrated is abstract (strategy, systems, performance, architecture).

**Lottie sourcing rules:**
- Source from LottieFiles only. Search for abstract/minimal/geometric animations.
- Before using: check that the animation uses only neutral colours OR can be recoloured to brand palette.
- If a Lottie contains green, blue, purple, or pink — do not use it. Recolour in Adobe After Effects or reject it.
- Animation speed: all Lottie playback slowed to 60–70% of default speed. Fast animations feel cheap.
- Loop: yes, but only while in viewport. Pause when scrolled out of view (use Intersection Observer).

**SVG illustration rules:**
- Any decorative SVG element (line art, abstract shapes, dividers) uses only brand tokens.
- Never use icon packs as decorative elements. Every SVG should be purpose-built.
- Line weight: 1–1.5px for fine details, 2px for structural lines. Nothing thicker unless intentional.

---

#### Image Quality Benchmark — Reference Sites
Before sourcing or approving any image, ask: "Would this image look at home on one of these sites?"

- **Instrument** (instrument.com) — editorial B&W, high contrast, purposeful composition
- **Koto** (koto.studio) — vibrant work mockups, controlled colour in frames
- **Wolff Olins** (wolffolins.com) — strong typography-led visuals, minimal photography
- **Ueno** (ueno.co, archived) — colour work shown in clean mockup frames, B&W editorial portraits
- **Superside** (superside.com) — colour work shown systematically, dark page backgrounds
- **Fantasy** (fantasy.co) — device mockups with colour work, monochrome editorial photography

If the answer is no — the image doesn't belong on BHeard.

---

#### Image Component Rules (for Cursor)
All images must be rendered through Next.js `<Image>` component. Never a raw `<img>` tag.

```tsx
// Tier 1 — Editorial B&W
<Image src={src} alt={alt} className="img-editorial" ... />
// img-editorial applies: filter: grayscale(100%) contrast(1.1)

// Tier 2 — Work Mockup (colour, inside frame)
<div className="mockup-frame">
  <Image src={src} alt={alt} ... />
</div>
// mockup-frame: dark border, subtle shadow, no filter

// Tier 3 — Background texture
// Never use <Image> for grain — use CSS pseudo-element only
// For bg photo at low opacity: use as CSS background-image, not <Image>

// Tier 4 — Lottie
import Lottie from 'lottie-react'
// Always: loop={true}, rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
// Always: pause when not in viewport
```

---

## 2. MOTION SYSTEM (CENTRAL — REUSABLE HOOKS ONLY)

**File location:** `components/system/motion/`

Build these hooks once. Reference them everywhere by name. Never write inline GSAP in page components.

### Hook Catalog

| Hook | Trigger | Use Case |
|---|---|---|
| `useFadeUpScrub(ref, distance?)` | ScrollTrigger scrub | Section headings, body paragraphs entering viewport |
| `useStaggerReveal(containerRef, childSelector)` | ScrollTrigger once | Grid items, list items, logo strips |
| `useParallaxScroll(ref, speed?)` | ScrollTrigger scrub | Background images, watermark text, decorative elements |
| `useTextSplitReveal(ref)` | ScrollTrigger once | Hero headlines, large display text (splits by word) |
| `useMaskReveal(ref)` | ScrollTrigger once | Images revealing behind a sliding mask (left→right) |
| `useLineDraw(ref)` | ScrollTrigger scrub | SVG lines, timeline connectors, dividers |
| `useHoverParallax(ref)` | Mouse move | Cards, images responding to cursor position |
| `useHoverLift(ref)` | Mouse enter/leave | CTA buttons, project cards on hover |
| `usePinnedSection(ref, panels)` | ScrollTrigger pin | Services storytelling sections (pin + panel swap) |
| `useCountUp(ref, target)` | ScrollTrigger once | Metrics / results numbers in case studies |
| `useHorizontalScroll(ref)` | ScrollTrigger scrub | Tech stack logos, horizontal card tracks |

### Global Motion Rules
- All scroll animations use `scrub: 1` unless it's a one-shot reveal (use `once: true` instead)
- Easing standard: `power2.out` for reveals, `power3.inOut` for transitions
- Reduced motion: all hooks must check `window.matchMedia('(prefers-reduced-motion: reduce)')` and skip GSAP if true
- Never animate `width`, `height`, or `margin`. Only `transform` and `opacity`.
- Pin sections sparingly — max 1 per page, max 4 panels inside it

### Page Transition (Single Pattern)
```
Route change → overlay panel slides in from bottom (black, 0.4s)
              → new page mounts underneath
              → overlay panel slides out upward (0.4s)
              → page hero animates in
```
Implement once in `app/(site)/layout.tsx`. Never per-page.

---

## 3. REUSABLE UI PRIMITIVES

**File location:** `components/system/`

### `<SectionShell>`
Props: `theme` (light|dark), `padY` (default|tight|flush), `watermark?` (string)
- Handles section padding, background color, and watermark rendering
- All sections on all pages use this wrapper. No raw `<section>` tags with hardcoded padding.

### `<SectionHeading>`
Props: `eyebrow?` (label text), `heading` (string), `subtext?` (string), `align` (left|center)
- Eyebrow: label token, `text-primary`, uppercase, letter-spaced
- Heading: headline token, rendered with `useTextSplitReveal` by default
- Max 2 lines. If longer, reduce font size.

### `<InnerPageHero>`
Props: `watermark` (string), `heading` (string), `subtext?` (string), `theme` (light|dark)
- Used by every inner page except homepage
- Heading animates with `useTextSplitReveal`
- Watermark animates with `useParallaxScroll`
- Never has a background image — typography only

### `<ContentCard>`
Props: `type` (project|story|blog|job), `image?`, `eyebrow`, `title`, `meta?`, `href`
- Project type: **Tier 2 mockup image** (colour work inside dark frame) top, `text-primary` eyebrow tag, bold title, hover uses `useHoverLift`. On hover, the frame lifts and the colour inside becomes the visual reward.
- Story type: Same Tier 2 mockup image, but outcome metric overlaid at bottom of image in a dark strip.
- Blog type: No image. Category tag + date + read time meta only.
- Job type: No image. Department tag + location/type meta only.

### `<BentoGrid>`
Props: `items[]`, `variant` (2col|3col|asymmetric)
- Asymmetric variant: one large cell (2×2) + smaller cells around it (used on homepage, Brand Solutions)
- 2col: equal split (used on Tech Solutions capabilities)
- 3col: uniform grid (used on Blog listing)

### `<PinnedStorySection>`
Props: `panels[]` (each: heading, body, visual, visualType)
- Pins the container while panels swap on scroll
- Left side: text content (heading + body)
- Right side: `visualType` determines the treatment:
  - `"editorial"` → Tier 1 B&W image with `img-editorial` class and `useMaskReveal`
  - `"lottie"` → Tier 4 brand-coloured Lottie animation (for abstract services like strategy/systems)
  - `"mockup"` → Tier 2 work mockup inside dark frame (for services where real output exists)
- Used on Brand Solutions and Tech Solutions only

### `<ProcessTimeline>`
Props: `steps[]` (each: number, title, description)
- Horizontal on desktop, vertical on mobile
- Line draws between steps using `useLineDraw`
- Steps stagger in using `useStaggerReveal`

### `<MetricsRow>`
Props: `metrics[]` (each: value, label)
- Used inside case study detail pages
- Numbers animate with `useCountUp` on viewport entry

### `<MotionWrapper>`
Props: `animation` (fadeUp|maskReveal|stagger), `delay?`
- Generic wrapper when a hook doesn't need its own component
- Used for one-off elements that need entrance animation

---

## 4. PAGE-BY-PAGE ARCHITECTURE

---

### PAGE 1: HOMEPAGE (`app/page.tsx`)
**Status: Structure complete. Do not restructure. Only refactor to use system primitives.**

#### What needs to change on the existing homepage:
1. Replace inline GSAP with motion hooks
2. "SPLIT BENTO GRID" label → replace with a real brand statement heading
3. Services section → replace plain text list with styled editorial links (larger, with a right-arrow and `text-primary` hover state)
4. Client logos section → add fade-mask edges + auto-scroll using `useHorizontalScroll`
5. About section preview → add a concrete 2–3 line positioning statement, not just the name
6. CTA block → add a specific headline ("Ready to be heard?") + one-line subtext + grain texture overlay (Tier 3, Treatment A)
7. **Selected Works grid** → switch from B&W images to **Tier 2 mockup images** (colour client work inside dark device/browser frames). This is the homepage's primary colour moment — let the work speak.
8. **Hero** → remains Tier 1 B&W editorial. The contrast between the B&W hero and the colour work grid below creates a deliberate visual shift as users scroll.

#### Animations to lock in on homepage:
- Hero: `useTextSplitReveal` on main headline, `useParallaxScroll` on "BHEARD" watermark
- Services: `useFadeUpScrub` on section entry
- Bento grid: `useStaggerReveal` on grid cells, `useHoverLift` + `useHoverParallax` on each cell
- Selected Works: `useMaskReveal` on each project image as it enters viewport
- About preview: `useFadeUpScrub`
- CTA: `useFadeUpScrub` on heading

---

### PAGE 2: BRAND SOLUTIONS (`app/(site)/services/brand-solutions/page.tsx`)
**Emotional intent: The visitor should feel they've found an agency that thinks, not just executes.**

#### Section 1 — Hero
- Component: `<InnerPageHero watermark="BRAND" />`
- Heading: "WHERE STRATEGY MEETS VISUAL LANGUAGE."
- Subtext: One sentence. What BHeard does differently, not what branding is.
- Theme: Light (white bg)
- Animation: `useTextSplitReveal` on heading, `useParallaxScroll` on watermark

#### Section 2 — Positioning Statement (CONTEXT)
- Layout: Full-width, single large paragraph. No columns. No images.
- This is an editorial statement — 3–4 lines of opinionated copy about why most brands fail to be heard and what BHeard does about it.
- Font: display-lg, weight 400 (not bold — contrast with the hero)
- Animation: `useFadeUpScrub` word by word (not letter by letter — too slow)
- Theme: Dark (black bg, white text)
- Orange: highlight one key phrase inline using `<span class="text-primary">`

#### Section 3 — Services Breakdown (CAPABILITY) — PINNED
- Component: `<PinnedStorySection>`
- Layout: Pin the section. Left panel = service name + description + deliverables list. Right panel = visual keyed to service type.
- 5 panels — visual type per panel:
  1. **Brand Strategy** → `visualType="lottie"` — abstract Lottie showing nodes/connections in brand colours (strategy = systems thinking)
  2. **Visual Identity** → `visualType="mockup"` — Tier 2: a brand guideline spread or logo system shown flat-lay
  3. **Campaign Design** → `visualType="mockup"` — Tier 2: a billboard or social campaign shown in real environment mockup
  4. **Content Systems** → `visualType="mockup"` — Tier 2: a social media grid screenshot in phone frame
  5. **Graphic Design** → `visualType="editorial"` — Tier 1: B&W close-up of print materials (hands holding printed piece)
- Each panel transition: previous text fades out, new text fades up (`useFadeUpScrub`). Right visual: `useMaskReveal` on each swap.
- Pinned scroll: `usePinnedSection`

#### Section 4 — Process (HOW WE WORK)
- Component: `<ProcessTimeline>`
- 4 steps: Discover → Define → Design → Deliver
- Each step has a short sharp description (2 lines max)
- Layout: Horizontal on desktop. The timeline line draws as user scrolls.
- Animation: `useLineDraw` + `useStaggerReveal`
- Theme: Light

#### Section 5 — Selected Brand Work (PROOF)
- Component: `<BentoGrid variant="asymmetric">`
- Show 4 brand-specific projects from Selected Works
- **Image type: Tier 2 mockups** — all images are colour client work inside frames. This section is the visual proof of capability. Let the work's colour do the work.
- Animation: `useMaskReveal` on images, `useHoverLift` on cards (lifts the frame, reveals colour fully)
- Theme: Dark background — the dark surface makes the colour mockups pop without competing with page chrome

#### Section 6 — One Featured Case Highlight (DEPTH)
- Layout: Split. Left: **Tier 1 B&W editorial image** (hands, process, or space from the project) with `useParallaxScroll`. Right: project name, problem in one sentence, outcome in one sentence, link to full story.
- The B&W here is intentional contrast — Section 5 showed the colourful output, Section 6 shows the human process behind it.
- This is NOT a card. It is a large editorial block. The image takes 50% of the viewport width.
- Theme: Dark

#### Section 7 — CTA
- Heading: "Let's build something that lasts."
- One button. No noise.
- Theme: Orange background, black text

---

### PAGE 3: TECH SOLUTIONS (`app/(site)/services/tech-solutions/page.tsx`)
**Emotional intent: Confidence without noise. The visitor should feel capability, not hustle.**
**Critical constraint: Do NOT mention the internal tech business by name. Position this as BHeard's technical arm — a capability, not a separate company.**

#### Section 1 — Hero
- Component: `<InnerPageHero watermark="BUILD" />`
- Heading: "ENGINEERED TO PERFORM. BUILT TO SCALE."
- Subtext: One sentence. Focus on outcomes (speed, reliability, conversion), not technologies.
- Theme: Dark
- Animation: `useTextSplitReveal`, `useParallaxScroll` on watermark

#### Section 2 — Capability Overview (CONTEXT)
- Layout: 2×2 grid of capability blocks (not cards — full-bleed grid cells with large numbers)
- Each cell: large numeral (01, 02, 03, 04) + capability title + 2-line description
  1. **Web Applications** — Custom-built, performance-first web apps and platforms
  2. **Mobile Development** — iOS and Android apps with native-quality experience
  3. **Integrations & Automation** — CRMs, ERPs, payment gateways, API ecosystems
  4. **E-Commerce & D2C** — End-to-end store builds, conversion optimization, retention systems
- Animation: `useStaggerReveal` on cells
- Theme: Dark, thin white borders between cells

#### Section 3 — How We Build (PROCESS)
- Layout: Horizontal scroll track. 5 cards on a horizontal axis.
- Each card: Step number + title + short description
  1. Discovery & Architecture
  2. Design System & Prototyping
  3. Development Sprints
  4. QA & Performance Audit
  5. Launch & Monitoring
- Animation: `useHorizontalScroll` — the track scrolls horizontally as user scrolls vertically
- Theme: Light

#### Section 4 — Tech Stack
- Layout: Clean grid of tech logos. 4 columns. Logos grayscale, on hover turn to original color briefly.
- Groups: Frontend (Next.js, React, TypeScript), Backend (Node.js, Prisma, MySQL), Mobile (React Native), Infrastructure (cPanel, PM2, Nginx)
- Animation: `useStaggerReveal`
- Theme: Dark, subtle

#### Section 5 — Selected Builds (PROOF)
- Component: `<BentoGrid variant="2col">`
- Show tech-tagged projects only
- Animation: `useMaskReveal`, `useHoverLift`
- Theme: Light

#### Section 6 — CTA
- Heading: "Have a product in mind?"
- Subtext: "We scope, build, and ship."
- Theme: Black bg, orange CTA button

---

### PAGE 4: SUCCESS STORIES — LISTING (`app/(site)/stories/page.tsx`)
**Emotional intent: Every card should feel like the first line of a thriller. The visitor wants to keep reading.**

#### Section 1 — Hero
- Component: `<InnerPageHero watermark="PROOF" />`
- Heading: "RESULTS THAT SPEAK FIRST."
- Subtext: "Every project starts with a real problem. Here's what happened when we solved them."
- Theme: Light

#### Section 2 — Stories Grid
- Layout: Masonry-style grid, 2 columns. Cards are tall, image-led.
- Each card:
  - B&W project image (full card top)
  - Orange eyebrow tag (industry: Hospitality / D2C / Education / etc.)
  - Project title (bold, 2 lines max)
  - One-line outcome teaser ("Scaled from 0 to 12,000 monthly leads in 4 months.")
  - "Read story →" link
- Animation: `useStaggerReveal` on grid load, `useHoverLift` on each card, `useMaskReveal` on images
- No filter tabs on initial build. Add category filter in v2.
- Theme: Light

#### Section 3 — CTA
- Heading: "Working on something similar?"
- Simple, no noise
- Theme: Dark

---

### PAGE 5: SUCCESS STORY DETAIL (`app/(site)/stories/[slug]/page.tsx`)
**Emotional intent: Cinematic. This page should feel like reading a case study in a premium design magazine.**

#### Section 1 — Hero
- Layout: Full viewport height. Large project title (display-xl). Orange eyebrow (industry + service type). Small meta row: client, year, services delivered.
- No image in the hero. Typography only.
- Watermark: the client's industry keyword (e.g., "HOSPITALITY")
- Animation: `useTextSplitReveal` on title

#### Section 2 — Cover Visual
- **Tier 1 B&W editorial image.** Full-width. No padding. Edge to edge.
- `useMaskReveal` — image reveals left to right behind a sliding black mask as user scrolls into it.
- This is the first image the user sees. It must be the strongest one — a moment from the project, the client's environment, or a process shot. Never a generic stock image.

#### Section 3 — The Brief (PROBLEM)
- Layout: Split. Left: large label "THE BRIEF" in `text-primary`. Right: 2–3 paragraph description of the client's situation and challenge.
- Theme: Light
- Animation: `useFadeUpScrub` on the right-side text

#### Section 4 — The Approach (SOLUTION)
- Layout: Full-width dark section. Single large paragraph. No columns.
- **Tier 3 Treatment A** grain texture on the dark background — this section needs atmosphere, not images.
- Same editorial treatment as Brand Solutions positioning statement — opinionated, specific, not generic.
- Theme: Dark
- Animation: `useFadeUpScrub` word by word

#### Section 5 — Visual Showcase
- 2–3 images stacked vertically with generous spacing. **Mixed tier approach for visual rhythm:**
  - First image: **Tier 2 mockup** — the primary deliverable (website in browser frame, app in phone frame, campaign on billboard). Full-bleed width. This is the colour moment.
  - Second image: **Tier 1 B&W editorial** — constrained to content width. Process, people, or environment. Creates contrast with the colour mockup above.
  - Third image (if available): **Tier 2 mockup** — secondary deliverable or detail shot. Constrained width.
- Each image: `useParallaxScroll` — moves slightly slower than scroll speed

#### Section 6 — Outcomes (PROOF)
- Component: `<MetricsRow>`
- 3–4 metrics. Large numerals. One-line label beneath.
- Example: "340%" / "Increase in organic reach" | "4 months" / "From brief to launch" | "₹0" / "Paid media spend"
- Animation: `useCountUp` on each number
- Theme: Dark, **Tier 3 Treatment A** grain overlay

#### Section 7 — Next Story
- Layout: Full-width. Left half: current story title (faded). Right half: next story title (bold) with arrow.
- Hover: right side image previews with `useHoverParallax`
- This replaces a generic "related stories" section with something that feels editorial

---

### PAGE 6: BLOG LISTING (`app/(site)/blog/page.tsx`)
**Emotional intent: Thoughtful. This is where BHeard shows it has a point of view, not just services.**

#### Section 1 — Hero
- Component: `<InnerPageHero watermark="THINK" />`
- Heading: "PERSPECTIVES ON BRAND & BUILD."
- Subtext: Short. One sentence about why BHeard writes — not to rank, but to think out loud.
- Theme: Dark

#### Section 2 — Featured Post
- Layout: Full-width card. Large B&W image left (60%). Title, category, date, excerpt right (40%).
- This is always the latest post. Not a carousel.
- Animation: `useMaskReveal` on image, `useFadeUpScrub` on text

#### Section 3 — Post Grid
- Component: `<BentoGrid variant="3col">`
- Each card: category tag (orange), title, date + read time, excerpt (2 lines)
- No author photos. Clean, editorial.
- Animation: `useStaggerReveal`
- Theme: Light

#### Section 4 — CTA
- "Have a topic you want us to cover?" + email link
- Minimal. No buttons.

---

### PAGE 7: BLOG DETAIL (`app/(site)/blog/[slug]/page.tsx`)
**Emotional intent: Clean reading experience. Animations step back completely here.**

#### Section 1 — Hero
- Layout: Constrained width (700px max). Category (orange label), large title, date + read time.
- No background image. No watermark.
- Theme: Light

#### Section 2 — Content
- Markdown rendered with Tailwind Typography (`prose` class)
- Max width: 700px, centered
- Code blocks: dark themed
- Pull quotes: large, orange left border, display-lg font
- Images: full-width within the content column, `useMaskReveal` on each

#### Section 3 — Related Posts
- 2 posts. Side by side. Minimal cards (title + category only).
- No images. Clean.

---

### PAGE 8: CAREERS LISTING (`app/(site)/careers/page.tsx`)
**Emotional intent: Culture-first. The visitor should feel they want to be part of this, before they see the job titles.**

#### Section 1 — Hero
- Component: `<InnerPageHero watermark="JOIN" />`
- Heading: "WE HIRE PEOPLE, NOT RESUMES."
- Subtext: One sharp sentence about the kind of person who thrives at BHeard.
- Theme: Dark

#### Section 2 — Culture Statement
- Layout: Full-width. Single large paragraph. Editorial.
- 3–4 sentences about how BHeard works — async, ownership, taste over process.
- Animation: `useFadeUpScrub`
- Theme: Light

#### Section 3 — Open Roles
- Layout: Clean list. Not cards. Each role is a full-width row:
  - Left: Role title (title token) + department (label token, orange)
  - Right: Location/type (Remote / Hybrid / On-site) + "Apply →" link
  - Thin border bottom. Hover: row background shifts subtly to orange-tint.
- Animation: `useStaggerReveal`
- If no open roles: show "Nothing right now, but we're always open to great people." + email link.

#### Section 4 — CTA
- Heading: "Don't see your role?"
- "Send us your work anyway." + email

---

### PAGE 9: CAREERS DETAIL (`app/(site)/careers/[slug]/page.tsx`)

#### Structure:
- Hero: Role title + department (no watermark here — keep it functional)
- Two columns: Left (sticky): role meta (type, location, team, level). Right: full job description in `prose`.
- At bottom: simple apply form (name, email, portfolio link, message) — no file upload on v1.
- No heavy animation. This is a functional page.

---

### PAGE 10: ABOUT (`app/(site)/about/page.tsx`)
**Emotional intent: Personal and opinionated. The visitor should feel they understand exactly who built this company and why.**

#### Section 1 — Hero
- Component: `<InnerPageHero watermark="STORY" />`
- Heading: "BUILT FOR BRANDS THAT DESERVE TO BE HEARD."
- Subtext: None. The heading is enough.
- Theme: Light

#### Section 2 — Philosophy Statement
- Layout: Full-width. Single large paragraph (3–4 sentences).
- This is the founder's voice. Opinionated. Specific. No corporate language.
- Example structure: "Most agencies execute. We think first. [Why BHeard exists]. [What we believe about brand and build]. [What we refuse to do]."
- Animation: `useFadeUpScrub` word by word
- Theme: Dark, `text-primary` highlight on one key phrase

#### Section 3 — The Two Sides
- Layout: Split. Left: Brand Solutions (heading + 3-line description). Right: Tech Solutions (heading + 3-line description). Thin divider between them.
- This is NOT a services list. It is a positioning statement about why BHeard does both.
- Animation: Left side `useFadeUpScrub` from left. Right side from right.
- Theme: Light

#### Section 4 — Founder / Team (Optional on v1)
- Layout: **Tier 1 B&W editorial portrait** (full height, left — `useMaskReveal`). Right: name, title, 2–3 line bio, and one quote in display font.
- Portrait treatment: high contrast B&W, not a corporate headshot. Environmental or mid-action preferred.
- If team photo not ready: skip and replace with a "We're a small team with big opinions." editorial block with a **Tier 3 Treatment A** grain texture on the dark background.
- Animation: `useMaskReveal` on image, `useFadeUpScrub` on text

#### Section 5 — Values
- Layout: NOT cards. 4 statements in large type, stacked vertically. Each one is a single sentence.
  1. "We don't start with deliverables. We start with problems."
  2. "Creative work that can't be explained isn't creative — it's random."
  3. "The best brand is one your audience recognizes before they see your name."
  4. "We build things we're proud to put our name on."
- Each statement: `useFadeUpScrub` as it enters viewport
- Theme: Dark

#### Section 6 — Client Logos (Social Proof)
- Same auto-scroll component as homepage
- Theme: Light

#### Section 7 — CTA
- "We'd like to know your story too."
- One button: "Start a conversation"

---

### PAGE 11: CONTACT (`app/(site)/contact/page.tsx`)
**Emotional intent: Zero friction. The visitor has already decided. Don't slow them down.**

#### Section 1 — Hero
- Component: `<InnerPageHero watermark="TALK" />`
- Heading: "LET'S TALK."
- No subtext. No noise.
- Theme: Dark

#### Section 2 — Contact Layout
- Split. 50/50.
- Left: 3 pieces of information stacked:
  - Email (large, clickable)
  - Instagram handle
  - A single sentence: "We respond within 24 hours."
- Right: Form. Fields: Name, Email, What are you working on? (textarea), How did you find us? (select — optional but useful for tracking)
- Form style: Borderless inputs, only a bottom border. Black bg, white text. Orange focus state.
- Submit button: Full-width, orange, black text, "Send it →"
- Animation: `useFadeUpScrub` on left content, `useStaggerReveal` on form fields
- Theme: Dark

#### Section 3 — None.
No CTA after contact. No client logos. No blog posts. The page ends at the form.

---

## 5. BACKEND ARCHITECTURE

### 5.1 File Structure
```
lib/
  db/
    prisma.ts              ← Prisma client singleton
  services/
    blog.service.ts
    careers.service.ts
    stories.service.ts
    media.service.ts
  validators/
    blog.validator.ts
    careers.validator.ts
    stories.validator.ts
```

### 5.2 Prisma Models
```prisma
model BlogPost {
  id          Int       @id @default(autoincrement())
  slug        String    @unique
  title       String
  excerpt     String
  content     String    @db.LongText
  category    String
  readTime    Int
  published   Boolean   @default(false)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  seo         SEO?
}

model SuccessStory {
  id          Int       @id @default(autoincrement())
  slug        String    @unique
  clientName  String
  industry    String
  services    String    // comma-separated tags
  brief       String    @db.Text
  approach    String    @db.Text
  outcome     String    @db.Text
  metrics     Json      // [{value, label}]
  coverImage  String    // path in /public/uploads
  images      Json      // [paths]
  published   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  seo         SEO?
}

model Career {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  title       String
  department  String
  type        String   // Full-time / Part-time / Contract
  location    String   // Remote / Hybrid / On-site
  description String   @db.LongText
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model MediaAsset {
  id        Int      @id @default(autoincrement())
  filename  String
  path      String
  alt       String?
  usedIn    String?
  createdAt DateTime @default(now())
}

model SEO {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  ogImage     String?
  blogPostId  Int?     @unique
  storyId     Int?     @unique
  blogPost    BlogPost? @relation(fields: [blogPostId], references: [id])
  story       SuccessStory? @relation(fields: [storyId], references: [id])
}
```

### 5.3 API Routes
```
app/api/
  blog/
    route.ts          GET (list, published only) | POST (admin create)
    [slug]/
      route.ts        GET (single) | PUT (admin update) | DELETE (admin)
  stories/
    route.ts          GET | POST
    [slug]/route.ts   GET | PUT | DELETE
  careers/
    route.ts          GET (active only) | POST
    [slug]/route.ts   GET | PUT | DELETE
  media/
    route.ts          POST (upload) | GET (list)
    [id]/route.ts     DELETE
```

---

## 6. ADMIN PANEL

**Route:** `app/admin/`
**Auth:** Simple session-based auth (email + password). No OAuth on v1.
**Style:** Same token system as site. Dark theme. Minimal animation (only `useFadeUpScrub` on page load).

### Modules:
```
app/admin/
  page.tsx              ← Dashboard (counts: posts, stories, careers, media)
  blog/
    page.tsx            ← List all posts (published + draft)
    new/page.tsx        ← Create post (markdown editor)
    [id]/page.tsx       ← Edit post
  stories/
    page.tsx            ← List all stories
    new/page.tsx        ← Create story (multi-section form)
    [id]/page.tsx       ← Edit story
  careers/
    page.tsx            ← List all roles
    new/page.tsx        ← Create role
    [id]/page.tsx       ← Edit role
  media/
    page.tsx            ← Upload + browse media assets
```

### Admin UI Rules:
- Reuse `<SectionShell>`, `<ContentCard>` — same primitives, different data
- Tables: clean, bordered, no zebra striping
- Forms: same borderless input style as contact form
- Markdown editor: integrate `@uiw/react-md-editor` (dark theme)
- Image upload: drag-and-drop, stores to `/public/uploads`, records in `MediaAsset`

---

## 7. IMPLEMENTATION ORDER

Do not skip phases. Do not work on Phase 3 while Phase 1 is incomplete.

### Phase 1 — Foundation (Do this first, nothing else)
1. `docs/design-system.md` — full token spec written and committed
2. `globals.css` — all CSS variables defined
3. `tailwind.config.ts` — semantic aliases mapped
4. `components/system/motion/` — all 11 hooks built and tested in isolation
5. `components/system/` — all 8 primitives built (`SectionShell`, `SectionHeading`, `InnerPageHero`, `ContentCard`, `BentoGrid`, `PinnedStorySection`, `ProcessTimeline`, `MetricsRow`, `MotionWrapper`)

### Phase 2 — Homepage Refactor
6. Refactor existing homepage to use system primitives + motion hooks
7. Replace all placeholder section labels with real headings
8. Fix client logo scroll, CTA copy, about section
9. QA: animation timing, mobile layout, reduced motion

### Phase 3 — Inner Page Templates
10. `app/(site)/layout.tsx` — nav, footer, page transition
11. Brand Solutions page — full build
12. Tech Solutions page — full build
13. About page — full build
14. Contact page — full build

### Phase 4 — Dynamic Pages (Listing + Detail)
15. Success Stories listing + detail
16. Blog listing + detail
17. Careers listing + detail

### Phase 5 — Backend
18. Prisma schema + `db.ts` singleton
19. Service layer + validators
20. All API routes
21. Media upload handler

### Phase 6 — Admin Panel
22. Auth (session)
23. Dashboard
24. Blog CRUD
25. Stories CRUD
26. Careers CRUD
27. Media manager

### Phase 7 — QA + Deployment
28. Visual QA pass (all pages, all breakpoints)
29. Animation audit (budget check, timing, reduced motion)
30. Performance audit (Lighthouse, image optimization, lazy loading)
31. cPanel Node app setup + PM2 config
32. Environment variables + production build test

---

## 8. QA GATES (NOTHING SHIPS WITHOUT PASSING THESE)

| Gate | Requirement |
|---|---|
| Animation budget | Max 4 animation types per page |
| No inline GSAP | Zero `gsap.to()` calls outside `components/system/motion/` |
| No color violations | Zero hardcoded hex values. Zero use of `tertiary`, `tertiary-fixed`, or `tertiary-dim` tokens. Zero non-brand decorative colors. |
| Image tier discipline | Every image traceable to a tier. No raw colour `<Image>` outside a mockup frame. No stock photography. No AI images. No Lottie with off-brand colours. |
| Mobile layout | Every page tested at 375px, 768px, 1280px, 1440px |
| Reduced motion | All animations disabled correctly on `prefers-reduced-motion` |
| Lighthouse score | Performance ≥ 85, Accessibility ≥ 90 |
| No placeholder text | Zero instances of "Lorem ipsum" or section labels like "SPLIT BENTO GRID" |
| Type safety | Zero TypeScript errors on build |
| API error handling | Every API route returns typed error responses |

---

## 9. THINGS CURSOR MUST NEVER DO

- Never import or use any font other than `var(--font-space-grotesk)` and `var(--font-manrope)`. These are already configured.
- Never use `font-sans`, `font-serif`, or any Tailwind default font utility — always use `font-headline`, `font-body`, or `font-label`.
- Never hardcode hex color values. Always use Tailwind token classes from the existing config.
- Never add new color keys to `tailwind.config.ts`. Only the permitted fontSize and spacing additions from Section 1.5 are allowed.
- Never use the `tertiary` color family (`#ffd162`, `#f8c229`). These yellows are not brand colors.
- Never use `framer-motion`. GSAP only.
- Never use a card layout where a split layout was specified.
- Never add icons (Heroicons, Lucide, FontAwesome) unless explicitly specified in this plan.
- Never use color photography as a raw `<Image>` outside a mockup frame. Colour images belong in Tier 2 frames only.
- Never apply `filter: grayscale()` inline. Use the `img-editorial` utility class only.
- Never source images from stock photography sites (Unsplash, Pexels, Shutterstock, Getty). All images are either client work, purpose-shot editorial, or approved Lottie animations.
- Never use AI-generated images. Not for placeholders. Not for anything.
- Never use a Lottie animation that contains colours outside the brand palette without recolouring it first.
- Never hardcode spacing values — always use the token system.
- Never add a section that isn't in this plan without flagging it first.
- Never use gradient backgrounds. Flat color surfaces only (black, white, orange).
- Never write marketing copy. Use the exact content structure defined per section.
- Never use `margin-top` or `margin-bottom` for section spacing — use `SectionShell`'s `padY` prop.
- Never generate a "testimonials" section. It is not in this plan.
