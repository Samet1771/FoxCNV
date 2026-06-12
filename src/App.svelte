<script lang="ts">
  import TitleBar from "./lib/components/TitleBar.svelte";
  import GlassPanel from "./lib/components/GlassPanel.svelte";
  import Logo from "./lib/components/Logo.svelte";
  import { isTauri } from "./lib/ipc";

  // M0 is the app shell only. Drag-drop + right-click intake lands in M1,
  // so the drop area below is presentational for now.
  const inApp = isTauri();
</script>

<div class="app-root">
  <TitleBar />

  <main class="content">
    <section class="hero">
      <div class="hero-mark"><Logo size={30} /></div>
      <h1>FoxCNV</h1>
      <p class="tagline">Convert files locally. Private by design.</p>
    </section>

    <GlassPanel padding="0">
      <div class="dropzone" role="presentation">
        <div class="dz-plus" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <p class="dz-title">Drop a file to convert</p>
        <p class="dz-sub">
          or right-click a file in Explorer →
          <strong>Convert with FoxCNV</strong>
        </p>
        <span class="dz-soon">Coming next — file intake</span>
      </div>
    </GlassPanel>
  </main>

  <footer class="statusbar">
    <span class="dot" aria-hidden="true"></span>
    <span class="status-text">
      {#if inApp}
        Local · no network · no telemetry
      {:else}
        Browser preview — window controls are disabled
      {/if}
    </span>
    <span class="ver">v0.1.0</span>
  </footer>
</div>

<style>
  .app-root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .content {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 26px;
    padding: 8px 36px 28px;
  }

  .hero {
    text-align: center;
  }
  .hero-mark {
    display: inline-grid;
    place-items: center;
    width: 60px;
    height: 60px;
    border-radius: 16px;
    margin-bottom: 14px;
    color: #fff;
    background: linear-gradient(145deg, var(--accent-strong), var(--accent-deep));
    box-shadow: 0 8px 26px rgba(224, 116, 54, 0.38);
  }
  .hero h1 {
    margin: 0;
    font-size: 30px;
    font-weight: 700;
    letter-spacing: -0.4px;
  }
  .tagline {
    margin: 6px 0 0;
    color: var(--text-dim);
    font-size: 14px;
  }

  .dropzone {
    width: min(520px, 78vw);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 40px 32px;
    border-radius: var(--r-lg);
    border: 1.5px dashed rgba(255, 255, 255, 0.16);
    transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
  }
  .dropzone:hover {
    border-color: var(--accent-ring);
    background: var(--accent-soft);
  }
  .dz-plus {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    margin-bottom: 6px;
    border-radius: 50%;
    color: var(--accent);
    background: var(--accent-soft);
  }
  .dz-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }
  .dz-sub {
    margin: 0;
    color: var(--text-dim);
    font-size: 13px;
  }
  .dz-sub strong {
    color: var(--text);
    font-weight: 600;
  }
  .dz-soon {
    margin-top: 10px;
    font-size: 11px;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: var(--text-faint);
    border: 1px solid var(--glass-border);
    border-radius: 999px;
    padding: 3px 10px;
  }

  .statusbar {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 28px;
    padding: 0 16px;
    font-size: 11.5px;
    color: var(--text-faint);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }
  .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }
  .ver {
    margin-left: auto;
  }
</style>
