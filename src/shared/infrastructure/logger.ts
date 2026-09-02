import pino from "pino";

import { env } from "@/shared/infrastructure/env";

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "authorization",
      "cookie",
      "publicToken",
      "signedUrl",
      "objectPath",
      "photo",
      "image",
      "prompt",
    ],
    censor: "[REDACTED]",
  },
  base: undefined,
});
