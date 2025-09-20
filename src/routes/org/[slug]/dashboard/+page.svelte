<script lang="ts">
  import { getOrgBySlug, updateOrg } from "$services/org/org.remote.ts";

  let { data } = $props<{ data: { slug: string } }>();
  const org = getOrgBySlug(data.slug);

  let name = $state("");
  let image = $state("");
  let error = $state<string | null>(null);
  let saved = $state(false);

  $effect(() => {
    const o = org.current;
    if (o && !name) name = o.name;
    if (o && !image && o.image) image = o.image;
  });

  async function save() {
    error = null;
    saved = false;
    const o = org.current;
    if (!o) return;
    try {
      await updateOrg({ orgId: o.id, name, image });
      saved = true;
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }
</script>

<div class="space-y-6">
  <h2 class="text-xl font-semibold">Overview</h2>

  {#if error}
    <div class="alert alert-error"><span>{error}</span></div>
  {/if}
  {#if saved}
    <div class="alert alert-success"><span>Saved</span></div>
  {/if}

  <form class="card bg-base-200" onsubmit={(e) => { e.preventDefault(); save(); }}>
    <div class="card-body space-y-4">
      <label class="form-control">
        <div class="label"><span class="label-text">Name</span></div>
        <input class="input input-bordered w-full" bind:value={name} />
      </label>
      <label class="form-control">
        <div class="label"><span class="label-text">Image URL</span></div>
        <input class="input input-bordered w-full" bind:value={image} />
      </label>
      <div class="card-actions">
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </div>
  </form>
</div>
