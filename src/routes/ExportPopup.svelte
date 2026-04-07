<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Number from "$lib/components/input/Number.svelte";
  import MessagePopup from "$lib/components/MessagePopup.svelte";
  import type { Config } from "$lib/julia/julia-config";
  import JuliaRenderer from "$lib/julia/julia-renderer";
  import { fade, fly } from "svelte/transition";

  let { config, showExportScreen = $bindable() }: { config: Config, showExportScreen: boolean } = $props();

  let exportWidth = $state(1920);
  let exportHeight = $state(1080);
  let messagePopup: MessagePopup;

  function getStrippedConfig() {
    const { width, height, ...strippedConfig } = config;
    return {
      ...strippedConfig,
      width: exportWidth,
      height: exportHeight,
    };
  }

  function exportFractal() {
    if (exportWidth <= 0 || exportHeight <= 0) {
      messagePopup.showMessage("Width and height can't be less than 1", "error", 3000);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = exportWidth;
    canvas.height = exportHeight;

    const renderer = new JuliaRenderer(canvas);
    renderer.resize(exportWidth, exportHeight);
    renderer.setFractal(getStrippedConfig());
    renderer.render();

    // Force download rendered image through dodgy method
    const link = document.createElement('a');
    link.download = 'Julia.png';
    link.href = canvas.toDataURL();
    link.click();
  }

  async function copyConfig() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(getStrippedConfig()));
      messagePopup.showMessage("Copied!", "success");
    } catch (error) {
      console.error(error);
      messagePopup.showMessage(`An error occured: ${error}`, "error", 3000);
    }
  }
</script>

<div class="absolute top-0 left-0 size-full bg-black/30 flex items-center justify-center" transition:fade={{ duration: 300 }}>
  <div class="bg-ctp-base/90 backdrop-blur-lg border-2 border-ctp-surface1 rounded-3xl p-6 gap-3 shadow-2xl flex flex-col items-stretch justify-between" transition:fly={{ y: "100%", duration: 300 }}>
    <h2 class="text-3xl text-center font-semibold">Export Fractal</h2>

    <div class="flex-1 flex flex-col items-stretch gap-3 p-3">
      <div class="flex items-center justify-between">
        Image Width
        <Number bind:value={exportWidth} showSlider={false} />
      </div>

      <div class="flex items-center justify-between">
        Image Height
        <Number bind:value={exportHeight} showSlider={false} />
      </div>
    </div>

    <Button variant="secondary" onclick={copyConfig}>
      Copy Config
    </Button>

    <div class="grid grid-cols-2 gap-3">
      <Button class="w-50" variant="secondary" onclick={() => { showExportScreen = false; }}>Cancel</Button>
      <Button class="w-50" variant="primary" onclick={exportFractal}>Export</Button>
    </div>

    <MessagePopup bind:this={messagePopup} />
  </div>
</div>
