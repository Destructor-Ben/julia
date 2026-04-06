<script lang="ts">
  import Button from "$lib/components/Button.svelte";
  import Number from "$lib/components/input/Number.svelte";
  import type { Config } from "$lib/julia/julia-config";
  import JuliaRenderer from "$lib/julia/julia-renderer";
  import { fade, fly } from "svelte/transition";

  let { config, showExportScreen = $bindable() }: { config: Config, showExportScreen: boolean } = $props();

  let exportWidth = $state(1920);
  let exportHeight = $state(1080);

  let message = $state("");
  let shouldShowMessage = $state(false);
  let messageType = $state("");

  let timeoutHandle: null | number = null;

  function showMessage(msg: string, type: string, duration: number = 1500) {
    if (shouldShowMessage && timeoutHandle) {
      clearTimeout(timeoutHandle);
    }

    message = msg;
    messageType = type;
    shouldShowMessage = true;

    timeoutHandle = setTimeout(() => {
      shouldShowMessage = false;
      timeoutHandle = null;
    }, duration);
  }

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
      showMessage("Width and height can't be less than 1", "error", 3000);
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
      showMessage("Copied!", "success");
    } catch (error) {
      console.error(error);
      showMessage(`An error occured: ${error}`, "error", 3000);
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

    {#if shouldShowMessage}
      <div class="absolute top-full left-0 w-full mt-2 flex items-center justify-center" transition:fly={{ duration: 150, y: "-100%" }}>
        <div class="text-ctp-base py-2 px-4 rounded-2xl shadow-xl font-semibold text-sm" class:bg-ctp-green={messageType === "success"} class:bg-ctp-red={messageType === "error"}>{message}</div>
      </div>
    {/if}
  </div>
</div>
