<script lang="ts">
  import { onMount } from "svelte";
  import TitleBar from "./lib/components/TitleBar.svelte";
  import GlassPanel from "./lib/components/GlassPanel.svelte";
  import Logo from "./lib/components/Logo.svelte";
  import {
    isTauri,
    takeInitialFile,
    probeFile,
    onOpenFile,
    onDragDrop,
    fileName,
    formatBytes,
    type FileInfo,
  } from "./lib/ipc";

  const inApp = isTauri();
  let dragOver = $state(false);
  let loaded = $state<FileInfo | null>(null);

  async function load(path: string) {
    const info = await probeFile(path);
    loaded = info ?? { path, name: fileName(path), ext: "", size: 0 };
  }

  onMount(() => {
    const unsubs: Array<() => void> = [];
    void (async () => {
      const initial = await takeInitialFile();
      if (initial) await load(initial);
      // Subsequent right-click launches are folded into this instance.
      unsubs.push(await onOpenFile((p) => load(p)));
      // Native OS drag-and-drop (real file paths).
      unsubs.push(
        await onDragDrop({
          onHover: () => (dragOver = true),
          onCancel: () => (dragOver = false),
          onDrop: (paths) => {
            dragOver = false;
            if (paths[0]) void load(paths[0]);
          },
        }),
      );
    })();
    return () => unsubs.forEach((u) => u());
  });

  // Browser-only fallback so the drop area is demoable without Tauri.
  function onBrowserDragOver(e: DragEvent) {
    if (inApp) return;
    e.preventDefault();
    dragOver = true;
  }
  function onBrowserDragLeave() {
    if (!inApp) dragOver = false;
  }
  function onBrowserDrop(e: DragEvent) {
    if (inApp) return;
    e.preventDefault();
    dragOver = false;
    const f = e.dataTransfer?.files?.[0];
    if (f) {
      loaded = {
        path: f.name,
        name: f.name,
        ext: f.name.split(".").pop()?.toLowerCase() ?? "",
        size: f.size,
      };
    }
  }
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
      {#if loaded}
        <div class="filecard">
          <div class="fc-icon">{loaded.ext ? loaded.ext.toUpperCase() : "FILE"}</div>
          <div class="fc-meta">
            <p class="fc-name" title={loaded.path}>{loaded.name}</p>
            <p class="fc-sub">{loaded.size ? formatBytes(loaded.size) : "ready"}</p>
          </div>
          <button class="fc-clear" onclick={() => (loaded = null)} title="Remove" aria-label="Remove file">
            <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
              <line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" stroke-width="1.4" />
              <line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" stroke-width="1.4" />
            </svg>
          </button>
        </div>
        <div class="fc-actions">
          <button class="btn-primary" disabled>Convert</button>
          <span class="dz-soon">Conversion options arrive in the next update</span>
        </div>
      {:else}
        <div
          class="dropzone"
          class:over={dragOver}
          role="presentation"
          ondragover={onBrowserDragOver}
          ondragleave={onBrowserDragLeave}
          ondrop={onBrowserDrop}
        >
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
        </div>
      {/if}
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

  /* Empty drop area */
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
  .dropzone:hover,
  .dropzone.over {
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
    font-size: 11px;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: var(--text-faint);
  }

  /* Loaded file card */
  .filecard {
    width: min(520px, 78vw);
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 18px 20px;
  }
  .fc-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: var(--r-md);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.4px;
    color: #fff;
    background: linear-gradient(145deg, var(--accent-strong), var(--accent-deep));
    box-shadow: 0 6px 18px rgba(224, 116, 54, 0.32);
  }
  .fc-meta {
    flex: 1 1 auto;
    min-width: 0;
  }
  .fc-name {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fc-sub {
    margin: 2px 0 0;
    font-size: 12px;
    color: var(--text-dim);
  }
  .fc-clear {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 0;
    background: rgba(255, 255, 255, 0.06);
    color: var(--text-dim);
    cursor: default;
    transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
  }
  .fc-clear:hover {
    background: rgba(255, 255, 255, 0.14);
    color: var(--text);
  }

  .fc-actions {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0 20px 18px;
  }
  .btn-primary {
    border: 0;
    border-radius: var(--r-sm);
    padding: 9px 22px;
    font-size: 13.5px;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(145deg, var(--accent-strong), var(--accent-deep));
    cursor: default;
    transition: filter var(--dur) var(--ease), opacity var(--dur) var(--ease);
  }
  .btn-primary:hover:not(:disabled) {
    filter: brightness(1.08);
  }
  .btn-primary:disabled {
    opacity: 0.45;
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
