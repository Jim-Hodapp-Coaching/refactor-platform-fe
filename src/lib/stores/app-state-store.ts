import {
  CoachingSession,
  defaultCoachingSession,
} from "@/types/coaching-session";
import {
  CoachingRelationshipWithUserNames,
  defaultCoachingRelationshipWithUserNames,
} from "@/types/coaching_relationship_with_user_names";
import { Id } from "@/types/general";
import {
  defaultOrganization,
  defaultOrganizations,
  Organization,
} from "@/types/organization";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface AppState {
  organizationId: Id;
  relationshipId: Id;
  coachingSessionId: Id;
  organization: Organization;
  coachingSession: CoachingSession;
  coachingRelationship: CoachingRelationshipWithUserNames;
  organizationsArray: Organization[];
}

interface AppStateActions {
  setOrganizationId: (organizationId: Id) => void;
  setRelationshipId: (relationshipId: Id) => void;
  setCoachingSessionId: (coachingSessionId: Id) => void;
  setOrganization: (organization: Organization) => void;
  setCoachingSession: (coachingSession: CoachingSession) => void;
  setCoachingRelationship: (
    coachingRelationship: CoachingRelationshipWithUserNames
  ) => void;
  setOrganizationsArray: (organizationsArray: Organization[]) => void;
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
  organizationsArray: defaultOrganizations(),
};

export const createAppStateStore = (initState: AppState = defaultInitState) => {
  const appStateStore = create<AppStateStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,

          setOrganizationId: (organizationId) => {
            set({ organizationId });
          },
          setRelationshipId: (relationshipId) => {
            set({ relationshipId });
          },
          setCoachingSessionId: (coachingSessionId) => {
            set({ coachingSessionId });
          },
          setOrganization: (organization) => {
            set({ organization });
          },
          setCoachingSession: (coachingSession) => {
            set({ coachingSession });
          },
          setCoachingRelationship: (coachingRelationship) => {
            set({ coachingRelationship });
          },
          setOrganizationsArray: (organizationsArray: Organization[]) => {
            set({ organizationsArray });
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
