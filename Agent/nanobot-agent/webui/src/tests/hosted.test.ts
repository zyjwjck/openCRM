import { afterEach, describe, expect, it, vi } from "vitest";

import {
  clearHostedConfig,
  hostedCredential,
  hostedInitialSessionHash,
  hostedLanguage,
  hostedTheme,
  isHosted,
  notifyHostedError,
  notifyHostedRoute,
  setHostedConfig,
} from "@/hosted";

describe("hosted integration config", () => {
  afterEach(() => clearHostedConfig());

  it("returns empty/null values when not hosted (standalone mode)", () => {
    expect(isHosted()).toBe(false);
    expect(hostedCredential()).toBe("");
    expect(hostedInitialSessionHash()).toBe("");
    expect(hostedLanguage()).toBe("");
    expect(hostedTheme()).toBeNull();
  });

  it("stores host-supplied initialization parameters", () => {
    setHostedConfig({
      credential: "cred-123",
      language: "zh-CN",
      theme: "dark",
      initialSessionHash: "#/chat/abc",
    });
    expect(isHosted()).toBe(true);
    expect(hostedCredential()).toBe("cred-123");
    expect(hostedLanguage()).toBe("zh-CN");
    expect(hostedTheme()).toBe("dark");
    expect(hostedInitialSessionHash()).toBe("#/chat/abc");
  });

  it("applies defaults for optional parameters", () => {
    setHostedConfig({ credential: "cred" });
    expect(hostedLanguage()).toBe("");
    expect(hostedTheme()).toBeNull();
    expect(hostedInitialSessionHash()).toBe("");
  });

  it("delivers route changes to the host callback", () => {
    const onRouteChange = vi.fn();
    setHostedConfig({ credential: "cred", onRouteChange });
    notifyHostedRoute("#/chat/xyz");
    expect(onRouteChange).toHaveBeenCalledWith("#/chat/xyz");
  });

  it("delivers errors to the host callback with a code", () => {
    const onError = vi.fn();
    setHostedConfig({ credential: "cred", onError });
    notifyHostedError({ code: "credential", message: "HTTP 401" });
    expect(onError).toHaveBeenCalledWith({ code: "credential", message: "HTTP 401" });
  });

  it("host callbacks throwing never propagate into the agent UI", () => {
    setHostedConfig({
      credential: "cred",
      onRouteChange: () => {
        throw new Error("host bug");
      },
      onError: () => {
        throw new Error("host bug");
      },
    });
    expect(() => notifyHostedRoute("#/chat/1")).not.toThrow();
    expect(() => notifyHostedError({ code: "unknown", message: "x" })).not.toThrow();
  });

  it("clears hosted state so a later standalone render is unaffected", () => {
    setHostedConfig({ credential: "cred", language: "ja" });
    clearHostedConfig();
    expect(isHosted()).toBe(false);
    expect(hostedCredential()).toBe("");
  });
});
