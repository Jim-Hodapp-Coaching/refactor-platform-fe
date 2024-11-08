import { AppStateStore } from "@/lib/stores/app-state-store";

export const useSelectors = () => ({
  selectOrgPlaceholder: (state: AppStateStore) =>
    state.organization?.name || "Select an organization",

  selectRelPlaceholder: (state: AppStateStore) =>
    state.coachingRelationship
      ? `${state.coachingRelationship.coach_first_name} ${state.coachingRelationship.coach_last_name} -> ${state.coachingRelationship.coachee_first_name} ${state.coachingRelationship.coachee_last_name}`
      : "Select coaching relationship",

  selectSessionPlaceholder: (state: AppStateStore) =>
    state.coachingSession?.date || "Select a session",
});
