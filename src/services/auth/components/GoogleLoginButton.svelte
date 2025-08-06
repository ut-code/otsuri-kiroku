<script lang="ts">
  import { signIn } from "../auth-client.ts";

  interface Props {
    callbackURL?: string;
    disabled?: boolean;
  }
  const { callbackURL, disabled }: Props = $props();

  let processing = $state(false);
  async function handleGoogleAuth() {
    try {
      processing = true;
      await signIn.social({
        provider: "google",
        callbackURL,
      });
    } catch (error) {
      alert(`Error: ${error}`);
    } finally {
      processing = false;
    }
  }

  const buttonDisabled = $derived(processing || disabled);
</script>

<button
  class={[
    "btn bg-white text-black",
    !buttonDisabled && "border-[#e5e5e5]",
    buttonDisabled && "btn-disabled",
  ]}
  onclick={handleGoogleAuth}
  disabled={buttonDisabled}
>
  {@render googleLogo()}
  {#if processing}
    Logging in...
  {:else}
    Login with Google
  {/if}
</button>

{#snippet googleLogo()}
  <svg
    aria-label="Google logo"
    width="16"
    height="16"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <g>
      <path
        fill="#34a853"
        d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
      ></path>
      <path
        fill="#4285f4"
        d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
      ></path>
      <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
      ></path>
      <path
        fill="#ea4335"
        d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
      ></path>
    </g>
  </svg>
{/snippet}
