<script lang="ts">
  import { resolve } from "$app/paths";
  import { listUserOrgs, switchOrg } from "$services/org/org.remote.ts";

  const orgs = listUserOrgs();
  let switching = $state<string | null>(null);

  async function onSwitch(id: string) {
    switching = id;
    try {
      await switchOrg({ orgId: id }).updates(listUserOrgs());
    } finally {
      switching = null;
    }
  }
</script>

<div class="dropdown">
  <button type="button" class="btn btn-ghost">Organizations</button>
  <ul class="dropdown-content menu bg-base-100 rounded-box z-[1] w-72 p-2 shadow">
    {#await orgs}
      <li class="p-2 text-sm text-base-content/60">Loading organizations…</li>
    {:then list}
      {#each list as org (org.id)}
        <li>
          <a href={resolve(`/org/[slug]`, { slug: org.slug })} aria-disabled={switching === org.id} onclick={(e) => { e.preventDefault(); onSwitch(org.id); }}>
            <div class="flex items-center gap-2">
              {#if org.image}
                <img src={org.image} alt={org.name} class="size-6 rounded" />
              {/if}
              <span>{org.name}</span>
              {#if switching === org.id}
                <span class="loading loading-spinner loading-xs ml-auto"></span>
              {/if}
            </div>
          </a>
        </li>
      {:else}
        <li class="p-2 text-sm text-base-content/60">No organizations yet</li>
      {/each}
      <li class="mt-2"><a href={resolve(`/org/new`)} class="btn btn-sm btn-primary">Create organization</a></li>
    {/await}
  </ul>
</div>
