# Strands Hint

Static Strands hints and answers site for `strandshint.net`.

## Daily update

1. Play or collect today's puzzle data.
2. Run `pnpm new:puzzle`.
3. Enter date, theme, spangram, answers, hints, and editor note.
4. Run `pnpm build`.
5. Commit and push.
6. Cloudflare Pages deploys the static export.

## Commands

- `pnpm dev` starts local development.
- `pnpm new:puzzle` creates `data/puzzles/YYYY/YYYY-MM-DD.json`.
- `pnpm lint` checks the app.
- `pnpm build` creates the static export in `out/`.

## Solver notes

The solver is a scratchpad today. A later version can add DFS plus dictionary lookup by walking adjacent board letters, filtering candidates by known word length, and ranking matches against the theme.
