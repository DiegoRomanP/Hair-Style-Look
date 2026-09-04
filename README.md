# Hair Style Look

> Un MVP local para convertir una conversación con el estilista en una consulta
> visual de peinado, con privacidad como condición de entrada.

Hair Style Look explora un recorrido B2B2C para una peluquería piloto: una
persona adulta llega desde un código QR, entiende y acepta el tratamiento de
sus datos, comparte una foto frontal y define el cambio que busca. El objetivo
es ayudar a cliente y estilista a acordar un look realizable; no sustituir su
criterio profesional ni hacer diagnósticos.

## Estado del proyecto

La **Fase 0** está implementada y comprobada: una base Next.js/PWA accesible,
tipado estricto, endpoint de salud y controles de calidad locales. El producto
no está listo para producción ni para fotografías de personas reales.

| Disponible hoy | Planificado para el MVP |
| --- | --- |
| Landing móvil, PWA, health check y pruebas base | QR, sesión anónima, consentimiento bloqueante, catálogo y cuestionario |
| TypeScript estricto, Tailwind, Pino, Vitest y Playwright | MongoDB/GridFS, fotos privadas, resultados, descarga y eliminación |
| CI sin secretos ni consumo de créditos | Worker local y OpenAI Images con presupuesto, idempotencia y límites |

## Recorrido que se validará

```text
QR del salón → sesión anónima → consentimiento → 3 respuestas → foto
→ simulación visual → resultados persistentes → descarga o eliminación → ficha
```

El recorrido se construye de forma incremental. Las integraciones de MongoDB,
GridFS y OpenAI Images están diseñadas, pero **aún no están implementadas**.

## Tecnologías

- **Aplicación:** Next.js (App Router), React y TypeScript estricto.
- **Diseño y PWA:** Tailwind CSS, Web App Manifest y UI mobile-first.
- **Validación y observabilidad:** Zod y Pino con redacción de datos sensibles.
- **Calidad:** ESLint, Vitest, Testing Library y Playwright.
- **Persistencia prevista:** MongoDB Community, driver oficial de Node.js y
  GridFS.
- **Generación prevista:** OpenAI Images detrás de un puerto
  `ImageGenerationProvider` y un worker local.

## Inicio rápido

**Requisitos:** Node.js `24.19.0`, pnpm `11.22.0` y Corepack. Estas versiones
están fijadas en el repositorio para asegurar resultados reproducibles.

```bash
corepack enable
corepack prepare pnpm@11.22.0 --activate
pnpm install --frozen-lockfile
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000). El health check está en
[`GET /api/v1/health`](http://localhost:3000/api/v1/health).

No se requieren credenciales para ejecutar la Fase 0. Las variables de
integraciones se añadirán únicamente junto con su primer consumidor y nunca
deben versionarse.

## Verificación

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm test:e2e
```

La CI ejecuta esta misma puerta sin secretos ni llamadas de pago.

## Principios de diseño

- **Privacidad antes de la foto:** no habrá acceso a catálogo, cámara o carga
  sin consentimiento versionado.
- **Límites claros:** sin menores, biometría, diagnóstico, entrenamiento propio
  ni automatizaciones de contacto.
- **Persistencia privada:** el diseño aprobado usará tokens opacos hasheados,
  aislamiento por salón y sesión, y binarios fuera de documentos JSON.
- **Coste controlado:** OpenAI Images tendrá un límite de USD 10 por entorno,
  dos trabajos concurrentes por sesión y reintentos explícitos.
- **Honestidad operativa:** los mensajes de error y rechazo serán plantillas
  estáticas; no se presenta una maqueta como una integración terminada.

## Arquitectura prevista

```text
Presentación / API → Aplicación → Dominio
Infraestructura     → implementa puertos
Worker local        → usa casos de uso y repositorios
```

Es un monolito modular: el dominio no dependerá de Next.js, MongoDB ni OpenAI.
Cuando se implemente la persistencia, los repositorios deberán aplicar siempre
el alcance de salón y sesión; GridFS utilizará estados intermedios y una
reconciliación idempotente porque no ofrece transacciones multidocumento.

## Privacidad y alcance

Este repositorio es una demostración local. Antes de usar fotos reales se
requiere una revisión humana de la normativa aplicable, el texto definitivo de
consentimiento, la retención máxima, los roles de tratamiento y el soporte.

La eliminación local prevista no equivale a eliminar contenido de servicios
externos. Consulta el [inventario de datos](./docs/privacy/data-inventory.md) y
la [política técnica de conservación](./docs/privacy/retention-policy.md).

## Documentación

- [Especificación técnica del MVP](./DevTech-MVP.md)
- [Investigación de producto y mercado](./Investigacion-Mercado.md)
- [Decisión de arquitectura: MongoDB y OpenAI Images](./docs/architecture/decisions/0001-local-mongodb-openai-mvp.md)
- [Plan de ejecución por fases](./docs/agents/execution-plan.md)
- [Guía para agentes](./AGENTS.md)

## Próximo hito

Implementar la persistencia y el acceso anónimo (Fase 1) con MongoDB Community,
sesiones recuperables, consentimiento bloqueante y pruebas de aislamiento entre
salones. La carga privada de fotos con GridFS es el siguiente hito (Fase 2).
