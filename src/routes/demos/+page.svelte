<script lang="ts">
  import { resolve } from "$app/paths";
</script>

<div class="container mx-auto max-w-4xl p-8">
  <div class="mb-4">
    <a href={resolve(`/`)} class="btn btn-ghost btn-sm">← Back to Home</a>
  </div>
  
  <h1 class="text-4xl font-bold mb-8">Demo Pages</h1>

  <p class="text-lg text-base-content/70 mb-8">
    Explore the various features and components of this SvelteKit application.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Hello Demo</h2>
        <p class="text-base-content/70">
          Simple example demonstrating remote functions and reactive state management.
        </p>
        <div class="card-actions justify-end">
          <a href={resolve(`/demos/hello`)} class="btn btn-primary">View Demo</a>
        </div>
      </div>
    </div>
    <div class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Authentication Demo</h2>
        <p class="text-base-content/70">
          User authentication system with Google OAuth integration and session management.
        </p>
        <div class="card-actions justify-end">
          <a href={resolve(`/demos/auth`)} class="btn btn-primary">View Demo</a>
        </div>
      </div>
    </div>
  </div>
</div>
