import { isHosted } from "@/hosted";

export const DEFAULT_HTTP_TIMEOUT_MS = 20_000;

/** Prefix used by the host's reverse proxy to reach the nanobot gateway.
 *  Standalone mode keeps plain relative URLs (served by the gateway itself). */
export const HOSTED_API_BASE = "/nanobot-api";

/** Resolve a gateway URL for the current runtime. In hosted (micro-frontend)
 *  mode the WebUI runs on the CRM origin, so gateway API paths must go through
 *  the same-origin reverse proxy prefix. Media URLs produced by the server are
 *  handled by `resolveMediaUrl` for `<img>`/markdown usage. */
export function resolveGatewayUrl(input: RequestInfo | URL): RequestInfo | URL {
  if (!isHosted()) return input;
  if (typeof input === "string" && /^\/(api|webui|auth)\//.test(input)) {
    return `${HOSTED_API_BASE}${input}`;
  }
  return input;
}

/** Resolve a server-provided media URL (e.g. /api/media/...) for display. */
export function resolveMediaUrl(url: string | undefined | null): string {
  if (!url) return "";
  return String(resolveGatewayUrl(url));
}

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs: number = DEFAULT_HTTP_TIMEOUT_MS,
): Promise<Response> {
  const resolved = resolveGatewayUrl(input);
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    return fetch(resolved, init);
  }

  const controller = typeof AbortController !== "undefined"
    ? new AbortController()
    : null;
  const externalSignal = init.signal;
  const abortFromExternal = () => controller?.abort();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (controller && externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener("abort", abortFromExternal, { once: true });
    }
  }

  try {
    const request = fetch(resolved, {
      ...init,
      signal: controller?.signal ?? externalSignal,
    });
    const timeout = new Promise<Response>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Request timed out after ${timeoutMs}ms`));
        controller?.abort();
      }, timeoutMs);
    });
    return await Promise.race([request, timeout]);
  } finally {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    externalSignal?.removeEventListener("abort", abortFromExternal);
  }
}
