<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    padding = "28px",
  }: { children?: Snippet; padding?: string } = $props();
</script>

<section class="glass" style:padding>
  {@render children?.()}
</section>

<style>
  .glass {
    position: relative;
    border-radius: var(--r-lg);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
    /* The CSS blur layers depth on top of the native OS backdrop. */
    backdrop-filter: blur(var(--glass-blur)) saturate(150%);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(150%);
    overflow: hidden;
  }

  /* A faint top highlight gives the glass a lit, fluid edge. */
  .glass::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(
      150deg,
      rgba(255, 255, 255, 0.22),
      rgba(255, 255, 255, 0) 40%
    );
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
</style>
