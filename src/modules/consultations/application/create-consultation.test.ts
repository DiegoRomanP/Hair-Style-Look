import { describe, expect, it } from "vitest";

import {
  createConsultation,
  type Consultation,
  type ConsultationRepository,
} from "@/modules/consultations";

describe("createConsultation", () => {
  it("starts a consultation awaiting consent", async () => {
    let persisted: Consultation | null = null;
    const repository: ConsultationRepository = {
      async create(consultation) {
        persisted = consultation;
        return consultation;
      },
      async findByPublicTokenHash() {
        return null;
      },
      async updateStatus() {
        return null;
      },
    };

    const now = new Date("2026-08-22T08:00:00.000Z");
    const result = await createConsultation(
      {
        id: "consultation-id",
        salonId: "salon-id",
        publicTokenHash: "token-hash",
        expiresAt: new Date("2026-08-23T08:00:00.000Z"),
      },
      { consultationRepository: repository, now: () => now },
    );

    expect(result).toMatchObject({
      ok: true,
      value: { status: "awaiting_consent", createdAt: now },
    });
    if (!result.ok) {
      throw new Error("Expected the consultation to be created.");
    }

    expect(persisted).toEqual(result.value);
  });

  it("rejects a consultation that is already expired", async () => {
    const repository: ConsultationRepository = {
      async create(consultation) {
        return consultation;
      },
      async findByPublicTokenHash() {
        return null;
      },
      async updateStatus() {
        return null;
      },
    };
    const now = new Date("2026-08-22T08:00:00.000Z");

    const result = await createConsultation(
      {
        id: "consultation-id",
        salonId: "salon-id",
        publicTokenHash: "token-hash",
        expiresAt: now,
      },
      { consultationRepository: repository, now: () => now },
    );

    expect(result).toEqual({
      ok: false,
      error: expect.objectContaining({ code: "CONSULTATION_INVALID_EXPIRY" }),
    });
  });
});
