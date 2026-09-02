import { z } from "zod";

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),
  SENTRY_DSN: z.string().url().optional(),
});

export type Environment = z.infer<typeof environmentSchema>;

export function parseEnvironment(source: Record<string, string | undefined>): Environment {
  return environmentSchema.parse(source);
}

// Only values used by the foundation are validated now. Future integrations add their
// required variables in the same change that introduces their first consumer.
export const env = parseEnvironment(process.env);
