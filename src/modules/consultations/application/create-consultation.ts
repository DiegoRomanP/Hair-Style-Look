import { failure, success, type Result } from "@/shared/domain";

import {
  consultationInvalidExpiryError,
  type Consultation,
  type ConsultationInvalidExpiryError,
} from "../domain";

import type { ConsultationRepository } from "./consultation-repository";

export type CreateConsultationInput = Readonly<{
  id: string;
  salonId: string;
  publicTokenHash: string;
  expiresAt: Date;
}>;

export type CreateConsultationDependencies = Readonly<{
  consultationRepository: ConsultationRepository;
  now: () => Date;
}>;

export async function createConsultation(
  input: CreateConsultationInput,
  dependencies: CreateConsultationDependencies,
): Promise<Result<Consultation, ConsultationInvalidExpiryError>> {
  const now = dependencies.now();

  if (input.expiresAt <= now) {
    return failure(consultationInvalidExpiryError());
  }

  const consultation: Consultation = {
    id: input.id,
    salonId: input.salonId,
    publicTokenHash: input.publicTokenHash,
    status: "awaiting_consent",
    expiresAt: input.expiresAt,
    selectedLookResultId: null,
    assignedStylistMemberId: null,
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  };

  return success(await dependencies.consultationRepository.create(consultation));
}
