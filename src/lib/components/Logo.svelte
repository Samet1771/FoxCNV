<script lang="ts">
  // Minimalist "convert / swap" mark: two arrows pointing opposite ways.
  // Inherits color via `currentColor` so callers tint it with the accent.
  let { size = 24 }: { size?: number } = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d="M4 9 H17" />
  <path d="M14 6 L17 9 L14 12" />
  <path d="M20 15 H7" />
  <path d="M10 12 L7 15 L10 18" />
</svg>
