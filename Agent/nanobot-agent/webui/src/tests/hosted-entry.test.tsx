import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock heavyweight dependencies so mount/unmount lifecycle can be tested in isolation.
const unmountMocks: ReturnType<typeof vi.fn>[] = [];
const renderMocks: ReturnType<typeof vi.fn>[] = [];

vi.mock("react-dom/client", () => ({
  default: {
    createRoot: (_container: HTMLElement) => {
      const unmount = vi.fn();
      const render = vi.fn();
      unmountMocks.push(unmount);
      renderMocks.push(render);
      return { render, unmount };
    },
  },
}));

vi.mock("@/App", () => ({
  default: () => null,
}));

vi.mock("@/i18n", () => ({
  initializeI18n: vi.fn(async () => undefined),
}));

vi.mock("@/i18n/config", () => ({
  normalizeLocale: (v: string) => v,
  LOCALE_STORAGE_KEY: "nanobot.locale",
}));

vi.mock("@/lib/runtime", () => ({
  initializeLoopbackRuntimeHost: vi.fn(),
}));

describe("hosted mount lifecycle", () => {
  let container: HTMLElement;

  beforeEach(() => {
    unmountMocks.length = 0;
    renderMocks.length = 0;
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
    vi.unstubAllGlobals();
  });

  it("rejects mounting without a credential and reports to onError", async () => {
    const { mountAgent } = await import("@/hosted-entry");
    const onError = vi.fn();
    await expect(
      mountAgent(container, { credential: "", onError }),
    ).rejects.toThrow("credential is required");
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ code: "credential" }),
    );
  });

  it("mounts and unmounts cleanly across repeated cycles without duplicate roots", async () => {
    const { mountAgent } = await import("@/hosted-entry");
    for (let i = 0; i < 3; i += 1) {
      const handle = await mountAgent(container, { credential: `cred-${i}` });
      expect(renderMocks).toHaveLength(i + 1);
      handle.unmount();
      // Calling unmount twice must be idempotent.
      handle.unmount();
      expect(unmountMocks[i]).toHaveBeenCalledTimes(1);
      expect(container.children).toHaveLength(0);
    }
    expect(renderMocks).toHaveLength(3);
    expect(unmountMocks).toHaveLength(3);
  });

  it("applies host language and theme to storage and the document", async () => {
    const { mountAgent } = await import("@/hosted-entry");
    const handle = await mountAgent(container, {
      credential: "cred",
      language: "zh-CN",
      theme: "dark",
    });
    expect(localStorage.getItem("nanobot.locale")).toBe("zh-CN");
    expect(localStorage.getItem("nanobot-webui.theme")).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    handle.unmount();
  });
});
