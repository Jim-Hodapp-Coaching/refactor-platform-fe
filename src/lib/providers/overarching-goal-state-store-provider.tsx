// The purpose of this provider is to provide compatibility with
// Next.js re-rendering and component caching
"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import {
  type OverarchingGoalStateStore,
  createOverarchingGoalStateStore,
} from "@/lib/stores/overarching-goal-state-store";

export const OverarchingGoalStateStoreContext =
  createContext<StoreApi<OverarchingGoalStateStore> | null>(null);

export interface OverarchingGoalStateStoreProviderProps {
  children: ReactNode;
}

export const OverarchingGoalStateStoreProvider = ({
  children,
}: OverarchingGoalStateStoreProviderProps) => {
  const storeRef = useRef<StoreApi<OverarchingGoalStateStore>>(undefined);
  if (!storeRef.current) {
    storeRef.current = createOverarchingGoalStateStore();
  }

  return (
    <OverarchingGoalStateStoreContext.Provider value={storeRef.current}>
      {children}
    </OverarchingGoalStateStoreContext.Provider>
  );
};

export const useOverarchingGoalStateStore = <T,>(
  selector: (store: OverarchingGoalStateStore) => T
): T => {
  const oagStateStoreContext = useContext(OverarchingGoalStateStoreContext);

  if (!oagStateStoreContext) {
    throw new Error(
      `useOverarchingGoalStateStore must be used within OverarchingGoalStateStoreProvider`
    );
  }

  return useStore(oagStateStoreContext, selector);
};
