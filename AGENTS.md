# Unified Agent Guide

This file consolidates and deduplicates guidance from AGENTS.md and CLAUDE.md. It focuses on important, non‑trivial rules for working in this repo.

## Overview
- Runtime: Bun (not Node.js). Framework: SvelteKit + Svelte 5 (runes).
- Key pattern: Experimental Remote Functions for type‑safe client↔server.
- Build output: `target/` directory (not `dist/`).

## Project Structure & Aliases
- `src/routes/` — SvelteKit routes (e.g., `+page.svelte`, `+layout.svelte`).
- `src/lib/remote/` — Remote Functions (`*.remote.ts`) used by UI.
- `src/services/` — Server/domain logic (`*.server.ts`), Prisma, auth.
- `src/lib/components/` — Reusable Svelte components.
- `prisma/` — Prisma schema (`schema.prisma`, SQLite).
- `.storybook/` and `src/stories/` — Storybook config and stories.
- `static/`, `docs/`, `target/` — Static files, documentation, build output.
- Aliases: `$remote` → `./src/lib/remote`, `$services` → `./src/services`, `@` → `./src` (see `svelte.config.js`).

## Commands
- `bun install --frozen-lockfile` — Install deps.
- `bun dev` — Dev server at `http://localhost:3000`.
- `bun run build` / `bun preview` — Build to `target/` and preview.
- `bun check` — Type, lint, and format checks. Use `bun fix` to auto‑fix.
- Storybook: `bun storybook` (port 6006) / `bun build-storybook`.
- Prisma: `bunx prisma db push` (apply schema), `bunx prisma studio`, `bunx prisma generate`.

## Code Style & Conventions
- Formatting: Biome (tabs, double quotes) + Prettier (Svelte, Tailwind plugin).
- Linting: ESLint flat config.
- Import rule: Local TS imports must include `.ts`; SvelteKit virtual modules (e.g., `$app/stores`) do not. Example: `import { foo } from "@/lib/utils.ts"`.
- File patterns: `*.server.ts` for server‑only; `*.remote.ts` for Remote Functions; components use `PascalCase.svelte`.

## Svelte 5 Runes (Essentials)
- Read https://svelte.dev/llms.txt before writing Svelte.
- Use `$state(...)` for reactive values, `$effect(() => ...)` for side effects, `$derived(expr)` for derived values; `$inspect(var)` for debugging.

## Remote Functions Pattern
- Flow: Component → Remote Query (`src/lib/remote`) → Server Service (`src/services`).
- Remote queries return an object with `.current` (state) and `.refresh()` (revalidate/update).

## Testing
- Storybook‑driven testing. Create `*.stories.svelte|ts` next to components.
- Use `storybook/test` in `play` for interactions (e.g., `expect`, `userEvent`, `within`).
- No separate test runner or coverage threshold; cover critical UI states.

## Database
- SQLite via Prisma. Keep schema in `prisma/schema.prisma` and apply with `bunx prisma db push`.

## Security & Configuration
- Required env vars (validated in `src/lib/env.server.ts` with Valibot): `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- Use a local `.env`; never commit secrets.

## Commit & PR
- Use concise, imperative commits (e.g., `feat: ...`, `fix: ...`).
- Before PR: run `bun check` and `bun run build`; include UI screenshots when relevant.
- If DB schema changes, update `prisma/schema.prisma` and run `bunx prisma db push`.

## HTML Rules (Local)
- Links that navigate must be `<a>` (even if styled like a button).
- If an input has a label, nest the input inside `<label>`. If not possible, use `$props.id()` instead of a static `id` string.

## Docs
- See `docs/architecture.md`, `docs/development.md`, and `docs/deployment.md` for deeper details.
