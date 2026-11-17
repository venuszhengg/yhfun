# Home header and hero review — 4 November 2026

> Historical review. Later Figma CSS and PDF checks supersede its hero and page-layout notes; see [home-token-map.md](./home-token-map.md) for the current desktop implementation status.

This is a provisional implementation scaffold, not a verified Figma match or approved V2.

## Evidence and blockers

Read-only Notion working specification retrieved successfully:
https://app.notion.com/p/40efcdf3eb8481428664d5c36f2deaf6

Figma session opened, but design-context and metadata requests returned the Starter-plan MCP limit. No frame render, exact copy, original logo, photo, crop or resolved variables were retrieved. Browser connector was unavailable. Native Chrome allowed an English 390 px visual check; further checks stopped when the user changed browser windows.

## Source measurements recorded in Notion

- Desktop content span 1200 px; 1440 px reference frame; 24 px gutters.
- Desktop header 1280 × 64 px, x80 / y24.
- Mobile header outer height 88 px with 16 px insets.
- Hero: EN desktop 560 px, EN mobile 540 px, CN desktop 796 px; 24 px radius.
- EN desktop legacy hero 80/88 at 500, tracking −4%; review calls for headings 700.
- Review font decision: Plus Jakarta Sans EN, Noto Sans SC Simplified Chinese; 700 headings, 500 controls, 400 body.

## Provisional choices

All copy, text wordmark, solid hero placeholder, palette, 1024 px nav breakpoint, mobile type scale, CN 96 px desktop hero, CTA arrangement and query-string routes are proposed. The hero uses minimum heights so text can grow. Legacy mobile Fraunces/Manrope and CN Resource Han Rounded/MiSans have been replaced according to the review, requiring wrap comparison. Case Studies is omitted pending publication approval. Font loading currently uses Google Fonts; self-hosting, Mainland access and production font availability are unresolved. Do not treat the starter src/assets/hero.png as a website photo.

Services, About and Contact links lead to explicit localized placeholder views. They are not finished public pages. Language switching preserves the query-string page. No enquiry or booking action submits data.

## Exact reference packet needed

Provide header + hero screenshots, exact approved copy and inspect values for:

1. EN desktop Home: 266:4147 (inside supplied section 266:4146).
2. EN mobile Home: 209:16850.
3. CN desktop Home: 209:17890.
4. CN mobile Home: frame link/ID still needed.

For each: frame width; header position, height, padding/gaps; logo dimensions; nav type/spacing; hero box; headline size/weight/line height/tracking/text width; body and button type; CTA height/padding/radius; image focal point/crop. Supply original logo SVG and exact RGBA/opacity for Brand Olive, Section Title Olive, Dark Text, Body Text, BG/surface, hover and hero overlay. Identify canonical V2 frames per locale/viewport. Notion says V2 revisions, final design and launch approvals remain open.

## Verification

- Production build passed.
- git diff --check passed.
- White #fff / provisional olive #4b531e: 8.22:1 (calculated sRGB contrast).
- Native Chrome EN 390 px: header, whole problem-solving phrase and stacked CTAs visually inspected.
- Source inspected: localized destination URLs, document lang/title, menu aria-expanded/controls, Escape focus restoration, outside-pointer and focus-leave dismissal, skip link and visible focus CSS.
- Not yet runtime verified: 320 and 1440 px in both locales, Chinese 390 px, keyboard sequence/focus, menu dismissal, route navigation, font download success, zoom/reflow and intermediate breakpoint widths. No image crop verification possible without photo.

## Review checklist

Open each language at widths 320, 390 and 1440 px in Chrome DevTools device toolbar. Check the whole headline, horizontal scrolling, CTA wrapping, mobile menu and navigation fit. Tab from the address bar into the page: skip link, logo, menu (mobile), nav (desktop/open menu), language switch, primary CTA, contact CTA. Enter opens links; Space opens the menu; Escape closes it and restores menu-button focus. Click outside or Tab away to dismiss. Follow each CTA, switch languages on its placeholder page, then return Home.
