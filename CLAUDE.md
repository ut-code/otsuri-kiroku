# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

- This is a Memo-app built with SvelteKit and Bun runtime, using experimental remote functions for server-client communication.

## Quick Reference

### Essential Commands

- `bun dev` - Start development server
- `bun check` - Run all checks (lint + type)
- `bun fix` - Auto-fix formatting

refer to `README.md` for more specific and up-to-date information.

### Key Directories

- `src/lib/remote/` - Client-Server communication using Svelte Remote Functions
- `src/services/` - Business logic (includes server-side code and client-side code)

### Path Aliases

- `$remote` → `./src/lib/remote`
- `$services` → `./src/services`

## Documentation

For detailed information, see:

- **[Development Guide](docs/development.md)** - Setup, commands, testing, and code style
- **[Architecture](docs/architecture.md)** - Technical architecture, remote functions pattern, and examples
- **[Deployment](docs/deployment.md)** - Production builds and server setup

## Stack Summary

- **Runtime**: Bun (not Node.js)
- **Framework**: SvelteKit + Svelte 5 (runes API)
- **Styling**: TailwindCSS v4 + DaisyUI
- **Key Feature**: Experimental remote functions for type-safe server-client communication

## Rules When Coding

- Always consider spec before writing a new feature.

- When you are to write svelte, always read <https://svelte.dev/llms.txt> before writing.
  - Highlighted points are:
    - Use `$state` for reactive variables. Good: `let count = $state(0)`, Bad: `let count = 0`
    - Use `$effect` for side effects. Good: `let count = $state(0); $effect(() => console.log(count))`, Bad: `let count = 0; $: console.log(count)`
    - Use `$derived` for derived values. Good: `let count = $state(0); let doubleCount = $derived(count * 2)`, Bad: `let count = 0; $: doubleCount = count * 2`
    - Use `$inspect` for debugging. Good: `let count = $state(0); $inspect(count)`

- Use experimental remote functions for server-client communication.
  - Remote queries should be in `src/lib/remote/`

- After writing code, always run `bun check` to check for type errors and format errors.
  - if you find formatting errors, run `bun fix` to fix.
