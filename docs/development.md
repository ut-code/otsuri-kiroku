# Development Guide

## ESLint Configuration Notes

### File Extension Requirements

The project requires `.ts` extensions for local TypeScript imports but not for SvelteKit virtual modules.

**Challenge encountered:** The standard `eslint-plugin-import`'s `import/extensions` rule has difficulty distinguishing between local files (which should require `.ts` extensions) and SvelteKit's virtual modules (`$app/*`, `$env/*`) which don't have file extensions.

**Solution:** Using `eslint-plugin-file-extension-in-import-ts` which properly handles this distinction automatically.

- ✅ Local imports: `import { foo } from "$lib/utils.ts"`
- ✅ Virtual modules: `import { page } from "$app/stores"`

## Setup

Prerequisites: Install Bun and Node.js (npm not required)

```sh
bun install
```

## Development Commands

- `bun dev` - Start development server
- `bun build` - Build for production (outputs to `target/` directory)
- `bun preview` - Preview production build
- `bun check` - Run both linting and type checking
- `bun run check:type` - Type check with svelte-check
- `bun run check:lint` - Run linting with prettier and eslint
- `bun fix` - Auto-fix code formatting with prettier
- `bun storybook` - Start Storybook development server on port 6006
- `bun build-storybook` - Build Storybook for production

## Code Style

- **Linting**: ESLint with Prettier integration
- **Formatting**: Biome with tab indentation and double quotes
- **Type Checking**: TypeScript with strict mode enabled

## Testing

- Storybook with addon-vitest for component testing
- No traditional test runner configured - uses Storybook's testing capabilities
