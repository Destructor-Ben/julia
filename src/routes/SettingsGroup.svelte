<script lang="ts">
  import Heading from "$lib/components/Heading.svelte";
  import type { Snippet } from "svelte";

  let { children, heading }: { children: Snippet, heading: string } = $props();
</script>

<Heading level={3} class="text-center my-2">{heading}</Heading>
<div class="grid grid-cols-[auto_auto] gap-4">
  {@render children()}
</div>
