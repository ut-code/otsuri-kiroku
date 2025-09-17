# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

- This is a Memo-app built with SvelteKit and Bun runtime, using experimental remote functions for server-client communication.

## Quick Reference

### Essential Commands

- `bun dev` - Start development server (port 3000)
- `bun run build` - Build for production (outputs to `target/` directory)
- `bun preview` - Preview production build
- `bun check` - Run all checks (type + lint + format)
- `bun check:type` - Type check only with svelte-check
- `bun check:lint` - Lint only with ESLint
- `bun check:format` - Format check only with Prettier
- `bun fix` - Auto-fix formatting and linting issues
- `bun storybook` - Start Storybook server (port 6006)

### Database Commands

- `bunx prisma db push` - Update/create database schema
- `bunx prisma studio` - Open Prisma Studio for database management
- `bunx prisma generate` - Generate Prisma client

refer to `README.md` for more specific and up-to-date information.

Note: Prisma CLI/Studio require Node.js to be installed (app runtime is Bun).

### Key Directories

- `src/services/` - Domain services and Remote Functions (client/server colocated); all components live in `src/services/<service>/components/`

### Path Aliases

- `$services` → `./src/services`
- `@` → `./src`

## Documentation

For detailed information, see:

- **[Development Guide](docs/development.md)** - Setup, commands, testing, and code style
- **[Architecture](docs/architecture.md)** - Technical architecture, remote functions pattern, and examples
- **[Deployment](docs/deployment.md)** - Production builds and server setup

## Stack Summary

- **Runtime**: Bun (not Node.js)
- **Framework**: SvelteKit + Svelte 5 (runes API)
- **Database**: Prisma + SQLite with Better Auth integration
- **Styling**: TailwindCSS v4 + DaisyUI
- **Testing**: Storybook with addon-vitest (no traditional test runner)
- **Build Output**: Uses `target/` directory (not typical `dist/`)
- **Key Feature**: Experimental remote functions for type-safe server-client communication

## Rules When Coding

- Always create spec file before writing a new feature.

- When you are to write svelte, always read <https://svelte.dev/llms.txt> before writing.
  - Highlighted points are:
    - Use `$state` for reactive variables. Good: `let count = $state(0)`, Bad: `let count = 0`
    - Use `$effect` for side effects. Good: `let count = $state(0); $effect(() => console.log(count))`, Bad: `let count = 0; $: console.log(count)`
    - Use `$derived` for derived values. Good: `let count = $state(0); let doubleCount = $derived(count * 2)`, Bad: `let count = 0; $: doubleCount = count * 2`
    - Use `$inspect` for debugging. Good: `let count = $state(0); $inspect(count)`

- Use experimental remote functions for server-client communication.
  - Remote functions should be under `src/services/<service>/*.remote.ts`, next to `*.server.ts`.
  - Pattern: Component → Remote Function → Service logic
  - Remote functions return objects with `.current` and `.refresh()`

- **Import Requirements**: Local TypeScript imports must include `.ts` extensions
  - ✅ Local imports: `import { foo } from "$lib/utils.ts"`
  - ✅ Virtual modules: `import { page } from "$app/stores"` (no extension needed)
  - Uses `eslint-plugin-file-extension-in-import-ts` for enforcement

- After writing code, always run `bun check` to check for type errors and format errors.
  - if you find formatting errors, run `bun fix` to fix.

### HTML Local Rules

- For "elements that lead users to a new page on click", always use `<a>` tag even if it looks like a button.
- If an input has a label, put it inside the label tag. if it's not possible, use `$props.id()` rune instead of static string.
