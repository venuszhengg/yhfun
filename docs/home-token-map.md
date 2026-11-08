# Home inspection and token map — 4 November 2026

> **Status clarification — 8 November 2026:** Case Studies publication was approved and reconfirmed on 7 November. Featured cases and links are implemented, including Chinese content. Responsive and Chinese adaptations have since been implemented; comprehensive visual parity remains unverified. The scope and Git statements below describe the earlier work, not the current tree.

On 7 November 2026, the user confirmed public display of the three featured cases on Chinese Home and Services and supplied Chinese copy and targeted page updates in `chinese updates.pdf`. These changes do not constitute approval of other new mobile or Chinese designs.

## Historical scope and status

User selected **English desktop only**. The later handoff supplied the Home.pdf copy and the `mockup-illustrations` export folder; all supplied English desktop Home sections are implemented. No mobile layout or Chinese copy has been newly derived. The older bilingual header/hero scaffold remains, with clearly provisional styling.

Figma and Notion stayed read-only. No commit, push or deployment was performed. Current branch remains feature/home-hero.

## Sources and access

- Home frame: https://www.figma.com/design/HjNDq2ttaq2ZLt4w8ogetz/Y.H.FUN-Website?node-id=266-4147
- Home checklist: https://app.notion.com/p/40efcdf3eb8481bf9eaee11f6ad038d5
- Setup/token checklist: https://app.notion.com/p/40efcdf3eb848119aab6fed7450d7aa8
- Working spec: https://app.notion.com/p/40efcdf3eb8481428664d5c36f2deaf6
- V2 corrections: https://app.notion.com/p/3fffcdf3eb84810cb762ce768e52b688
- Case gate: https://app.notion.com/p/40efcdf3eb8481d494b1deab555a379e

Figma get_design_context and read-only use_figma both returned the Starter-plan tool-call limit. Native Figma UI inspection succeeded: Home overview, intro, situation-section layout, colour variable table and spacing variable table. This is partial native inspection, not complete programmatic binding coverage. The later user-provided `mockup-illustrations` folder is copied intact to `public/images/mockup-illustrations/`; its Home-specific exports are used where they match the existing illustrated slots.

## English desktop section order

| Order | Section / visible heading | Build status |
| --- | --- | --- |
| 1 | Header and navigation | Earlier provisional scaffold; logo export and exact binding/state check pending |
| 2 | Hero: Your problem-solving partner. | 1440 × 560px framed hero; supplied 1360 × 560px image, 35% Figma-specified black overlay, centered action cutout |
| 3 | Work through the problem. Put ideas into practice. | Built with original intro illustration and exact supporting sentence |
| 4 | WHO WE ARE FOR audience strip | Built: Small teams • Independent business owners • Individuals |
| 5 | What’s on your mind? | Built from Home.pdf copy; no exported illustration required |
| 6 | How we can help | Built with matching original illustrations for all three service cards |
| 7 | Start small before deciding where to invest next | Built with five matching original process illustrations and five numbered marker exports |
| 8 | Featured case studies | Built with supplied titles, descriptions, and case-study photographs |
| 9 | Talk it through with us | Built with the original 1440×326 shared CTA illustration |
| 10 | Dark footer | Built with supplied copy; social icon artwork remains a labelled placeholder |

The Home and Services featured case cards share a full-card link and a desktop hover/keyboard-focus treatment: 6px lift, a warm olive-grey shadow, 1.035 image zoom within the existing rounded frame, and a 2px arrow shift. The shadow, darker arrow colour (`#79803e`), and motion values are interaction-specific rather than verified Figma tokens. Reduced motion removes the movement while retaining focus and colour feedback.

The five process steps visible in the overview are Understand the problem; Choose a priority; Try it on a small scale; See what happens; Adjust or expand. These headings still require close text comparison alongside body copy before assembly.

FAQ is excluded per V2 review. User approved case-study publication on 4 November 2026. The Home now includes the three featured teasers and Case Studies nav/footer links; the destination remains an explicit preview because other page bodies are outside this Home build.

## Current Figma variable structure

Native variable tables now show **Colour Tokens (24)** and **Spacing (44)**. Both inspected tables expose a single Value column. Desktop/Mobile content spacing is represented by separately named aliases, not confirmed viewport modes. This conflicts with the older Notion inventory (Brand Olive, spacing/4, etc.); current native names below take precedence for the retrieved values. Variable IDs and all layer bindings could not be extracted.

