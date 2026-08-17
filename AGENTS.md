<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Overview

Personal portfolio site for **Abraao Xavier Sungo Sala** (Full Stack Developer). Built with Next.js App Router, Tailwind CSS v4, SQLite + Prisma ORM. Goal: dynamic sections with smooth scroll, polished UX/UI.

## Stack

- **Next.js 16.3.1** (App Router — all routes in `app/`)
- **React 19**
- **Tailwind CSS v4** — uses `@tailwindcss/postcss` plugin in `postcss.config.mjs`. No `tailwind.config.*` file; theme is configured via CSS `@theme inline` in `app/globals.css`.
- **TypeScript** — strict mode, path alias `@/*` → `./*`
- **Prisma 7.9.1 + SQLite** — uses `@prisma/adapter-libsql` driver adapter

## Commands

```bash
npm run dev        # start dev server (localhost:3000)
npm run build      # production build
npm run start      # production server
npm run lint       # eslint (next core-web-vitals + typescript)
npm run db:push    # push schema to SQLite
npm run db:seed    # seed database with sample data
npm run db:reset   # force reset + seed
```

No test suite exists. Run `npx tsc --noEmit` for type checking.

## Project Structure

```
app/
  layout.tsx           # root layout (html, fonts, body)
  page.tsx             # home page (server component, fetches from Prisma)
  globals.css          # Tailwind import + CSS variables + @theme inline
  components/          # client components (Hero, About, Projects, Contact, Navigation, LoginModal)
  admin/               # admin panel (protected routes)
    layout.tsx         # admin layout with sidebar
    page.tsx           # dashboard
    login/page.tsx     # login page
    projetos/page.tsx  # CRUD projetos
    skills/page.tsx    # CRUD skills
    mensagens/page.tsx # visualizar mensagens
  api/
    auth/              # login, logout, me
    admin/             # CRUD APIs (stats, projects, skills, contacts)
    contact/route.ts   # contact form API endpoint
  generated/prisma/    # Prisma generated client (do not edit)
lib/
  prisma.ts            # singleton Prisma client with adapter
  auth.ts              # JWT helpers (createToken, verifyToken, getSession)
middleware.ts          # protects /admin/* routes
prisma/
  schema.prisma        # database schema (User, Project, Skill, Contact)
  seed.ts              # seed script (includes admin user)
```

Conventions:
- Use `app/` directory router, not `pages/`.
- Components go in `app/components/`.
- Use `@/` prefix for absolute imports (e.g., `import { prisma } from "@/lib/prisma"`).
- Server components fetch data; client components handle interactivity.

## Key Gotchas

- **Tailwind v4 is different**: No `tailwind.config.js`. Customization happens in `globals.css` via `@theme inline {}` blocks and CSS variables. Utility classes are imported with `@import "tailwindcss"`.
- **Next.js 16 breaking changes**: Check `node_modules/next/dist/docs/` before using APIs from memory. The `LayoutProps` type is used in layouts (see `app/layout.tsx:20`).
- **No .env committed**: `.env*` is gitignored. Create `.env` locally for DATABASE_URL.

## Prisma 7 Critical Details

Prisma 7 has **breaking changes** from older versions:

- **No `url` in schema**: The `datasource` block in `schema.prisma` only has `provider`. The URL is configured in `prisma.config.ts` and passed via environment variable.
- **Driver adapter required**: `PrismaClient` must receive an `adapter` option. For SQLite, use `@prisma/adapter-libsql`:
  ```typescript
  import { PrismaLibSql } from "@prisma/adapter-libsql";
  const adapter = new PrismaLibSql({ url: "file:./dev.db" });
  const prisma = new PrismaClient({ adapter });
  ```
- **Generated client location**: Output goes to `app/generated/prisma/`. Import from `@/app/generated/prisma/client` or `@/app/generated/prisma`.
- **Seed script needs adapter**: The seed file (`prisma/seed.ts`) must instantiate its own `PrismaClient` with the adapter. Run with `tsx prisma/seed.ts`.
- **Database path**: `DATABASE_URL="file:./dev.db"` is relative to where `npx prisma` runs (project root), not the prisma folder.
- **Force reset consent**: Running `prisma db push --force-reset` as AI requires user consent and `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION` env var.

## Linting

ESLint flat config in `eslint.config.mjs` uses `eslint-config-next` with core-web-vitals and typescript presets. No custom rules.
