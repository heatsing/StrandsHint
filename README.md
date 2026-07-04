# Strands Hint

Independent fan-made helper site for `strandshint.net`.

This site is not affiliated with The New York Times. It does not use the NYT logo, does not copy
the official game UI, does not fetch NYT APIs, and does not auto-scrape official puzzle content.
Daily puzzle notes are entered manually through the admin area.

## Local Setup

1. Copy `.env.example` to `.env.local` or export the same variables in your shell.
2. Run `npm install`.
3. Run `npm run db:push`.
4. Run `npm run db:seed`.
5. Run `npm run dev`.

Default local variables:

```bash
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="change-me"
NEXT_PUBLIC_SITE_URL="https://strandshint.net"
```

## Commands

- `npm run dev` starts Next.js.
- `npm run lint` runs Next lint.
- `npm run build` runs `prisma generate` and builds the app.
- `npm run db:push` syncs Prisma schema to SQLite.
- `npm run db:seed` creates one fictional sample puzzle.

## Daily Publishing

1. Visit `/admin/login`.
2. Log in with `ADMIN_PASSWORD`.
3. Open `/admin/puzzles/new`.
4. Enter the puzzle content manually.
5. Publish it when ready.

All public answer and archive pages read from the database.
