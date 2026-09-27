# Security+ Practice room

Run with Node.js 20 or newer:

```sh
npm run dev
```

Open http://localhost:5173. No runtime dependencies or account setup.

## Included

- All 414 questions imported from the supplied PDF, split into 90 / 90 / 90 / 90 / 54.
- Untimed attempts, answered indicators, independent flags, direct question navigation.
- Answers and current position saved per set in this browser.
- Submission confirmation, exact-match multi-answer scoring, result filters, expandable explanations.
- Stable shuffled options during a test. Review restores PDF order so explanation references to option letters remain accurate.
- Question order is randomized for each new attempt and stays fixed when that attempt is resumed. The results show a proportional practice estimate, with 750/900 as the target to pass.
- Desktop and mobile layouts, native radio/checkbox controls, keyboard focus, reduced-motion support.

Security: the dev server binds to loopback, serves only the app entry point and assets, and sends a restrictive Content Security Policy. The static page includes its own Content Security Policy for hosts that do not let you configure headers.

Scoring: one point only when the selected options exactly match the PDF key. Unanswered and incorrect questions receive zero. Results also show a practice estimate mapped proportionally to 900 points, the 750-point passing threshold, and the additional points and correct answers needed to reach it. This is an illustrative grading style only: CompTIA's actual scaled score is not a direct percentage conversion, so this estimate does not predict an official exam result. The supplied answer key is preserved and has not been independently fact-checked.

Retaking a set replaces its saved attempt after confirmation. Clearing browser data removes saved progress. Everything is stored locally; no backend or uploads. The full question bank, answers, and explanations are bundled in `public/questions.json`. Anyone who can access a public deployment can download them, so publish it only if you are allowed to redistribute that source material. This is a personal practice app, not a secure proctored exam.

## Validate / import

```sh
npm test
python3 scripts/import_questions.py '/path/to/source.pdf'
```

Import requires `pdftotext` (Poppler). The importer validates complete questions and sequential IDs. Browser verification lives in `tests/browser-check.mjs`. With the server running, use `npm install`, `npx playwright install chromium`, then `npm run test:browser`. Screenshots are written to `artifacts/`.

## Deploy on Vercel

Import this repository with the root directory set to the repository root. `vercel.json` selects the static build and publishes `dist/`, which contains `index.html`, `src/`, and `public/` at the site root. No environment variables are needed. The build runs automatically on deployment; run `npm run build` locally to inspect the output. `server.mjs` is a local development server.

After deployment, open the deployment URL and verify that the question sets load. If Vercel still shows a 404, check that the project's Root Directory points to this repository root and that the latest commit containing `vercel.json` was deployed.
