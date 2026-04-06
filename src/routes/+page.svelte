<script lang="ts">
  import { untrack } from "svelte";

  import JuliaRenderer from "$lib/julia/julia-renderer";
  import { defaultConfig } from "$lib/julia/julia-config";

  import HeaderButton from "./HeaderButton.svelte";
  
  import ExportIcon from "$lib/components/icons/ExportIcon.svelte";
  import SettingsIcon from "$lib/components/icons/SettingsIcon.svelte";
  import GithubIcon from "$lib/components/icons/GithubIcon.svelte";
  import Settings from "./Settings.svelte";
  import ExportPopup from "./ExportPopup.svelte";
  import { glide } from "$lib/transitions";

  let showSettings = $state(false);

  let header: HTMLElement;

  function handleResize() {
    config.width = window.innerWidth;
    config.height = window.innerHeight - header.clientHeight - 2; // 2px for the border
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
  let startedDragOnCanvas = false;
  let mousePos: { x: number, y: number } = { x: -1, y: -1 };

  function mouseIsOverCanvas() {
    return document.elementFromPoint(mousePos.x, mousePos.y) === canvas;
  }
  
  function handleMouseMove(event: MouseEvent) {
    mousePos = {
      x: event.clientX,
      y: event.clientY,
    };

    if (!mouseIsOverCanvas()) {
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

    startedDragOnCanvas = mouseIsOverCanvas();
    pressedMouse = true;
  }

  function handleMouseUp(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    startedDragOnCanvas = false;
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
  // TODO: Q + E to rotate?
  // TODO: mouse + r to rotate?
  function onKeyDown(key: string) {
    
  }

  function onKeyUp(key: string) {
    
  }

  function handleScroll(event: WheelEvent) {
    if (!mouseIsOverCanvas()) {
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
    config.real = x / width * 2 - 1;
    config.imaginary = y / height * 2 - 1;

    return true;
  }

  function moveWithMouse(event: MouseEvent) {
    if (!pressedMouse || !startedDragOnCanvas) {
      return;
    }

    // You have no idea how fucking long it took to get this magic number
    // I will NOT explain how i got it because fuck anyone reading this
    // Fuck you future me if you ever need to change this
    const scale = 2 / config.height / config.scale;
    // Rotation was quite easy for some reason
    const deltaX = event.movementX * scale;
    const deltaY = event.movementY * scale;
    const cosRot = Math.cos(-config.rotation);
    const sinRot = Math.sin(-config.rotation);
    config.translationX -= deltaX * cosRot + deltaY * sinRot;
    config.translationY -= deltaX * -sinRot + deltaY * cosRot;
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
<header bind:this={header} class="bg-ctp-mantle p-2 grid grid-cols-3 items-center border-b-2 border-b-ctp-surface1">
  <div class="justify-self-start flex items-center gap-1">
    <HeaderButton title="Open Config" action={() => showSettings = !showSettings}>
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
    <div class="w-125 bg-ctp-crust/90 backdrop-blur-lg p-4 absolute top-0 left-0 overflow-y-scroll overflow-x-hidden border-r-2 border-r-ctp-surface1" style={`height: ${config.height}px;`} transition:glide={{ x: '-100%', duration: 300 }}>
      <Settings bind:config={config} />
    </div>
  {/if}
</div>

<!-- Export screen -->
{#if showExportScreen}
  <ExportPopup {config} bind:showExportScreen={showExportScreen} />
{/if}
