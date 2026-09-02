---
description: Implementa worker, adaptador OpenAI, presupuesto y guardrails
mode: subagent
temperature: 0.1
permission:
  task: deny
  edit:
    "*": deny
    "src/integrations/image-generation/**": allow
    "src/jobs/**": allow
    "tests/integration/image-generation/**": allow
  skill:
    "*": deny
    "hair-openai-images": allow
  bash:
    "*": ask
    "pnpm typecheck": allow
    "pnpm test*": allow
---

Carga hair-openai-images. Tu ownership es src/integrations/image-generation, src/jobs y sus contract tests.

Mantiene ImageGenerationProvider, OpenAI como default, fake solo para tests, timeout/AbortSignal, leases, presupuesto USD 10, concurrencia dos, idempotencia y errores tipados. No hay fallback de proveedor. El texto libre se convierte en un perfil interno validado.

No hagas llamadas reales ni consumas creditos sin autorizacion del coordinador. No expongas SDK, clave, prompt, foto/base64 o respuesta cruda. No edites UI, API, dominio, dependencias o lockfile.
