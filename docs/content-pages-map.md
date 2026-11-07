# Additional English desktop pages

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

The About page uses a 560px stone intro band, a 720px white challenges section, and a 520px inset stone companion panel. Case Studies alternates a stone middle story band between white story sections. These backgrounds extend horizontally to the viewport while remaining bounded to their section height.

The following visible photography/artwork remains unavailable as an individual original export and is labelled in the page rather than cropped from the PDFs or replaced with unrelated artwork:

- Three Case Studies photos.
- About overview illustration and companion/process illustration.
- Contact social icon artwork.

The shared footer's social icons remain labelled placeholders. No full-page or section screenshot is used as implementation artwork.

## Interactions and scope

- Header and footer links navigate to the corresponding existing routes; legal pages link to each other.
- Policy table-of-contents links target their numbered sections, and each policy has a Back to top link.
- The Contact page and form use the existing `en` and `zh-Hans` locale setup. The form validates required fields, email format, and optional phone numbers in the browser. Website submission is not yet available because this project has no contact API. Set `VITE_CONTACT_FORM_ENDPOINT` to the production API URL to enable POST submission; the API must independently validate the JSON fields (`enquiryType`, `name`, `email`, E.164 `phone`, `countryCode`, and `message`) and return a successful HTTP status only after accepting the enquiry. With no endpoint configured or a failed response, the form keeps its values and shows a retry message; it never simulates success. Direct email links are also provided.
- The Simplified Chinese Contact route uses localized page/form copy with the shared layout; no Chinese page-specific visual reference was supplied.
- Contact-form type uses the project's `--font-wordmark` and `--font-body` typography aliases; its palette references the verified neutral and olive tokens in `styles/tokens.css`. The component-specific validation colour is an unbound value from the supplied prototype. No `textStyles.json` was present in the workspace or Desktop during implementation.
- All listed page bodies are implemented in English except the localized Simplified Chinese Contact route. No Chinese Contact visual reference was supplied, so its shared layout is not a Chinese visual-match claim. Mobile layouts are basic responsive adaptations and are not Figma-match claims.

Run `npm run build` and `npm run lint` after changes. Compare the browser pages with the supplied PDFs at 1440px before claiming visual parity; missing original exports remain known differences.
