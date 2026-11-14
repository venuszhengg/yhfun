# Services desktop implementation map

> **Status clarification — 8 November 2026:** The original desktop map below is retained as historical reference. Chinese content and responsive adaptations are now implemented, and Case Studies publication was confirmed on 7 November. Visual parity across all breakpoints remains unverified.

Source frame: Figma `HjNDq2ttaq2ZLt4w8ogetz`, node `266:4362`. Copy was transcribed from the user-supplied Services.pdf; geometry and layer values come from the supplied, read-only Figma CSS export. The implementation is the 1440px English desktop canvas only.

## Verified page geometry

The root frame is 1440 × 6750.7px with 112px top padding and 80px between its main sections. Implemented section heights are:

| Section | Height |
| --- | ---: |
| Hero | 560px |
| Support for individuals | 492px |
| Independent business owners and teams | 597px |
| AI in everyday work | 691px |
| Chinese and European markets | 765.2px |
| How we work together and service options | 1368px |
| Featured case studies | 704px |
| Closing CTA | 416px |
| Footer | 485.5px |

These heights, the 80px section gaps, and 112px top padding sum to the supplied frame height. The implementation uses 120px desktop content insets and the 1200px content width where specified by the export.

## Verified values and token usage

Existing verified aliases are reused: `--color-page`, `--color-section`, `--color-tinted`, `--color-primary`, `--color-olive`, `--color-heading`, `--color-text`, `--color-text-strong`, `--palette-neutral-charcoal`, `--palette-neutral-ivory`, `--palette-olive-vivid`, `--palette-olive-light`, `--palette-olive-pale`, `--placeholder-surface`, and the EN typography aliases from [tokens.css](../styles/tokens.css).

Page-specific measurements retained in [services.css](../styles/services.css) include:

- Hero media inset 40px, 1360 × 560px; hero copy 660 × 210px, 80px/88px H1, 56px gap to actions.
- Section content uses 120px side padding; section 01 content is 1200 × 312px with 282px columns and 24px gaps; section 02 content is 1200 × 337px.
- AI content columns are 690px and 486px with a 24px gap; market cards are 588 × 230.2px.
- Discovery artwork container is 486 × 343px; case panel is 1360 × 704px with 1200px card grid.
- Several component colors, typography, and one-off dimensions are literal CSS layer values from the export rather than asserted variable bindings.

## Assets and pending exports

Original supplied artwork is used for the AI illustration, both China/Europe market illustrations, the discovery-call illustration, and the shared closing landscape in `public/images/mockup-illustrations/`.

The user-supplied `public/images/heroes/hero-services.png` is used in the 1360 × 560px media inset 40px into the 1440 × 560px hero. Its 2720 × 1120px source has the same aspect ratio, so it displays without an additional crop at the reference size. A 35% black overlay follows the supplied PDF appearance; unlike the Home overlay, this opacity is a visual match rather than a verified Services Figma binding. The bottom action cutout is 450 × 88px, aligned 40px from the hero's left edge. Section backgrounds extend horizontally to the viewport within each section's vertical bounds. The case-study cards use the supplied photographs with centered cover crops. No page screenshot is used.

## Scope and verification status

The original scope was English desktop only. Mobile and Chinese adaptations have since been implemented. Featured case studies are shown under the user's confirmed publication approval; case links use the existing Case Studies destination.

The production build, lint, local preview, and a 1440px browser comparison are required before claiming the page matches the reference. Missing exports above are known visual differences.
