<script lang="ts">
  import { resolve } from "$app/paths";
  import { goto } from "$app/navigation";
  import { signIn, signOut, useSession } from "$services/auth/auth-client.ts";
  let returnTo = $state("/");

  $effect(() => {
    if (typeof window !== "undefined") {
      returnTo = `${window.location.pathname}${window.location.search}`;
    }
  });

  const session = useSession();


  async function handleSignOut() {
    await signOut();
    await goto(resolve("/"));
  }

  async function handleGoogleSignIn() {
    await signIn.social({
      provider: "google",
      callbackURL: returnTo,
    });
  }
</script>

{#if $session.data?.user}
  <div class="dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
      {#if $session.data.user.image}
        <div class="w-10 rounded-full">
          <img
            alt="Profile"
            src={$session.data.user.image} />
        </div>
      {:else}
        <div class="w-10 h-10 rounded-full bg-neutral flex items-center justify-center">
          <span class="text-neutral-content font-semibold">
            {$session.data.user.name?.[0] ?? $session.data.user.email[0].toUpperCase()}
          </span>
        </div>
      {/if}
    </div>
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
      <li class="menu-title">
        <span>Signed in as</span>
        <span class="text-sm opacity-70">{$session.data.user.email}</span>
      </li>
      <!-- Profile/Settings routes not implemented → hide until ready -->
      <div class="divider my-1"></div>
      <li><button onclick={handleSignOut}>Sign Out</button></li>
    </ul>
  </div>
{:else}
  <div class="flex gap-2">
    <button class="btn btn-outline btn-sm" onclick={handleGoogleSignIn}>
      Sign In with Google
    </button>
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a href={`${resolve('/auth/signin')}?redirectTo=${encodeURIComponent(returnTo)}`} class="btn btn-primary btn-sm">
      Sign In
    </a>
  </div>
{/if}
