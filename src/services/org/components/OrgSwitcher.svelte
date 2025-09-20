<script lang="ts">
	import { resolve } from "$app/paths";
	import { listUserOrgs, switchOrg } from "$services/org/org.remote.ts";

	const orgs = listUserOrgs();
	let switching = $state<string | null>(null);

	async function onSwitch(id: string, href: string) {
		switching = id;
		try {
			await switchOrg({ orgId: id }).updates(listUserOrgs());
			// After switching context, navigate to the org page
			if (typeof window !== "undefined") window.location.href = href;
		} finally {
			switching = null;
		}
	}
</script>

{#await orgs}
	<div class="p-2 text-sm text-base-content/60">Loading organizations…</div>
{:then list}
	{#if list.length === 0}
		<div class="p-2 text-sm text-base-content/60">No organizations yet</div>
	{:else}
		<ul class="space-y-3">
			{#each list as org (org.id)}
				{#key org.id}
					<li>
						<a
							href={resolve(`/org/[slug]`, { slug: org.slug })}
							aria-disabled={switching === org.id}
							onclick={(e) => {
								e.preventDefault();
								onSwitch(org.id, (e.currentTarget as HTMLAnchorElement).href);
							}}
							class="card bg-base-100 border border-base-200 hover:border-base-300 transition"
						>
							<div class="card-body p-4 flex items-center gap-3">
								{#if org.image}
									<img src={org.image} alt={org.name} class="size-8 rounded" />
								{:else}
									<div class="size-8 rounded bg-neutral flex items-center justify-center text-neutral-content">
										{org.name[0]}
									</div>
								{/if}
								<div class="flex-1 flex items-center gap-2 min-w-0">
									<div class="font-medium truncate">{org.name}</div>
									<span class="badge badge-ghost badge-sm normal-case">{org.role}</span>
								</div>
								{#if switching === org.id}
									<span class="loading loading-spinner loading-xs"></span>
								{/if}
							</div>
						</a>
					</li>
				{/key}
			{/each}
		</ul>
	{/if}
{/await}
