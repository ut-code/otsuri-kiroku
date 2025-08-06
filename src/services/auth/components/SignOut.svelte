<script lang="ts">
  // TODO: add confirmation dialog
  import { signOut, useSession } from "../auth-client.ts";

  interface Props {
    disabled?: boolean;
  }

  const { disabled = false }: Props = $props();

  let processing = $state(false);
  const session = useSession();

  async function handleSignOut() {
    try {
      processing = true;
      await signOut();
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      processing = false;
    }
  }

  const canSignOut = $derived(!!$session.data?.user);
  const buttonDisabled = $derived(!canSignOut || processing || disabled);
</script>

<button
  type="button"
  class="btn btn-error"
  onclick={handleSignOut}
  disabled={buttonDisabled}
>
  {#if processing}
    Signing out...
  {:else}
    Sign Out
  {/if}
</button>
