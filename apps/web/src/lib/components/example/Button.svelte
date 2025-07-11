<script lang="ts">
  import "@/app.css";
  import type { Snippet } from "svelte";

  interface Props {
    /** Is this the principal call to action on the page? */
    primary?: boolean;
    /** What background color to use */
    backgroundColor?: string;
    /** How large should the button be? */
    size?: "small" | "medium" | "large";
    /** Button contents */
    children: Snippet;
    /** The onclick event handler */
    onclick?: () => void;
  }

  const { primary = false, backgroundColor, size = "medium", children, ...props }: Props = $props();

  const mode = $derived(primary ? "btn-primary" : "");
  const sizeClass = $derived.by(() => {
    switch (size) {
      case "small":
        return "btn-sm";
      case "medium":
        return "btn-md";
      case "large":
        return "btn-lg";
    }
  });
</script>

<button
  type="button"
  class={["btn", sizeClass, mode]}
  style={`${backgroundColor ? `background-color: ${backgroundColor};` : ""}`}
  {...props}
>
  {@render children()}
</button>
