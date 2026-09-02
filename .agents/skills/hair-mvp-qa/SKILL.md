---
name: hair-mvp-qa
description: Verify Hair Style Look increments and agent handoffs against the local MVP quality gates, including consent, cookies, MongoDB isolation, GridFS lifecycle, OpenAI cost controls, restart recovery and privacy.
---

# Hair Style Look MVP QA

## Review order

1. Read AGENTS.md and the active wave in docs/agents/execution-plan.md.
2. Inspect the integrated diff and current Git status.
3. Map every acceptance criterion to evidence or mark it not verified.
4. Run the narrowest tests first, then the full gate when dependencies are ready.
5. Report findings before summaries, ordered by severity.

## Blocking checks

- Rejecting consent prevents catalog, camera, upload and generation.
- QR and URLs contain no session secret.
- Cookies are HttpOnly and scoped correctly.
- Salon A cannot read or modify Salon B.
- Assets survive an authorized restart and can be deleted end to end.
- GridFS orphan cleanup is idempotent.
- A third concurrent generation is rejected before provider use.
- The fifth equivalent request produces a discreet warning.
- USD 10 stops the call before cost is incurred.
- Non-hairstyle requests are rejected before the provider.
- Errors are static and do not expose raw provider content.
- Logs contain no PII, photo, base64, cookie, token, GridFS path or prompt.
- Real OpenAI calls do not run in CI.

## Commands

Run only commands that exist in package.json and report their exact result:

pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm build
pnpm test:e2e

Do not say passed when a command was scoped, skipped, blocked or failed. For E2E use accessible locators, web-first assertions and no fixed sleeps.

## Finding format

Include severity, file and line, expected behavior, actual behavior, impact and a minimal reproduction. Do not modify production code unless the coordinator changes the task.
