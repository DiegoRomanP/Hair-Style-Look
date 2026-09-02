# ADR 0001: MVP local con MongoDB y OpenAI Images

- Estado: aceptado
- Fecha: 2026-08-30

## Contexto

El diseño anterior apuntaba a Supabase, Trigger.dev y servicios cloud para un piloto cercano a produccion. El objetivo aclarado es menor: construir primero un MVP local que demuestre el recorrido y conserve las sesiones e imagenes despues de reiniciar.

El usuario prefiere MongoDB como base NoSQL y OpenAI/“ChatGPT image” como proveedor normal. Tambien fija USD 10 de presupuesto, dos generaciones concurrentes y mensajes estaticos ante fallos o solicitudes fuera de alcance.

## Decision

- Usar MongoDB Community local como unica base de datos del MVP.
- Usar el driver oficial `mongodb` sin ODM.
- Guardar documentos de dominio en colecciones y binarios en GridFS.
- Ejecutar un worker Node local del mismo repositorio para jobs recuperables.
- Usar OpenAI Images como proveedor normal mediante `ImageGenerationProvider`.
- Mantener un fake solo para tests/CI, no como default de runtime.
- No usar Supabase, Trigger.dev, Sentry/PostHog cloud ni segundo proveedor en esta fase.
- Tratar la carpeta `supabase/` como legado pendiente de retirada coordinada.

## Consecuencias positivas

- Menos servicios para iniciar la demostracion.
- Persistencia local coherente con la preferencia NoSQL.
- GridFS mantiene metadatos y binarios en la misma tecnologia.
- El puerto de proveedor evita acoplar dominio y API a OpenAI.
- El worker y MongoDB permiten recuperar jobs tras reinicio sin infraestructura cloud.

## Limites y riesgos

- MongoDB local no aporta por si solo alta disponibilidad, backups gestionados o residencia garantizada en Peru.
- GridFS no soporta transacciones multidocumento; se necesita estado intermedio y reconciliacion de huerfanos.
- La sesion anonima y el aislamiento se implementan en repositorios/API, no con RLS.
- OpenAI puede aplicar retencion de monitoreo de abuso fuera del control de la aplicacion.
- La duracion maxima de conservacion local requiere decision legal antes de datos reales.

## Criterio de revision

Revisar este ADR solo despues de completar el vertical slice local o si una exigencia real de residencia, disponibilidad, autentificacion o operacion hace insuficiente el diseño. Cualquier migracion a Atlas, Supabase u otra nube requiere un ADR nuevo.
