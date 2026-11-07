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

## Preview

1. In VS Code choose Terminal → New Terminal.
2. Run `npm run dev` (dependencies are already installed).
3. Open the Local URL printed in the terminal, usually http://localhost:5173.
4. English: `/?lang=en`; Simplified Chinese: `/?lang=zh-Hans`. The header link switches language.
5. Save a source file to see Vite update the browser. Stop the server with Ctrl+C.

Files to edit: `src/App.jsx` for bilingual content and interactions; `styles/tokens.css` for shared design values; `styles/components.css` for header/buttons/focus/container; `styles/home.css` for the hero. `src/index.css` holds the global reset. `npm run build` checks the production build.

This preview is provisional. Read [the evidence, missing reference packet and QA checklist](docs/home-review.md) before judging it against Figma. Services, Case Studies, About, Contact, and the three policy pages now have English desktop implementations; see the page-specific maps for missing assets and verification status.

## Save to GitHub after reviewing

Current branch at inspection: `feature/home-hero`; origin: https://github.com/venuszhengg/yhfun.git. No commit, push, pull request or branch change was performed.

1. Save files in VS Code (File → Save All).
2. Click the branch name at bottom left → Create new branch → enter `feature/home-header-hero`. Your uncommitted files stay with you. If that branch already exists, select it instead.
3. Open Source Control on the left. Review every changed/untracked file: much of this starter project was already uncommitted before this task. In particular review README.md and all public/src/styles files. Do not stage node_modules or dist (already ignored).
4. Click + beside the files you want to include. Enter `Build provisional bilingual Home header and hero`, then click Commit.
5. Click Publish Branch to push this branch to origin. Sign into GitHub if VS Code asks. Publishing the branch saves code on GitHub; it does not deploy a website.
6. Leave creating a pull request until you are happy with the preview.

Optional terminal equivalent after reviewing all files:

```sh
git switch -c feature/home-header-hero
git status
# Stage only the reviewed files in VS Code, then:
git commit -m "Build provisional bilingual Home header and hero"
git push -u origin feature/home-header-hero
```


## Latest scope: English desktop only (4 November)

The English desktop Home uses the supplied Home.pdf copy and the original mockup SVG exports. The asset bundle is kept in `public/images/mockup-illustrations/` and matching artwork is wired into the intro, service cards, process steps/markers, and closing CTA. Case-study publication has been approved; the Home section and navigation are included with labelled placeholders for the three unavailable case images. The hero background/cutout and social icons also remain unavailable placeholders. Read [the current mapping and section inventory](docs/home-token-map.md); it supersedes the earlier review note where values conflict.

Preview `/?lang=en` at 1440px. The desktop layout targets the supplied frame; no completed visual-match claim is made. Mobile/Chinese expansion and other page bodies remain deferred. Run `npm run build` before committing. Keep Git publishing and deployment for your own review.


## Full Home with placeholders — current preview

The English desktop homepage includes all in-scope sections through the footer, using the supplied Home.pdf copy and original exported artwork. Case-study publication is approved; the Home section and navigation are present, with labelled placeholders for the three missing case images. Hero photo/cutout and social icons remain labelled placeholders. Open `http://localhost:5173/?lang=en` (or the URL printed by `npm run dev`) in a desktop browser and scroll to the bottom. Do not treat this as an asset-complete or launch-approved website.

## Services desktop preview

The English desktop Services route is implemented at `/?lang=en&page=services` using the supplied Figma CSS measurements, Services.pdf copy and matching original illustrations. Its 1440px section inventory, token mappings and missing-artwork placeholders are recorded in [docs/services-token-map.md](docs/services-token-map.md). The hero photograph, service-card icons and case-study photographs remain labelled placeholders; mobile/Chinese Services layouts are deferred.

## Additional English desktop pages

Case Studies, About Us, Contact, Privacy Policy, Terms of Service, and Refunds & Cancellations Policy are implemented from the supplied PDFs. See [docs/content-pages-map.md](docs/content-pages-map.md) for routes, source measurements, asset status, and Contact form integration details. The Contact form sends directly to `VITE_CONTACT_FORM_ENDPOINT` only when configured; there is no production endpoint in this project, and the form never simulates success. Missing photos and illustrations are explicitly labelled. Contact copy is available in English and Simplified Chinese; other Chinese pages and mobile designs remain deferred.
