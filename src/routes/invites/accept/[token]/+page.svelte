<script lang="ts">
  import { resolve } from "$app/paths";
  import { acceptInvite } from "$services/org/org.remote.ts";

  let { data } = $props<{ data: { token: string } }>();
  let status = $state<"idle" | "processing" | "done" | "error">("idle");
  let message = $state<string | null>(null);

  async function accept() {
    status = "processing";
    try {
      await acceptInvite({ token: data.token });
      status = "done";
    } catch (e) {
      status = "error";
      message = e instanceof Error ? e.message : String(e);
    }
  }
</script>

<div class="max-w-xl mx-auto p-6 space-y-4">
  <a class="btn btn-ghost btn-sm" href={resolve(`/`)}>← Home</a>
  <h1 class="text-2xl font-semibold">Accept Invitation</h1>

  {#if status === "idle"}
    <div class="space-y-4">
      <p>Click below to accept and join the organization.</p>
      <button class="btn btn-primary" onclick={accept}>Accept Invite</button>
    </div>
  {/if}

  {#if status === "processing"}
    <div class="space-y-4">
      <span class="loading loading-spinner"></span>
      <p>Joining…</p>
    </div>
  {/if}

  {#if status === "done"}
    <div class="alert alert-success">Invitation accepted. You can now navigate to your organization.</div>
  {/if}

  {#if status === "error"}
    <div class="alert alert-error">{message}</div>
  {/if}
</div>
