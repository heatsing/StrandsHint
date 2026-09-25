# Strands Hint

Independent fan-made helper site for `strandshint.net`.

This site is not affiliated with The New York Times. It does not use the NYT logo, does not copy
the official game UI, does not fetch NYT APIs, and does not auto-scrape official puzzle content.
Daily puzzle notes are maintained manually in local JSON.

## Local Setup

1. Run `npm install`.
2. Edit `data/puzzles.json` for manually entered daily content.
3. Run `npm run dev`.

## Commands

- `npm run dev` starts Next.js.
- `npm run lint` runs Next lint.
- `npm run build` creates the static export in `out/`.

## Daily Answers (Wordle / Connections / etc.)

1. Create a draft:
   `npm run daily:answer -- new --game=wordle`
2. Edit `data/daily-answers.json` for that date/game.
3. Publish:
   `npm run daily:answer -- publish --game=wordle`
4. Build and deploy.

Supported games: `wordle`, `connections`, `spelling-bee`, `pips`, `mini-crossword`, `crossword`.
Strands continues to use `npm run daily:import` / `daily:publish` with `data/puzzles.json`.

## Daily Publishing (Strands)

1. Import a draft for today (or a date):
   `npm run daily:import`
   Optional: `npm run daily:import -- --date=2026-09-22`
2. Open `data/puzzles.json`, verify theme/spangram, and fill full theme `words` when the source only exposes prefixes.
3. Publish after review:
   `npm run daily:publish`
4. Run `npm run lint` and `npm run build`.
5. Commit, push, and deploy the `out/` directory to Cloudflare Pages.

Draft import pulls public third-party editorial pages (`strands.today`) as a starting point. It does not scrape official NYT APIs, and drafts stay unpublished until you review them.

The live static site cannot save edits from the browser. That is intentional: there is no database.
