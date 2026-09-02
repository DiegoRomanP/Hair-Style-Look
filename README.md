# Hair Style Look

MVP local B2B2C para que una peluqueria convierta la intencion de un cliente adulto en una simulacion de peinado y una ficha basica. No es un sistema listo para produccion.

## Estado

La Fase 0 de la fundacion Next.js/PWA esta verificada localmente con Node.js 24.19.0 y pnpm 11.22.0. Aun faltan el recorrido QR, cookie anonima, consentimiento bloqueante, MongoDB/GridFS, fotografia, worker, OpenAI Images, resultados persistentes y ficha.

La carpeta `supabase/` pertenece a una arquitectura anterior no integrada. No debe ampliarse; su retirada esta prevista despues de estabilizar el baseline.

## Stack decidido

- Node.js `24.19.0` y pnpm `11.22.0`.
- Next.js, React, TypeScript strict y Tailwind.
- MongoDB Community local, driver oficial y GridFS.
- OpenAI Images por defecto mediante un adaptador `ImageGenerationProvider`.
- Worker Node local para jobs recuperables.
- Vitest y Playwright.

## Inicio actual

```bash
corepack enable
corepack prepare pnpm@11.22.0 --activate
pnpm install --frozen-lockfile
pnpm dev
```

Aplicacion: `http://localhost:3000`  
Salud: `GET /api/v1/health`

MongoDB y OpenAI todavia no estan implementados. No hace falta configurar credenciales para verificar el baseline.

## Verificacion

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm test:e2e
```

Los checks de la Fase 0 pasan sin MongoDB ni OpenAI. El primer commit sigue pendiente porque el filesystem actual no permite escribir el indice de Git.

## Documentos

- Especificacion tecnica: [`DevTech-MVP.md`](./DevTech-MVP.md)
- Producto y mercado: [`Investigacion-Mercado.md`](./Investigacion-Mercado.md)
- Instrucciones para agentes: [`AGENTS.md`](./AGENTS.md)
- Handoff: [`Resumen-Para-Agente.md`](./Resumen-Para-Agente.md)
- Plan multiagente: [`docs/agents/execution-plan.md`](./docs/agents/execution-plan.md)
- Revision de skills y lanzamiento: [`docs/agents/skills-review.md`](./docs/agents/skills-review.md)
- ADR de arquitectura: [`docs/architecture/decisions/0001-local-mongodb-openai-mvp.md`](./docs/architecture/decisions/0001-local-mongodb-openai-mvp.md)
