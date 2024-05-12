import { create, useStore } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface AuthState {
    // Holds external_id UUID from the backend DB schema for a User
    userUUID: string;
    isLoggedIn: boolean;
}

interface AuthActions {
    login: (userUUID: string) => void;
    logout: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const defaultInitState: AuthState = {
    userUUID: "",
    isLoggedIn: false,
}

export const createAuthStore = (
    initState: AuthState = defaultInitState,
) => {
    const authStore = create<AuthStore>()(
        devtools(
            persist(
                (set) => ({
                    ... initState,

                    login: (userUUID) => {
                        set({ isLoggedIn: true, userUUID });
                    },
                    logout: () => {
                        set({ isLoggedIn: false, userUUID: undefined });
                    },
                }),
                {
                    name: 'auth-store',
                    storage: createJSONStorage(() => sessionStorage),
                }
            )
        )
    )
    return authStore;
}
