<script lang="ts">
  import "@/app.css";
  import type { Snippet } from "svelte";
  import Header from "$services/header/components/Header.svelte";

  interface Props {
    children: Snippet;
  }
  const { children }: Props = $props();
</script>

<Header />
<main class="container mx-auto p-4">
  {@render children()}
</main>
