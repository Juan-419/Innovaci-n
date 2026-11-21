---
name: Normandia Mobile
colors:
  surface: '#fbf8fc'
  surface-dim: '#dcd9dd'
  surface-bright: '#fbf8fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f7'
  surface-container: '#f0edf1'
  surface-container-high: '#eae7eb'
  surface-container-highest: '#e4e1e6'
  on-surface: '#1b1b1e'
  on-surface-variant: '#554336'
  inverse-surface: '#303033'
  inverse-on-surface: '#f3f0f4'
  outline: '#887364'
  outline-variant: '#dbc2b0'
  surface-tint: '#904d00'
  primary: '#8d4b00'
  on-primary: '#ffffff'
  primary-container: '#b15f00'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb77d'
  secondary: '#a73a00'
  on-secondary: '#ffffff'
  secondary-container: '#fd651e'
  on-secondary-container: '#571a00'
  tertiary: '#006b2f'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e8642'
  on-tertiary-container: '#f7fff3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc3'
  primary-fixed-dim: '#ffb77d'
  on-primary-fixed: '#2f1500'
  on-primary-fixed-variant: '#6e3900'
  secondary-fixed: '#ffdbce'
  secondary-fixed-dim: '#ffb599'
  on-secondary-fixed: '#370e00'
  on-secondary-fixed-variant: '#7f2b00'
  tertiary-fixed: '#95f8a7'
  tertiary-fixed-dim: '#79db8d'
  on-tertiary-fixed: '#00210a'
  on-tertiary-fixed-variant: '#005323'
  background: '#fbf8fc'
  on-background: '#1b1b1e'
  surface-variant: '#e4e1e6'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 38px
    fontWeight: '700'
    lineHeight: 46px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-xl:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.875rem
  margin: 1.5rem
  margin-mobile: 1.25rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 1.75rem
  space-xl: 2.5rem
---

## Brand & Style

This design system is engineered specifically for non-digital native seniors and individuals who experience friction or anxiety with standard modern touch interfaces. The experience rejects ephemeral floating elements, cryptic iconography, and ambiguous flat click states in favor of hyper-legible, tactile physical metaphors.

The visual aesthetic unites **Neo-Tactile affordance** with **Warm Editorial Clarity**. Interfaces convey the grounded permanence of printed pocket guides, heritage appliances, and tactile mechanical controls:
- **Immediate Affordability:** Every interactive component resembles an operable physical toggle, key, or surfaced tile.
- **Calm, High-Contrast Reassurance:** High color contrast ratios exceeding WCAG AAA standards are softened using warm parchment undertones, eliminating harsh glare while retaining extreme separation of planes.
- **Physical Feedback Cues:** Interactions rely on downward mechanical depression states (displacing hard drop shadows to simulate real mechanical travel) so users never question whether an action was received.

## Colors

The palette establishes an organic, grounding baseline utilizing ivory paper tones contrasted sharply against deep graphite ink strokes, enriched by deliberate functional accents.

- **Background Canvas:** `#F7F4EB` (Warm Ivory) serves as the primary canvas, backed by `#FFFDF8` (Soft Cream) for raised card surfaces.
- **Structure & Text (Neutral):** Deep graphite `#18181B` delivers AAA contrast against ivory for all body text, icons, and 2px architectural borders. Secondary supporting text uses `#27272A`.
- **Primary Accent (Warm Amber):** `#D97706` is reserved for highlighted states, key interactive indicators, and primary callouts.
- **Secondary Accent (Terracotta):** `#EA580C` guides secondary focal actions, alerts, and vital warm indicators.
- **Tertiary (Forest Green):** `#15803D` exclusively commands confirmed, positive, safe, or success actions (e.g., "Confirm Order", "Call Caregiver", "Active").
- **Surface Elevation:** White and soft cream overlays never employ translucency; pure opaque layering prevents visual muddiness for aging retinas.

## Typography

Typography prioritizes immediate recognition and comfort over space compression. Space Grotesk injects structural character and distinctive glyph shapes into headers and button labels, preventing visual monotony. Inter is chosen for body text for its open counters, tall x-height, and superior legibility at larger display scales.

- **Strict Floor:** No critical interactive text or descriptive body copy drops below 17px. The minimum label size (`label-sm` at 14px) is strictly restricted to secondary badge counters or auxiliary timestamps.
- **Leading Ratio:** Line height is purposefully kept between 1.45x and 1.55x to prevent eye fatigue across multi-line passages for presbyopic vision.
- **Weight Strategy:** Headings and interactive buttons strictly utilize SemiBold (600) and Bold (700) weights to preserve stroke contrast against solid background fills. Thin and Light weights are forbidden.

