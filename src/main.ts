import { mount } from "svelte";
import "./styles/global.css";
import App from "./App.svelte";
import { isTauri } from "./lib/ipc";

// Let the stylesheet switch to a transparent body so the native Windows
// mica/acrylic backdrop shows through when running inside the app.
if (isTauri()) {
  document.documentElement.classList.add("is-tauri");
}

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
