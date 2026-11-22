/** Hosted micro-frontend entry point.
 *
 * The openCRM SvelteKit app dynamically imports this module and calls
 * `mountAgent` to render the agent UI inside its own document (no iframe).
 * The standalone SPA entry (`main.tsx`) remains untouched for direct access.
 */

import ReactDOM, { type Root } from "react-dom/client";

import App from "./App";
import "./hosted.css";
import { initializeI18n } from "./i18n";
import { normalizeLocale } from "./i18n/config";
import { LOCALE_STORAGE_KEY } from "./i18n/config";
import { initializeLoopbackRuntimeHost } from "./lib/runtime";
import {
  clearHostedConfig,
  setHostedConfig,
  type AgentError,
  type AgentMountOptions,
} from "./hosted";

export type { AgentError, AgentMountOptions } from "./hosted";

export interface AgentHandle {
  unmount(): void;
}

const THEME_STORAGE_KEY = "nanobot-webui.theme";

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore storage errors (private mode, etc.)
  }
}

function applyThemeClass(theme: "light" | "dark"): void {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

/** Mount the agent WebUI into `container` using host-supplied initialization. */
export async function mountAgent(
  container: HTMLElement,
  options: AgentMountOptions,
): Promise<AgentHandle> {
  if (!container) throw new Error("mountAgent: container is required");
  if (!options?.credential) {
    const error: AgentError = { code: "credential", message: "missing credential" };
    options?.onError?.(error);
    throw new Error("mountAgent: credential is required");
  }

  setHostedConfig(options);

  // Scope all WebUI CSS to this container (see scope-hosted-css.cjs) and make
  // it a query container so responsive/compact layouts follow the drawer's
  // width rather than the browser viewport.
  container.classList.add("nanobot-hosted");
  container.style.containerType = "inline-size";
  container.style.containerName = "nanobot";

  // The standalone CSS sizes html/body/#root to 100%. In hosted mode the host
  // owns the document, so size the mount container directly instead.
  container.style.height = "100%";
  container.style.minHeight = "0";
  container.style.overflow = "hidden";

  if (options.language) {
    writeStorage(LOCALE_STORAGE_KEY, normalizeLocale(options.language));
  }
  const theme = options.theme ?? "light";
  writeStorage(THEME_STORAGE_KEY, theme);
  applyThemeClass(theme);

  if (typeof globalThis.crypto !== "undefined" && !("randomUUID" in globalThis.crypto)) {
    Object.defineProperty(globalThis.crypto, "randomUUID", {
      value: () =>
        "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }),
      configurable: true,
    });
  }

  initializeLoopbackRuntimeHost();
  await initializeI18n();

  let root: Root | null = ReactDOM.createRoot(container);
  root.render(<App />);

  let unmounted = false;
  return {
    unmount(): void {
      if (unmounted) return;
      unmounted = true;
      const activeRoot = root;
      root = null;
      try {
        activeRoot?.unmount();
      } finally {
        clearHostedConfig();
        container.replaceChildren();
        container.classList.remove("nanobot-hosted");
      }
    },
  };
}