### Colour primitives and usage aliases

| Figma primitive | CSS base | Resolved value | Figma usage alias → CSS usage |
| --- | --- | --- | --- |
| Images/Dark | --image-dark | #000000 at 35% | Image overlay role; exact layer binding pending |
| Olive/Vivid | --palette-olive-vivid | #898F45 | Legacy pale mobile CTA; not used as final action pair |
| Olive/Deep | --palette-olive-deep | #536624 | Action/Secondary/Background → --color-olive |
| Olive/Muted | --palette-olive-muted | #6B6D53 | Text/Section Heading → --color-heading |
| Olive/Light | --palette-olive-light | #D4D6BF | Surface/Header at 95% → --color-header |
| Olive/Pale | --palette-olive-pale | #EBECE0 | Surface/Tinted → --color-tinted |
| Neutral/Light Stone | --palette-neutral-light-stone | #F5F3EF | Surface/Section → --color-section |
| Neutral/Warm White | --palette-neutral-warm-white | #FCFAF8 | Surface/Page → --color-page |
| Neutral/Charcoal | --palette-neutral-charcoal | #2C2C26 | Previously used for Text/Strong |
| Neutral/Ivory | --palette-neutral-ivory | #FFFAF7 | Text/On Image → --color-on-image; Action/Primary/Label → --color-on-primary; Action/Secondary/Label → --color-on-olive |
| Neutral/Deep Grey | --palette-neutral-deep-grey | #515248 | Previously used for Text/Body |
| Amber/Burnt | --palette-amber-burnt | #C44E14 | Action/Primary/Background → --color-primary |

Colours have one observed value each. No separate Desktop/Mobile colour modes were visible in the table. --color-header currently resolves its opacity explicitly in CSS; its base RGB corresponds to --palette-olive-light. Global aliases are verified; specific header/hero/card binding coverage is not complete. Do not infer that all layers with matching visible colours are bound.

The current user-directed dark text colour overrides the original Figma mappings: `--color-text-dark` is `#42453A`, and both `--color-text` (body) and `--color-text-strong` resolve to it. The original palette primitives remain available for non-text uses. Section headings and text on images retain their separate colour roles.

### Dimensions: bases

| Figma base | CSS | Resolved value |
| --- | --- | --- |
| Spacing/16 | --space-4 | 16px |
| Spacing/24 | --space-6 | 24px |
| Spacing/40 | --space-10 | 40px |
| Spacing/80 | --space-20 | 80px |
| Spacing/120 | --space-30 | 120px |
| Radius/24 | --radius-hero | 24px |
| Radius/Pill | --radius-pill | 999px |
| Width/Context Max | --content-max | 1200px (Context is the visible Figma spelling) |

### Dimensions: usage aliases

| Figma usage | Base/value | CSS usage | Desktop / Mobile distinction |
| --- | --- | --- | --- |
| Padding/Content/Desktop Inline | Spacing/120 | --content-inset-desktop | Desktop 120px |
| Padding/Content/Mobile Inline | Spacing/24 | --content-inset-mobile | Mobile 24px; frame outside current scope |
| Gap/Heading to Content | Direct 40 | --gap-heading-content | One value |
| Gap/Between Sections | Direct 80 | --gap-sections | One value |
| Gap/Columns | Direct 24 | --grid-gap | One value |
| Gap/Rows | Direct 24 | --gap-rows | One value |
| Gap/Card/Content | Spacing/24 | --gap-card-content | One value |
| Gap/Card/List | Spacing/16 | --gap-card-list | One value |
| Gap/Header/Nav Items | Spacing/40 | --gap-nav | One value |
| Gap/Header/Controls | spacing/8, resolves 8 | Not newly promoted; old --space-2 remains provisional base | Referenced source collection not inspected |
| Gap/Footer/Groups | Spacing/24 | --gap-footer-groups | One value |
| Gap/Footer/Links | spacing/8, resolves 8 | Not newly promoted | Referenced source collection not inspected |
| Gap/Button/Icon and Label | spacing/8, resolves 8 | Not newly promoted | Referenced source collection not inspected |
| Gap/Hero/Actions | Spacing/16 | --gap-hero-actions | One value |
| Gap/Hero/Header to Actions | Direct 56 | --gap-hero-heading-actions | One value |
| Gap/Hero/Eyebrow to Header | Spacing/16 | --gap-hero-eyebrow-heading | One value |
| Padding/Card/Inline and Block | Spacing/24 | --padding-card-inline/block | One value each |
| Padding/Button/Icon and Label | Direct 20 | --padding-button-inline | Original source value; superseded by user-directed 24px |
| Padding/Button/Block | Direct 12 | --padding-button-block | One value |
| Padding/Content/Header/Outer Inline | Spacing/80 | --header-outer-inline | Desktop |
| Padding/Content/Header/Outer Top | Spacing/24 | --header-outer-top | Desktop |
| Padding/Content/Header/Capsule Inline | Spacing/120 | --header-capsule-inline | One value; exact header-layer adoption pending |
| Padding/Content/Hero/Inline | Spacing/40 | --padding-hero-inline | One value |
| Padding/Content/Hero/Content Side | Spacing/40 | --padding-hero-content-side | One value |
| Padding/Content/Hero/Cutout LR | Spacing/40 | --padding-hero-cutout-inline | One value |
| Padding/Content/Hero/Cutout TB | Spacing/16 | --padding-hero-cutout-block | One value |
| Padding/Content/Footer/Inline | Spacing/120 | --padding-footer-inline | Desktop |
| Padding/Content/Footer/Top | Spacing/80 | --padding-footer-top | Desktop |

