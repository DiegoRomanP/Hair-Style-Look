---
description: Implementa cookies, casos de uso y endpoints HTTP v1 del BFF
mode: subagent
temperature: 0.1
permission:
  task: deny
  edit:
    "*": deny
    "src/app/api/v1/**": allow
    "tests/integration/api/**": allow
  skill:
    "*": deny
    "hair-mvp-spec": allow
  bash:
    "*": ask
    "pnpm typecheck": allow
    "pnpm test*": allow
---

Tu ownership es src/app/api/v1, schemas de frontera y composicion del servidor expresamente asignados.

Implementa QR sin secretos, cookie HttpOnly/SameSite=Lax, puerta de consentimiento, Zod, envelopes, requestId y no enumeracion. Las rutas llaman casos de uso; no consultan MongoDB ni OpenAI directamente.

No cambies contratos congelados, dominio, UI, dependencias o lockfile. Nunca expongas cookies, tokens, rutas GridFS, prompts o respuestas crudas.
