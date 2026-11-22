import { afterEach, describe, expect, it, vi } from "vitest";

import { setHostedConfig, clearHostedConfig } from "@/hosted";
import { resolveGatewayUrl, resolveMediaUrl, fetchWithTimeout } from "@/lib/http";
import { deriveWsUrl } from "@/lib/bootstrap";

describe("hosted reverse-proxy URL resolution", () => {
  afterEach(() => {
    clearHostedConfig();
    vi.unstubAllGlobals();
  });

  function enterHosted() {
    setHostedConfig({ credential: "test-cred" });
  }

  it("keeps plain relative URLs in standalone mode", () => {
    expect(resolveGatewayUrl("/api/sessions")).toBe("/api/sessions");
    expect(resolveGatewayUrl("/webui/bootstrap")).toBe("/webui/bootstrap");
  });

  it("prefixes gateway API paths in hosted mode", () => {
    enterHosted();
    expect(resolveGatewayUrl("/api/sessions")).toBe("/nanobot-api/api/sessions");
    expect(resolveGatewayUrl("/webui/bootstrap")).toBe("/nanobot-api/webui/bootstrap");
    expect(resolveGatewayUrl("/auth/token")).toBe("/nanobot-api/auth/token");
  });

  it("does not prefix non-gateway URLs", () => {
    enterHosted();
    expect(resolveGatewayUrl("https://example.com/x")).toBe("https://example.com/x");
    expect(resolveGatewayUrl("/other")).toBe("/other");
  });

  it("resolves server-provided media URLs for display", () => {
    enterHosted();
    expect(resolveMediaUrl("/api/media/abc.png")).toBe("/nanobot-api/api/media/abc.png");
    expect(resolveMediaUrl("")).toBe("");
  });

  it("fetchWithTimeout sends the prefixed URL in hosted mode", async () => {
    enterHosted();
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await fetchWithTimeout("/api/sessions");
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0]).toBe("/nanobot-api/api/sessions");
  });

  it("deriveWsUrl uses the same-origin WS proxy in hosted mode", () => {
    enterHosted();
    const result = deriveWsUrl("/", "tok");
    expect(result).toContain("/nanobot-ws/");
    expect(result).toContain("token=tok");
    expect(result).toMatch(/^wss?:\/\//);
  });
});
