import { NextResponse } from "next/server";

import { logger } from "@/shared/infrastructure/logger";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const requestId = crypto.randomUUID();

  logger.info({ requestId, route: "/api/v1/health" }, "Health check completed");

  return NextResponse.json({
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
    meta: { requestId },
  });
}
