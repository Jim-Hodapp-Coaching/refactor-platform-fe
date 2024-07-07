// The purpose of this provider is to provide compatibility with
// Next.js re-rendering and component caching
"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import {
  type AppStateStore,
  createAppStateStore,
} from "@/lib/stores/app-state-store";

export const AppStateStoreContext =
  createContext<StoreApi<AppStateStore> | null>(null);

export interface AppStateStoreProviderProps {
  children: ReactNode;
}

export const AppStateStoreProvider = ({
  children,
}: AppStateStoreProviderProps) => {
  const storeRef = useRef<StoreApi<AppStateStore>>();
  if (!storeRef.current) {
    storeRef.current = createAppStateStore();
  }

  return (
    <AppStateStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStateStoreContext.Provider>
  );
};

export const useAppStateStore = <T,>(
  selector: (store: AppStateStore) => T
): T => {
  const appStateStoreContext = useContext(AppStateStoreContext);

  if (!appStateStoreContext) {
    throw new Error(
      `useAppStateStore must be used within AppStateStoreProvider`
    );
  }

  return useStore(appStateStoreContext, selector);
};
