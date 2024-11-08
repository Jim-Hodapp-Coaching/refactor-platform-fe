import { useMemo } from "react";
import { createAppStateStore as globalStore } from "@/lib/stores/app-state-store";

export const useAppState = () => {
  const store = globalStore();

  return useMemo(
    () => ({
      organizationId: store.getState().organizationId,
      relationshipId: store.getState().relationshipId,
      coachingSessionId: store.getState().coachingSessionId,

      organization: store.getState().organization,
      coachingRelationship: store.getState().coachingRelationship,
      coachingSession: store.getState().coachingSession,

      setOrganizationId: (organizationId: string) => {
        if (store.getState().organizationId !== organizationId) {
          store.setState({ organizationId });
        }
      },
      setRelationshipId: (relationshipId: string) => {
        if (store.getState().relationshipId !== relationshipId) {
          store.setState({ relationshipId });
        }
      },
      setCoachingSessionId: (coachingSessionId: string) => {
        if (store.getState().coachingSessionId !== coachingSessionId) {
          store.setState({ coachingSessionId });
        }
      },

      setOrganization: (organization: any) => {
        if (store.getState().organization !== organization) {
          store.setState({ organization });
        }
      },
      setCoachingRelationship: (coachingRelationship: any) => {
        if (store.getState().coachingRelationship !== coachingRelationship) {
          store.setState({ coachingRelationship });
        }
      },
      setCoachingSession: (coachingSession: any) => {
        if (store.getState().coachingSession !== coachingSession) {
          store.setState({ coachingSession });
        }
      },
    }),
    [store]
  );
};
