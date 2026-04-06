<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    level?: number
    class?: string
    children?: Snippet
  }

  let { level = 1, class: className = "", children }: Props = $props();
</script>

{#if level === 1 && children}
  <h1 class={`font-semibold text-2xl ${className}`}>{@render children()}</h1>
{:else if level === 2 && children}
  <h2 class={`font-semibold text-xl ${className}`}>{@render children()}</h2>
{:else if level === 3 && children}
  <h3 class={`font-semibold text-lg ${className}`}>{@render children()}</h3>
{:else if level === 4 && children}
  <h4 class={`font-semibold text-md ${className}`}>{@render children()}</h4>
{:else if level === 5 && children}
  <h5 class={`font-semibold text-sm ${className}`}>{@render children()}</h5>
{:else if level === 6 && children}
  <h6 class={`font-semibold text-xs ${className}`}>{@render children()}</h6>
{/if}
