# Additional English desktop pages

> **Status clarification — 8 November 2026:** The desktop measurements below are historical reference notes. English and Simplified Chinese page content and responsive adaptations are now implemented; they are not a claim of visual parity. Case Studies publication approval was confirmed again on 7 November. Contact simulation and production behavior are described under Interactions and scope.

The English desktop routes below are implemented from the supplied single-page PDFs. The Case Studies reference is also linked to Figma node `266:4146`; publication approval was recorded on 4 November 2026. Each PDF has a 1440-point-wide page; the page heights are source-document dimensions, not asserted CSS frame heights.

| Route | Reference | PDF page size (points) |
| --- | --- | ---: |
| `/?lang=en&page=case-studies` | Figma `266:4146`, Case Studies.pdf | 1440 × 4469.5 |
| `/?lang=en&page=about` | About Us.pdf | 1440 × 3586.5 |
| `/?lang=en&page=contact` | Contact.pdf | 1440 × 2637.5 |
| `/?lang=en&page=refunds` | Refunds & Cancellations Policy.pdf | 1440 × 2167.5 |
| `/?lang=en&page=terms` | Terms of Service.pdf | 1440 × 2167.5 |
| `/?lang=en&page=privacy` | Privacy Policy.pdf | 1440 × 3301.5 |

Page copy, policy text, and visible section order were transcribed from those PDFs. The page composition uses the existing 1440px desktop canvas, site header, footer, and verified shared tokens. The supplied PDFs do not provide layer-level CSS values for every page, so page-specific layout measurements in `styles/content-pages.css` are implementation values, not claimed Figma variable bindings.

## Assets and pending exports

The About challenge cards use the matching original illustrations from `public/images/mockup-illustrations/`. The Contact illustration and shared closing landscape also use their matching original exports.

The supplied hero images are used on their matching routes from `public/images/heroes/hero-case.png`, `hero-about.png`, and `hero-contact.png`. At the 1440px desktop reference width, each image is inset 40px within a 1440 × 560px hero; the 2720 × 1120px sources match the 1360 × 560px media ratio. A 35% black overlay follows the PDF appearance. About and Case Studies actions are left-aligned in the bottom page-colour cutout; Contact has a centered cutout with a single discovery-call action. The 560px height and media dimensions are PDF-measured, not asserted as Figma bindings.

The About page uses a stone intro band, a white challenges section, and an inset stone companion panel. Case Studies alternates a stone middle story band between white story sections. These backgrounds extend horizontally to the viewport while remaining bounded to their section height.

The Case Studies page uses the replacement base photos `pexels-ron-lach-8311880 1.png`, `hhotel 1.png`, and `restaurant 1.png` from `public/images/case-studies/`. At desktop widths each image reaches its adjacent viewport edge, uses `object-fit: cover`, and matches its text block's height; the two corners beside the text have a 24px radius.

The following visible artwork remains unavailable as an individual original export and is labelled in the page rather than cropped from the PDFs or replaced with unrelated artwork:

- About overview illustration.
- Contact social icon artwork.

As of 8 November, Contact and the footer share social channel icons and metadata. No full-page or section screenshot is used as implementation artwork.

The About companion panel uses the supplied `What you're facing`, `Bring ideas into the workflow`, and `Let feedback guide decisions` service SVGs. All three principles are shown together, in columns on desktop and stacked on mobile, using the site's existing scroll-reveal treatment.

## Interactions and scope

- Header and footer links navigate to the corresponding existing routes; legal pages link to each other.
- Policy table-of-contents links target their numbered sections, and each policy has a Back to top link.
- The Contact page and form use the existing `en` and `zh-Hans` locale setup. The form validates required fields, email format, and optional phone numbers in the browser. In Vite development mode, a valid submission displays the realistic success screen without sending or storing the enquiry, even if `VITE_CONTACT_FORM_ENDPOINT` is set. The success copy is not labelled as a simulation. Direct email links remain available.
- Contact details use the shared copy interaction with an interactive tooltip; always-visible split buttons below the details open the default email app, the WeChat QR dialog, the RedNote website, or the YouTube channel. The RedNote account is found manually by its copyable ID; no profile URL is assumed. The footer retains its existing copy-email presentation.
- In a production build, an absent or blank `VITE_CONTACT_FORM_ENDPOINT` causes the form to report that website submission is not configured, without making a request. If the variable is configured at build time, the existing production path POSTs to that endpoint; it is not the development simulation. No `PREVIEW_ONLY` switch exists. Do not configure an endpoint until a real API is approved and ready: it must independently validate the JSON fields (`enquiryType`, `name`, `email`, E.164 `phone`, `countryCode`, and `message`) and return a successful HTTP status only after accepting the enquiry. Verify delivery, failure handling, privacy, and confirmation copy before deployment; no response-time commitment is currently verified.
- The Simplified Chinese Contact route uses localized page/form copy with the shared layout; no Chinese page-specific visual reference was supplied.
- Contact-form type uses the project's heading and body typography aliases; its palette references the neutral and olive tokens in `styles/tokens.css`. The white input/menu surface and `#d6d8ce` border are user-directed refinement values, not verified Figma bindings. The component-specific validation colour is an unbound value from the supplied prototype. No `textStyles.json` was present in the workspace or Desktop during implementation.
- The enquiry type, name, email, phone and message fields use the supplied 24px SVG icons, coloured with the existing body-text and focused olive aliases; the icons are decorative and the field labels remain accessible.
- The listed page bodies also have Simplified Chinese implementations and responsive layouts. No Chinese Contact visual reference was supplied, and the responsive work is not a Figma-match claim.

Run `npm run build` and `npm run lint` after changes. Compare the browser pages with the supplied PDFs at 1440px before claiming visual parity; missing original exports remain known differences.
