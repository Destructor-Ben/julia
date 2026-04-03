<script lang="ts">
  import NumberInput from "$lib/components/NumberInput.svelte";
  import SelectInput from "$lib/components/SelectInput.svelte";
  import ToggleInput from "$lib/components/ToggleInput.svelte";

  import { type Config } from "$lib/julia/julia-config";
  import FractalType from "$lib/julia/fractal-type";
  import FalloffType from "$lib/julia/falloff-type";

  let { config = $bindable() }: { config: Config } = $props();

  const fractalTypes = Object.keys(FractalType)
                             .filter(key => typeof FractalType[key as any] === 'number')
                             .map(key => ({ id: FractalType[key as any], name: key }));

  const falloffTypes = Object.keys(FalloffType)
                             .filter(key => typeof FalloffType[key as any] === 'number')
                             .map(key => ({ id: FalloffType[key as any], name: key }));
</script>

<h2>Fractal Type</h2>

<SelectInput bind:value={config.fractal} options={fractalTypes}>
  Fractal
</SelectInput>

{#if config.fractal === FractalType.Julia}
  <h2>Julia Coordinates</h2>

  <p>Hold J to change the coordinates with the mouse.</p>

  <NumberInput bind:value={config.real} min={-3} max={3} step={0.01}>
    Real Component
  </NumberInput>
  
  <NumberInput bind:value={config.imaginary} min={-3} max={3} step={0.01}>
    Imaginary Component
  </NumberInput>
{/if}

{#if config.fractal === FractalType.Mandelbrot}
  <h2>Mandelbrot Exponent</h2>

  <p>Negative and fractional exponents are allowed.</p>
  
  <NumberInput bind:value={config.exponent} min={-5} max={5} step={0.01}>
    Exponent
  </NumberInput>
{/if}

<h2>Transformation</h2>

<NumberInput bind:value={config.translationX} min={-3} max={3} step={0.01}>
  Translation X
</NumberInput>

<NumberInput bind:value={config.translationY} min={-3} max={3} step={0.01}>
  Translation Y
</NumberInput>

<NumberInput bind:value={config.rotation} min={0} max={Math.PI * 2} step={0.01}>
  Rotation (Radians)
</NumberInput>

<NumberInput bind:value={config.scale} min={0.01} max={15} step={0.01}>
  Scale
</NumberInput>

<h2>Renderer</h2>
<!--<p>More iterations also increases the depth of the fractal,<br/>and can remove a lot of fireflies.<br/>A higher escape radius usually means more quality,<br/>but low can be fun to experiment with.</p>-->
<NumberInput bind:value={config.maxIterations} min={1} max={1000} step={1}>
  Iterations<!-- - Higher means more quality but slower-->
</NumberInput>

<NumberInput bind:value={config.radius} min={1} max={1000} step={0.01}>
  Escape Radius<!--<br/>How far a point must travel to be considered part of the set-->
</NumberInput>

<h2>Falloff</h2>
<NumberInput bind:value={config.falloffStrength} min={0} max={10000} step={0.01}>Falloff strength</NumberInput>
<SelectInput bind:value={config.falloffType} options={falloffTypes}>
  Falloff type
</SelectInput>

<h2>Falloff Color</h2>
<NumberInput bind:value={config.fractalColorR} min={0} max={255} step={1}>R</NumberInput>
<NumberInput bind:value={config.fractalColorG} min={0} max={255} step={1}>G</NumberInput>
<NumberInput bind:value={config.fractalColorB} min={0} max={255} step={1}>B</NumberInput>
<NumberInput bind:value={config.fractalColorA} min={0} max={1} step={0.01}>A</NumberInput>
<NumberInput bind:value={config.fractalColorStrength} min={0} max={1000} step={0.01}>Strength (allows blowing out)</NumberInput>

<h2>Background Color</h2>
<NumberInput bind:value={config.backgroundColorR} min={0} max={255} step={1}>R</NumberInput>
<NumberInput bind:value={config.backgroundColorG} min={0} max={255} step={1}>G</NumberInput>
<NumberInput bind:value={config.backgroundColorB} min={0} max={255} step={1}>B</NumberInput>
<NumberInput bind:value={config.backgroundColorA} min={0} max={1} step={0.01}>A</NumberInput>

<h2>Set Color</h2>
<ToggleInput bind:value={config.useSetColorOverValue}>Whether to use the color provided below for pixels in the set,<br/>or to pretend that pixels in the set have the value provided below.</ToggleInput>
<NumberInput bind:value={config.setValue} min={0} max={1} step={0.01}>The value of pixels in the set</NumberInput>
<NumberInput bind:value={config.setColorR} min={0} max={255} step={1}>R</NumberInput>
<NumberInput bind:value={config.setColorG} min={0} max={255} step={1}>G</NumberInput>
<NumberInput bind:value={config.setColorB} min={0} max={255} step={1}>B</NumberInput>
<NumberInput bind:value={config.setColorA} min={0} max={1} step={0.01}>A</NumberInput>
