<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import type { Config } from "$lib/julia/julia-config";
  import { fade, fly } from "svelte/transition";

  let { config, showExportScreen = $bindable() }: { config: Config, showExportScreen: boolean } = $props();
</script>

<div class="absolute top-0 left-0 size-full bg-black/30 flex items-center justify-center" transition:fade={{ duration: 300 }}>
  <div class="w-150 h-100 bg-ctp-base/90 backdrop-blur-lg border-2 border-ctp-surface1 rounded-3xl p-6 shadow-2xl flex flex-col items-stretch justify-between" transition:fly={{ y: "100%", duration: 300 }}>
    <h2 class="text-3xl text-center font-semibold">Export Fractal</h2>

    <p>TODO: implement exporting image + config</p>

    <div class="grid grid-cols-2 gap-6">
      <Button variant="secondary" onclick={() => { showExportScreen = false; }}>Cancel</Button>
      <Button variant="primary" onclick={() => {}}>Export</Button>
    </div>
  </div>
</div>
