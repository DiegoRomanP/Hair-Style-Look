---
name: hair-openai-images
description: Implement or review the Hair Style Look OpenAI Images adapter, local worker, controlled hairstyle prompts, cost budget, concurrency, idempotency, retry behavior, moderation and static failure messages.
---

# Hair Style Look OpenAI Images

## Safety gate

Never make a real OpenAI request, use credentials or spend credits unless the coordinator explicitly authorizes that execution. Contract and integration tests use a simulated transport.

## Provider contract

- OpenAI Images is selected when IMAGE_PROVIDER is openai.
- All SDK calls remain inside the OpenAI adapter.
- The domain depends only on ImageGenerationProvider.
- The API key exists only in server or worker environment.
- The generation profile and model are versioned.
- Logs contain provider, model/profile, duration, attempt, sanitized code and cost; never image, base64, prompt or raw response.

## Pre-call guards

Validate, in order:

1. current consent;
2. input asset ownership and ready state;
3. human-hairstyle scope;
4. idempotency;
5. fewer than two running jobs for the session;
6. enough of the USD 10 environment budget.

Reserve budget atomically before the call. Reconcile it after success or classified failure.

## Retries and failures

- Only a user action starts another paid attempt.
- Reusing the same idempotency key returns the original job.
- The fifth equivalent request shows a small warning but does not block by itself.
- Use timeout and AbortSignal.
- Recover an abandoned job only when its lease expired and no final result exists.
- There is no automatic provider fallback.
- Present only versioned static messages for provider failure, scope rejection, concurrency, budget and inappropriate results.

## Prompt control

Never concatenate free-form style text directly into an internal instruction. Normalize, validate scope, map it to an allowlisted hairstyle description and keep system/profile text server-side.

## Tests

Run the same contract suite for fake and OpenAI adapters with the network mocked. Cover success, timeout, abort, provider refusal, partial results, budget stop, concurrency stop, duplicate key and sanitized logging.
