# Full-width background correction

Implemented locally on 7 November 2026. This changes background layout across
existing routes, without adding pages, copy, imagery, or publication approval.

## Shared layout

`styles/section-layout.css` provides explicit opt-ins for rectangular colour
bands, decorative landscapes, and the footer. Background layers measure the
available browser width through the root query container (`100cqw`), excluding
scrollbars. Existing centred content containers keep their constraints.

Home and Services featured-case panels, About's companion panel, policy headings,
and rounded hero media remain inset. The alternating rectangular Case Studies
band extends to both edges. Existing `100vw` colour-band duplicates were removed.

At 1024–1439px the existing fixed-width desktop layouts caused overflow; scoped
width caps and flexible columns now fit those layouts to the available space.
Oversized Services illustrations and narrow CTA labels also fit their containers.
These are layout accommodations, not new mobile designs. Home sections that were
already desktop-only remain desktop-only.

Landscapes keep their original files, section heights at the reference width,
and centred bottom alignment. At desktop widths of 1440px and above, the shared
closing illustration scales to the viewport width at its original 1440:326
aspect ratio. Its section grows only when necessary to contain the artwork;
narrower layouts retain their existing sizing.

## Verification

- Production build and ESLint passed.
- Local Vite preview returned HTTP 200.
- All eight English routes passed viewport-edge and horizontal-overflow checks
  at 320, 390, 768, 1024, 1280, 1440, and 1920px (56 combinations).
- Before/after measurements at 1440px found no changes to measured headings,
  paragraphs, buttons, content images, or inset-panel bounds and radii on any
  English route. Baseline styles were replayed in their original cascade order.
- Browser screenshots of Home, Services, Case Studies, and About were inspected
  at 1920px, with additional tablet/mobile checks. Home was compared visually
  with Figma frame `266:4147` at 1440px. Existing photo/social/illustration
  placeholders remain; this is not an asset-complete Figma-match claim.
- Existing internal route destinations were checked. Chinese Contact also
  passed overflow checks at 320, 390, 768, 1024, 1440, and 1920px.

Review screenshots, measurements, and the isolated before/after patch are in
`/tmp/yhfun-background-qa/` on this machine.

## Git handoff

The repository is on `feature/home-hero`, with only the initial README commit.
The app, styles, assets, and configuration were already untracked before this
task; README also had existing edits. They were preserved. No files were staged,
committed, pushed, or deployed: a task-only application commit cannot be separated
from that uncommitted implementation baseline. The isolated patch captures only
this task's source changes for review. Case-study visibility was left as found;
this change does not grant or exercise publication approval.
