# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Y.H.FUN local Home preview

React + Vite already existed in this folder. Existing shared CSS was extended. The original App.jsx and index.css are preserved as text in docs/original-*.txt; unused starter assets and App.css remain intact.

## Current status — 8 November 2026

The site includes English and Simplified Chinese routes, approved Case Studies content, and responsive adaptations for mobile and tablet. The desktop maps below document their original scope, not the current limits of the implementation. Responsive visual checks have covered representative routes and widths, but a complete comparison with the references and the missing pre-refactor baseline remains outstanding.

The Contact form simulates a realistic success message in Vite development mode without sending or storing an enquiry, even if an endpoint is configured. A production build without `VITE_CONTACT_FORM_ENDPOINT` fails closed; when an endpoint is configured at build time, the production code can POST real enquiries. No endpoint is configured by this project. Do not configure one until the submission service, privacy and delivery are explicitly approved and verified. See [the Contact integration notes](docs/content-pages-map.md#interactions-and-scope).

Run `npm test`, `npm run lint`, and `npm run build` for automated verification. These checks do not establish visual parity or deployment readiness. GitHub synchronization and deployment are separate; a push may trigger a hosting integration, so verify the deployment target first.

## Cloudflare Workers build preparation

The existing Cloudflare project is a Workers Builds integration, so the static React/Vite site can use Workers static assets without switching to Pages. `wrangler.jsonc` points Wrangler at Vite's `dist` output, enables single-page application navigation fallback, and provides the required `previews` block. Build before running any Wrangler deployment command.

Once publishing is approved and these changes are present on the selected production branch, configure Workers & Pages → `yhfun` → Settings → Build:

- Repository: `venuszhengg/yhfun`; root directory: `/` (repository root).
- Production branch: `main`; build command: `npm run build`; deploy command: `npx wrangler deploy`.
- Use Node.js 24 (Workers Builds currently defaults to Node 24); check that no build variable overrides it with an unsupported version.
- In the separate Previews Base settings, set the build command to `npm run build` if preview builds are desired; keep the preview command as `npx wrangler preview` and the root directory as `/`. Preview builds and Preview URLs are separate controls. Leave Preview URLs disabled unless publication is authorized.
- Review branch and preview settings before pushing: enabled preview builds can publish branch previews, and existing integrations may use an older preview model. Do not change production settings, merge, or deploy without approval.

The 9 November dashboard screenshots showed the production build command set correctly but the Previews Base build command empty. The Wrangler configuration does not run Vite by itself. A local `npx wrangler deploy --dry-run` validates packaging without deploying; it does not verify the dashboard, Cloudflare account, domains, or production delivery. Keep `VITE_CONTACT_FORM_ENDPOINT` unset until the submission service, privacy and delivery have been approved and tested.

### Contact form preparation (not enabled)

`worker/contact.js` and `wrangler.contact.jsonc` prepare a same-origin `/api/contact` endpoint. General enquiries go to `hello@yhfunhq.com` and business/service enquiries to `info@yhfunhq.com`; replies use the visitor's address. The Worker validates input, restricts sender and destinations, and applies per-IP and global Cloudflare rate limits. Cloudflare's rate limits are approximate per location, not a complete spam prevention system.

The normal `wrangler.jsonc` still deploys only static assets, and the production form still fails closed without `VITE_CONTACT_FORM_ENDPOINT`. Do not enable the endpoint or deploy the alternate configuration until explicitly approved. Before activation:

1. Confirm Cloudflare Email Service supports this account, onboard the sending domain if required, and verify both receiving addresses. Review any plan, cost, DNS and existing mail-delivery implications before changing account settings.
2. Verify that rate-limit namespace IDs `719825331` and `719825332` do not conflict with existing account usage. Review spam controls, privacy policy and delivery monitoring.
3. With authorization, configure the build variable `VITE_CONTACT_FORM_ENDPOINT=/api/contact` and use `npx wrangler deploy --config wrangler.contact.jsonc` as the deploy command. This deploys the site and must not be run as a test without publication approval.
4. Perform approved end-to-end delivery and failure tests for both enquiry types, languages and inboxes. An accepted send is not proof of final inbox delivery.

Locally, `npx wrangler deploy --dry-run --config wrangler.contact.jsonc` checks the Worker configuration without deployment. A local `wrangler dev --local --config wrangler.contact.jsonc` uses Cloudflare's simulated email binding, not real delivery. Never enable a remote email binding for unapproved tests.

## Preview

1. In VS Code choose Terminal → New Terminal.
2. Run `npm run dev` (dependencies are already installed).
3. Open the Local URL printed in the terminal, usually http://localhost:5173.
4. English: `/?lang=en`; Simplified Chinese: `/?lang=zh-Hans`. The header and footer language switchers preserve the current page; their selection slides for 280 ms before navigation, or switches immediately with reduced motion. On mobile and tablet, the header switcher appears inside the navigation menu.
5. Save a source file to see Vite update the browser. Stop the server with Ctrl+C.

Files to edit: `src/App.jsx` for bilingual content and interactions; `styles/tokens.css` for shared design values; `styles/components.css` for header/buttons/focus/container; `styles/home.css` for the hero. `src/index.css` holds the global reset. `npm run build` checks the production build.

This preview is provisional. Read [the evidence, missing reference packet and QA checklist](docs/home-review.md) before judging it against Figma. Services, Case Studies, About, Contact, and the three policy pages now have English desktop implementations; see the page-specific maps for missing assets and verification status.

## Historical GitHub instructions from the initial preview

The following describes the initial preview workflow, not the current branch status or an instruction to create another branch. Check `git status` and the configured upstream before publishing; external deployment automation may be present.

Current branch at inspection: `feature/home-hero`; origin: https://github.com/venuszhengg/yhfun.git. No commit, push, pull request or branch change was performed.

1. Save files in VS Code (File → Save All).
2. Click the branch name at bottom left → Create new branch → enter `feature/home-header-hero`. Your uncommitted files stay with you. If that branch already exists, select it instead.
3. Open Source Control on the left. Review every changed/untracked file: much of this starter project was already uncommitted before this task. In particular review README.md and all public/src/styles files. Do not stage node_modules or dist (already ignored).
4. Click + beside the files you want to include. Enter `Build provisional bilingual Home header and hero`, then click Commit.
5. Click Publish Branch to push this branch to origin. Sign into GitHub if VS Code asks. First confirm whether a push will trigger deployment.
6. Leave creating a pull request until you are happy with the preview.

Optional terminal equivalent after reviewing all files:

```sh
git switch -c feature/home-header-hero
git status
# Stage only the reviewed files in VS Code, then:
git commit -m "Build provisional bilingual Home header and hero"
git push -u origin feature/home-header-hero
```


## Historical scope: English desktop only (4 November)

The English desktop Home uses the supplied Home.pdf copy and the original mockup SVG exports. The asset bundle is kept in `public/images/mockup-illustrations/` and matching artwork is wired into the intro, service cards, process steps/markers, and closing CTA. The case-study cards use the supplied photographs. Read [the current mapping and section inventory](docs/home-token-map.md); it supersedes the earlier review note where values conflict.

At that time the scope was English desktop only. Preview `/?lang=en` at 1440px; the desktop layout targets the supplied frame, but no completed visual-match claim is made.


## Full Home with placeholders — current preview

The English desktop homepage includes all in-scope sections through the footer, using the supplied Home.pdf copy and original exported artwork. Its three case-study cards use the supplied photographs. Open `http://localhost:5173/?lang=en` (or the URL printed by `npm run dev`) in a desktop browser and scroll to the bottom. Do not treat this as an asset-complete or launch-approved website.

## Services desktop preview

The Services route is implemented at `/?lang=en&page=services` using the supplied Figma CSS measurements, Services.pdf copy and matching original illustrations. Its original 1440px section inventory and token mappings are recorded in [docs/services-token-map.md](docs/services-token-map.md). Mobile and Chinese adaptations have since been implemented but are not claimed to match an unavailable reference.

## Additional English desktop pages

Case Studies, About Us, Contact, Privacy Policy, Terms of Service, and Refunds & Cancellations Policy are implemented from the supplied PDFs. See [docs/content-pages-map.md](docs/content-pages-map.md) for routes, source measurements, asset status, and Contact form integration details. Case Studies publication was approved; some missing artwork and visual-reference checks remain outstanding.

## Reveal motion

Selected editorial headings, artwork and cards use opt-in `data-reveal="text"` or `data-reveal="visual"` attributes, with optional `data-reveal-order` values for a short capped stagger. The shared observer in `src/useScrollReveals.js` only prepares content below the initial viewport, reveals it once and immediately exposes focused or anchor-targeted content. Hero text uses `data-hero-reveal`. Reduced motion and browsers without IntersectionObserver leave content visible; form fields, navigation and policy copy remain static. The existing React application itself requires JavaScript to render.