Some collection rows below the initially visible table were not read. No missing numeric values were invented. --space-* follows the existing CSS convention (4 means the 16px step); the Figma name is recorded explicitly to avoid confusing it with the actual pixel value.

The shared ActionButton default height (56px), hover height (60px), and inline text padding (24px) were updated at the user's direction on 5 November 2026; these are implementation values, not newly verified Figma variable bindings. All variants, including arrow-only controls, use the same height. Hero action groups use intrinsic width so their button spacing is not compressed by stale fixed widths; the English desktop Home cutout is aligned to the 24px spacing around the group.

The existing .container uses --content-max plus two mobile insets as its outer cap. At 1440px its 1248px outer cap plus 24px inner padding produces exactly 120px from the viewport edge to content. That reproduces the desktop measurement; a future responsive shell should explicitly adopt --content-inset-desktop/mobile when the relevant layouts are authorized.

### Typography

| Source | CSS role | Desktop value | Mobile / conflict |
| --- | --- | --- | --- |
| V2 font decision | --font-en / --font-zh / --font-body | Plus Jakarta Sans / Noto Sans SC | Mobile/Chinese new work deferred |
| V2 weights | --weight-body/control/heading | 400 / 500 / 700 | Review decision applies over legacy fonts |
| EN/Heading/Hero, recorded in Notion | Existing hero style | 80px / 88px / −4%; legacy 500 overridden by review 700 | Mobile scale not verified |
| EN/Heading/H1, recorded in Notion | --type-section-size/tracking | 48px / Auto / −2% / 700 | New intro uses normal line-height for Auto; needs browser comparison |
| EN/Body, recorded in Notion | Existing global body | 16px / Auto / 400 | Existing browser 1.5 line-height still provisional |
| EN/Button, recorded in Notion | Existing .button | 16px / Auto / 500 | Existing mobile control scale remains provisional |
| H3 / H4 / Eyebrow | Not mapped to new components | Recorded 28/700, 20/500, 14/700 | Exact usage and review role exceptions pending |

Text style IDs and all current per-layer assignments are missing. The typography table distinguishes review decisions and older recorded geometry from freshly inspected variables.

## Native measurements and one-offs

- Home 266:4147: 1440 × 6170.27, top padding 112, parent gap 80, page fill direct #FCFAF8.
- Intro parent: x0 / y752, 1440 × 384, parent gap and padding 0; internal section children carry their own spacing.
- Situation section: 1440 × 504, horizontal padding 120, vertical padding 80, internal gap 40.
- Intro illustration image 16, node 266:6473: original copied SVG root 472 × 160, embedded image y−9 / height181. Saved without changing SVG contents as public/images/home/intro.svg. The exported image node may not include all parent-instance effects; complete parent-asset comparison remains open.
- English heading/copy are editable HTML. No whole-screen Figma screenshot is used as a website asset.

## CSS audit / provisional remainder

Verified aliases are used by the intro/audience section, button padding, desktop nav gaps and header outer margins. The supplied Home hero image is displayed at 1360×560 inside the 1440×560 hero with the Figma-specified 35% black overlay and 450×88 centered cutout. The header/menu still contain older provisional colours, spacing, sizes, focus colour, breakpoint, menu border/shadow and mobile type rules.

