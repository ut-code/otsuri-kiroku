<script lang="ts">
  import OrgSwitcher from "$services/org/components/OrgSwitcher.svelte";
  import { resolve } from "$app/paths";
  
</script>

<div class="container mx-auto max-w-4xl p-8">
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-semibold">Aida - お釣り記録</h1>
    <div class="flex items-center gap-2">
      <a href={resolve(`/org/new`)} class="btn btn-sm">New Organization</a>
      <OrgSwitcher />
    </div>
  </div>

  <p class="text-lg text-base-content/70 mb-8">
    Welcome to the fishing record app built with SvelteKit and experimental
    remote functions.
  </p>

  <div class="card bg-base-200 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">For Developers</h2>
      <p class="text-base-content/70">
        Explore the demo pages to see various features and components in action.
      </p>
      <div class="card-actions justify-end">
        <a href={resolve(`/demos`)} class="btn btn-primary">View Demos</a>
      </div>
    </div>
  </div>
</div>
