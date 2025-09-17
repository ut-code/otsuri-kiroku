# Architecture

## Runtime & Framework

- **Runtime**: Bun (not Node.js)
- **Framework**: SvelteKit with Svelte 5 (using new runes API)
- **Adapter**: svelte-adapter-bun (builds to `target/` directory)
- **Styling**: TailwindCSS v4 with DaisyUI components

## Key Features

- **Remote Functions**: Uses SvelteKit's experimental `remoteFunctions` feature for type-safe server-client communication
- **Async Components**: Experimental async component support enabled
- **Storybook**: Component development and documentation

## Directory Structure

- `src/services/` - Domain services and Remote Functions per service; all components live in `src/services/<service>/components/`
- `src/routes/` - SvelteKit pages and layouts
- `src/lib/utils/` - Shared non-UI utilities
- `src/stories/` - Storybook component stories
- `target/` - Production build output (not `dist/`)

## Path Aliases

- `$services` → `./src/services`
- `$lib` → `./src/lib` (SvelteKit default)

Note: Local TypeScript imports must include the `.ts` extension. SvelteKit virtual modules (e.g., `$app/stores`) do not require extensions.

## Remote Function Pattern

The codebase uses SvelteKit's experimental remote functions for server communication:

1. **Server Services** (`src/services/<service>/*.server.ts`): Business logic
2. **Remote Functions** (`src/services/<service>/*.remote.ts`): Client-facing remote API for the service
3. **Component Usage**: Components import and use remote functions for reactive server data

Example flow: `Component` → `helloQuery` (remote) → `HelloService` (server)

### Example Implementation

**Server Service** (`src/services/hello/hello.server.ts`):

```typescript
export class HelloService {
  async hello() {
    // Business logic here
    return "Hello, World!";
  }
}
```

**Remote Function** (`src/services/hello/hello.remote.ts`):

```typescript
import { query } from "$app/server";
import { HelloService } from "$services/hello/hello.server.ts";

const helloService = new HelloService();

export const helloQuery = query(async () => {
  return await helloService.hello();
});
```

**Component Usage**:

```svelte
<script>
  import { helloQuery } from "$services/hello/hello.remote.ts";

  const hello = helloQuery();
</script>

<p>{hello.current}</p>
<button onclick={() => hello.refresh()}>Refresh</button>
```
