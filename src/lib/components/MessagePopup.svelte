<script lang="ts">
  import { fly } from "svelte/transition";

  let { class: className = "", comeFromTop = false, useDefaultStyle = true }: {
    class?: string, comeFromTop?: boolean, useDefaultStyle?: boolean
  } = $props();

  let message = $state("");
  let shouldShowMessage = $state(false);
  let messageType = $state("");

  let timeoutHandle: null | number = null;

  export function showMessage(msg: string, type: string, duration: number = 1500) {
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
</script>

{#if shouldShowMessage}
  <div class={className + (useDefaultStyle ? " absolute top-full left-0 w-full mt-2 flex items-center justify-center" : "")} transition:fly={{ duration: 150, y: comeFromTop ? "100%" : "-100%" }}>
    <div class="text-ctp-base py-2 px-4 rounded-2xl shadow-xl font-semibold text-sm" class:bg-ctp-green={messageType === "success"} class:bg-ctp-red={messageType === "error"}>{message}</div>
  </div>
{/if}
