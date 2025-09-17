<script lang="ts">
  import { listMembers, addMember, removeMember, changeMemberRole, getOrgBySlug } from "$services/org/org.remote.ts";

  let { data } = $props<{ data: { slug: string } }>();
  const org = getOrgBySlug(data.slug);
  const members = listMembers({ slug: data.slug });

  let newUserId = $state("");
  let newRole = $state<"admin" | "member">("member");
  let busy = $state<string | null>(null);
  let error = $state<string | null>(null);

  async function onAdd() {
    error = null;
    const o = org.current;
    if (!o) return;
    busy = "add";
    try {
      await addMember({ orgId: o.id, userId: newUserId, role: newRole }).updates(listMembers({ slug: data.slug }));
      newUserId = "";
      newRole = "member";
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      busy = null;
    }
  }

  async function onRemove(userId: string) {
    error = null;
    const o = org.current;
    if (!o) return;
    busy = `remove:${userId}`;
    try {
      await removeMember({ orgId: o.id, userId }).updates(listMembers({ slug: data.slug }));
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      busy = null;
    }
  }

  async function onChangeRole(userId: string, role: "admin" | "member") {
    error = null;
    const o = org.current;
    if (!o) return;
    busy = `role:${userId}`;
    try {
      await changeMemberRole({ orgId: o.id, userId, role }).updates(listMembers({ slug: data.slug }));
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      busy = null;
    }
  }
</script>

<div class="space-y-6">
  <h2 class="text-xl font-semibold">Members</h2>

  {#if error}
    <div class="alert alert-error"><span>{error}</span></div>
  {/if}

  <div class="card bg-base-200">
    <div class="card-body">
      <h3 class="card-title">Add member</h3>
      <div class="flex gap-2 items-end">
        <label class="form-control flex-1">
          <div class="label"><span class="label-text">User ID</span></div>
          <input class="input input-bordered w-full" bind:value={newUserId} placeholder="user_..." />
        </label>
        <label class="form-control">
          <div class="label"><span class="label-text">Role</span></div>
          <select class="select select-bordered" bind:value={newRole}>
            <option value="member">member</option>
            <option value="admin">admin</option>
          </select>
        </label>
        <button class="btn btn-primary" disabled={busy === "add" || !newUserId} onclick={onAdd}>
          {#if busy === "add"}
            <span class="loading loading-spinner"></span>
          {:else}
            Add
          {/if}
        </button>
      </div>
    </div>
  </div>

  <div class="card bg-base-200">
    <div class="card-body">
      <h3 class="card-title">Current members</h3>
      {#await members}
        <p>Loading…</p>
      {:then list}
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr><th>User</th><th>Role</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {#each list as m (m.user.id)}
                <tr>
                  <td>
                    <div class="flex items-center gap-2">
                      {#if m.user.image}
                        <img src={m.user.image} alt={m.user.name} class="size-6 rounded" />
                      {/if}
                      <span>{m.user.name}</span>
                    </div>
                  </td>
                  <td>
                    {#if m.role === "owner"}
                      <span class="badge">owner</span>
                    {:else}
                      <select class="select select-bordered select-sm" value={m.role} onchange={(e) => onChangeRole(m.user.id, (e.currentTarget as HTMLSelectElement).value as "admin" | "member")} disabled={busy?.startsWith("role:")}
                      >
                        <option value="member" selected={m.role === "member"}>member</option>
                        <option value="admin" selected={m.role === "admin"}>admin</option>
                      </select>
                    {/if}
                  </td>
                  <td>
                    <button class="btn btn-ghost btn-sm text-error" disabled={m.role === "owner" || busy === `remove:${m.user.id}`} onclick={() => onRemove(m.user.id)}>
                      {#if busy === `remove:${m.user.id}`}
                        <span class="loading loading-spinner loading-xs"></span>
                      {:else}
                        Remove
                      {/if}
                    </button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/await}
    </div>
  </div>
</div>