A definitive unbound-layer audit cannot be made without layer property access. Home fill displayed as a direct Color #FCFAF8 rather than an alias pill; direct measurement is recorded, not assumed to prove bindings elsewhere.

## Remaining input (user will provide later)

Logo SVG, exact small section/footer text, original social/arrow/flag icons and final public destinations remain pending. The supplied service, process, marker and closing-landscape exports are already used where they match the Home sections. Keep legal registration details exactly as supplied; none have been invented. Final V2 approval remains pending.

## Verification

Production build and git diff --check passed after implementation. Local preview HTTP returned 200. Native Figma screenshots were inspected, but no final 1440px browser comparison/screenshots or runtime keyboard/navigation pass were completed for the new section. Existing 390px English screenshot from the previous slice is historical and does not validate this revision. Full-home, mobile and bilingual acceptance checks are not claimed.

Preview: npm run dev, then open the printed URL with /?lang=en at 1440px. The existing /?lang=zh-Hans route is retained as the earlier scaffold; it is not a complete Chinese Home page.


## Supplied CSS export — latest evidence (4 November)

The user supplied a 5,788-line Figma CSS export of Home 266:4147. A local verbatim copy is saved as `docs/figma-home-266-4147.css.txt`. Its resolved layer values now supersede earlier observational guesses where they conflict. It has no node IDs, binding metadata, full text contents or original image payloads; every `url(image.png)` still requires the corresponding asset export. The text-style extraction is in `docs/figma-home-text-styles.json`.

| Exact supplied style/layer | CSS | Applied value |
| --- | --- | --- |
| EN/Heading/Hero | --type-hero-size/line/weight/tracking | 80px / 88px / 500 / −4% |
| EN/Heading/H1 | --type-section-size/line/tracking | 48px / 60px / −2%, 700 |
| EN/Body Regular | --type-body-size/line | 16px / 20px, 400 |
| EN/Action/Button | --type-action-size/line | 16px / 20px, 500 |
| EN/Label/Eyebrow | --type-eyebrow-size/line | 14px / 18px, 700 |
| Header nav item | --type-nav-size/line | 14px / 18px, 500; current Home 700 |
| Header wordmark | --font-wordmark | DM Sans 700, 24px / 31px, −4% |
| Header language label | --font-utility, --type-utility-size/line | Manrope 500, 10px / 14px |
| Header resolved fill | --color-header-layer | rgba(243,240,235,.95); differs from Surface/Header global alias |
| Current Home resolved colour | --color-nav-current-layer | #5F700A; differs from Olive/Deep |
| CTA pill resolved vertical padding | --padding-button-block-layer | 10px; differs from global Padding/Button/Block = 12px |

Desktop CSS is scoped under `.desktop-home` at the existing desktop breakpoint. It reproduces the 1440px reference canvas rather than deriving a new responsive desktop/mobile design. The full desktop section sequence and 6170.27px frame height are implemented; artwork and icons that have not been exported remain explicitly labelled placeholders.

Verified one-offs applied: page top 112; header x80/y24/1280×64, padding0 80, blur 10; wordmark x120/y17/94×31; language control right120/top10/78×44; hero1440×560, inset media 40/1360×560; hero content x191/1058×560; eyebrow top 155; headline top 189/height176; action group x344/top492/370×48, first pill193×44 and second109×44 with separate44px circular action; intro main324px high with 80/120 padding, text690×164, artwork wrapper486×160 and gap24; audience strip60px with20/120 padding. These are source layer measurements, not asserted variable bindings. Page/artboard canvas left80/top80 is not copied as browser padding.

The intro artwork wrapper is 486×160. The supplied `Page=home, Section=hero.svg` export has the exact 486×160 viewBox and is used in that wrapper. The supplied `public/images/heroes/hero-home.png` is used at 1360×560, inset 40px into the 1440×560 hero. The 35% black overlay is taken from the Figma CSS export; the page-colour 450×88 action cutout is built in HTML/CSS rather than using a section screenshot.

Removed the prior invented English hero supporting sentence. Existing verified headline and previously inspected eyebrow are retained. The hero primary CTA has no arrow; the secondary contact CTA now uses the supplied split-button arrow asset. The header still uses a simple equivalent-language link; the original flag/menu artwork and states are missing. Exact text content cannot be recovered from generic CSS comments such as Text or Explore services; full-copy verification remains open.

