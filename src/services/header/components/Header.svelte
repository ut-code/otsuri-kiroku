<script lang="ts">
  import { resolve } from "$app/paths";
  import AuthButton from "$services/auth/components/AuthButton.svelte";

  // no props
</script>

<header class="navbar bg-base-100 border-b border-base-200">
  <div class="flex-1">
    <a href={resolve(`/`)} class="btn btn-ghost text-xl">Otsuri Kiroku</a>
  </div>
  <div class="flex-none">
    <AuthButton />
  </div>
</header>
