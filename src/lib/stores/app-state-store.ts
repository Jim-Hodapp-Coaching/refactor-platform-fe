import {
  CoachingSession,
  defaultCoachingSession,
} from "@/types/coaching-session";
import {
  CoachingRelationshipWithUserNames,
  defaultCoachingRelationshipWithUserNames,
} from "@/types/coaching_relationship_with_user_names";
import { Id } from "@/types/general";
import { defaultOrganization, Organization } from "@/types/organization";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface AppState {
  organizationId: Id;
  relationshipId: Id;
  coachingSessionId: Id;
  organization: Organization;
  coachingSession: CoachingSession;
  coachingRelationship: CoachingRelationshipWithUserNames;
}

interface AppStateActions {
  setOrganizationId: (organizationId: Id) => [string];
  setRelationshipId: (relationshipId: Id) => void;
  setCoachingSessionId: (coachingSessionId: Id) => void;
  setOrganization: (organization: Organization) => Id;
  setCoachingSession: (coachingSession: CoachingSession) => Id;
  setCoachingRelationship: (
    coachingRelationship: CoachingRelationshipWithUserNames
  ) => Id;
  reset(): void;
}

export type AppStateStore = AppState & AppStateActions;

export const defaultInitState: AppState = {
  organizationId: "",
  relationshipId: "",
  coachingSessionId: "",
  organization: defaultOrganization(),
  coachingSession: defaultCoachingSession(),
  coachingRelationship: defaultCoachingRelationshipWithUserNames(),
};

export const createAppStateStore = (initState: AppState = defaultInitState) => {
  const appStateStore = create<AppStateStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,

          setOrganizationId: (organizationId) => {
            set({ organizationId });
            return [organizationId];
          },
          setRelationshipId: (relationshipId) => {
            set({ relationshipId });
          },
          setCoachingSessionId: (coachingSessionId) => {
            set({ coachingSessionId });
          },
          setOrganization: (organization) => {
            set({ organization });
            return organization.id;
          },
          setCoachingSession: (coachingSession) => {
            set({ coachingSession });
            return coachingSession.id;
          },
          setCoachingRelationship: (coachingRelationship) => {
            set({ coachingRelationship });
            return coachingRelationship.id;
          },
          reset(): void {
            set(defaultInitState);
          },
        }),
        {
          name: "app-state-store",
          storage: createJSONStorage(() => sessionStorage),
        }
      )
    )
  );
  return appStateStore;
};
