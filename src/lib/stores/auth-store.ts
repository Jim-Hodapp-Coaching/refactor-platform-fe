import { Id } from "@/types/general";
import { defaultUserSession, UserSession } from "@/types/user-session";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface AuthState {
  // Holds user id UUID from the backend DB schema for a User
  userId: Id;
  userSession: UserSession;
  isLoggedIn: boolean;
}

interface AuthActions {
  login: (userId: Id, userSession: UserSession) => void;
  logout: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const defaultInitState: AuthState = {
  userId: "",
  userSession: defaultUserSession(),
  isLoggedIn: false,
};

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  const authStore = create<AuthStore>()(
    devtools(
      persist(
        (set) => ({
          ...initState,

          login: (userId, userSession) => {
            set({ isLoggedIn: true, userId, userSession });
          },
          logout: () => {
            set(defaultInitState);
          },
        }),
        {
          name: "auth-store",
          storage: createJSONStorage(() => sessionStorage),
        }
      )
    )
  );
  return authStore;
};
