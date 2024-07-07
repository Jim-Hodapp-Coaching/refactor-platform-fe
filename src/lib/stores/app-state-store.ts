import { Id } from '@/types/general';
import { create, useStore } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface AppState {
    organizationId: Id;
    relationshipId: Id;
    coachingSessionId: Id;
}

interface AppStateActions {
    setOrganizationId: (organizationId: Id) => void;
    setRelationshipId: (relationshipId: Id) => void;
    setCoachingSessionId: (coachingSessionId: Id) => void;
    reset (): void;
}

export type AppStateStore = AppState & AppStateActions;

export const defaultInitState: AppState = {
    organizationId: "",
    relationshipId: "",
    coachingSessionId: "",
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
