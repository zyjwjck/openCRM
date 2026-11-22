import { afterEach, describe, expect, it } from "vitest";

import {
  clearHostedConfig,
  hostedInitialCrmModules,
  setHostedConfig,
} from "@/hosted";

describe("hosted CRM module scope", () => {
  afterEach(() => clearHostedConfig());

  it("defaults to an empty scope when no modules are supplied", () => {
    setHostedConfig({ credential: "c" });
    expect(hostedInitialCrmModules()).toEqual([]);
  });

  it("returns the supplied default scope and isolates copies", () => {
    setHostedConfig({ credential: "c", initialCrmModules: ["leads"] });
    expect(hostedInitialCrmModules()).toEqual(["leads"]);

    const first = hostedInitialCrmModules();
    first.push("contacts");
    expect(hostedInitialCrmModules()).toEqual(["leads"]);
  });

  it("clears the scope on unmount", () => {
    setHostedConfig({ credential: "c", initialCrmModules: ["leads"] });
    clearHostedConfig();
    expect(hostedInitialCrmModules()).toEqual([]);
  });
});
