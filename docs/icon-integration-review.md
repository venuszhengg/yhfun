# Original SVG icon integration

Implemented locally on 7 November 2026. This is an icon-only change to the existing preview, not publication or design approval.

## References and scope

Reviewed every page of the seven available single-page Figma PDF exports in Downloads: Home, About Us, Case Studies, Contact, Privacy Policy, Terms of Service, and Refunds & Cancellations Policy. All have a 1440-point-wide reference canvas. Services.pdf was unavailable; Venus explicitly authorized using icon names for the Services placeholders and approved `Bring ideas into the workflow.svg` for the existing “Bring tools into the workflow” card. Its placement remains subject to her visual review.

PDF visual measurements below are unbound component values, not asserted Figma variable aliases. No token, typography, background, section dimension, button style, or publication setting was changed. Existing case previews remain as found; no new case, route, public destination, or publication authorization was added.

## Asset mapping

Original filenames are preserved under `public/images/`. All 15 imported files were compared byte-for-byte with their Downloads originals; shapes, strokes, colors, embedded textures and SVG viewBoxes are unchanged. No library icons or reconstructed artwork were added.

| Page / section | Original SVG | Size and placement |
| --- | --- | --- |
| Services / individuals and business cards | `What you're facing.svg`, `What we do together.svg`, `Possible deliveries.svg` | Existing 80 × 80px slots above headings; each asset reused in both sections |
| Services / AI steps | `Start with the task.svg`, `Bring ideas into the workflow.svg`, `Let feedback guide decisions.svg` | Existing 80 × 80px slots beside step text |
| Case Studies / fashion boutique metadata | `clothing-rack 1.svg` | 24 × 24px before the label, 8px gap |
| Case Studies / hotel metadata | `concierge-bell 1.svg` | 24 × 24px before the label, 8px gap |
| Case Studies / restaurant metadata | `plate-utensils 1.svg` | 24 × 24px before the label, 8px gap |
| Case Studies / each location | `marker 1.svg` | 24 × 24px before country, 8px gap |
| Case Studies / each “The challenge” | `What you're facing.svg` | 40 × 40px beside the heading and paragraph, 16px gap |
| Case Studies / each “Our approach” | `What we do together.svg` | 40 × 40px beside the heading and paragraph, 16px gap |
| Case Studies / each “Why this approach” | `Let feedback guide decisions.svg` | 40 × 40px beside the heading and paragraph, 16px gap |
| Contact / Social | `App=Wechat, Colour=Olive.svg`, `App=RedNote, Colour=Olive.svg`, `App=YT, Colour=Olive.svg` | 24 × 24px, vertically centered with the existing account text, 8px gap |
| Shared footer / all eight routes | `App=Wechat, Colour=Stone.svg`, `App=RedNote, Colour=Stone.svg` | 24 × 24px, 16px gap; 104 × 26px row retains the original placeholder’s measured height, with 24px icons centered inside |
| Home / “What's on your mind?” | Existing `src/Right.svg` (identical to Downloads/Right.svg) | Reused original 24 × 24px arrow inside the existing 44px circle; replaces text arrows |

Decorative icons use empty alt text because adjacent headings/text provide their meaning. Social platform icons have platform alt labels where the account text alone does not identify the platform. No invented links or keyboard stops were introduced. Existing action and hover behavior is retained.

## Missing or pending

- Footer WhatsApp: no matching SVG in the supplied folders. Its first 24px slot remains an outlined empty placeholder with an accessible label and tooltip identifying the missing export. YouTube was not substituted for it.
- About / companion process: the small active star marker in the PDF has no matching standalone supplied SVG. The numbered Home markers and the five-point feedback star are different artwork and were not substituted.
- Services: icon-name matches are authorized, including the differently named workflow export. Exact PDF comparison is pending because Services.pdf was unavailable.
- Contact: the supplied Olive exports retain their original `#898F45` color. The PDF appears darker; assets were not recolored, in accordance with the instruction to preserve their original appearance.
- Other existing photo/illustration placeholders remain outside this icon task. Existing arrows, numbered process artwork, flags, and controls were retained where already implemented.

## Verification

- `npm run build`: passed after implementation. Production preview also checked all eight routes at 1440px with zero broken images or overflow. Home, Services, Case Studies and Contact total page heights match their captured pre-change heights.
- `npm run lint`: passed after implementation.
- Browser matrix: all eight English routes at 1440, 768, 390 and 320px (32 route/width combinations). No broken images, runtime console errors, or horizontal overflow.
- Icon rectangles checked in the browser: Services 80px, Case Studies detail 40px, metadata/social 24px. Explicit image dimensions reserve their space during loading.
- Desktop icon screenshots visually compared with the available PDF references. Original section geometry and full-width/contained backgrounds were preserved. Existing overall page differences from the PDFs are outside scope; this is not a full-page exact-match claim.
- 390px Services, Case Studies and Contact screenshots visually reviewed; other mobile widths checked for asset loading and overflow. These are checks of existing responsive adaptations, not new mobile Figma designs. The existing mobile Services layout remains basic and unstyled compared with its desktop canvas.
- Keyboard smoke check: the first Tab reaches “Skip to content”; Enter moves focus to `main`. Added images have no tabindex. Existing link destinations and controls were not changed.
- Shared Contact icons also render on the existing Chinese Contact route; no Chinese design expansion was made.

## Git handoff

At task start, the only tracked file was README.md; the entire existing application (`src/`, `styles/`, `public/`, package/configuration files and docs) was already untracked. The branch is `feature/home-hero`, remote `https://github.com/venuszhengg/yhfun.git`. No files were staged and no commit, push or PR was created: committing edited source files would also include the pre-existing untracked implementation, which cannot safely be represented as this icon-only change. Local work is preserved. A source-only before/after patch and review screenshots are in `/tmp/yhfun-icon-review/`; copied assets are in the repository folders above.
