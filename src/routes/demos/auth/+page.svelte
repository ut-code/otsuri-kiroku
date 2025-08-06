<script lang="ts">
  import { sessionQuery } from "$remote/auth.remote.ts";
  import { signOut, useSession } from "$services/auth/auth-client.ts";
  import GoogleLoginButton from "$services/auth/components/GoogleLoginButton.svelte";
  import UserInfo from "./UserInfo.svelte";

  const session = useSession();
  const remoteSession = sessionQuery();

  let forceEnableGoogleLogin = $state(false);
</script>

<div class="container mx-auto max-w-6xl p-8">
  <div class="mb-4">
    <a href="/demos" class="btn btn-ghost btn-sm">← Back to Demos</a>
  </div>

  <h1 class="text-3xl font-bold mb-8">Authentication Demo</h1>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">User Info (client-side)</h2>
        {#if $session.isPending}
          <p class="text-center text-base-content/70">Loading...</p>
        {:else if $session.data?.user}
          <UserInfo user={$session.data.user} />
        {:else}
          <p class="text-center text-base-content/70">Logged out</p>
        {/if}
      </div>
    </section>

    <section class="card bg-base-200 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">User Info (server-side)</h2>
        {#await remoteSession}
          <p class="text-center text-base-content/70">Loading...</p>
        {:then session}
          {#if session?.user}
            <UserInfo user={session.user} />
          {:else}
            <p class="text-center text-base-content/70">Logged out</p>
          {/if}
        {/await}
      </div>
    </section>
  </div>

  <section class="card bg-base-200 shadow-xl mt-8">
    <div class="card-body">
      <h2 class="card-title">Actions</h2>
      <div class="card-actions">
        <GoogleLoginButton
          callbackURL="/demos/auth"
          disabled={!!$session.data?.user && !forceEnableGoogleLogin}
        />
        {#if $session.data?.user}
          <button
            class="btn btn-error"
            onclick={async () => {
              await signOut();
            }}
          >
            Sign Out
          </button>
        {/if}

        <span class="flex-grow"></span>
        <label class="text-sm text-base-content/70">
          Force enable Google login
          <input
            type="checkbox"
            bind:checked={forceEnableGoogleLogin}
            class="toggle"
          />
        </label>
      </div>
    </div>
  </section>
</div>
