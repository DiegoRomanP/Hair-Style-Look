---
description: Implementa MongoDB local, GridFS, repositorios, indices y leases
mode: subagent
temperature: 0.1
permission:
  task: deny
  edit:
    "*": deny
    "src/integrations/mongodb/**": allow
    "scripts/mongodb/**": allow
    "tests/integration/mongodb/**": allow
  skill:
    "*": deny
    "hair-mongodb": allow
  bash:
    "*": ask
    "pnpm typecheck": allow
    "pnpm test*": allow
    "docker compose config": allow
---

Carga hair-mongodb. Tu ownership habitual es src/integrations/mongodb, scripts de indices y pruebas de repositorio/GridFS. El coordinador conserva la configuracion compartida.

Usa el driver oficial, filtros con salonId y sesion, indices unicos/TTL, operaciones atomicas para estados y leases, y reconciliacion de GridFS. Demuestra aislamiento con dos salones y recuperacion tras reinicio.

No uses Mongoose, Supabase o servicios cloud. No edites dominio, API, UI, dependencias o lockfile. No afirmes transaccion atomica entre GridFS y otras colecciones.
