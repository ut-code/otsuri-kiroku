# Deployment Guide

## Production Build

```sh
bun run build
```

This creates a production build in the `target/` directory (not `dist/`).

## Starting Production Server

```sh
cd target
bun start
```

The production server uses the svelte-adapter-bun adapter, optimized for Bun runtime.

## Build Output

- Build artifacts are located in `target/` directory
- The adapter is configured to output to `target/` in `svelte.config.js`
- Production server runs with Bun, not Node.js