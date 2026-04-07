<script lang="ts">
  import Dropdown from "$lib/components/input/Dropdown.svelte";
  import Number from "$lib/components/input/Number.svelte";
  import Toggle from "$lib/components/input/Toggle.svelte";

  import { defaultConfig, type Config } from "$lib/julia/julia-config";
  import FractalType from "$lib/julia/fractal-type";
  import FalloffType from "$lib/julia/falloff-type";
  import Heading from "$lib/components/Heading.svelte";
  import SettingsGroup from "./SettingsGroup.svelte";
  import SettingsLabel from "./SettingsLabel.svelte";
  import Color from "$lib/components/input/Color.svelte";
  import Button from "$lib/components/Button.svelte";

  let { config = $bindable(), selectedPreset = $bindable(), presetOptions }: { config: Config, selectedPreset: number, presetOptions: any } = $props();

  const fractalTypes = Object.keys(FractalType)
                             .filter(key => typeof FractalType[key as any] === 'number')
                             .map(key => ({ id: FractalType[key as any], name: key }));

  const falloffTypes = Object.keys(FalloffType)
                             .filter(key => typeof FalloffType[key as any] === 'number')
                             .map(key => ({ id: FalloffType[key as any], name: key }));

  async function importClipboard() {
    // TODO: validate that it is valid JSON
    const configText = await navigator.clipboard.readText();
    const json = JSON.parse(configText);

    const configKeys = Object.keys(defaultConfig);

    const strippedConfig = {};
    configKeys.forEach(key => {
      if (key === "width" || key === "height") {
        return;
      }

      if (key in json) {
        (strippedConfig as any)[key] = json[key];
      }
    });

    config = {
      ...config,
      ...strippedConfig,
    };
  }
</script>

<Heading level={2} class="text-center mb-2">Julia Config</Heading>
<hr class="border border-ctp-overlay0 my-3 rounded-full" />

<SettingsGroup heading="Presets">
  <SettingsLabel label="Select Preset" />
  <Dropdown bind:value={selectedPreset} options={presetOptions} />

  <SettingsLabel label="Import Config" tooltip="Import a config from your clipboard" />
  <div>
    <Button variant="primary" onclick={importClipboard} class="float-right">Import</Button>
  </div>
</SettingsGroup>

<hr class="border border-ctp-overlay0 my-3 rounded-full" />

<SettingsGroup heading="Fractal">
  <SettingsLabel label="Fractal Type" />
  <Dropdown bind:value={config.fractal} options={fractalTypes} />

  {#if config.fractal === FractalType.Julia}
    <SettingsLabel label="Real" tooltip="The real component of the julia coordinate\nHold J to change the coordinate with the mouse" />
    <Number bind:value={config.real} min={-3} max={3} step={0.01} />
    
    <SettingsLabel label="Imaginary" tooltip="The imaginary component of the julia coordinate\nHold J to change the coordinate with the mouse" />
    <Number bind:value={config.imaginary} min={-3} max={3} step={0.01} />
  {/if}

  {#if config.fractal === FractalType.Mandelbrot}
    <SettingsLabel label="Exponent" tooltip="The exponent of z in the Mandelbrot equation\nNegative and fractional values allowed" />
    <Number bind:value={config.exponent} min={-5} max={5} step={0.01} />
  {/if}
</SettingsGroup>

<SettingsGroup heading="Transform">
  <SettingsLabel label="Position X" />
  <Number bind:value={config.translationX} min={-3} max={3} step={0.01} />

  <SettingsLabel label="Position Y" />
  <Number bind:value={config.translationY} min={-3} max={3} step={0.01} />

  <SettingsLabel label="Rotation" tooltip="Anti-clockwise, measured in radians" />
  <Number bind:value={config.rotation} min={0} max={Math.PI * 2} step={0.01} />

  <SettingsLabel label="Scale" />
  <Number bind:value={config.scale} min={0.01} max={15} step={0.01} />
</SettingsGroup>

<SettingsGroup heading="Renderer">
  <SettingsLabel label="Max Iterations" tooltip="The maximum number of times the fractal equation can be run on a point\nHigher increases quality and depth of the fractal and can remove fireflies\nLower improves performance" />
  <Number bind:value={config.maxIterations} min={1} max={100} step={1} />

  <SettingsLabel label="Escape Radius" tooltip="How far a point must travel to be considered not part of the set" />
  <Number bind:value={config.radius} min={0.0001} max={10} step={0.01} />
</SettingsGroup>

<SettingsGroup heading="Falloff">
  <SettingsLabel label="Falloff Type" />
  <Dropdown bind:value={config.falloffType} options={falloffTypes} />

  <SettingsLabel label="Falloff Strength" />
  <Number bind:value={config.falloffStrength} min={0} max={10000} step={0.01} />
</SettingsGroup>

<SettingsGroup heading="Colors">
  <SettingsLabel label="Use Set Color" tooltip="Whether to use the provided color for pixels in the set,\nor to pretend that pixels in the set have the falloff value provided below\nCan be used to hide fireflies" />
  <Toggle id="useSetColorOverValue" bind:value={config.useSetColorOverValue} />
  
  <SettingsLabel label="Set Value" tooltip="The falloff value that each pixel in the set is assigned if the above toggle is enabled" />
  <Number bind:value={config.setValue} min={0} max={1} step={0.01} />

  <SettingsLabel label="Falloff Color Strength" tooltip="A multiplier to the falloff color to allow blowing it out by raising it's brightness above 1\nLowering this and raising falloff strength have similar effects\n(ignoring that lowering falloff strength doesn't cause blowout)" />
  <Number bind:value={config.falloffColorStrength} min={0} max={1000} step={0.01} />

  <SettingsLabel label="Falloff Color" />
  <Color bind:r={config.falloffColorR} bind:g={config.falloffColorG} bind:b={config.falloffColorB} bind:a={config.falloffColorA} />

  <SettingsLabel label="Background Color" />
  <Color bind:r={config.backgroundColorR} bind:g={config.backgroundColorG} bind:b={config.backgroundColorB} bind:a={config.backgroundColorA} />

  <SettingsLabel label="Set Color" />
  <Color bind:r={config.setColorR} bind:g={config.setColorG} bind:b={config.setColorB} bind:a={config.setColorA} />
</SettingsGroup>
