# Instrucciones del proyecto para agentes

## 1. Mision y nivel de madurez

Hair Style Look es un MVP local y verificable para una peluqueria piloto. No es un sistema comercial listo para produccion. Su finalidad es validar si una consulta guiada con una simulacion visual ayuda al cliente adulto y al estilista a acordar un peinado realizable.

Prioriza un unico recorrido demostrable:

1. El QR identifica al salon, sin incluir secretos.
2. El servidor crea una sesion anonima y entrega una cookie `HttpOnly`, `Secure` en HTTPS y `SameSite=Lax`.
3. La persona debe aceptar la politica versionada de tratamiento de imagen, mensajes y datos antes de acceder al resto de la aplicacion.
4. Captura o selecciona una foto frontal.
5. Responde tres datos minimos: estilo deseado, largo actual y nivel de cambio.
6. Puede elegir un estilo curado o escribir uno nuevo; el texto nuevo se conserva como sugerencia pendiente de curacion.
7. Solicita hasta dos generaciones simultaneas mediante OpenAI Images.
8. Puede reintentar de forma explicita. A la quinta peticion identica para la misma foto y sesion se muestra una advertencia discreta.
9. Ve resultados parciales, selecciona uno y obtiene una ficha basica persistente.
10. Puede descargar sus imagenes, volver a verlas tras reiniciar el navegador y pedir su eliminacion.

No presentes un diseño, placeholder o fake como una integracion terminada.

## 2. Fuentes de verdad

Consulta en este orden:

1. La peticion mas reciente y explicita del usuario.
2. Este archivo y cualquier `AGENTS.md` mas especifico.
3. ADR aceptados en `docs/architecture/decisions/`.
4. `DevTech-MVP.md` para contratos, stack y plan tecnico.
5. `Investigacion-Mercado.md` para producto, hipotesis y limites.
6. `docs/agents/execution-plan.md` para coordinacion.

Si dos fuentes se contradicen, no decidas silenciosamente. Marca el conflicto y solicita decision solo cuando cambie alcance, costes, privacidad o una eleccion dificil de revertir.

## 3. Decisiones aprobadas del MVP

- `IMAGE_PROVIDER=openai` es el valor normal por defecto.
- La integracion se denomina OpenAI Images o GPT Image. “ChatGPT image” es el nombre informal del usuario, no un SDK distinto.
- Todo proveedor implementa `ImageGenerationProvider`; no existe fallback automatico en este MVP.
- El fallback visible es un mensaje estatico, accionable y no generado por IA.
- El gasto acumulado permitido por entorno es como maximo USD 10, configurable en centavos y con bloqueo duro.
- Se permiten dos generaciones en ejecucion como maximo por sesion.
- Una solicitud ajena a peinados humanos, una solicitud de imagen general, el presupuesto agotado o el limite de concurrencia activan el rechazo o kill switch correspondiente.
- MongoDB Community local es la persistencia principal. Usa el driver oficial de Node.js, no un ODM, salvo ADR posterior.
- Los documentos viven en colecciones MongoDB y las fotos/resultados en buckets GridFS separados.
- La sesion puede recuperarse despues de reiniciar el navegador mediante una cookie persistente y un token opaco cuyo hash se guarda en MongoDB.
- El cliente decide entre descargar/eliminar o conservar para volver. La duracion juridica definitiva sigue pendiente antes de un piloto con personas reales.
- Catalogo, servicios, sugerencias de estilo, jobs, resultados y ficha se persisten.
- Los mensajes de rechazo, fallo y soporte son plantillas versionadas; no se redactan con IA.
- El despliegue cloud, transferencias internacionales, pagos, CRM, reservas completas y endurecimiento comercial quedan fuera de esta iteracion.

## 4. Stack del MVP

- Node.js `24.19.0` y pnpm `11.22.0`, fijados en el repositorio.
- TypeScript estricto, Next.js App Router, React y Tailwind CSS.
- Zod en fronteras; React Hook Form y TanStack Query solo cuando exista el consumidor.
- MediaDevices para captura; validacion local sencilla sin reconocimiento facial.
- MongoDB Community mediante Docker Compose y volumen local persistente.
- Driver oficial `mongodb`; GridFS para `input_assets`, `result_assets` y `moderation_assets`.
- Worker Node del mismo repositorio que reclama jobs con operaciones atomicas. No Trigger.dev en el MVP local.
- SDK oficial `openai` dentro del adaptador de infraestructura.
- Pino para logs locales sanitizados. Sentry y PostHog no son dependencias obligatorias en esta fase.
- Vitest, Testing Library, MSW y Playwright.
- GitHub Actions solo para checks sin creditos ni secretos.

