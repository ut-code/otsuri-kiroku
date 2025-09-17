<script lang="ts">
  import { resolve } from "$app/paths";
  import { getOrgBySlug } from "$services/org/org.remote.ts";

  let { data, children } = $props<{ data: { slug: string }; children: () => unknown }>();
  const org = getOrgBySlug(data.slug);
</script>

{#await org}
  <div class="p-6">Loading organization…</div>
{:then o}
  <div class="container mx-auto max-w-6xl p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        {#if o.image}
          <img src={o.image} alt={o.name} class="size-8 rounded" />
        {/if}
        <h1 class="text-xl font-semibold">{o.name}</h1>
        <span class="badge badge-outline">/{o.slug}</span>
      </div>
      <nav class="tabs tabs-boxed">
        <a class="tab" href={resolve(`/org/[slug]`, { slug: o.slug })}>Home</a>
        <a class="tab" href={resolve(`/org/[slug]/members`, { slug: o.slug })}>Members</a>
        <a class="tab" href={resolve(`/org/[slug]/invites`, { slug: o.slug })}>Invites</a>
        <a class="tab" href={resolve(`/org/[slug]/settings`, { slug: o.slug })}>Settings</a>
      </nav>
    </div>
    {@render children()}
  </div>
{/await}
