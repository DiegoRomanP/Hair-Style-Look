export { createConsultation } from "./application/create-consultation";
export type {
  CreateConsultationDependencies,
  CreateConsultationInput,
} from "./application/create-consultation";
export type { ConsultationRepository } from "./application/consultation-repository";
export { expireConsultation, transitionConsultation } from "./domain/consultation";
export type { Consultation } from "./domain/consultation";
export type {
  ConsultationError,
  ConsultationExpiredError,
  ConsultationInvalidExpiryError,
  ConsultationInvalidStateError,
} from "./domain/consultation-errors";
export {
  canTransitionConsultation,
  consultationStatuses,
  isFinalConsultationStatus,
} from "./domain/consultation-status";
export type { ConsultationStatus } from "./domain/consultation-status";
