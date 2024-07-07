import { Id } from '@/types/general';
import { create, useStore } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

interface AuthState {
    // Holds user id UUID from the backend DB schema for a User
    userId: Id;
    isLoggedIn: boolean;
}

interface AuthActions {
    login: (userId: Id) => void;
    logout: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const defaultInitState: AuthState = {
    userId: "",
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

                    login: (userId) => {
                        set({ isLoggedIn: true, userId });
                    },
                    logout: () => {
                        set({ isLoggedIn: false, userId: undefined });
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
