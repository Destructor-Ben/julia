<script lang="ts">
  import InfoIcon from "$lib/components/icons/InfoIcon.svelte";
  import { autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";

  let { label, tooltip = "" }: { label: string, tooltip?: string } = $props();

  function tooltipAction(node: HTMLElement) {
    const tooltip = node.querySelector(".tooltip-content")! as HTMLElement;
    let cleanup: (() => void) | null = null;

    function updatePosition() {
      // autoUpdate returns a function that cleans up the listeners
      cleanup = autoUpdate(node, tooltip, () => {
        computePosition(node, tooltip, {
          placement: "right",
          strategy: "fixed",
          middleware: [offset(4), flip(), shift()],
        }).then(({ x, y }) => {
          Object.assign(tooltip.style, {
            left: `${x}px`,
            top: `${y}px`,
            visibility: "visible",
            opacity: "1",
            pointerEvents: "auto"
          });
        });
      });
    }

    function hideTooltip() {
      // Stop tracking when mouse leaves
      if (cleanup) {
        cleanup();
        cleanup = null;
      }
      
      Object.assign(tooltip.style, {
        visibility: "hidden",
        opacity: "0",
        pointerEvents: "none"
      });
    }

    document.body.appendChild(tooltip);
    node.addEventListener("mouseenter", updatePosition);
    node.addEventListener("mouseleave", hideTooltip);
    
    return {
      destroy() {
        if (cleanup) cleanup();
        node.removeEventListener("mouseenter", updatePosition);
        node.removeEventListener("mouseleave", hideTooltip);
        if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
      }
    };
  }
</script>

<span class="flex items-center">
  {label}
  {#if tooltip !== ""}
    <span class="ml-1 text-ctp-subtext0" use:tooltipAction>
      <InfoIcon width={24} height={24} />
      <div class="tooltip-content text-ctp-text invisible opacity-0 border-2 border-ctp-overlay0 shadow-lg bg-ctp-surface0 p-2 rounded-lg transition-[visibility,opacity] whitespace-nowrap absolute top-0 left-0 w-max z-50">
        {#each tooltip.split("\\n") as line}
          <span>{line}</span>
          <br />
        {/each}
      </div>
    </span>
  {/if}
</span>
