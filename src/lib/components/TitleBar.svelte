<script lang="ts">
  import Logo from "./Logo.svelte";
  import { windowControls } from "../ipc";

  let maximized = $state(false);

  async function toggleMax() {
    maximized = await windowControls.toggleMaximize();
  }
</script>

<!-- `data-tauri-drag-region` makes the bar draggable (needs the
     core:window:allow-start-dragging capability). -->
<header class="titlebar" data-tauri-drag-region>
  <div class="brand" data-tauri-drag-region>
    <span class="brand-mark"><Logo size={16} /></span>
    <span class="brand-name">FoxCNV</span>
  </div>

  <div class="controls">
    <button class="ctl" aria-label="Minimize" title="Minimize" onclick={windowControls.minimize}>
      <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
        <line x1="1" y1="5" x2="9" y2="5" stroke="currentColor" stroke-width="1" />
      </svg>
    </button>
    <button class="ctl" aria-label="Maximize" title={maximized ? "Restore" : "Maximize"} onclick={toggleMax}>
      {#if maximized}
        <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
          <rect x="2.5" y="0.5" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1" />
          <rect x="0.5" y="2.5" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1" />
        </svg>
      {:else}
        <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
          <rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" stroke-width="1" />
        </svg>
      {/if}
    </button>
    <button class="ctl close" aria-label="Close" title="Close" onclick={windowControls.close}>
      <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
        <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1" />
        <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1" />
      </svg>
    </button>
  </div>
</header>

<style>
  .titlebar {
    height: var(--titlebar-h);
    flex: 0 0 var(--titlebar-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 14px;
    user-select: none;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 9px;
    color: var(--text);
  }
  .brand-mark {
    display: inline-flex;
    color: var(--accent);
  }
  .brand-name {
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: var(--text-dim);
  }

  .controls {
    display: flex;
    height: 100%;
  }

  .ctl {
    width: 46px;
    height: 100%;
    display: grid;
    place-items: center;
    background: transparent;
    border: 0;
    color: var(--text-dim);
    cursor: default;
    transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
  }
  .ctl:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text);
  }
  .ctl.close:hover {
    background: var(--accent);
    color: #fff;
  }
  .ctl:focus-visible {
    outline: 2px solid var(--accent-ring);
    outline-offset: -2px;
  }
</style>
