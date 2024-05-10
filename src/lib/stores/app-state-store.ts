import { create, useStore } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface AppState {
    userId: string | undefined;
}

interface AppStateActions {
    setUserId: (userId: string | undefined) => void;
    validUser: () => boolean;
    clearUser: () => void;
}

// TODO: make this store persist across page reloads
const appStateStore = create<AppState & AppStateActions>()(
    devtools(
        persist(
            (set, get) => ({
                userId: undefined,

                setUserId: (userId: string | undefined) => {
                    set({ userId });
                },

                validUser: (): boolean => {
                    return get().userId !== undefined;
                },

                clearUser: () => {
                    set({ userId: undefined });
                },
            }),
            {
                name: 'app-state-store',
                storage: createJSONStorage(() => sessionStorage),
            }
        )
    )
);

export type ExtractState<S> = S extends {
    getState: () => infer T;
}
? T
: never;
