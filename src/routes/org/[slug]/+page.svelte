<script lang="ts">
  import { resolve } from "$app/paths";
  import { getOrgBySlug, listMembers } from "$services/org/org.remote.ts";

  let { data } = $props<{ data: { slug: string } }>();
  const org = getOrgBySlug(data.slug);
  const members = listMembers({ slug: data.slug });
</script>

<section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <div class="card bg-base-200">
    <div class="card-body">
      <h2 class="card-title">Organization</h2>
      {#await org}
        <p>Loading…</p>
      {:then o}
        <p class="text-sm text-base-content/70">ID: {o.id}</p>
        {#if o.image}
          <img src={o.image} alt={o.name} class="w-24 rounded" />
        {/if}
      {/await}
    </div>
  </div>

  <div class="card bg-base-200">
    <div class="card-body">
      <h2 class="card-title">Members</h2>
      {#await members}
        <p>Loading members…</p>
      {:then list}
        <ul class="space-y-2">
          {#each list as m (m.user.id)}
            <li class="flex items-center gap-3">
              {#if m.user.image}
                <img src={m.user.image} alt={m.user.name} class="size-6 rounded" />
              {/if}
              <span>{m.user.name}</span>
              <span class="badge badge-sm">{m.role}</span>
            </li>
          {:else}
            <li>No members.</li>
          {/each}
        </ul>
      {/await}
      <div class="card-actions">
        <a class="btn btn-sm" href={resolve(`/org/[slug]/members`, { slug: data.slug })}>Manage members</a>
      </div>
    </div>
  </div>
</section>
