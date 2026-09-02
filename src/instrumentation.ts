export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const [{ init }, { env }] = await Promise.all([
    import("@sentry/nextjs"),
    import("@/shared/infrastructure/env"),
  ]);

  if (!env.SENTRY_DSN) {
    return;
  }

  init({
    dsn: env.SENTRY_DSN,
    sendDefaultPii: false,
    beforeSend(event) {
      // Photo metadata, cookies and request bodies are not observability data.
      delete event.request?.cookies;
      delete event.request?.data;
      delete event.user;
      return event;
    },
  });
}
