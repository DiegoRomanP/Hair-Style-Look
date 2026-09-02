---
name: hair-mongodb
description: Design, implement, or review Hair Style Look persistence with local MongoDB Community, the official Node.js driver, GridFS, indexes, idempotent jobs, session isolation, asset deletion, and restart recovery.
---

# Hair Style Look MongoDB

## Boundaries

- Use the official mongodb driver. Do not add Mongoose without a new ADR.
- Use one local MongoDB database and a persistent Docker volume.
- Store domain metadata in collections and image binaries in separate GridFS buckets.
- Every business query includes salonId; client queries also include sessionId.
- Never store plaintext session tokens, base64, prompts, signed URLs or secrets.

## Required collections and buckets

Collections: salons, sessions, consent_records, hairstyles, style_suggestions, consultations, generation_jobs, assets, service_cards, budget_ledger and incident_events.

GridFS buckets: input_assets, result_assets and moderation_assets.

## Workflow

1. Define the repository port before the adapter.
2. Create indexes idempotently from a clean database.
3. Use unique indexes for slugs, token hashes, style suggestions and job idempotency keys.
4. Use TTL only for documents with an explicit Date expiry.
5. Claim jobs with conditional findOneAndUpdate and a lease.
6. Test restart recovery and isolation with two salons.
7. Test GridFS upload, authorized stream, deletion and orphan reconciliation.

## GridFS consistency

GridFS does not support multi-document transactions. Never claim that metadata and file chunks commit atomically.

Use this protocol:

1. Insert an asset in uploading state.
2. Stream the binary to the correct GridFS bucket.
3. Conditionally set gridFsId and ready state.
4. On failure, mark cleanup_pending.
5. Reconcile stale uploading records and orphaned files idempotently.

Moderation storage may contain only an inappropriate provider result, is not client-visible and expires within 24 hours. Do not store rejected user input there.

## Evidence

For each change report indexes, repository filters, commands run, restart behavior and any operation that was not atomic. Do not require Atlas or cloud credentials for the local gate.
