<script lang="ts">
  let { title, action, children, } = $props();
</script>


<button
  class="hover:bg-ctp-surface0 p-2 rounded-2xl transition-colors cursor-pointer"
  title={title}
  onclick={action}
>
  {@render children()}
</button>
