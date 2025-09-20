<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/stores";

  let { data, children } = $props<{ data: { slug: string }; children: () => unknown }>();

  function isActive(href: string): boolean {
    const p = $page.url.pathname;
    return p === href || p.startsWith(href + "/");
  }
</script>

<div class="container mx-auto max-w-6xl p-6">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <aside class="bg-base-200 rounded-xl p-2 lg:col-span-3 lg:sticky lg:top-4 h-fit">
      <ul class="menu menu-compact w-full">
        <li>
          <a class={`${isActive(resolve(`/org/[slug]/dashboard`, { slug: data.slug })) ? "active" : ""} w-full justify-start`}
             href={resolve(`/org/[slug]/dashboard`, { slug: data.slug })}
          >Overview</a>
        </li>
        <li>
          <a class={`${isActive(resolve(`/org/[slug]/dashboard/members`, { slug: data.slug })) ? "active" : ""} w-full justify-start`}
             href={resolve(`/org/[slug]/dashboard/members`, { slug: data.slug })}
          >Members</a>
        </li>
        <li>
          <a class={`${isActive(resolve(`/org/[slug]/dashboard/invites`, { slug: data.slug })) ? "active" : ""} w-full justify-start`}
             href={resolve(`/org/[slug]/dashboard/invites`, { slug: data.slug })}
          >Invites</a>
        </li>
      </ul>
    </aside>
    <section class="lg:col-span-9">
      {@render children()}
    </section>
  </div>
</div>
