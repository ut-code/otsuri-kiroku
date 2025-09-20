<script lang="ts">
  import { resolve } from "$app/paths";
  import { goto } from "$app/navigation";
  import { createOrg } from "$services/org/org.remote.ts";

  let name = $state("");
  let err = $state<string | null>(null);
  let processing = $state(false);

  async function submit() {
    err = null;
    processing = true;
    try {
      const org = await createOrg({ name });
      // Navigate to the new org
      await goto(resolve(`/org/${org.slug}`));
    } catch (e) {
      err = e instanceof Error ? e.message : String(e);
    } finally {
      processing = false;
    }
  }
</script>

<div class="max-w-xl mx-auto p-6 space-y-4">
  <a class="btn btn-ghost btn-sm" href={resolve(`/`)}>← Home</a>
  <h1 class="text-2xl font-semibold">Create Organization</h1>

  {#if err}
    <div class="alert alert-error">
      <span>{err}</span>
    </div>
  {/if}

  <form
    class="space-y-4"
    onsubmit={(e) => {
      e.preventDefault();
      submit();
    }}
  >
    <label class="form-control">
      <div class="label"><span class="label-text">Name</span></div>
      <input
        class="input input-bordered w-full"
        bind:value={name}
        placeholder="Acme Inc"
      />
    </label>
    <button type="submit" class="btn btn-primary" disabled={processing}>
      {#if processing}
        <span class="loading loading-spinner"></span> Creating…
      {:else}
        Create
      {/if}
    </button>
  </form>
</div>
