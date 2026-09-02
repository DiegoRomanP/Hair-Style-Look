import type { DomainError } from "@/shared/domain";

import type { ConsultationStatus } from "./consultation-status";

export type ConsultationInvalidStateError = DomainError & {
  readonly code: "CONSULTATION_INVALID_STATE";
  readonly currentStatus: ConsultationStatus;
  readonly targetStatus: ConsultationStatus;
};

export type ConsultationExpiredError = DomainError & {
  readonly code: "CONSULTATION_EXPIRED";
};

export type ConsultationInvalidExpiryError = DomainError & {
  readonly code: "CONSULTATION_INVALID_EXPIRY";
};

export type ConsultationError =
  | ConsultationInvalidStateError
  | ConsultationExpiredError
  | ConsultationInvalidExpiryError;

export function consultationInvalidStateError(
  currentStatus: ConsultationStatus,
  targetStatus: ConsultationStatus,
): ConsultationInvalidStateError {
  return {
    code: "CONSULTATION_INVALID_STATE",
    message: "The consultation cannot transition to the requested status.",
    currentStatus,
    targetStatus,
  };
}

export function consultationExpiredError(): ConsultationExpiredError {
  return {
    code: "CONSULTATION_EXPIRED",
    message: "The consultation has expired.",
  };
}

export function consultationInvalidExpiryError(): ConsultationInvalidExpiryError {
  return {
    code: "CONSULTATION_INVALID_EXPIRY",
    message: "The consultation expiry must be in the future.",
  };
}
