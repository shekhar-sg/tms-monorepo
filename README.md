# Task Manager

A task and project workspace built with Next.js, NestJS, PostgreSQL, and Prisma. The monorepo uses pnpm workspaces and Turborepo; shared Zod schemas and TypeScript contracts live in `packages/types`.

## Local setup

Use Node.js 22.12 or newer and pnpm 9 (the version declared in `package.json`).

```sh
pnpm install --frozen-lockfile
```

Create `apps/api/.env` with your own values:

```dotenv
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/task_manager
JWT_SECRET=REPLACE_WITH_A_RANDOM_SECRET_AT_LEAST_32_CHARACTERS
FRONTEND_URL=http://localhost:3000
```

Guest login requires no OAuth setup. Google sign-in is available when `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL` are configured. Copy the values documented in `apps/api/.env.example`. Register `http://localhost:3000/api/auth/google/callback` as the authorized redirect URI in your Google Cloud Web application client. The value must match exactly (including port and path); `http://localhost:4000/api/auth/google/callback` is not an API route. Restart the API after changing `.env`; the development source watcher does not reload environment files. In production use the HTTPS web origin and keep `FRONTEND_URL` consistent. The callback must use the web origin so session cookies remain available to Next.js.

Create `apps/web/.env.local`:

```dotenv
API_URL=http://localhost:4000
```

Browser requests use the web application's `/api` proxy, and server requests use `API_URL`. Set it consistently to the intended API for each environment; rewrites are evaluated at build time. Cookies are HttpOnly and same-site. Production requires HTTPS.

For the Vercel frontend project, set `API_URL=https://tms-monorepo-api.vercel.app` in the Production environment. For the API project, set `FRONTEND_URL=https://tms-monorepo-web.vercel.app` and `GOOGLE_CALLBACK_URL=https://tms-monorepo-web.vercel.app/api/auth/google/callback`. Register that same callback in the Google OAuth client. Redeploy the frontend without reusing its previous build cache after changing `API_URL`. Turbo includes this variable in the build environment and cache key. A `DNS_HOSTNAME_RESOLVED_PRIVATE` error from the frontend's `/api/auth/providers` indicates the proxy destination resolves to a private address; verify `API_URL` and rebuild.

Initialize a local database (use a separate database for testing):

```sh
pnpm --filter api prisma:generate
pnpm --filter api prisma:migrate
pnpm --filter @repo/types build
pnpm dev
```

Open http://localhost:3000 and continue as a guest. Create a project, then create tasks within it. Do not run development migrations against a production database.

## Checks

```sh
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

`lint` and `check-types` do not rewrite source. `pnpm check` checks formatting and imports without rewriting files. `pnpm format` explicitly formats files. API tests mock persistence; the web tests use Node's built-in runner for URL parsing and filter regressions.

The web dev/build scripts use webpack because the installed Next.js Turbopack CSS worker fails on this Windows environment. Typography uses a system font stack, with no network font fetch needed for builds.

## Behavior and verification

- Existing accent colors and light/dark/system preferences remain available in the user menu.
- Task edits validate and save after a short delay, with serialized writes, save status, and retry after a failed save. The pause button suspends autosave; resume before leaving to persist edits.
- Task/project deletion requires confirmation. Project deletion also removes its task data.
- Invalid URL filters are ignored independently; the API still validates input strictly.
- A task update is partial: omitted fields stay unchanged; explicit null clears supported optional fields, and empty arrays clear members or labels.
- Board status updates and status activity records share a database transaction.

For release acceptance, verify guest sign-in; project creation/inline editing; task creation, autosave, subtasks, comments/replies, moves and deletion; profile and preference persistence; expired-session redirects; and loading/error/empty states. Check 390px, 768px, and desktop widths, both themes, and all accents. Use disposable accounts/projects and clean them up after testing.

## Workspace upgrade

Apply the checked-in migration before running the new API:

```sh
pnpm --filter api prisma:generate
pnpm --filter @repo/types build
pnpm --filter api exec prisma migrate deploy
```

The migration preserves tasks and projects, normalizes ordering, and copies legacy shared labels into private labels for each referencing project owner. Original unreferenced labels remain archived. Google sign-in upgrades a new guest in place or transfers work transactionally into an existing Google account; cancelled sign-in keeps the guest session. Guest work is tied to its browser session until upgraded. An expired or cleared guest cookie cannot recover anonymous work.

Board cards, table rows, and subtasks share transactional ordering and optimistic move queues. Manual order is shared across a user's projects within each status; project pages show a subset. Clear filters and choose Manual order to reorder; other sorts still allow status changes. View preferences persist per user/page. Top-level feeds count parent tasks; subtasks remain on their parent.

### Ask AI with Groq's free plan

Set `GROQ_API_KEY` on the API server. The official `groq-sdk` uses `openai/gpt-oss-20b` with strict structured output and a maximum of 1,800 completion tokens. `GROQ_MODEL` can select another model that supports strict structured output and low reasoning effort. No paid features or automatic model upgrades are enabled.

The app defaults to one AI request per minute and 100 per day across the installation (`AI_GLOBAL_RPM`, `AI_GLOBAL_RPD`), plus 5 requests/hour per guest, 10/hour per guest IP, and 60/hour per Google user. These app safeguards do not guarantee staying within every Groq account limit; the provider's actual organization/token quotas still apply. Provider quota failures show a retry message. Automatic SDK retries are disabled to avoid repeated free-plan consumption.

The assistant sends bounded, recent accessible project/task context, the selected task's short description, and the last conversation turn to Groq. It discloses partial context, offers links, and never claims to have saved proposals. Review and edit suggestions, deselect unwanted tasks/remove subtasks, then use Create selected. The API validates ownership and saves the hierarchy atomically, with idempotent retries. Existing work cannot be edited or deleted by AI. Conversations stay in the mounted session; only quota counters and apply receipts persist. Missing provider configuration leaves manual workflows available.

### Database regression checks

```sh
pnpm --filter api test:database
```

This command uses the configured connection to create a uniquely named `codex_verify_` schema, checks migration backfill on populated fixtures, applies migrations to a fresh isolated schema, runs concurrency/isolation/guest-transfer/AI-creation tests, and drops only its temporary schema in a finally block. The database role needs schema-create permission. It never migrates or seeds the application's configured schema. Normal unit tests skip these integration tests unless the guarded test URL is set.

Release checks include OAuth success/cancellation with real Google credentials and a Groq smoke request when keys are configured. Production hosting deployment remains a separate step.
