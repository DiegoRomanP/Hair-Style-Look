# Handoff para construir Hair Style Look

## Resultado esperado

Construir un MVP local, no una plataforma de produccion. La demostracion termina cuando un adulto entra por QR, acepta el tratamiento de datos, elige o describe un peinado, aporta una foto, obtiene una simulacion mediante OpenAI Images, puede recuperarla tras reiniciar, descargarla o eliminarla y genera una ficha basica.

## Estado real al 2 de septiembre de 2026

- Existe un scaffold Next.js/PWA, health check y dominio inicial de consultas.
- Existen tests unitarios e integracion/E2E basicos.
- El repositorio aun no tiene commit inicial: Git no puede crear `.git/index.lock` porque el filesystem lo rechaza como solo lectura.
- La implementacion MongoDB, GridFS, sesion por cookie, consentimiento, fotografia, worker, OpenAI y ficha no existe.
- `supabase/` es un resto no integrado de la arquitectura anterior; no debe ampliarse.
- La Fase 0 se verifico con Node 24.19.0, pnpm 11.22.0, ESLint 9.39.2 y TypeScript 5.9.3.
- Vitest excluye `.next`, `.opencode` y `.agents`; la puerta completa local pasa.
- El build Turbopack y el E2E movil basico pasan sin servicios externos.
- La instalacion global actual de OpenCode esta incompleta porque no ejecuto su postinstall.

No confundas especificacion actualizada con implementacion terminada.

## Decisiones congeladas

- OpenAI Images es el proveedor normal: `IMAGE_PROVIDER=openai`.
- MongoDB Community local + driver oficial + GridFS reemplaza Supabase para este MVP.
- QR sin secreto; token intercambiado por cookie `HttpOnly` y persistente.
- Consentimiento versionado bloquea toda funcion si se rechaza.
- Tres entradas obligatorias: estilo, largo actual y nivel de cambio.
- Texto libre de estilo se almacena como sugerencia pendiente y se filtra antes del prompt.
- Maximo dos generaciones concurrentes por sesion.
- Reintentos solo por accion del usuario; quinta solicitud equivalente muestra advertencia discreta.
- Presupuesto total por entorno: USD 10.
- Kill switch: fuera de peinados humanos, imagen general, presupuesto agotado o concurrencia excedida.
- No hay fallback de proveedor: solo mensaje estatico.
- Catalogo, servicios, jobs, resultados y ficha son persistentes.
- El usuario puede descargar y solicitar eliminacion; la retencion legal final queda pendiente antes de datos reales.
- Resultado inadecuado del proveedor: ocultar, mensaje estatico e incidente; cuarentena GridFS maxima 24 horas, nunca dataset.

## Primera tarea exacta

### Fase 0 — baseline verde

Ownership: coordinador solamente.

1. Activar Node 24.19.0 y pnpm 11.22.0.
2. Resolver la combinacion incompatible de ESLint/TypeScript sin introducir versiones flotantes.
3. Excluir `.next`, `.opencode`, `.agents` y artefactos del descubrimiento de tests/lint cuando corresponda.
4. Ejecutar `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:integration`, `pnpm build` y `pnpm test:e2e`.
5. Corregir solo fallos del baseline.
6. Crear el primer commit verde.

Criterio de salida: todos los checks locales pasan sin MongoDB ni OpenAI y Git tiene un baseline recuperable. En la ronda actual solo falta el commit porque el indice de Git no es escribible.

No agregar MongoDB, OpenAI ni dependencias hasta superar esta puerta.

## Plan posterior

### Fase 1 — MongoDB, sesion y consentimiento

- Docker Compose con volumen local.
- Driver `mongodb` a nivel de proyecto.
- Indices y repositorios con aislamiento por salon/sesion.
- Cookie anonima, revocacion y consentimiento bloqueante.
- Catalogo y cuestionario de tres campos.
- Retiro coordinado del camino Supabase.

Salida: datos y acceso sobreviven reinicio; dos salones quedan aislados.

### Fase 2 — fotos persistentes

- Validacion/preparacion local.
- GridFS de inputs y resultados.
- Stream autorizado, descarga y eliminacion.
- Reconciliacion de uploads huerfanos.

Salida: foto privada y eliminacion de punta a punta.

### Fase 3 — OpenAI Images

- `ImageGenerationProvider`.
- Adaptador OpenAI, worker local y polling.
- Idempotencia, budget ledger, limite 2, contador 5 y mensajes estaticos.
- Tests contractuales con red simulada.

Salida: flujo asincrono verde; una ejecucion con credito solo bajo autorizacion.

### Fase 4 — ficha y demo

- Seleccion del resultado.
- Ficha persistente con servicio, tiempo, precio y advertencia.
- Vista minima del estilista.
- E2E movil completo y recuperacion tras reinicio.

Salida: vertical slice demostrable con datos sinteticos.

## Agentes

Lanzar en este orden, sin superar tres subagentes simultaneos:

1. `orchestrator`: baseline, contratos, dependencias e integracion.
2. Ola de especificacion/datos: `product-privacy`, `mongodb-engineer` y, solo si no se solapan, `domain-engineer`.
3. Ola de vertical slice: `application-api`, `frontend-pwa` y `generation-jobs` con contratos congelados.
4. `qa-security` sobre el resultado integrado.

No lanzar roles de benchmark, cloud o plataforma en el MVP local. Las instrucciones completas viven en `docs/agents/execution-plan.md`.

## Skills

- `$hair-mvp-spec`: alcance, contradicciones y criterios de aceptacion.
- `$hair-mongodb`: colecciones, GridFS, jobs e aislamiento local.
- `$hair-openai-images`: adaptador, presupuesto y guardrails.
- `$hair-mvp-qa`: puertas, privacidad y pruebas.
- `$vercel-react-best-practices`: componentes React/Next cuando corresponda.
- `$playwright-skill`: pruebas E2E autorizadas.

Las skills de proyecto viven en `.agents/skills`. OpenCode descubre los agentes desde `.opencode/agents`.

## Reglas de pnpm

Todo paquete requerido por codigo, scripts o CI es local y versionado:

```bash
pnpm add paquete@version
pnpm add -D paquete@version
pnpm exec comando
```

No uses `pnpm add -g` para dependencias del proyecto. El coordinador es el unico que modifica `package.json` y `pnpm-lock.yaml`.

## Entrega obligatoria

Cada agente informa:

- resultado, no intencion;
- archivos modificados;
- comandos ejecutados y salida relevante;
- pruebas omitidas y motivo;
- riesgos y supuestos;
- diff o commit identificable;
- siguiente accion permitida.

Antes de datos reales siguen pendientes revision legal, texto final, duracion maxima de conservacion, region/transferencias y canal humano de soporte.
