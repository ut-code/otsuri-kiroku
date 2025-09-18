<script lang="ts">
  import { resolve } from "$app/paths";
  let { data } = $props<{ data: { slug: string } }>();
</script>

<div class="container mx-auto max-w-3xl p-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-semibold">Organization</h1>
    <a class="btn btn-primary btn-sm" href={resolve(`/org/[slug]/dashboard`, { slug: data.slug })}>Go to Dashboard</a>
  </div>
</div>

