import { create, useStore } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface AppState {
    userId: string | undefined;
}

interface AppStateActions {
    // TODO: change this to be more like:
    // isLoggedIn: boolean;
    // user: any | null;
    // login: (user: any) => void;
    // logout: () => void;
    // Or, perhaps having a separate from auth-store from app-state-store is the proper thing to do?
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

type Params<U> = Parameters<typeof useStore<typeof appStateStore, U>>;

// Selectors
const userIdSelector = (state: ExtractState<typeof appStateStore>) => state.userId;
const actionsSelector = (state: ExtractState<typeof appStateStore>) => state;

// Getters
export const getUserId  = () => userIdSelector(appStateStore.getState());
export const getActions = () => actionsSelector(appStateStore.getState());

function useAppStateStore<U>(selector: Params<U>[1], equalityFn?: Params<U>[2]) {
    return useStore(appStateStore, selector, equalityFn);
}

// Hooks
export const useUserId = () => useAppStateStore(userIdSelector);
export const useActions = () => useAppStateStore(actionsSelector);
