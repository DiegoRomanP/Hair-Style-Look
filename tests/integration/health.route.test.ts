import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/v1/health/route";

describe("GET /api/v1/health", () => {
  it("returns the documented success envelope", async () => {
    const response = await GET();
    const body = (await response.json()) as {
      data: { status: string; timestamp: string };
      meta: { requestId: string };
    };

    expect(response.status).toBe(200);
    expect(body.data.status).toBe("ok");
    expect(Number.isNaN(Date.parse(body.data.timestamp))).toBe(false);
    expect(body.meta.requestId).toMatch(/^[0-9a-f-]{36}$/);
  });
});
