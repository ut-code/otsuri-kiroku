<script lang="ts">
  import { sessionQuery } from "$remote/auth.remote.ts";
  import { useSession } from "$services/auth/auth-client.ts";
  import GoogleLoginButton from "$services/auth/components/GoogleLogin.svelte";
  import SignOut from "$services/auth/components/SignOut.svelte";
  import UserInfo from "./UserInfo.svelte";

  const session = useSession();
  const remoteSession = sessionQuery();
</script>

<div class="container mx-auto max-w-6xl p-8">
  <div class="mb-4">
    <a href="/demos" class="btn btn-ghost btn-sm">← Back to Demos</a>
  </div>

  <h1 class="text-3xl font-bold mb-8">Authentication Demo</h1>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">User Info (obtained client-side)</h2>
        {#if $session.isPending}
          <p class="text-center text-base-content/70">Loading...</p>
        {:else if $session.data?.user}
          <span class="text-lg text-success">✅ Authenticated</span>
          <UserInfo user={$session.data.user} />
        {:else}
          <span class="text-lg text-error">❌ Not Authenticated</span>
        {/if}
      </div>
    </section>

    <section class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">
          User Info (obtained server-side)
          <button
            onclick={async () => await remoteSession.refresh()}
            class="btn btn-sm"
          >
            🔄 Refetch
          </button>
        </h2>
        {#await remoteSession}
          <p class="text-center text-base-content/70">Loading...</p>
        {:then session}
          {#if session?.user}
            <span class="text-lg text-success">✅ Authenticated</span>
            <UserInfo user={session.user} />
          {:else}
            <span class="text-lg text-error">❌ Not Authenticated</span>
          {/if}
        {/await}
      </div>
    </section>
  </div>

  <section class="card bg-base-200 shadow-xl mt-8">
    <div class="card-body">
      <h2 class="card-title">Actions</h2>
      <div class="card-actions">
        <GoogleLoginButton callbackURL="/demos/auth" />
        <SignOut />
      </div>
    </div>
  </section>
</div>
