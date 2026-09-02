# Plan de ejecucion multiagente del MVP

## Estado y regla principal

La Fase 0 esta verde en local, pero el proyecto sigue detenido en Ola 0 hasta poder crear el primer commit: el filesystem rechaza la escritura de `.git/index.lock`. MongoDB, GridFS y OpenAI Images estan especificados, no implementados.

Ninguna ola empieza hasta integrar y verificar la anterior. Con cuatro slots totales, el maximo es un coordinador y tres subagentes. Los agentes no comparten archivos dentro de una ola.

## Roles activos

| Agente | Responsabilidad | Skills principales |
|---|---|---|
| `orchestrator` | baseline, contratos, dependencias, integracion y puertas | `hair-mvp-spec`, `hair-mvp-qa` |
| `product-privacy` | consentimiento, cuestionario, retencion y mensajes | `hair-mvp-spec` |
| `domain-engineer` | estados, reglas, puertos y casos de uso puros | `hair-mvp-spec` |
| `mongodb-engineer` | MongoDB, GridFS, repositorios y worker leases | `hair-mongodb` |
| `application-api` | cookies, Route Handlers y composicion | `hair-mvp-spec` |
| `frontend-pwa` | recorrido movil, camara y estados de UI | `vercel-react-best-practices` |
| `generation-jobs` | worker, adaptador OpenAI, presupuesto y guardrails | `hair-openai-images` |
| `qa-security` | pruebas integradas, privacidad y threat checks | `hair-mvp-qa`, `playwright-skill` |

Los roles `benchmark-analyst`, `platform-observability`, `staff-recommendations`, `photo-pipeline` y `supabase-engineer` quedan fuera del lanzamiento inicial. `photo-pipeline` puede reactivarse en Ola 2 si el coordinador separa archivos; `supabase-engineer` solo puede ayudar a retirar legado, nunca a expandirlo.

## Antes de lanzar un subagente

El coordinador entrega un contrato de tarea con:

- objetivo y no objetivos;
- rama o worktree desde baseline verde;
- archivos permitidos;
- archivos prohibidos;
- contratos congelados que consume;
- criterios de aceptacion;
- comandos de prueba;
- dependencia de otras entregas;
- prohibicion de creditos/secretos salvo autorizacion.

Una tarea sin esta ficha no se delega.

## Ola 0 — baseline serial

Agente: `orchestrator` solamente.

1. Usar Node 24.19.0 y pnpm 11.22.0.
2. Corregir incompatibilidad ESLint/TypeScript.
3. Corregir el alcance de Vitest para ignorar `.next`, `.opencode` y `.agents`.
4. Ejecutar todos los checks.
5. Crear primer commit verde.

Puerta:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm test:e2e
git status --short
```

No agregar dependencias funcionales en esta ola.

## Ola 1 — contratos, acceso y MongoDB

### Paralelo permitido

- `product-privacy`: `docs/product/**`, `docs/privacy/**` y plantillas de mensajes asignadas.
- `domain-engineer`: dominio/aplicacion de access, consent, catalog y consultation.
- `mongodb-engineer`: `src/integrations/mongodb/**`, scripts de indices y pruebas de repositorio.

El coordinador primero fija tipos compartidos y agrega `mongodb`/configuracion Docker de forma serial. Despues integra en orden dominio -> datos -> documentos.

Puerta:

- sesion recuperable tras reinicio;
- rechazo de consentimiento bloquea;
- tres respuestas persisten;
- sugerencia de estilo agrega ocurrencias sin duplicar;
- salon A no accede a salon B;
- indices se crean desde base limpia.

## Ola 2 — API, UI y fotos privadas

### Paralelo permitido

- `application-api`: sesiones, cookies, consent, catalog, consultation y assets.
- `frontend-pwa`: QR, consentimiento, formulario y captura; no edita API.
- `mongodb-engineer` o `photo-pipeline`: GridFS y reconciliacion o preparacion browser, con ownership no superpuesto.

Puerta:

- no hay secretos en URL;
- cookie y autorizacion funcionan;
- foto valida persiste en GridFS;
- stream exige sesion correcta;
- descarga y eliminacion son verificables;
- upload interrumpido se reconcilia.

## Ola 3 — generacion OpenAI

### Paralelo permitido

- `generation-jobs`: puerto, worker, adaptador y contrato simulado.
- `domain-engineer`: reglas de job, idempotencia, presupuesto y contador.
- `frontend-pwa`: polling, resultados parciales y mensajes estaticos.

El coordinador es el unico que configura la clave o autoriza una ejecucion pagada.

Puerta:

- `IMAGE_PROVIDER=openai` selecciona el adaptador;
- maximo dos jobs en ejecucion;
- quinta repeticion muestra advertencia sin bloquear;
- USD 10 detiene antes de llamar al proveedor;
- fuera de alcance se rechaza antes de cobrar;
- reinicio del worker recupera lease vencido;
- fallo parcial conserva resultados validos;
- suite contractual simulada pasa.

## Ola 4 — ficha y demo

- `domain-engineer`: seleccion y ficha.
- `frontend-pwa`: resultado, descarga, eliminacion y vista minima de estilista.
- `application-api`: endpoints de ficha.

Puerta: E2E movil QR -> consentimiento -> tres campos -> foto -> resultado -> ficha, incluida recarga/reinicio.

## QA por ola

`qa-security` se lanza despues de integrar la ola, no contra ramas separadas. Reporta severidad, archivo, impacto y reproduccion. El propietario corrige hallazgos; el coordinador vuelve a ejecutar la puerta completa.

Checks especiales:

- no foto/base64/cookie/token/prompt en logs;
- datos sinteticos solamente;
- no OpenAI real en CI;
- cuarentena de resultado inadecuado no visible y maximo 24 horas;
- mensajes de rechazo son constantes versionadas;
- `supabase/` no vuelve a entrar en runtime.

## Secuencia eficiente de lanzamiento

1. `orchestrator` completa Ola 0.
2. Ola 1: tres subagentes en paralelo solo despues de congelar contratos.
3. Integrar y lanzar `qa-security`.
4. Repetir para la ola siguiente.
5. Actualizar `project/current-status` y `delivery/agent-launch-sequence` en Engram al cerrar cada puerta.

No lanzar todos los roles. No usar un agente especializado si la tarea cabe en el ownership del agente ya activo. No delegar cambios de una sola linea que el coordinador puede verificar de inmediato.

## Formato de entrega

```text
Resultado:
Ownership respetado:
Archivos:
Pruebas ejecutadas:
Pruebas omitidas:
Riesgos/supuestos:
Commit o diff:
Siguiente accion permitida:
```
