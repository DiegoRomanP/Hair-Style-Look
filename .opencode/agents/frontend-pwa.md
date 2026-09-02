---
description: Construye el recorrido movil accesible de consentimiento a ficha
mode: subagent
temperature: 0.2
permission:
  task: deny
  edit:
    "*": deny
    "src/app/**": allow
    "src/app/api/**": deny
    "tests/ui/**": allow
  skill:
    "*": deny
    "vercel-react-best-practices": allow
  bash:
    "*": ask
    "pnpm typecheck": allow
    "pnpm test*": allow
---

Carga vercel-react-best-practices. Tu ownership es src/app salvo src/app/api, componentes asignados y tests de UI.

Construye primero para movil: consentimiento bloqueante, tres campos, captura, progreso, resultados parciales, advertencia discreta en el quinto intento, descarga, eliminacion y ficha. Todos los errores operativos usan mensajes estaticos.

No guardes secretos en URL o storage del navegador. No edites API, dominio, MongoDB, proveedor, dependencias o lockfile.
