<script lang="ts">
  import { fade, fly } from "svelte/transition";

  import JuliaRenderer from "$lib/julia/julia-renderer";
  import { defaultConfig } from "$lib/julia/julia-config";

  import HeaderButton from "./HeaderButton.svelte";
  
  import ExportIcon from "$lib/components/icons/ExportIcon.svelte";
  import SettingsIcon from "$lib/components/icons/SettingsIcon.svelte";
  import GithubIcon from "$lib/components/icons/GithubIcon.svelte";
  import Settings from "./Settings.svelte";
  import { untrack } from "svelte";

  let showSettings = $state(false);

  let header: HTMLElement;

  function handleResize() {
    config.width = window.innerWidth;
    config.height = window.innerHeight - header.clientHeight;
  }

  $effect(() => {
    handleResize();

    untrack(() => {
      // Strange bug on first load, the canvas doesn't have the correct size set by the time everything is rendered
      // Setting it manually fixes it
      canvas.width = config.width;
      canvas.height = config.height;
    })
  });

  // #region Renderer Setup

  // Create the renderer
  let config = $state(defaultConfig);
  let canvas: HTMLCanvasElement;
  let renderer: JuliaRenderer;

  $effect(() => {
    renderer = new JuliaRenderer(canvas);

    return () => {
      renderer.destroy();
    }
  })

  // Resize viewport when canvas size changed
  $effect(() => {
    renderer.resize(config.width, config.height);
  })

  // Render the fractal
  $effect(() => {
    renderer.setFractal(config);
    renderer.render();
  });

  // #endregion

  // #region Receiving Input

  let pressedKeys: { [key: string]: boolean } = {};
  let pressedMouse = false;
  let mousePos: { x: number, y: number } = { x: -1, y: -1 };

  function shouldNotReceiveInput() {
    return document.elementFromPoint(mousePos.x, mousePos.y) != canvas;
  }
  
  function handleMouseMove(event: MouseEvent) {
    mousePos = {
      x: event.clientX,
      y: event.clientY,
    };

    if (shouldNotReceiveInput()) {
      return;
    }

    if (modifyJuliaCoords(event)) {
      return;
    }

    moveWithMouse(event);
  }

  function handleMouseDown(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    pressedMouse = true;
  }

  function handleMouseUp(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    pressedMouse = false;
  }

  function handleKeyDown(event: KeyboardEvent) {
    // Prevents repeated presses from holding a key down
    if (!pressedKeys[event.code]) {
      pressedKeys[event.code] = true;
      onKeyDown(event.code);
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    // Prevents repeated presses from holding a key down
    if (pressedKeys[event.code]) {
      pressedKeys[event.code] = false;
      onKeyUp(event.code);
    }
  }

  // #endregion

  // #region Handling Input

  // TODO: add WASD and arrow keys input
  // TODO: how to figure out when to ignore the input (e.g. do we ignore if the mouse is hovering over the header?)
  function onKeyDown(key: string) {
    
  }

  function onKeyUp(key: string) {
    
  }

  function handleScroll(event: WheelEvent) {
    if (shouldNotReceiveInput()) {
      return;
    }

    // Zooming
    event.preventDefault();

    // We want scaling to be proportional to the existing scale
    // Since adding 0.1 scale when we are already at 300 barely does anything
    const scrollUnits = event.deltaMode;
    let scrollAmount = event.deltaY;

    switch (scrollUnits) {
      case 0: // Pixels
        break;
      case 1: // Lines
        scrollAmount *= 16; // Estimate, but should work
        break;
      case 2: // Pages
        scrollAmount *= window.innerHeight;
        break;
    }

    // Scale to make scrolling 1 page double in size
    scrollAmount /= window.innerHeight;

    config.scale -= config.scale * scrollAmount;
  }

  function modifyJuliaCoords(event: MouseEvent) {
    if (!pressedKeys["KeyJ"]) {
      return false;
    }

    const canvasSize = canvas.getBoundingClientRect();

    const x = event.clientX - canvasSize.x;
    const y = event.clientY - canvasSize.y;

    const width = canvasSize.width;
    const height = canvasSize.height;

    // Normalize to [-1 - 1] coordinate space for fractal
    config.real = (x - width / 2) / width * 2;
    config.imaginary = (y - height / 2) / height * 2;

    return true;
  }

  // TODO: make this only worlk if the start coord is in the canvas too?
  function moveWithMouse(event: MouseEvent) {
    if (!pressedMouse) {
      return;
    }

    // Scale is included so we move more when we are zoomed in and less when we are zoomed out
    // TODO: make 250 be an actual value to prevent mouse drifting
    config.translationX -= event.movementX * 3.5 / config.width / config.scale;
    config.translationY -= event.movementY * 3.5 / config.height / config.scale;
  }

  // #endregion

  // #region Exporting

  let showExportScreen = $state(false);

  // TODO: make this use a config defined above and decide whether to export and image or fractal
  function exportFractal() {

  }

  // TODO: save and load images + animations
  function saveImage() {
    console.log("Saving image...");

    // TODO: create a new canvas and renderer with the desired resolution
    const imgLink = canvas.toDataURL("image/png");

    // Create a temporary link element and "click" it
    let link = document.createElement("a");
    link.href = imgLink;
    link.download = "Julia.png";
    link.click();

    console.log("Image saved");
  }

  function saveAnimation() {
    console.log("Saving animation...");
    
    console.log("Animation saved");
  }

  // TODO: save and load configs

  // #endregion
</script>

<svelte:head>
  <title>Julia - Fractal Renderer</title>
</svelte:head>

<svelte:window
  onresize={handleResize}
  onwheel={handleScroll}
  onmousemove={handleMouseMove}
  onmousedown={handleMouseDown}
  onmouseup={handleMouseUp}
  onkeydown={handleKeyDown}
  onkeyup={handleKeyUp}
/>

<!-- Header -->
<header bind:this={header} class="bg-ctp-mantle p-2 grid grid-cols-3 items-center">
  <div class="justify-self-start flex items-center gap-1">
    <HeaderButton title="Open Settings" action={() => showSettings = !showSettings}>
      <div class="transition-transform duration-300" class:rotate-60={showSettings}>
        <SettingsIcon width={24} height={24} />
      </div>
    </HeaderButton>

    <HeaderButton title="Export" action={() => showExportScreen = true}>
      <ExportIcon width={24} height={24} />
    </HeaderButton>
  </div>
  
  <div class="justify-self-center">
    <h1 class="font-semibold text-2xl">Julia - Fractal Renderer</h1>
  </div>
  
  <div class="justify-self-end">
    <a class="hover:underline font-semibold text-md flex items-center gap-1" href="https://github.com/Destructor-Ben/julia">
      <GithubIcon width={30} height={30} />
      Source Code
    </a>
  </div>
</header>

<!-- Settings and canvas -->
<div class="relative">
  <canvas
    width={config.width}
    height={config.height}
    bind:this={canvas}
  ></canvas>

  {#if showSettings}
    <div class="bg-ctp-crust p-2 absolute top-0 left-0 overflow-y-scroll overflow-x-hidden" style={`height: ${config.height}px;`} transition:fly={{ x: '-100%', duration: 300 }}>
      <Settings bind:config={config} />
    </div>
  {/if}
</div>

<!-- Export screen -->
{#if showExportScreen}
  <div class="absolute top-0 left-0 size-full bg-black/30 flex items-center justify-center" transition:fade={{ duration: 300 }}>
    <div class="w-100 h-75 bg-red-500" transition:fly={{ y: "100%", duration: 300 }}>
      Test

      <button onclick={() => { showExportScreen = false; }}>Cancel</button>
      <button onclick={exportFractal}>Export</button>
    </div>
  </div>
{/if}
