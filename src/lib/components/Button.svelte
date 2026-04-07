<script lang="ts">
  import type { Snippet } from "svelte";
  import type { MouseEventHandler } from "svelte/elements";

  interface Props {
    variant: "primary" | "secondary"
    onclick?: MouseEventHandler<EventTarget>
    children: Snippet
    class?: string
  };

  let { variant, onclick, children, class: className = "" }: Props = $props();
</script>

<button class={
  variant === "primary"   ? `${className} shadow-sm cursor-pointer py-2 px-4 rounded-2xl transition-colors active:bg-ctp-mauve-900 hover:bg-ctp-mauve-700 bg-ctp-mauve text-ctp-base` :
  variant === "secondary" ? `${className} shadow-sm cursor-pointer py-2 px-4 rounded-2xl transition-colors border-2 border-ctp-overlay0 active:bg-ctp-surface2 hover:bg-ctp-surface1 bg-ctp-surface0` :
  className
} {onclick}>{@render children()}</button>
