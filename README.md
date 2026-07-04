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

## Daily Publishing

1. Open `/admin/puzzles/new` locally if you want help shaping a JSON object.
2. Paste the generated object into `data/puzzles.json`.
3. Run `npm run lint`.
4. Run `npm run build`.
5. Commit, push, and deploy the `out/` directory to Cloudflare Pages.

The live static site cannot save edits from the browser. That is intentional: there is no database.
