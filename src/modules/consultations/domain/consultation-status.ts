export const consultationStatuses = [
  "draft",
  "awaiting_consent",
  "awaiting_photo",
  "awaiting_answers",
  "ready_to_generate",
  "generating",
  "results_ready",
  "generation_failed",
  "look_selected",
  "stylist_reviewed",
  "completed",
  "cancelled",
  "expired",
] as const;

export type ConsultationStatus = (typeof consultationStatuses)[number];

const transitions: Readonly<Record<ConsultationStatus, readonly ConsultationStatus[]>> = {
  draft: ["awaiting_consent", "cancelled", "expired"],
  awaiting_consent: ["awaiting_photo", "cancelled", "expired"],
  awaiting_photo: ["awaiting_answers", "cancelled", "expired"],
  awaiting_answers: ["ready_to_generate", "cancelled", "expired"],
  ready_to_generate: ["generating", "cancelled", "expired"],
  generating: ["results_ready", "generation_failed", "cancelled", "expired"],
  results_ready: ["look_selected", "cancelled", "expired"],
  generation_failed: ["ready_to_generate", "cancelled", "expired"],
  look_selected: ["stylist_reviewed", "cancelled", "expired"],
  stylist_reviewed: ["completed", "cancelled", "expired"],
  completed: [],
  cancelled: [],
  expired: [],
};

export function canTransitionConsultation(
  from: ConsultationStatus,
  to: ConsultationStatus,
): boolean {
  return transitions[from].includes(to);
}

export function isFinalConsultationStatus(status: ConsultationStatus): boolean {
  return transitions[status].length === 0;
}
