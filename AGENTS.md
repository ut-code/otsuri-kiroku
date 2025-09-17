# Unified Agent Guide

This file consolidates and deduplicates guidance from AGENTS.md and CLAUDE.md. It focuses on important, non‑trivial rules for working in this repo.

## Overview
- Runtime: Bun (not Node.js). Framework: SvelteKit + Svelte 5 (runes).
- Key pattern: Experimental Remote Functions for type‑safe client↔server.
- Build output: `target/` directory (not `dist/`).

## Project Structure & Aliases
- `src/routes/` — SvelteKit routes (e.g., `+page.svelte`, `+layout.svelte`).
- `src/services/` — Service modules per domain (`src/services/<service>`): Remote Functions (`*.remote.ts`), server/domain logic (`*.server.ts`), and components (`components/`).
- `prisma/` — Prisma schema (`schema.prisma`, SQLite).
- `.storybook/` and `src/stories/` — Storybook config and stories.
- `static/`, `docs/`, `target/` — Static files, documentation, build output.
- Aliases: `$services` → `./src/services`, `@` → `./src` (see `svelte.config.js`).

## Commands
- `bun install --frozen-lockfile` — Install deps.
- `bun dev` — Dev server at `http://localhost:3000`.
- `bun run build` / `bun preview` — Build to `target/` and preview.
- `bun check` — Type, lint, and format checks. Use `bun fix` to auto‑fix.
- Storybook: `bun storybook` (port 6006) / `bun build-storybook`.
- Prisma: `bunx prisma db push` (apply schema), `bunx prisma studio`, `bunx prisma generate`.

## Code Style & Conventions
- Formatting: Biome (tabs, double quotes) + Prettier (Svelte, Tailwind plugin). Always auto‑format; do not hand‑tweak around formatter output.
- Linting: ESLint flat config. Prefer fixes via `bun fix`; only disable rules with a clear justification.
- Imports: All local TypeScript imports (relative or aliased) must include the `.ts` extension. Do not rely on extensionless resolution.
  - Allowed exceptions: SvelteKit virtual modules (e.g., `$app/stores`) and bare package imports from `node_modules`.
  - Examples:
    - `import { foo } from "@/lib/utils.ts"`
    - `import { query } from "$services/users/users.remote.ts"`
    - `import { doThing } from "../helpers/do-thing.ts"`
- File patterns: `*.server.ts` for server‑only; `*.remote.ts` for Remote Functions; components use `PascalCase.svelte`.

### Formatting Guidelines
- Indentation: tabs. Quotes: double quotes. Let the formatter decide spacing and wrapping.
- Keep one statement per line; end statements with semicolons (formatter enforces).
- Ensure files end with a newline; no trailing whitespace (formatter enforces).
- Prefer named exports over default when reasonable; one module per concern.
- Keep import groups clean: external packages first, then aliased (`@`, `$services`), then relative paths.
- Run `bun check` locally; use `bun fix` to apply lint/format fixes before PRs.

### Component Location
- Place all components under `src/services/<service>/components/` next to their service logic.
- Do not use `src/lib/components/`. Keep `src/lib` for non-UI shared code (e.g., utilities).

## Svelte 5 Only — Always Use Runes
- Always write components with Svelte 5 runes. Do not use legacy `$:` reactive declarations or Svelte 3/4 patterns.
- Prefer `$state`, `$derived`, `$effect`, `$inspect`, and `$props()` for reactivity and props.
- Keep local UI state in `$state(...)`; avoid writable stores for purely local component state.
- Read https://svelte.dev/llms.txt before writing Svelte.

## Remote Functions Pattern
- Location: co-locate per domain under `src/services/<service>/*.remote.ts` alongside related `*.server.ts`.
- Flow: Component → Remote Function (`src/services/<service>/*.remote.ts`) → Service logic (`*.server.ts`).
- Remote functions return an object with `.current` (state) and `.refresh()` (revalidate/update).

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

## Docs
- See `docs/architecture.md`, `docs/development.md`, and `docs/deployment.md` for deeper details.

## HTML Rules (Local)
- Links that navigate must be `<a>` (even if styled like a button).
- If an input has a label, nest the input inside `<label>`. If not possible, use `$props.id()` instead of a static `id` string.

## Svelte Rules

Always favor these Svelte 5 patterns in new and updated files.
Basic state, derived value, and effect:

```svelte
<script lang="ts">
  const count = $state(0);
  const doubled = $derived(count * 2);

  $effect(() => {
    console.debug("count changed:", count);
  });
</script>

<button on:click={() => count++}>Clicked {count} times</button>
<p>Doubled: {doubled}</p>
```

Props with types and defaults via `$props()`:

```svelte
<script lang="ts">
  // Declare and type props with defaults
  const { label = "Submit", start = 1 } = $props<{
    label?: string;
    start?: number;
  }>();

  const clicks = $state(start);
</script>

<button on:click={() => clicks++}>{label}: {clicks}</button>
```

Async side effect (fetch on mount or when deps change):

```svelte
<script lang="ts">
  const userId = $state<string | null>(null);
  const profile = $state<{ name: string } | null>(null);

  $effect(async () => {
    if (!userId) return;
    const res = await fetch(`/api/profile/${userId}`);
    profile = await res.json();
  });
</script>

{#if profile}
  <h2>{profile.name}</h2>
{/if}
```

Readable forms and IDs (follow local HTML rules):

```svelte
<script lang="ts">
  const email = $state("");

  // If you cannot nest the input inside <label>, generate an id
  const inputId = $props.id();
</script>

<!-- Preferred: nest input inside label -->
<label>
  Email
  <input type="email" bind:value={email} />
  <small>We never share your email.</small>
  
</label>

<!-- If nesting isn’t possible, use generated id instead of a static string -->
<label for={inputId}>Email</label>
<input id={inputId} type="email" bind:value={email} />
```

Debugging with `$inspect`:

```svelte
<script lang="ts">
  const data = $state({ ready: false });
  $inspect(data); // logs value and updates as it changes
</script>
```

