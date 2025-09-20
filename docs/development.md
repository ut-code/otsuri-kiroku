# Development Guide

## ESLint Configuration Notes

### File Extension Requirements

The project requires `.ts` extensions for local TypeScript imports but not for SvelteKit virtual modules.

**Challenge encountered:** The standard `eslint-plugin-import`'s `import/extensions` rule has difficulty distinguishing between local files (which should require `.ts` extensions) and SvelteKit's virtual modules (`$app/*`, `$env/*`) which don't have file extensions.

**Solution:** Using `eslint-plugin-file-extension-in-import-ts` which properly handles this distinction automatically.

- ✅ Local imports: `import { foo } from "$lib/utils.ts"`
- ✅ Virtual modules: `import { page } from "$app/stores"`

## Setup

Prerequisites: Install Bun and Node.js
Note: App runtime is Bun, but Prisma CLI/Studio require Node.js.

```sh
bun install --frozen-lockfile

# Initialize / update SQLite schema
bunx prisma db push
```

Note: `bunx prisma ...` commands require Node.js to be installed.

## Development Commands

- `bun dev` - Start development server
- `bun run build` - Build for production (outputs to `target/` directory)
- `bun preview` - Preview production build
- `bun check` - Run both linting and type checking
- `bun run check:type` - Type check with svelte-check
- `bun run check:lint` - Run linting with prettier and eslint
- `bun fix` - Auto-fix code formatting with prettier
- `bun storybook` - Start Storybook development server on port 6006
- `bun build-storybook` - Build Storybook for production

## Environment Variables

Define these in a local `.env` (do not commit secrets):

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

## Code Style

- **Linting**: ESLint with Prettier integration
- **Formatting**: Biome with tab indentation and double quotes
- **Type Checking**: TypeScript with strict mode enabled

## Testing

- Storybook with addon-vitest for component testing
- No traditional test runner configured - uses Storybook's testing capabilities

## UI/UX Features

### Responsive Design

- **Mobile-First**: TailwindCSS mobile-first responsive design
- **DaisyUI Components**: Pre-built accessible components
- **Loading States**: Consistent loading indicators across the application
- **Error Handling**: User-friendly error messages and states

### Navigation & Layout

- **Clean Navigation**: Breadcrumb navigation between sections
- **Card-based Layout**: Consistent card design pattern
- **Responsive Grid**: Mobile and desktop optimized layouts

### Component Location

- All components live under `src/services/<service>/components/` next to their service logic.
- Do not place components in `src/lib`. Reserve `src/lib` for non-UI shared code (e.g., utilities).

## Remote Functions Pattern

### Type-Safe Communication

- **Query Functions**: Server-side data fetching with client-side reactivity
- **Command Functions**: Server-side mutations with validation
- **Automatic Caching**: Built-in caching and state management
- **Real-time Updates**: Reactive queries with `.refresh()` methods
- **Location**: Place `*.remote.ts` under `src/services/<service>/` alongside related `*.server.ts` logic
