# NRMLSS

Wearable health platform + continuous Lab app.

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Auth + database

Local Postgres database `nrmlss` with Better Auth (email/password) and Drizzle.

1. Ensure Postgres is running on `localhost:5432`
2. Copy env values from `.env` (already created locally):
   - `DATABASE_URL`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`
3. Push schema:

```bash
pnpm db:push
```

4. Visit:
   - [/signup](http://localhost:3000/signup)
   - [/login](http://localhost:3000/login)
   - [/app](http://localhost:3000/app) (requires session)
   - [/content](http://localhost:3000/content) (private IG post studio, requires session)

Useful scripts:

```bash
pnpm db:push
pnpm db:seed
pnpm db:studio
```

Product schema notes live in [`src/db/SCHEMA.md`](src/db/SCHEMA.md).