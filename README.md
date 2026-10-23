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

Guest login requires no OAuth setup. The existing Google integration requires valid `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL` if it is enabled separately.

Create `apps/web/.env.local`:

```dotenv
API_URL=http://localhost:4000
```

Browser requests use the web application's `/api` proxy, and server requests use `API_URL`. Set it consistently to the intended API for each environment; rewrites are evaluated at build time. Cookies are HttpOnly and same-site. Production requires HTTPS.

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

Production deployment and database migrations are separate steps; this refresh does not require a schema migration.
