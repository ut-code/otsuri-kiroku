<script lang="ts">
  import type { User } from "better-auth/types";

  interface Props {
    signOut?: () => Promise<void>;
    user: User;
  }
  const { signOut, user }: Props = $props();
</script>

<span class="text-lg text-success">✅ Authenticated</span>

<div class="space-y-2">
  {#if user.image}
    <div class="flex items-center gap-2">
      <img src={user.image} alt="Profile" class="w-16 h-16 rounded-full" />
    </div>
  {/if}
  {#if user.name}
    <p class="text-lg font-bold">{user.name}</p>
  {/if}
  <p><strong>User ID:</strong> {user.id}</p>
  <p>
    <strong>Email:</strong>
    {user.email}
    {#if user.emailVerified}
      <span class="text-success">✅ Verified</span>
    {:else}
      <span class="text-error">❌ Not Verified</span>
    {/if}
  </p>
  <p>
    <strong>Created At:</strong>
    {new Date(user.createdAt).toLocaleString()}
  </p>
</div>

{#if signOut}
  <div class="card-actions justify-end mt-4">
    <button class="btn btn-error" onclick={signOut}> Sign Out </button>
  </div>
{/if}
