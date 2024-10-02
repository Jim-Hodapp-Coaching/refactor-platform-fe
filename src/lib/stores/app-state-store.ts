import { CoachingSession, defaultCoachingSession } from '@/types/coaching-session';
import { CoachingRelationshipWithUserNames, defaultCoachingRelationshipWithUserNames } from '@/types/coaching_relationship_with_user_names';
import { Id } from '@/types/general';
import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface AppState {
    organizationId: Id;
    relationshipId: Id;
    coachingSessionId: Id;
    coachingSession: CoachingSession;
    coachingRelationship: CoachingRelationshipWithUserNames;
}

interface AppStateActions {
    setOrganizationId: (organizationId: Id) => void;
    setRelationshipId: (relationshipId: Id) => void;
    setCoachingSessionId: (coachingSessionId: Id) => void;
    setCoachingSession: (coachingSession: CoachingSession) => void;
    setCoachingRelationship: (coachingRelationship: CoachingRelationshipWithUserNames) => void;
    reset (): void;
}

export type AppStateStore = AppState & AppStateActions;

export const defaultInitState: AppState = {
    organizationId: "",
    relationshipId: "",
    coachingSessionId: "",
    coachingSession: defaultCoachingSession(),
    coachingRelationship: defaultCoachingRelationshipWithUserNames(),
}

export const createAppStateStore = (
    initState: AppState = defaultInitState,
) => {
    const appStateStore = create<AppStateStore>()(
        devtools(
            persist(
                (set) => ({
                    ... initState,

                    setOrganizationId: (organizationId) => {
                        set({ organizationId });
                    },
                    setRelationshipId: (relationshipId) => {
                        set({ relationshipId });
                    },
                    setCoachingSessionId: (coachingSessionId) => {
                        set({ coachingSessionId });
                    },
                    setCoachingSession: (coachingSession) => {
                        set({ coachingSession });
                    },
                    setCoachingRelationship: (coachingRelationship) => {
                        set({ coachingRelationship });
                    },
                    reset (): void {
                        set(defaultInitState);
                    }
                }),
                {
                    name: 'app-state-store',
                    storage: createJSONStorage(() => sessionStorage),
                }
            )
        )
    )
    return appStateStore;
}
