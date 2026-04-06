<script lang="ts">
  import { fade } from "svelte/transition";
  import Number from "$lib/components/input/Number.svelte";
  import ColorIcon from "../icons/ColorIcon.svelte";

  // For future reference, no input element have disabled colours yet
  // This message is repeated across all input elements
  interface Props {
    r: number,
    g: number,
    b: number,
    a: number,
  }

  let {
    r = $bindable(),
    g = $bindable(),
    b = $bindable(),
    a = $bindable(),
  }: Props = $props();

  let popupOpen = $state(false);

  // svelte-ignore non_reactive_update
  let popup: HTMLElement;
  let button: HTMLElement;
</script>

<svelte:document onclick={(event) => {
  if (!(button && button.contains(event.target as Node)) && !(popup && popup.contains(event.target as Node))) {
    popupOpen = false;
  }
}} />

<div class="flex items-center justify-end gap-2 relative">
  <button bind:this={button} onclick={() => popupOpen = !popupOpen} class:border-ctp-mauve={popupOpen} class:border-ctp-overlay0={!popupOpen} class="bg-ctp-surface0 hover:bg-ctp-surface1 active:border-ctp-mauve rounded-lg p-1 transition-colors border-2 shadow-sm cursor-pointer">
    <ColorIcon width={24} height={24} />
  </button>

  <!-- TODO: include an alpha indicator by making half of it affected by alpha and have a checkerboard background -->
  <div
    class="w-15 h-7.5 rounded-lg border-2 border-ctp-overlay0 transition-colors shadow-sm"
    style={`background-color: rgba(${r}, ${g}, ${b}, ${a});`}
  ></div>

  {#if popupOpen}
    <div bind:this={popup} class="absolute bottom-full right-0 mb-2 rounded-lg p-2 bg-ctp-surface0 border-2 border-ctp-overlay0 shadow-lg flex flex-col gap-2" transition:fade={{ duration: 150 }}>
      <Number bind:value={r} min={0} max={255} step={1} />
      <Number bind:value={g} min={0} max={255} step={1} />
      <Number bind:value={b} min={0} max={255} step={1} />
      <Number bind:value={a} min={0} max={1} step={0.01} />
    </div>
  {/if}
</div>

<!-- TODO: popup that has:
- [ ] 4 number inputs
- [ ] hsv input
- [ ] cmyk input
- [ ] hex input
- [ ] Color square + hue circle
-->
