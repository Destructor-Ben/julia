<script lang="ts">
  // For future reference, no input element have disabled colours yet
  // This message is repeated across all input elements
  interface Props {
    value: any,
    options: { id: any, name: string }[],
  }

  let { value = $bindable(), options }: Props = $props();
</script>

<select bind:value={value} class="justify-self-end w-30 bg-ctp-surface0 rounded-lg px-2 py-1 border-2 border-ctp-overlay0 outline-none hover:bg-ctp-surface1 transition-colors hover:border-ctp-mauve shadow-sm">
  {#each options as option (option.id)}
    <option value={option.id}>{option.name}</option>
  {/each}
</select>
