// The purpose of this provider is to provide compatibility with
// Next.js re-rendering and component caching
"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";
import {
  CoachingSessionStateStore,
  createCoachingSessionStateStore,
} from "../stores/coaching-session-state-store";

export const CoachingSessionStateStoreContext =
  createContext<StoreApi<CoachingSessionStateStore> | null>(null);

export interface CoachingSessionStateStoreProviderProps {
  children: ReactNode;
}

export const CoachingSessionStateStoreProvider = ({
  children,
}: CoachingSessionStateStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CoachingSessionStateStore>>(undefined);
  if (!storeRef.current) {
    storeRef.current = createCoachingSessionStateStore();
  }

  return (
    <CoachingSessionStateStoreContext.Provider value={storeRef.current}>
      {children}
    </CoachingSessionStateStoreContext.Provider>
  );
};

export const useCoachingSessionStateStore = <T,>(
  selector: (store: CoachingSessionStateStore) => T
): T => {
  const sessionStateStoreContext = useContext(CoachingSessionStateStoreContext);

  if (!sessionStateStoreContext) {
    throw new Error(
      `useCoachingSessionStateStore must be used within CoachingSessionStateStoreProvider`
    );
  }

  return useStore(sessionStateStoreContext, selector);
};