No agregues Supabase, PostgreSQL, RLS, Vercel, Kubernetes, microservicios, colas cloud o un segundo backend. La carpeta `supabase/` es legado del diseño anterior y debe retirarse en una tarea coordinada despues de migrar las pruebas utiles.

## 5. Instalaciones con pnpm

Las dependencias de la aplicacion siempre se instalan a nivel de proyecto y quedan fijadas en `package.json` y `pnpm-lock.yaml`:

```bash
pnpm add <paquete>@<version>
pnpm add -D <paquete>@<version>
pnpm exec <binario>
```

No uses `pnpm add -g` para librerias, CLIs de build, test, lint, MongoDB u OpenAI. Las instalaciones globales se limitan a herramientas personales del desarrollador que no participen en CI ni en la reproducibilidad. Prefiere `corepack` para pnpm y `pnpm exec` para binarios locales.

Solo el coordinador modifica dependencias o el lockfile.

## 6. Arquitectura y limites

Mantener un monolito modular:

```text
presentacion/API -> aplicacion -> dominio
infraestructura -> implementa puertos
worker local -> usa casos de uso y repositorios
```

El dominio no importa React, Next.js, MongoDB ni OpenAI. Las rutas HTTP no consultan MongoDB directamente. Los repositorios siempre incluyen `salonId` y el alcance de sesion en sus filtros.

Patrones obligatorios donde tengan uso inmediato:

- casos de uso y rutas delgadas;
- repositorios como puertos;
- `ImageGenerationProvider` como puerto;
- transiciones explicitas para consultas, jobs y assets;
- idempotencia para iniciar y completar generaciones;
- errores tipados y mensajes seguros;
- operaciones atomicas de MongoDB para reclamar jobs y cambiar estados.

GridFS no soporta transacciones multidocumento. Sube el binario con estado `uploading`, confirma el documento de asset como `ready` y limpia de forma idempotente cualquier huerfano. No afirmes atomicidad entre GridFS y colecciones normales.

## 7. Datos minimos

Colecciones iniciales: `salons`, `sessions`, `consent_records`, `hairstyles`, `style_suggestions`, `consultations`, `generation_jobs`, `assets`, `service_cards`, `budget_ledger` e `incident_events`.

Buckets GridFS: `input_assets`, `result_assets` y `moderation_assets`.

Reglas:

- identificadores opacos y fechas UTC;
- dinero en centavos enteros y moneda explicita;
- token de sesion aleatorio: solo su hash en base de datos;
- cada filtro de repositorio incluye salon y sesion/rol;
- indice unico para la clave de idempotencia;
- TTL para sesiones e incidentes cuando corresponda;
- nunca base64 en documentos, logs o analitica;
- seeds sinteticos sin datos personales.

## 8. Consentimiento, fotos y moderacion

La pantalla de consentimiento es una puerta bloqueante. Si no se acepta, no se habilitan catalogo, cuestionario, camara, carga ni generacion. Registra version, fecha, salon, sesion y decision.

El texto inicial debe explicar en lenguaje claro: finalidades de la foto, mensajes y preferencias; uso de OpenAI; almacenamiento local; descarga y eliminacion; caracter referencial de la simulacion; prohibicion de menores, biometria, diagnostico y entrenamiento propio; y canal de soporte mediante mensaje preparado.

El texto es un borrador funcional, no asesoria legal. Antes de usar datos reales se requiere revision humana de la Ley peruana 29733, su reglamento vigente, roles y retencion.

Si una solicitud es inadecuada o ajena a peinados humanos, no se envia al proveedor. Guarda solo un incidente sanitizado. Si el proveedor devuelve un resultado inadecuado, puede guardarse en `moderation_assets` aislado, sin acceso del cliente, por un maximo tecnico de 24 horas para depuracion y luego se elimina. No uses ese bucket como dataset ni almacenes la foto original rechazada.

## 9. Jobs, limites y recuperacion

