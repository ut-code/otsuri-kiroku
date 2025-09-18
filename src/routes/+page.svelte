<script lang="ts">
  import OrgSwitcher from "$services/org/components/OrgSwitcher.svelte";
  import { resolve } from "$app/paths";
</script>

<div class="container mx-auto max-w-3xl p-8 space-y-8">
  <header class="space-y-2">
    <h1 class="text-3xl font-bold">組織を選択</h1>
    <p class="text-base-content/70">続行する組織を選ぶか、新しく作成してください。</p>
  </header>

  <section class="card bg-base-200 shadow-xl">
    <div class="card-body">
      <h2 class="card-title">Organizations</h2>
      <div class="space-y-3">
        <OrgSwitcher />
        <a href={resolve(`/org/new`)} class="btn btn-primary w-fit">新規作成</a>
      </div>
    </div>
  </section>

  <section class="card bg-base-100 border border-base-200">
    <div class="card-body">
      <h3 class="card-title text-base">Developer Demos</h3>
      <p class="text-sm text-base-content/70">各種機能のデモページはこちら。</p>
      <div class="card-actions">
        <a href={resolve(`/demos`)} class="btn btn-ghost btn-sm">View Demos</a>
      </div>
    </div>
  </section>
</div>
