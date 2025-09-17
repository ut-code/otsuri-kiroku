<script lang="ts">
  import { greetCommand, metUsersQuery } from "$services/hello/hello.remote";

  const users = metUsersQuery();

  let lastGreeting = $state<string | undefined>(undefined);
  let name = $state<string>("");
  let processing = $state<boolean>(false);

  async function greet() {
    processing = true;
    lastGreeting = await greetCommand({ name }).updates(metUsersQuery());
    processing = false;
    name = "";
  }
</script>

<div class="max-w-2xl mx-auto p-8 space-y-8">
  <div class="mb-4">
    <a href="/demos" class="btn btn-ghost btn-sm">← Back to Demos</a>
  </div>

  <header class="text-center">
    <h1 class="text-4xl font-bold mb-2">Greeting Generator</h1>
    <p class="text-gray-600">Get a random friendly greeting!</p>
  </header>
  {@render greetingCard()}
  {@render metUsersCard()}
</div>

{#snippet greetingCard()}
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body text-center">
      <div
        class="text-2xl font-semibold text-primary min-h-[3rem] flex items-center justify-center"
      >
        {#if lastGreeting}
          {lastGreeting}
        {:else}
          Click the button greet!
        {/if}
      </div>

      <form
        class="card-actions justify-center mt-4"
        onsubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          class="input input-bordered w-full"
          type="text"
          bind:value={name}
          placeholder="Enter your name"
        />
        <button
          type="submit"
          disabled={processing}
          class="btn btn-primary btn-lg"
        >
          {#if processing}
            <span class="loading loading-spinner loading-sm"></span>
            Getting greeting...
          {:else}
            Get New Greeting
          {/if}
        </button>
      </form>
    </div>
  </div>
{/snippet}

{#snippet metUsersCard()}
  <div class="card bg-base-200 shadow-md">
    <div class="card-body">
      <h2 class="card-title">People we've met</h2>
      {#await users}
        <p class="text-center text-base-content/70">
          Fetching list of users...
        </p>
      {:then data}
        <div class="flex flex-wrap gap-2">
          {#each data as user (user)}
            <span class="badge badge-outline badge-accent badge-lg">{user}</span
            >
          {:else}
            <p class="text-center text-base-content/70">
              You're the first person here!
            </p>
          {/each}
        </div>
        {#if data.length > 3}
          <p class="text-sm text-gray-500 mt-2">
            We've met {data.length} people in total!
          </p>
        {/if}
      {/await}
    </div>
  </div>
{/snippet}
