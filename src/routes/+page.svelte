<script lang="ts">
  import { untrack } from "svelte";
  import { helloQuery } from "$remote/hello.remote.ts";

  const hello = helloQuery();

  const encountered = $state<string[]>([]);

  $effect(() => {
    const newName = hello.current;
    untrack(() => {
      if (newName !== undefined && !encountered.includes(newName)) {
        encountered.push(newName);
      }
    });
  });
</script>

<h1>Welcome to SvelteKit</h1>

<h1>playground</h1>
<p>Hello: {hello.current}</p>
<button
  onclick={async () => {
    await hello.refresh();
  }}
  disabled={hello.loading}
  class="btn btn-primary"
>
  {#if hello.loading}
    <span class="loading loading-spinner"></span>
  {:else}
    refetch
  {/if}
</button>

<ul>
  <h1>Encountered</h1>
  {#each encountered as name (name)}
    <li>{name}</li>
  {/each}
</ul>
