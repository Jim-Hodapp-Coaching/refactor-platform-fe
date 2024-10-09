import { ApiResponse } from "@/components/ui/dashboard/dynamic-api-select";
import { CoachingSession } from "@/types/coaching-session";
import { CoachingRelationshipWithUserNames } from "@/types/coaching_relationship_with_user_names";
import { Id } from "@/types/general";
import { Organization } from "@/types/organization";
import { create, useStore } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface AppState {
  organizationId: Id;
  relationshipId: Id;
  coachingSessionId: Id;
}

interface AppStateActions {
  setOrganizationId: (organizationId: Id) => void;
  setRelationshipId: (relationshipId: Id) => void;
  setCoachingSessionId: (coachingSessionId: Id) => void;
  setElementValue: (elementId: string, value: any) => void;
  setApiResponse: (elementId: string, response: ApiResponse<any>) => void;
  reset(): void;
}

export type AppStateStore = AppState & AppStateActions;

export const defaultInitState: AppState = {
  organizationId: "",
  relationshipId: "",
  coachingSessionId: "",
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
          setElementValue: (elementId: string, value: any) => {
            set((state) => ({
              ...state,
              [`${elementId}Id`]: value,
            }));
          },
          setApiResponse: (elementId: string, response: ApiResponse<any>) => {
            set((state) => ({
              ...state,
              [`${elementId}`]: response,
            }));
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
