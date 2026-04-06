<script lang="ts">
  import type { Snippet } from "svelte";
  import type { MouseEventHandler } from "svelte/elements";

  interface Props {
    variant: "primary" | "secondary"
    onclick?: MouseEventHandler<EventTarget>
    children: Snippet
  };

  let { variant, onclick, children }: Props = $props();
</script>

<button class={
  variant === "primary"   ? "cursor-pointer p-2 rounded-2xl transition-colors active:bg-ctp-mauve-900 hover:bg-ctp-mauve-700 bg-ctp-mauve text-ctp-base" :
  variant === "secondary" ? "cursor-pointer p-2 rounded-2xl transition-colors border-2 border-ctp-surface1 active:bg-ctp-surface1 hover:bg-ctp-surface0" :
  ""
} {onclick}>{@render children()}</button>
