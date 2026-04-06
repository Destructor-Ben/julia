<script lang="ts">
  // For future reference, no input element have disabled colours yet
  // This message is repeated across all input elements
  interface Props {
    value: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    forceMinMaxNumber?: boolean
    showSlider?: boolean
  }

  let { value = $bindable(), min = 0, max = 5, step = 1, disabled = false, forceMinMaxNumber = false, showSlider = true }: Props = $props();

  let numberMin = $derived(forceMinMaxNumber ? min : "");
  let numberMax = $derived(forceMinMaxNumber ? max : "");
</script>

<div class="flex items-center justify-end gap-2">
  {#if showSlider}
    <input type="range"
      class="w-40 h-2 cursor-pointer bg-ctp-surface0 rounded-full border-2 border-ctp-overlay0 hover:bg-ctp-surface1 transition-colors shadow-sm"
      bind:value={value}
      {min}
      {max}
      {step}
      {disabled}
    />
  {/if}

  <input type="number"
    class="w-20 bg-ctp-surface0 rounded-lg px-2 py-1 border-2 border-ctp-overlay0 outline-none hover:bg-ctp-surface1 transition-colors focus:bg-ctp-surface0 focus:border-ctp-mauve shadow-sm"
    bind:value={value}
    min={numberMin}
    max={numberMax}
    {step}
    {disabled}
  />
</div>

<style>
  @import "tailwindcss";
  @import "@catppuccin/tailwindcss/mocha.css";

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    appearance: none;
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    appearance: none;
    -moz-appearance: textfield;
  }

  input[type="range"] {
    appearance: none;
    -webkit-appearance: none;

    &::-webkit-slider-thumb {
      appearance: none;
      -webkit-appearance: none;

      @apply bg-ctp-overlay2;
      @apply border-none;
      @apply rounded-full;
      @apply shadow-sm;
      @apply size-4;
    }

    &::-moz-range-thumb {
      appearance: none;
      -moz-appearance: textfield;

      @apply bg-ctp-overlay2;
      @apply border-none;
      @apply rounded-full;
      @apply shadow-sm;
      @apply size-4;
    }
  }
</style>
