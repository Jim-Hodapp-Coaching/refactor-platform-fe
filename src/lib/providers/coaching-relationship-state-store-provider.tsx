// The purpose of this provider is to provide compatibility with
// Next.js re-rendering and component caching
"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";
import {
  CoachingRelationshipStateStore,
  createCoachingRelationshipStateStore,
} from "../stores/coaching-relationship-state-store";

export const CoachingRelationshipStateStoreContext =
  createContext<StoreApi<CoachingRelationshipStateStore> | null>(null);

export interface CoachingRelationshipStateStoreProviderProps {
  children: ReactNode;
}

export const CoachingRelationshipStateStoreProvider = ({
  children,
}: CoachingRelationshipStateStoreProviderProps) => {
  const storeRef = useRef<StoreApi<CoachingRelationshipStateStore>>(undefined);
  if (!storeRef.current) {
    storeRef.current = createCoachingRelationshipStateStore();
  }

  return (
    <CoachingRelationshipStateStoreContext.Provider value={storeRef.current}>
      {children}
    </CoachingRelationshipStateStoreContext.Provider>
  );
};

export const useCoachingRelationshipStateStore = <T,>(
  selector: (store: CoachingRelationshipStateStore) => T
): T => {
  const relStateStoreContext = useContext(
    CoachingRelationshipStateStoreContext
  );

  if (!relStateStoreContext) {
    throw new Error(
      `useCoachingRelationshipStateStore must be used within CoachingRelationshipStateStoreProvider`
    );
  }

  return useStore(relStateStoreContext, selector);
};