- Estados minimos: `queued`, `running`, `succeeded`, `partially_succeeded`, `failed`, `cancelled`.
- Solo el usuario inicia un reintento; no hay bucle automatico de cobros.
- El mismo `idempotencyKey` devuelve el job existente.
- Una nueva peticion explicita puede crear un nuevo intento si pasa presupuesto, politica y concurrencia.
- A partir de cinco solicitudes equivalentes para la misma foto/sesion, registra anomalia y muestra una nota pequena; no bloquees solo por ese contador.
- Mas de dos jobs `running` por sesion se rechazan con mensaje preparado.
- Timeout y cancelacion usan `AbortSignal`; el worker recupera jobs abandonados por lease vencido.
- El presupuesto se reserva atomicamente antes de llamar a OpenAI y se reconcilia con el coste real.
- Nunca reintentes automaticamente un fallo definitivo o una denegacion de seguridad.

## 10. Fuera de alcance

- produccion, alta disponibilidad o escalado;
- aplicaciones nativas, video, AR o 3D;
- diagnostico medico, puntuacion de belleza o biometria;
- menores de edad;
- fine-tuning, dataset propio o RAG;
- pagos, facturacion, agenda, CRM, inventario o WhatsApp automatico;
- multiples proveedores activos o benchmark pagado;
- autenticacion empresarial, multitienda o marca blanca;
- Sentry/PostHog/cloud obligatorios.

## 11. Reglas de implementacion

1. Inspecciona Git y conserva cambios del usuario.
2. Empieza por un baseline verde y un commit inicial.
3. Construye QR -> cookie -> consentimiento -> cuestionario -> foto -> OpenAI -> resultados -> ficha.
4. Implementa MongoDB y persistencia antes de reclamar recuperacion tras reinicio.
5. Valida texto libre del estilo y conviertelo en prompt interno controlado; nunca lo pases sin filtrar.
6. Conserva un fake determinista solo para unit tests y CI, no como default normal de la aplicacion.
7. No ejecutes OpenAI ni consumas creditos sin autorizacion del coordinador.
8. No registres fotos, base64, cookies, tokens, prompts identificables o respuestas crudas.
9. Usa mensajes estaticos para rechazo, presupuesto, concurrencia, proveedor y soporte.
10. No construyas un panel amplio antes del recorrido del cliente.

## 12. Verificacion y Definition of Done

Ejecuta, segun el riesgo:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm test:e2e
```

Ademas prueba reinicio y recuperacion; aislamiento entre dos salones; presupuesto de USD 10; concurrencia 2; advertencia de quinta repeticion; puerta de consentimiento; descarga/eliminacion; limpieza de GridFS; y el contrato OpenAI con red simulada. Las pruebas con creditos quedan fuera de CI.

Una tarea solo termina cuando los criterios pasan, la documentacion coincide y se declaran verificaciones omitidas. El MVP no esta listo para personas reales hasta completar revision legal, textos, retencion y una prueba controlada con datos sinteticos.

## 13. Memoria y Engram

Al iniciar, consulta Engram para `Hair-Style-Look` y busca el tema. Guarda decisiones, estado, verificaciones y bloqueos sin secretos ni PII. Claves estables: `project/current-status`, `delivery/mvp-construction-plan`, `delivery/agent-specifications`, `delivery/agent-launch-sequence` y `architecture/local-mongodb-openai-mvp`.

Si Engram no esta disponible, dilo; no afirmes que se actualizo.

## 14. Coordinacion de agentes

Solo el `orchestrator` cambia dependencias, lockfile, contratos compartidos, configuracion, integracion o servicios que consuman creditos. Cada subagente recibe ownership, criterios y comandos antes de comenzar. Dos agentes no editan el mismo archivo en una ola.

Orden de integracion: especificaciones y contratos; dominio y datos; API y worker; UI; pruebas y documentacion.

No lances todos los agentes. Con cuatro slots totales, usa como maximo coordinador mas tres subagentes y solo cuando sus archivos no se superpongan. `qa-security` trabaja contra el resultado integrado.

Las olas y sus puertas viven en `docs/agents/execution-plan.md`. Las skills del proyecto viven en `.agents/skills/`; las definiciones ejecutables de OpenCode viven en `.opencode/agents/`.

## 15. Reporte

Empieza por el resultado. Incluye archivos modificados, comandos realmente ejecutados, resultado, riesgos, supuestos, decisiones pendientes, ola actual y siguiente accion permitida. No declares implementado lo que solo se especifico.
