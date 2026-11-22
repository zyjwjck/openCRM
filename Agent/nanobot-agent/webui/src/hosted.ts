/** Hosted (micro-frontend) integration configuration.
 *
 * When the WebUI is mounted by an external host (openCRM) via `mountAgent`,
 * this module holds the initialization parameters supplied by the host. The
 * standalone SPA never calls `setHostedConfig`, so all getters return `null`
 * and the app keeps its existing URL/localStorage behavior.
 */

export interface AgentError {
  code: "credential" | "bootstrap" | "unknown";
  message: string;
}

export interface AgentMountOptions {
  credential: string;
  language?: string;
  theme?: "light" | "dark";
  initialSessionHash?: string;
  /** Default CRM module scope for this mount (e.g. ["leads"] on the leads page).
   *  Values must be ids from CRM_MODULE_GROUPS. The user can still change the
   *  selection in the UI; this is only the initial state. */
  initialCrmModules?: string[];
  onRouteChange?: (hash: string) => void;
  onError?: (error: AgentError) => void;
}

interface HostedConfig {
  credential: string;
  language: string;
  theme: "light" | "dark" | null;
  initialSessionHash: string;
  initialCrmModules: string[];
  onRouteChange?: (hash: string) => void;
  onError?: (error: AgentError) => void;
}

let current: HostedConfig | null = null;

export function setHostedConfig(options: AgentMountOptions): HostedConfig {
  current = {
    credential: options.credential,
    language: options.language ?? "",
    theme: options.theme ?? null,
    initialSessionHash: options.initialSessionHash ?? "",
    initialCrmModules: Array.isArray(options.initialCrmModules)
      ? [...options.initialCrmModules]
      : [],
    onRouteChange: options.onRouteChange,
    onError: options.onError,
  };
  return current;
}

export function clearHostedConfig(): void {
  current = null;
}

export function isHosted(): boolean {
  return current !== null;
}

/** Credential supplied by the host. Empty string when not hosted. */
export function hostedCredential(): string {
  return current?.credential ?? "";
}

/** Initial route hash supplied by the host (opaque session id, not a credential). */
export function hostedInitialSessionHash(): string {
  return current?.initialSessionHash ?? "";
}

export function hostedLanguage(): string {
  return current?.language ?? "";
}

export function hostedTheme(): "light" | "dark" | null {
  return current?.theme ?? null;
}

/** Default CRM module scope supplied by the host, if any. */
export function hostedInitialCrmModules(): string[] {
  return current?.initialCrmModules ? [...current.initialCrmModules] : [];
}

/** Notify the host that the active route/session hash changed. */
export function notifyHostedRoute(hash: string): void {
  if (!current?.onRouteChange) return;
  try {
    current.onRouteChange(hash || "");
  } catch {
    // Host callbacks must never break the agent UI.
  }
}

/** Report a recoverable error to the host. */
export function notifyHostedError(error: AgentError): void {
  if (!current?.onError) return;
  try {
    current.onError(error);
  } catch {
    // Host callbacks must never break the agent UI.
  }
}
