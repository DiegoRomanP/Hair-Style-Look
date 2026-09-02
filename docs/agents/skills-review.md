# Revision de skills y uso con OpenCode

## Busqueda realizada

Se ejecuto y se leyo completamente:

```bash
npx skills use "https://github.com/vercel-labs/skills" --skill "find-skills"
```

Las busquedas interactivas posteriores de la CLI agotaron el tiempo de aprobacion, por lo que se contrasto el indice publico de skills.sh y las paginas de cada skill. No se encontro una skill de MongoDB con procedencia y adopcion suficientes para convertirla en dependencia del proyecto.

## Skills instaladas de terceros

### `vercel-react-best-practices`

- Fuente: `vercel-labs/agent-skills`.
- Uso: componentes React/Next.js y rendimiento de la PWA.
- Motivo: mantenida por Vercel, amplia adopcion y auditorias sin alertas mostradas por la CLI.
- Agente: `frontend-pwa`.

### `playwright-skill`

- Fuente: `testdino-hq/playwright-skill`.
- Uso: E2E movil, descargas, cookies, recargas y fallos.
- Motivo: guias especializadas, auditorias mostradas como seguras y reglas de prueba estables.
- Agente: `qa-security`.

Ambas se instalaron localmente en `.agents/skills` y quedaron registradas en `skills-lock.json`. Se reviso completamente cada `SKILL.md` antes de asignarla.

## Skills propias

Se inicializaron con `skill-creator`, se completaron y validaron:

| Skill | Uso | Agentes |
|---|---|---|
| `hair-mvp-spec` | alcance, contratos y decisiones pendientes | orchestrator, product-privacy, domain-engineer, application-api |
| `hair-mongodb` | colecciones, GridFS, indices y leases | mongodb-engineer |
| `hair-openai-images` | adaptador, jobs, presupuesto y guardrails | generation-jobs |
| `hair-mvp-qa` | puertas y controles bloqueantes | orchestrator, qa-security |

Comando de validacion:

```bash
python3 /home/diego/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/<skill>
```

## Skills descartadas

- Skills de benchmark/data science: no se necesita comparar proveedores antes del vertical slice.
- Skills de graph/RAG: no pertenecen al producto.
- Skill generica de ML: duplicaba las reglas del adaptador y conservaba el fake como default.
- Skill MongoDB no verificada: se prefirio una skill propia basada en documentacion oficial.
- Skills de despliegue/observabilidad cloud: el MVP es local.

## Como descubre OpenCode el proyecto

- Skills: `.agents/skills/<name>/SKILL.md`.
- Agentes: `.opencode/agents/<name>.md`.
- Configuracion y permisos: `opencode.json`.
- Instrucciones canonicas: `AGENTS.md`.

`opencode.json` declara `orchestrator` como agente principal, carga `AGENTS.md` de forma explicita y registra `.agents/skills` como ruta reproducible. El CLI global no es una dependencia del proyecto. `opencode --version` devuelve `1.18.26` y `opencode agent list` reconoce los ocho agentes.

## MCPs del proyecto

- `engram`: memoria persistente limitada al proyecto `Hair-Style-Look`.
- `context7`: consulta de documentacion actual de librerias y APIs.
- `github`: coordinacion de issues, cambios y pull requests cuando se solicite.

Los MCPs globales `headroom`, `serena` y `open-design` se deshabilitan en este proyecto para reducir herramientas y contexto no necesarios. No se agrega un MCP de Playwright porque la dependencia local y `playwright-skill` ya cubren el E2E reproducible; tampoco se agregan MCPs de MongoDB, OpenAI, Supabase o Sentry. MongoDB y OpenAI se integran en la aplicacion mediante sus clientes oficiales, y cualquier uso pagado de OpenAI requiere autorizacion del coordinador.

## Limites de agentes

Los seis agentes de implementacion tienen rutas de edicion explicitas y no pueden cambiar dependencias o configuracion compartida. `qa-security` es de solo lectura y `orchestrator` conserva en exclusiva dependencias, lockfile, configuracion, integracion y lanzamiento de subagentes.

## Lanzamiento eficiente

Iniciar el coordinador desde la raiz:

```bash
opencode --agent orchestrator .
```

Primera instruccion recomendada:

```text
Recupera Engram, inspecciona el repositorio y ejecuta solo la Ola 0 de docs/agents/execution-plan.md. No agregues integraciones ni dependencias funcionales. Entrega el baseline verde y el primer commit.
```

Despues de Ola 0, el orquestador puede delegar un maximo de tres tareas no superpuestas. No se recomienda invocar manualmente todos los subagentes. `qa-security` se lanza despues de integrar cada ola.

## Instalacion global frente a proyecto

Global, fuera de `package.json`:

- OpenCode CLI, porque es una herramienta personal para abrir y coordinar sesiones.
- pnpm mediante Corepack.

Local y versionado en el proyecto:

- Next.js, React, MongoDB driver, OpenAI SDK, Zod, test runners, linters y cualquier CLI usada por scripts o CI.
- Skills del proyecto bajo `.agents/skills`.

No usar `pnpm add -g` para librerias del runtime, build o tests. Ejecutar binarios locales con `pnpm exec`.
