<script lang="ts">
  import { Debounced } from "runed";
  import { page } from "$app/state";
  import { useAPI, useQuery } from "$lib";

  const api = useAPI({ host: page.url.host });

  let name = $state<string>();
  const debouncedName = new Debounced(() => name, 500);

  const fetchResult = useQuery(() => {
    if (!debouncedName.current) return api.get();
    return api({ name: debouncedName.current }).get();
  });
</script>

<div class="m-8 flex flex-col gap-4">
  <div class="invisible h-14">
    {#if fetchResult.loading}
      <div class="alert alert-info visible">
        <span class="loading loading-bars"></span>
        Loading...
      </div>
    {/if}
    {#if fetchResult.data}
      <div class="alert alert-success visible">{fetchResult.data}</div>
    {/if}

    {#if fetchResult.error}
      <div class="alert alert-error visible">{fetchResult.error}</div>
    {/if}
  </div>
</div>

<div class="flex justify-end">
  <input type="text" class="input" bind:value={name} placeholder="Type your name" />
  <button class="btn m-4" onclick={fetchResult.reload}> Retry </button>
</div>
