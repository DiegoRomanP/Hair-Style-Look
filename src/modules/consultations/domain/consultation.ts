import { failure, success, type Result } from "@/shared/domain";

import {
  consultationExpiredError,
  consultationInvalidStateError,
  type ConsultationError,
} from "./consultation-errors";
import {
  canTransitionConsultation,
  isFinalConsultationStatus,
  type ConsultationStatus,
} from "./consultation-status";

export type Consultation = Readonly<{
  id: string;
  salonId: string;
  publicTokenHash: string;
  status: ConsultationStatus;
  expiresAt: Date;
  selectedLookResultId: string | null;
  assignedStylistMemberId: string | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}>;

export function transitionConsultation(
  consultation: Consultation,
  targetStatus: ConsultationStatus,
  now: Date,
): Result<Consultation, ConsultationError> {
  if (consultation.status !== "expired" && consultation.expiresAt <= now) {
    return failure(consultationExpiredError());
  }

  if (!canTransitionConsultation(consultation.status, targetStatus)) {
    return failure(consultationInvalidStateError(consultation.status, targetStatus));
  }

  return success({
    ...consultation,
    status: targetStatus,
    completedAt: targetStatus === "completed" ? now : consultation.completedAt,
    updatedAt: now,
  });
}

export function expireConsultation(
  consultation: Consultation,
  now: Date,
): Result<Consultation, ConsultationError> {
  if (consultation.expiresAt > now) {
    return failure(consultationInvalidStateError(consultation.status, "expired"));
  }

  if (isFinalConsultationStatus(consultation.status)) {
    return failure(consultationInvalidStateError(consultation.status, "expired"));
  }

  return success({ ...consultation, status: "expired", updatedAt: now });
}
