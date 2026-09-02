---
name: hair-mvp-spec
description: Refine or review Hair Style Look product and technical requirements. Use for scope, acceptance criteria, contradictions, consent, questionnaire, retention, agent task contracts, or decisions that must stay limited to the local MVP.
---

# Hair Style Look MVP Specification

## Workflow

1. Read AGENTS.md, DevTech-MVP.md and the most specific document affected.
2. Separate four states: approved decision, current implementation, assumption, and pending decision.
3. Prefer the smallest vertical slice that demonstrates user value after a restart.
4. Reject production hardening, cloud services and unrelated product features unless the user explicitly changes scope.
5. Convert each requirement into observable behavior, error behavior and a testable acceptance criterion.
6. Update every active source that would otherwise contradict the decision.

## Frozen MVP decisions

- OpenAI Images is the normal provider; a fake is only for tests or offline demonstration.
- MongoDB Community and GridFS are local persistence.
- QR carries only the salon slug; the secret is exchanged for a persistent HttpOnly cookie.
- Consent is versioned and blocks the rest of the application when rejected.
- Required answers are style, current length and change level.
- A custom style is saved as a pending suggestion and sanitized before prompt composition.
- At most two jobs run per session.
- User-triggered retries are allowed; the fifth equivalent request shows a discreet warning.
- The environment budget is USD 10.
- Failures and policy rejections use versioned static messages.
- The client may download/delete or keep assets to return; maximum legal retention is still pending.

## Review checklist

- Does the requirement help QR-to-result-to-card?
- Can the behavior be tested locally without cloud infrastructure?
- Does it avoid secrets in URLs and PII in logs?
- Is provider cost stopped before the API call?
- Is an unresolved legal or retention issue labelled instead of invented?
- Does the handoff state files, ownership, acceptance criteria and commands?

## Ambiguity rule

The user specified three mandatory fields but described only style. The current explicit assumption is style, currentLength and changeLevel because the latter two already existed and affect realizability. Preserve the assumption label until the user confirms or replaces those fields.
