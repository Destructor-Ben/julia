<script lang="ts">
  // For future reference, no input element have disabled colours yet
  // This message is repeated across all input elements
  interface Props {
    value: boolean,
    disabled?: boolean,
    id: string,
    class?: string
  }

  let { value = $bindable(), disabled = false, id, class: className = "" }: Props = $props();
</script>

<div class={className + " flex items-center justify-end"}>
  <input type="checkbox"
    class="checkbox"
    bind:checked={value}
    hidden={true}
    {disabled}
    {id}
  />

  <label for={id}>
    <div
      class="transition w-[50px] h-[30px] rounded-full border-2 cursor-pointer"
      class:inset-shadow-sm={!value}
      class:bg-ctp-mauve={value}
      class:bg-ctp-surface0={!value}
      class:hover:bg-ctp-mauve-700={value}
      class:hover:bg-ctp-surface1={!value}
      class:border-transparent={value}
      class:border-ctp-overlay0={!value}
    >
      <div class="size-[18px] rounded-full mt-[4px] transition-[margin,background-color] shadow-sm" class:ml-[24px]={value} class:ml-[4px]={!value} class:bg-ctp-overlay2={!value} class:bg-ctp-base={value}></div>
    </div>
  </label>
</div>
