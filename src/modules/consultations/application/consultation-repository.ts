import type { Consultation, ConsultationStatus } from "../domain";

export interface ConsultationRepository {
  create(consultation: Consultation): Promise<Consultation>;
  findByPublicTokenHash(publicTokenHash: string): Promise<Consultation | null>;
  updateStatus(
    consultationId: string,
    expectedStatus: ConsultationStatus,
    nextStatus: ConsultationStatus,
    updatedAt: Date,
  ): Promise<Consultation | null>;
}
