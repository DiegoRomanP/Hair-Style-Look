import { describe, expect, it } from "vitest";

import {
  expireConsultation,
  transitionConsultation,
  type Consultation,
} from "@/modules/consultations";

const createdAt = new Date("2026-08-22T08:00:00.000Z");

function buildConsultation(status: Consultation["status"] = "awaiting_consent"): Consultation {
  return {
    id: "consultation-id",
    salonId: "salon-id",
    publicTokenHash: "token-hash",
    status,
    expiresAt: new Date("2026-08-23T08:00:00.000Z"),
    selectedLookResultId: null,
    assignedStylistMemberId: null,
    completedAt: null,
    createdAt,
    updatedAt: createdAt,
  };
}

describe("consultation state machine", () => {
  it("allows the consent to photo transition", () => {
    const result = transitionConsultation(
      buildConsultation(),
      "awaiting_photo",
      new Date("2026-08-22T08:05:00.000Z"),
    );

    expect(result).toMatchObject({ ok: true, value: { status: "awaiting_photo" } });
  });

  it("rejects invalid transitions", () => {
    const result = transitionConsultation(buildConsultation(), "results_ready", createdAt);

    expect(result).toEqual({
      ok: false,
      error: expect.objectContaining({ code: "CONSULTATION_INVALID_STATE" }),
    });
  });

  it("rejects transitions after the consultation expiry", () => {
    const consultation = {
      ...buildConsultation(),
      expiresAt: new Date("2026-08-22T07:59:59.000Z"),
    };

    const result = transitionConsultation(consultation, "awaiting_photo", createdAt);

    expect(result).toEqual({
      ok: false,
      error: expect.objectContaining({ code: "CONSULTATION_EXPIRED" }),
    });
  });

  it("rejects transitions from a terminal state", () => {
    const result = transitionConsultation(buildConsultation("completed"), "expired", createdAt);

    expect(result).toEqual({
      ok: false,
      error: expect.objectContaining({ code: "CONSULTATION_INVALID_STATE" }),
    });
  });

  it("expires a non-final consultation only after its expiry time", () => {
    const consultation = {
      ...buildConsultation("ready_to_generate"),
      expiresAt: new Date("2026-08-22T07:59:59.000Z"),
    };

    const result = expireConsultation(consultation, createdAt);

    expect(result).toMatchObject({ ok: true, value: { status: "expired" } });
  });
});