Validation: production build and whitespace check pass. Local preview HTTP 200; browser accessibility tree confirms current headline, CTA labels/URLs and intro content. Attempted 1440px screenshot checking through native Chrome, but viewport control did not retain 1440 and the user changed app state during input. No 1440px visual-match claim or complete-home screenshot is made. The requested mobile/Chinese expansion remains deferred.


## Full placeholder Home — latest implementation

User source: `/Users/venuszheng/Downloads/Home.pdf` (one1440×6170.27 page). Extracted text is saved in `docs/home-pdf-copy.txt`; PDF was rendered and visually inspected before implementation. Document content was treated as reference data, not new instructions.

Implemented after the intro: four situation links (two columns), three service cards, alternating five-step process, Begin your journey CTA, approved Featured case studies section, closing CTA and dark footer with exact supplied registration/address/email/copyright copy. The Home section uses the PDF's exact three case titles and descriptions; individual links and the "Read more about our work" CTA lead to the Case Studies destination preview because that page body remains outside scope. No PDF page screenshot is embedded in the website.

The supplied `ActionButton` component and arrow asset are used across Home, Services, About, Case Studies, Contact, policy pages and destination previews. Home retains the V2 EN · Desktop mapping: solid/olive for the hero's “Explore our services”; split/amber for “Let’s talk”, “Begin your journey” and “Read more about our work”; text/amber for service-card “Learn more” links; arrow/olive for each case-study card action; and solid/amber plus split/olive for the closing actions. Services and content pages use solid, split and arrow variants for their existing CTA placements, and the contact form submit uses solid/olive. The Back to Top control uses the arrow/olive variant with the supplied caption and upward arrow treatment on each policy page. Header menu/language controls and plain text navigation links remain native controls. The component references the existing primary, ivory and olive palette tokens. Its amber hover colour and motion/dimensions are retained from the supplied stylesheet; the hover colour has no Figma variable binding.

Situation bubbles also use the shared olive arrow action. Their block padding is reduced by 4px from the card padding token to retain the original desktop bubble height around the larger button; the SVG silhouette and tail remain in place.

New source: `src/HomeSections.jsx`; new page styles remain in `styles/home.css`, shared role values in `styles/tokens.css`. Existing React/Vite, query-string locales and destination placeholders are reused. Legal destination placeholders were added for privacy/terms/refunds so footer links do not silently return Home.

The CSS-export section heights used are504px situations,593px services,1911.77px process,704px case studies,436px closing,485.5px footer. Including the 80px parent gap before each continuation section yields the 6170.27px Home content height from the supplied frame, before the review-only preview note. This is a calculation from specified geometry; browser measurement remains to be verified. No extra gap is inserted between closing and footer.

The user-supplied `public/images/heroes/hero-home.png` fills the 1360×560 media frame at the 1440px reference width without an additional crop because its 2720×1120 source has the same aspect ratio. Its actions sit in the Figma-sized, centered page-colour cutout. Remaining placeholders: three case-study photos, social icon strip, and original arrow/flag assets. Case photo placeholders are labelled and are not substitutes for the missing photo exports. Simple text arrows remain visibly provisional controls. Situation bubble tails, exact original icons, floating motion and language-dropdown styling are not claimed complete.

The original asset bundle is retained intact under `public/images/mockup-illustrations/`. The intro, service, process, marker and closing assets use their original filenames and intrinsic SVG geometry. Other-page exports are included in the bundle but are not wired into the Home.

Copy includes the previously missing team statement, correct Putting ideas to the test service title, all five process descriptions, closing sentence and legal details. PDF text order is normalized only for line breaks; situation visual order remains business/team left and options/change right.

Verification: production build and whitespace check pass; local preview HTTP200. Native browser accessibility tree confirms every section and its copy, four same-language situation links to Services, three Learn more links to Services, journey CTA to Contact, closing links and footer destinations. Native desktop screenshots inspected across intro/situations/services, process start, closing/footer: no visible clipping in inspected regions. Privacy Policy link clicked and verified to render the correct explicit page preview. A full keyboard pass and exact1440px automated geometry comparison remain unverified; native app focus changed during the keyboard attempt. Mobile/Chinese were not expanded. No commit/push/deployment.