## Layout & Spacing

The layout model is optimized for mobile touch ergonomics with heavy focus on single-handed thumb zones. 

- **Grid Strategy:** A single-column vertical stack governs mobile devices, expanding to a 4-column structured layout on small tablets and 8-column on larger screens. Gaps prioritize physical separation between interactive items over dense information packing.
- **Ergonomic Safety Zone:** Primary action triggers (like confirmation keys, step navigation, and phone dialers) reside pinned within the bottom 40% of the mobile viewport ("thumb reach area").
- **Spacing Principle:** Generous gaps (`space-md` of 1.25rem and `space-lg` of 1.75rem) surround cards to eliminate accidental edge taps and visual bleeding.

## Elevation & Depth

This system avoids blurred Gaussian shadows and subtle atmospheric tints, which can appear as smudges or unclear boundaries to visually impaired or elderly eyes. Instead, depth is conveyed through **Hard Neo-Tactile Physical Offsets** combined with consistent outlines:

- **Border Architecture:** All structural surfaces, cards, input frames, and buttons possess an unbroken `2px solid #18181B` border.
- **Resting Shadow Depth:** Resting interactive elements present a directional, crisp, unblurred drop shadow: `box-shadow: 4px 4px 0px #18181B`. High-importance cards use `box-shadow: 6px 6px 0px #18181B`.
- **Physical Press State:** When an element is pressed or activated, it mechanically shifts down and right by 3px (`transform: translate(3px, 3px)`), collapsing its shadow to `1px 1px 0px #18181B`. This provides instantaneous tactile affirmation of contact.
- **Static Containment:** Non-interactive containers rest flat with simple 2px borders or an ultra-low offset of 2px 2px 0px `#18181B`, immediately differentiating passive information from actionable widgets.

## Shapes

The shape system employs roundedness level `2`. Base interactive items use `0.5rem` (8px) corner curvature, with major surfaces using `1rem` (16px) and modal dialogs using `1.5rem` (24px).

- **Friendly Discipline:** The 8px and 16px corner radii eliminate brutalist harshness while retaining crisp, identifiable geometric bounds.
- **Pill Exception for Badges:** Status pills, switch toggles, and notification counters leverage fully circular caps (9999px) to contrast against rectangular cards and buttons.

## Components

### Buttons
- **Touch Target:** Minimum height of `60px` (desktop/tablet allows down to `56px`), with generous horizontal padding of `space-lg`.
- **Primary Button:** Background `#D97706` (or `#15803D` for affirmative actions), 2px solid `#18181B` border, text in `#FFFDF8` or `#18181B` (bold `label-lg`), resting shadow `4px 4px 0px #18181B`.
- **Secondary Button:** Background `#FFFDF8`, 2px solid `#18181B`, text in `#18181B`, resting shadow `4px 4px 0px #18181B`.
- **Active Behavior:** Translates `3px, 3px` on press with shadow reducing to `1px 1px 0px #18181B`.

### Cards & Tiles
- **Surface:** `#FFFDF8` surface over `#F7F4EB` canvas.
- **Stroke & Shadow:** Continuous 2px border `#18181B` with `4px 4px 0px #18181B` offset.
- **Padding:** Minimum `space-md` (1.25rem) to prevent content crowding along perimeter borders.

### Input Fields
- **Dimensions:** Minimum vertical height of `64px`.
- **Styling:** Inset `#FFFDF8` background with 2px solid `#18181B` perimeter. Typography fixed at `body-lg` (18px) to prevent iOS auto-zoom and preserve effortless reading.
- **Labels & Hints:** Labels sit prominently outside and above the input box (never floating inside) in bold `label-md`.

### Toggle Switches & Selection Controls
- **Toggle Switches:** Physical slot track (`64px x 36px`) with 2px black border, housing an oversized circular knob (`30px`) that translates cleanly across the track. Active state fills with `#15803D`.
- **Checkboxes & Radios:** Scaled to a massive `32px x 32px` touch box with a dedicated 2px border. Selected checkboxes feature a bold 3px `#18181B` checkmark on an amber or green field.

### Chips & Badges
- **Status Pills:** Fully rounded (pill), 2px solid `#18181B`, colored dynamically based on status (e.g., `#15803D` with pure white text for active/completed, `#EA580C` for pending alerts).
- **Interactive Filter Chips:** Height of `48px`, toggling between `#FFFDF8` and filled `#D97706` with mechanical depressed states.

### High-Affordance Audio / Emergency Bar (System Specific)
- Prominent persistent anchor bar docked to the bottom safe area, offering immediate one-tap contact to caregivers or voice assistance via high-contrast `#EA580C` framing and explicit verbal instructions alongside intuitive iconography.