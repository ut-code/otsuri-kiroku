<script lang="ts">
  import { resolve } from "$app/paths";
  import { getOrgBySlug } from "$services/org/org.remote.ts";
  let { data, children } = $props<{ data: { slug: string }; children: () => unknown }>();
  const org = getOrgBySlug(data.slug);
</script>

{#await org}
  <div class="p-4">Loading…</div>
{:then o}
  <div class="container mx-auto max-w-6xl px-6 pt-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        {#if o.image}
          <img src={o.image} alt={o.name} class="size-7 rounded" />
        {/if}
        <a
          href={resolve(`/org/[slug]`, { slug: o.slug })}
          class="btn btn-ghost btn-sm normal-case gap-2"
        >
          <span class="text-lg font-semibold">{o.name}</span>
          <span class="badge badge-outline">/{o.slug}</span>
        </a>
      </div>
      <span></span>
    </div>
  </div>
  {@render children()}
{/await}
