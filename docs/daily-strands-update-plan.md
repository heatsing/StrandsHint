# Daily Strands Update Plan

Use this checklist once per day before publishing a Strands Hint entry.

## Daily Content Fields

- Date: `YYYY-MM-DD`
- Page title: `NYT Strands Hints & Answers Aug 15, 2026 | Strands Hint`
- Theme hint
- Difficulty
- Spangram hint 1
- Spangram hint 2
- Spangram direction
- Spangram answer
- Theme words
- Word hints
- Short answer explanation
- Related links

## Publishing Flow

1. Add the new daily entry through the admin flow or JSON content source.
2. Keep spangram and full answers hidden behind reveal controls.
3. Confirm the date appears on `/strands-hints/`.
4. Open the date page from the calendar.
5. Check the daily page title, H1, FAQ, canonical, and breadcrumb.
6. Run `npm run build` and `npm run seo:audit`.
7. Commit, push, and deploy.

## Automation Commands

Check which Strands dates are missing:

```bash
npm run daily:missing
```

Create a blank draft for tomorrow:

```bash
npm run daily:new -- --date=2026-08-17
```

Import a public third-party draft from `strands.today`:

```bash
npm run daily:import -- --date=2026-08-17
```

Import a small missing-date batch:

```bash
npm run daily:import:missing -- --from=2026-08-01 --to=2026-08-17 --limit=5
```

Imported entries stay unpublished by default. Review and complete the full theme words before
setting `published` to `true`.

## Editorial Rules

- Do not scrape or auto-copy official puzzle content.
- Do not show the full answer at page load.
- Keep the site disclaimer visible.
- Make the first hint useful without spoiling the answer.
- Treat third-party imports as drafts. Verify source accuracy and rewrite notes in the site voice
  before publishing.
