# Y. H. FUN website implementation

## Current scope and source of truth

- Build English desktop Home from Figma file `HjNDq2ttaq2ZLt4w8ogetz`, frame `266:4147`, at its 1440px reference width.
- The user's latest instruction is to reproduce the current Figma exactly: layout, section order, copy, typography, font family and weight, colours, spacing, dimensions, radii, artwork, image crops and alignment. Apply the specific Home placeholder authorization below where it changes this requirement.
- Current Figma visual values take precedence over older Notion/V2 recommendations and the provisional local scaffold. Do not independently apply a proposed font replacement, copy rewrite or visual revision that is absent from the agreed frame.
- Retain the separately recorded Case Studies publication gate: do not expose featured cases or public case links without publication approval. Document this intentional omission from the visual reference.
- Mobile and Chinese expansion are deferred. Do not derive those designs without authorization.

## Implementation rules

- Inspect the relevant Figma layers before implementing each section. Record resolved values, variable aliases, text styles and any unbound properties with their source.
- Reuse this React/Vite project, its existing routes and file structure. Preserve existing user work.
- Keep base tokens separate from usage aliases in `styles/tokens.css`. Reference verified mappings in the actual styles. Keep verified one-off values with their component/page and document them.
- Do not redesign, invent copy, substitute artwork or guess missing values. Identify the exact missing layer, value or export and ask before approximating, except for placeholders specifically authorized below.
- Existing provisional values are not evidence of Figma values. Keep unfinished or unverifiable parts explicitly labelled.
- Use original exported assets. Never use a screenshot of a complete section or page as its implementation.
- Figma, Notion and synced project sources remain read-only. The user will supply remaining exports later; do not repeatedly request them while they remain deferred.

## Latest user authorization: placeholder Home build

The user supplied `/Users/venuszheng/Downloads/Home.pdf` as the copy reference and explicitly asked to build out the homepage with placeholders. Implement all English desktop Home sections using that copy and the supplied CSS measurements. Label missing artwork, decorative markers and social icons as placeholders; do not block the remaining layout on asset exports. Original supplied artwork may remain. The Case Studies publication gate still applies. Mobile/Chinese expansion and other page bodies remain outside scope.

## Verification and handoff

- Run the local preview and production build for implementation changes.
- Compare browser screenshots with the agreed Figma frame at 1440px. Correct observed differences and report any remaining mismatch. Do not claim an exact match before completing this comparison.
- Verify image geometry/crops, destinations and keyboard behaviour for implemented controls. Separate measured/verified results from assumptions and pending checks.
- Report any authorized placeholders or intentional omissions in the handoff and draft PR.

## Branches, commits and pull requests

When Venus asks you to implement or fix an authorized change in this website repo, you have standing permission to create or reuse a task branch, commit the in-scope changes, push that branch to the verified GitHub remote, and open or update a draft PR. Do this when the work is ready for review, without asking Venus to repeat the authorization. This workflow does not expand implementation scope or grant publication approval.

1. Verify the repository, GitHub remote, intended PR base and working tree. Preserve existing edits. If they overlap with the task and cannot be separated safely, flag the conflict before staging.
2. Reuse the task branch and PR for follow-ups to the same change. Use a separate branch for unrelated work.
3. Review the diff and stage only task files. Exclude credentials, personal data, local settings, and unrelated edits or generated files.
4. Run the verification above. For visible UI changes, include before/after screenshots in the PR when useful. Record passed, failed and unavailable checks accurately. Resolve failures caused by the change before treating it as ready.
5. Commit with a descriptive message, push the task branch, and open or update its PR. Open new PRs as drafts. Preserve the review status of existing PRs. Describe what changed, why, and how it was verified. Include the branch and PR link in the final reply.
6. Direct pushes to the default branch, force pushes, merges and deployments require explicit instructions from Venus. If pushing a task branch would deploy publicly or bypass the Case Studies publication gate, stop before pushing and report the specific conflict.
7. If authentication, environment permissions or a repository rule blocks a push or PR, preserve the local work and report the exact blocker.

Advice, design exploration, read-only reviews and work-log backfills do not trigger commits, pushes or PRs.

## Desktop website work log

Use `~/Desktop/Y.H.FUN Website Work Log.md` as Venus’s personal summary of work on this website. Use PRs and commits for the detailed technical record. Keep the Desktop log outside the repository.

When asked to backfill, create the log if needed. Read it before writing and update matching entries to avoid duplicates. Use this website repo’s Git history, PRs, current code, and the available context from the website chat being backfilled. Include meaningful earlier decisions and unfinished work alongside completed changes. Verify implementation, merge and deployment statuses against the relevant evidence.

At the end of a task with a meaningful milestone, offer once to update the same log. Write the update when Venus says yes or directly asks for it. Skip routine discussion and small iterations already covered by an entry.

Use one short entry per milestone, newest first:

### YYYY-MM-DD · HH:mm Europe/Dublin · Feature or change

- **Status** — Proposed, prototyped, implemented locally, PR open, merged, deployed or blocked. Use the status supported by the evidence.
- **Why** — The user problem, design rationale or decision.
- **What changed** — One or two concrete points.
- **Verified** — What was checked and any material gap.
- **Reference** — PR, commit, prototype or chat link, when available.

Use the original milestone date and time for backfills where available. Omit unknown times. Summarize decisions and outcomes without copying chat transcripts or private data.