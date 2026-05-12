---
name: Modern Divine
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#554336'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#887364'
  outline-variant: '#dbc2b0'
  surface-tint: '#8f4e00'
  primary: '#8f4e00'
  on-primary: '#ffffff'
  primary-container: '#ff9933'
  on-primary-container: '#693800'
  inverse-primary: '#ffb77a'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed65b'
  on-secondary-container: '#745c00'
  tertiary: '#77574d'
  on-tertiary: '#ffffff'
  tertiary-container: '#d0a99d'
  on-tertiary-container: '#5a3d34'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdcc2'
  primary-fixed-dim: '#ffb77a'
  on-primary-fixed: '#2e1500'
  on-primary-fixed-variant: '#6d3a00'
  secondary-fixed: '#ffe088'
  secondary-fixed-dim: '#e9c349'
  on-secondary-fixed: '#241a00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#e7bdb1'
  on-tertiary-fixed: '#2c160e'
  on-tertiary-fixed-variant: '#5d4037'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 80px
---

## Brand & Style
The design system embodies the "Modern Divine" aesthetic—a sophisticated intersection of Vedic heritage and cutting-edge artificial intelligence. It is crafted to evoke a sense of digital sanctuary, moving away from the cold efficiency of typical AI interfaces toward a warm, authoritative, and meditative experience.

The visual style utilizes a high-end **Minimalist** foundation augmented with **Tactile Gold** accents. It prioritizes generous whitespace to allow scriptural wisdom to "breathe," ensuring the user feels unhurried and enlightened. The presence of subtle sacred geometry reinforces the connection between mathematical precision (AI) and cosmic order (Spirituality), resulting in a product that feels like a premium digital heirloom.

## Colors
The palette is rooted in the "Serene Parchment" (#FDFBF7), providing a warm, organic alternative to stark white, reducing eye strain during long reading sessions. "Deep Saffron" (#FF9933) serves as the primary action color, symbolizing energy and transformation, while "Royal Gold" (#D4AF37) is reserved for high-end borders and decorative accents.

For dark mode or high-contrast spiritual sections, "Midnight Spiritual" (#1A1A1A) provides a grounding depth. Gradients should be used sparingly—primarily as soft, "divine glow" backgrounds behind icons or as subtle top-to-bottom transitions on primary cards to suggest an ethereal light source.

## Typography
The typographic scale establishes a clear hierarchy between the "Majestic Serif" and the "Modern Sans." **Playfair Display** is used for all major headings to evoke the gravitas of ancient manuscripts. For body text, **Inter** is utilized with increased line height (1.5x - 1.6x) to ensure the wisdom being conveyed is highly legible and accessible.

Display headings should use a slight negative letter-spacing to appear more polished, while Labels and small metadata should use uppercase with generous letter-spacing to maintain a sophisticated, architectural feel.

## Layout & Spacing
This design system employs a **Fixed Grid** philosophy on desktop to maintain an intimate, book-like reading experience, centering content within a 1200px container. On mobile, it transitions to a fluid single-column layout with 20px side margins.

Generous vertical spacing (Section Gaps) is mandatory to prevent cognitive overload. Every element follows an 8px rhythmic grid, but layouts should intentionally "leak" whitespace to avoid the cluttered look of traditional SaaS dashboards. Grouped elements (like a verse and its commentary) should use tight internal spacing (8px-16px) but sit within larger parent containers with expansive padding (40px+).

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Ambient Shadows**. Surfaces do not "float" aggressively; instead, they lift subtly from the parchment background.

1.  **Low Elevation:** Used for cards. A very soft, large-radius shadow (Blur: 30px, Opacity: 4%) with a hint of Saffron in the shadow tint.
2.  **Interactive Depth:** On hover, cards transition to a thin 1px Royal Gold border rather than a heavier shadow.
3.  **Divine Overlays:** Modals and menus use a Backdrop Blur (20px) to maintain the "Modern Divine" tech feel, allowing the underlying parchment and mandala patterns to bleed through softly.

## Shapes
The shape language is "Soft" (0.25rem - 0.75rem), avoiding the overly "bubbly" look of consumer social apps while shunning the harshness of brutalist rectangles. This subtle rounding suggests a refined, hand-finished quality.

- **Standard Buttons/Inputs:** 4px (rounded-sm)
- **Content Cards:** 8px (rounded-lg)
- **Floating Action Buttons:** 12px (rounded-xl)
- **Decorative Elements:** Circular mandalas and geometric patterns should always be perfectly centered and symmetrical.

## Components
- **Buttons:** Primary buttons use the `divine_glow` gradient with white or deep brown text. Secondary buttons are "ghost" style with a 1px Royal Gold border.
- **Input Fields:** Use a subtle Parchment-darker fill (#F5F1E9) with a bottom-only gold border that glows slightly on focus.
- **Cards:** Defined by a 1px gold-tinted border and a soft shadow. Backgrounds may feature a 5% opacity mandala pattern watermark in the bottom-right corner.
- **Verse Chips:** Small, pill-shaped tags for Sanskrit terms, using a light Saffron background (#FFF4E5) and Deep Saffron text.
- **The "Wisdom Thread":** A unique vertical line component (1px Gold) that connects sequential pieces of AI-generated commentary, mimicking a lineage or a continuous scroll.
- **Iconography:** Use thin-stroke (Light or Regular) icons. Avoid solid/filled icons unless they represent an active state.