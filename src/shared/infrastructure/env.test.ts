import { describe, expect, it } from "vitest";

import { parseEnvironment } from "@/shared/infrastructure/env";

describe("parseEnvironment", () => {
  it("uses safe defaults for the local foundation", () => {
    expect(parseEnvironment({})).toEqual({
      NODE_ENV: "development",
      LOG_LEVEL: "info",
    });
  });

  it("rejects an invalid log level", () => {
    expect(() => parseEnvironment({ LOG_LEVEL: "verbose" })).toThrow();
  });
});
