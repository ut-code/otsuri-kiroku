<script lang="ts">
  import { getOrgBySlug, listInvites, createInvite, revokeInvite } from "$services/org/org.remote.ts";

  let { data } = $props<{ data: { slug: string } }>();
  const org = getOrgBySlug(data.slug);
  const invites = listInvites({ slug: data.slug });

  let role = $state<"admin" | "member">("member");
  let expiresInMinutes = $state(60 * 24);
  let creating = $state(false);
  let error = $state<string | null>(null);

  async function onCreate() {
    error = null;
    const o = org.current;
    if (!o) return;
    creating = true;
    try {
      await createInvite({ orgId: o.id, role, expiresInMinutes }).updates(listInvites({ slug: data.slug }));
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      creating = false;
    }
  }

  async function onRevoke(inviteId: string) {
    error = null;
    const o = org.current;
    if (!o) return;
    try {
      await revokeInvite({ orgId: o.id, inviteId }).updates(listInvites({ slug: data.slug }));
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }
</script>

<div class="space-y-6">
  <h2 class="text-xl font-semibold">Invites</h2>

  {#if error}
    <div class="alert alert-error"><span>{error}</span></div>
  {/if}

  <div class="card bg-base-200">
    <div class="card-body">
      <h3 class="card-title">Create invite</h3>
      <div class="flex items-end gap-2">
        <label class="form-control">
          <div class="label"><span class="label-text">Role</span></div>
          <select class="select select-bordered" bind:value={role}>
            <option value="member">member</option>
            <option value="admin">admin</option>
          </select>
        </label>
        <label class="form-control">
          <div class="label"><span class="label-text">Expires in (minutes)</span></div>
          <input type="number" class="input input-bordered" bind:value={expiresInMinutes} min={5} />
        </label>
        <button class="btn btn-primary" disabled={creating} onclick={onCreate}>
          {#if creating}
            <span class="loading loading-spinner"></span>
          {:else}
            Create
          {/if}
        </button>
      </div>
    </div>
  </div>

  <div class="card bg-base-200">
    <div class="card-body">
      <h3 class="card-title">Active invites</h3>
      {#await invites}
        <p>Loading…</p>
      {:then list}
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr><th>Token</th><th>Role</th><th>Expires</th><th>Link</th><th></th></tr>
            </thead>
            <tbody>
              {#each list as i (i.id)}
                <tr>
                  <td class="font-mono text-xs">{i.token}</td>
                  <td>{i.role}</td>
                  <td>{new Date(i.expiresAt).toLocaleString()}</td>
                  <td>
                    <input class="input input-bordered input-xs w-full" readonly value={`${location.origin}/invites/accept/${i.token}`} />
                  </td>
                  <td>
                    <button class="btn btn-ghost btn-sm text-error" onclick={() => onRevoke(i.id)}>Revoke</button>
                  </td>
                </tr>
              {:else}
                <tr><td colspan="5">No active invites.</td></tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/await}
    </div>
  </div>
</div>
